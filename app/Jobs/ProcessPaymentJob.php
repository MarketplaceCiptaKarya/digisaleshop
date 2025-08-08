<?php

namespace App\Jobs;

use App\Models\Payment;
use App\Models\Product;
use App\Models\Transaction;
use App\PaymentGateway\IFortepayImpl;
use App\PaymentGateway\PaymentGateway;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPaymentJob implements ShouldQueue
{
    use Queueable;

    private array $payload;
    private array $headers;

    /**
     * Create a new job instance.
     */
    public function __construct(array $payload)
    {
        $this->payload = $payload['body'] ?? [];
        $this->headers = $payload['headers'] ?? [];
    }

    /**
     * Execute the job.
     */
    public function handle(PaymentGateway $paymentGateway): void
    {
        if ($paymentGateway instanceof IFortepayImpl) {
            $validSignature = $paymentGateway->isValidsignature($this->headers['mcp-signature'], $this->payload['transaction_id'], $this->payload['external_id'], $this->payload['order_id']);

            if (!$validSignature) {
                throw new \Exception('Invalid signature for transaction: ' . $this->payload['external_id']);
            }
        }

        $transactionCheck = $paymentGateway->check($this->payload['transaction_id']);

        try {
            \DB::beginTransaction();
            $currentTransaction = Transaction::with(['detailTransactions'])
                ->lockForUpdate()
                ->where('invoice_number', $this->payload['order_id'])
                ->firstOrFail();

            $currentTransaction->status = match ($transactionCheck['transaction_status']) {
                'PAID', 'SUCCESS' => 'completed',
                'ACTIVE', 'REQUEST', 'PROCESSING' => 'pending',
                'FAILED', 'EXPIRED', 'CANCELLED', 'VOID' => 'failed',
                default => throw new \Exception('Unknown transaction status: ' . $this->payload['transaction_status']),
            };

            Payment::create([
                'transaction_id' => $currentTransaction->id,
                'payment_gateway_transaction_id' => $this->payload['transaction_id'],
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
