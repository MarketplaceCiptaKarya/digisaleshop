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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->uuid('category_id');
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->integer('weight')->default(0);
            $table->unsignedBigInteger('sold')->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');

            $table->foreign('category_id')->references('id')->on('categories');

            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('products_translations', function (Blueprint $table) {
            $table->id();

            $table->uuid('product_id');
            $table->string('locale')->index();
            $table->string('title');
            $table->text('description')->nullable();

            $table->unique(['product_id', 'locale']);
            $table->foreign('product_id')->references('id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products_translations');
        Schema::dropIfExists('products');
    }
};
