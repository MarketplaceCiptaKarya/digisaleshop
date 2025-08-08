<?php

namespace App\PaymentGateway;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class IFortepayImpl implements PaymentGateway
{
    private string $xVersion;
    private string $merchantId;
    private string $secretUnboundId;
    private string $hashKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->xVersion = config('services.payment.ifortepay.x_version');
        $this->merchantId = config('services.payment.ifortepay.merchant_id');
        $this->secretUnboundId = config('services.payment.ifortepay.secret_unbound_id');
        $this->hashKey = config('services.payment.ifortepay.hash_key');
        $this->baseUrl = config('services.payment.ifortepay.base_url');
    }

    private function createPostHeaders(string $orderId, string $externalId): array
    {
        return [
            'Authorization' => 'Basic ' . base64_encode($this->merchantId . ':' . $this->secretUnboundId),
            'Content-Type' => 'application/json',
            'x-req-signature' => hash('sha256', $this->hashKey . $externalId . $orderId),
            'x-version' => $this->xVersion,
        ];
    }

    private function createGetHeaders(): array
    {
        return [
            'Authorization' => 'Basic ' . base64_encode($this->merchantId . ':' . $this->secretUnboundId),
            'Content-Type' => 'application/json',
            'x-version' => $this->xVersion,
        ];
    }

    public function redirectPayment(array $payload): array
    {
        $endpoint = $this->baseUrl . '/payment-page/payment';
        $headers = $this->createPostHeaders($payload['order_id'], $payload['external_id']);

        try {
            $response = Http::withHeaders($headers)->post($endpoint, $payload);

            if ($response->failed()) {
                throw new \Exception('Failed to redirect payment: ' . $response->body());
            }

            return $response->json();
        } catch (ConnectionException $e) {
            throw new \Exception('Connection error: ' . $e->getMessage());
        }
    }

    public function check(string $transactionId): array
    {
        $endpoint = $this->baseUrl . '/payment-page/payment/' . $transactionId;
        $headers = $this->createGetHeaders();

        try {
            $response = Http::withHeaders($headers)->get($endpoint);

            if ($response->failed()) {
                throw new \Exception('Failed to get recent payment data: ' . $response->body());
            }

            return $response->json();
        } catch (ConnectionException $e) {
            throw new \Exception('Connection error: ' . $e->getMessage());
        }
    }

    public function isValidsignature(string $signature, string $transactionId, string $externalId, string $orderId): bool
    {
        $xRequestId = hash('sha256', $this->hashKey . $externalId . $orderId);
        $expectedSignature = hash('sha256', $transactionId . $xRequestId);
        return hash_equals($expectedSignature, $signature);
    }
}
