<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Transaction extends Model
{
    use HasUuids;

    protected $table = 'transactions';
    public $incrementing = false; // Since you're using UUID as primary key
    protected $keyType = 'string';

    protected $fillable = [
        'invoice_number',
        'transaction_date',
        'customer_contact',
        'customer_shipping_first_name',
        'customer_shipping_last_name',
        'customer_shipping_address',
        'customer_shipping_detail_address',
        'customer_shipping_city',
        'customer_shipping_province',
        'customer_shipping_postal_code',
        'customer_shipping_country',
        'customer_billing_first_name',
        'customer_billing_last_name',
        'customer_billing_address',
        'customer_billing_detail_address',
        'customer_billing_city',
        'customer_billing_province',
        'customer_billing_postal_code',
        'customer_billing_country',
        'total_amount',
        'total_weight',
        'status',
    ];

    protected $casts = [
        'transaction_date' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->human_readable_id)) {
                $model->invoice_number = self::generateTransactionId();
            }
        });
    }

    public static function generateTransactionId(): string
    {
        $prefix = 'I-';
        $date = now()->format('YmdHisu');
        return $prefix . $date;
    }

    public function checkout(): HasOne
    {
        return $this->hasOne(Checkout::class);
    }

    public function detailTransactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DetailTransaction::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class,);
    }
}
