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
        Schema::create('details_transaction', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('product_id');
            $table->uuid('transaction_id');

            $table->string('snapshot_image');
            $table->decimal('snapshot_price', 10, 2);
            $table->integer('snapshot_weight', 10, 2);

            $table->integer('quantity');
            $table->decimal('subtotal', 10, 2);

            $table->timestamps();

            $table->unique(['product_id', 'transaction_id']);
            $table->foreign('product_id')
                ->references('id')
                ->on('products');
            $table->foreign('transaction_id')
                ->references('id')
                ->on('transactions');
        });
        Schema::create('details_transaction_translations', function (Blueprint $table) {
            $table->id();

            $table->uuid('details_transaction_id');
            $table->string('locale')->index();

            $table->string('snapshot_title');
            $table->text('snapshot_description')->nullable();
            $table->string('snapshot_category');

            $table->unique(['details_transaction_id', 'locale']);
            $table->foreign('details_transaction_id')
                ->references('id')
                ->on('details_transaction')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('details_transaction_translations');
        Schema::dropIfExists('details_transaction');
    }
};
