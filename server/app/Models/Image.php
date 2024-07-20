<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Image extends BaseModel
{
    protected $fillable = [
        'path_url',
        'product_color_id',
        'public_id',
        'is_default',
        'product_id',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
