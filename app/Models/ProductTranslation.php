<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductTranslation extends Model
{
    protected $table = 'products_translations';
    public $timestamps = false;
    protected $fillable = [
        'title',
        'description',
    ];
}
