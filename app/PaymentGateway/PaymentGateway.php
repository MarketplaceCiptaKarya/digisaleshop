<?php

namespace App\PaymentGateway;

interface PaymentGateway
{
    public function redirectPayment(array $payload): array;

    public function check(string $transactionId): array;

}
