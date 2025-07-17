<?php

namespace App\Models;

use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Product extends Model implements TranslatableContract
{
    use HasFactory, SoftDeletes, HasUuids, Translatable;

    public $incrementing = false;
    protected $table = 'products';
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'media',
        'category_id',
        'price',
        'stock',
        'weight',
        'status',
    ];
    public $translatedAttributes = [
        'title',
        'description',
    ];
    public $translationModel = ProductTranslation::class;
    public $translationForeignKey = 'product_id';

    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function galleries(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductGallery::class);
    }

    public function detailTransactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DetailTransaction::class, 'product_id', 'id');
    }

}
