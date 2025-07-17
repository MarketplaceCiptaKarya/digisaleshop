<?php

namespace App\Models;

use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Category extends Model implements TranslatableContract
{
    use Translatable, HasUuids;

    protected $table = 'categories';
    protected $fillable = ['slug'];

    public $translatedAttributes = ['name', 'description'];
    public $translationModel = CategoryTranslation::class;
    public $translationForeignKey = 'category_id';

    public function products(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Product::class);
    }
}
