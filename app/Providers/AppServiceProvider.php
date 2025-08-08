<?php

namespace App\Providers;

use App\PaymentGateway\IFortepayImpl;
use App\PaymentGateway\IpaymuImpl;
use App\PaymentGateway\PaymentGateway;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->bind(PaymentGateway::class, IFortepayImpl::class);
    }
}
