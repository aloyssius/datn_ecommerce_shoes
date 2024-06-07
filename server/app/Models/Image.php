<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Image extends BaseModel
{
    protected $fillable = [
        'path_url',
        'product_details_id',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
