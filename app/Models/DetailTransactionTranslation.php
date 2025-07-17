<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailTransactionTranslation extends Model
{
    protected $table = 'details_transaction_translations';
    public $timestamps = false;
    protected $fillable = [
        'snapshot_title',
        'snapshot_description',
        'snapshot_category',
    ];
}
