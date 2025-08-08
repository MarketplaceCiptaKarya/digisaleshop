<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'payment' => [
        'ipaymu' => [
            'va' => env('IPAYMU_VA', ''),
            'api_key' => env('IPAYMU_API_KEY', ''),
            'base_url' => env('IPAYMU_BASE_URL', 'https://my.ipaymu.com/api/v2'),
        ],
        'ifortepay' => [
            'x_version' => env('IFORTEPAY_X_VERSION', ''),
            'merchant_id' => env('IFORTEPAY_MERCHANT_ID', ''),
            'secret_unbound_id' => env('IFORTEPAY_SECRET_UNBOUND_ID', ''),
            'hash_key' => env('IFORTEPAY_HASH_KEY', ''),
            'base_url' => env('IFORTEPAY_BASE_URL', 'https://api-live.mcpayment.id'),
        ]
    ],

];
