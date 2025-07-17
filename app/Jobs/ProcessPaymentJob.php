<?php

namespace App\Jobs;

use App\Models\Payment;
use App\Models\Product;
use App\Models\Transaction;
use App\PaymentGateway\PaymentGateway;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPaymentJob implements ShouldQueue
{
    use Queueable;

    private array $payload;

    /**
     * Create a new job instance.
     */
    public function __construct(array $payload)
    {
        $this->payload = $payload;
    }

    /**
     * Execute the job.
     */
    public function handle(PaymentGateway $paymentGateway): void
    {
        $transactionCheck = $paymentGateway->check($this->payload['trx_id']);

        if ($transactionCheck['Status'] !== 200) {
            throw new \Exception('Transaction check failed: ' . $transactionCheck['Message']);
        }

        try {
            \DB::beginTransaction();
            $currentTransaction = Transaction::with(['detailTransactions'])
                ->lockForUpdate()
                ->where('invoice_number', $this->payload['reference_id'])
                ->firstOrFail();

            $currentTransaction->status = match ($transactionCheck['Data']['Status']) {
                1 => 'completed',
                0 => 'pending',
                -2 => 'failed',
                default => throw new \Exception('Unknown transaction status: ' . $this->payload['status']),
            };

            Payment::create([
                'transaction_id' => $currentTransaction->id,
                'payment_gateway_transaction_id' => $this->payload['trx_id'],
            ]);

            foreach ($currentTransaction->detailTransactions as $detail) {
                Product::where('id', $detail->product_id)
                    ->lockForUpdate()
                    ->update([
                        'stock' => \DB::raw("stock - $detail->quantity"),
                        'sold' => \DB::raw("sold + $detail->quantity"),
                    ]);
            }

            $currentTransaction->save();

            \DB::commit();
        } catch (\Throwable $e) {
            \DB::rollBack();
            throw new \Exception('Failed to process payment: ' . $e->getMessage(), 0, $e);
        }
    }
}
