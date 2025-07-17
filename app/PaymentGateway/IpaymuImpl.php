<?php

namespace App\PaymentGateway;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class IpaymuImpl implements PaymentGateway
{
    protected string $va;
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->va = config('services.ipaymu.va');
        $this->apiKey = config('services.ipaymu.api_key');
        $this->baseUrl = config('services.ipaymu.base_url', 'https://my.ipaymu.com/api/v2');
    }

    public function generateSignature($method, array $body): string
    {
        $jsonBody = json_encode($body, JSON_UNESCAPED_SLASHES);
        $hashedBody = strtolower(hash('sha256', $jsonBody));
        $stringToSign = strtoupper($method) . ':' . $this->va . ':' . $hashedBody . ':' . $this->apiKey;

        return hash_hmac('sha256', $stringToSign, $this->apiKey);
    }

    protected function getHeaders(Supported_Http_Method $method, array $body): array
    {
        return [
            'Content-Type' => 'application/json',
            'va' => $this->va,
            'signature' => $this->generateSignature($method->value, $body),
            'timestamp' => now()->format('YmdHis'),
        ];
    }

    public function redirectPayment(array $payload): array
    {
        $endpoint = $this->baseUrl . '/payment';
        $headers = $this->getHeaders(Supported_Http_Method::POST, $payload);

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
        $endpoint = $this->baseUrl . '/transaction';

        $payload = [
            'transactionId' => $transactionId,
        ];

        $headers = $this->getHeaders(Supported_Http_Method::POST, $payload);
        try {
            $response = Http::withHeaders($headers)->post($endpoint, $payload);

            if ($response->failed()) {
                throw new \Exception('Failed to get recent payment data: ' . $response->body());
            }

            return $response->json();
        } catch (ConnectionException $e) {
            throw new \Exception('Connection error: ' . $e->getMessage());
        }
    }
}
