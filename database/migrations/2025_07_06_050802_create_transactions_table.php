<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('invoice_number')->unique();
            $table->dateTime('transaction_date');

            $table->string('customer_contact');

            $table->string('customer_shipping_first_name');
            $table->string('customer_shipping_last_name');
            $table->string('customer_shipping_address');
            $table->string('customer_shipping_detail_address')->nullable();
            $table->string('customer_shipping_city');
            $table->string('customer_shipping_province');
            $table->string('customer_shipping_postal_code');
            $table->string('customer_shipping_country');

            $table->string('customer_billing_first_name');
            $table->string('customer_billing_last_name');
            $table->string('customer_billing_address');
            $table->string('customer_billing_detail_address')->nullable();
            $table->string('customer_billing_city');
            $table->string('customer_billing_province');
            $table->string('customer_billing_postal_code');
            $table->string('customer_billing_country');

            $table->decimal('total_amount', 10, 2);
            $table->integer('total_weight');

            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
