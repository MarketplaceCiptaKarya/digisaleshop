<?php

namespace App\Models;

use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class DetailTransaction extends Model implements TranslatableContract
{
    use Translatable, HasUuids;

    protected $table = 'details_transaction';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'product_id',
        'transaction_id',
        'snapshot_image',
        'snapshot_price',
        'snapshot_weight',
        'quantity',
        'subtotal',
    ];

    public $translatedAttributes = [
        'snapshot_title',
        'snapshot_description',
        'snapshot_category',
    ];

    public $translationModel = DetailTransactionTranslation::class;
    public $translationForeignKey = 'details_transaction_id';

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
