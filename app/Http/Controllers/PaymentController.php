<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPaymentJob;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function notification(Request $request)
    {
        if (!$request->expectsJson()) {
            return response(null, 406);
        }

        ProcessPaymentJob::dispatch($request->only([
            'trx_id',
            'reference_id',
            'status',
            'status_code',
        ]));

        return response()->json(['success' => true], 200);
    }
}
