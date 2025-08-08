<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPaymentJob;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function notification(Request $request)
    {
        ProcessPaymentJob::dispatch([
            'body' => $request->only([
                'transaction_id',
                'external_id',
                'order_id',
                'transaction_status',
            ]),
            'headers' => collect($request->headers->all())
                ->map(function ($values) {
                    return implode(', ', $values);
                })
                ->toArray(),
        ]);

        return response()->json(['success' => true], 200);
    }
}
