<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;


class Code extends Model
{
    use HasUuids;

    protected $table = 'codes';

    protected $fillable = [
        'id',
        'identifier',
        'access_code',
    ];

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = true;
}
