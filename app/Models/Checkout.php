<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;


class Checkout extends Model
{
    use HasUuids;

    protected $table = 'checkouts';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'path',
        'transaction_id',
        'items',
        'expired_at',
        'redirect_url'
    ];

    protected $casts = [
        'expired_at' => 'datetime',
        'items' => 'array',
    ];

    public function transaction(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
