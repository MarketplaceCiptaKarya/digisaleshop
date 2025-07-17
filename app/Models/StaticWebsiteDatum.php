<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaticWebsiteDatum extends Model
{
    protected $table = 'static_website_data';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = ['key', 'locale'];
    protected $fillable = [
        'key',
        'locale',
        'value',
    ];

    public $timestamps = false;

    /**
     * Get the value of a static website datum by key.
     *
     * @param string $key
     * @return string|null
     */
    public static function getValueByKey(string $key): ?string
    {
        return self::where('key', $key)->value('value');
    }
}
