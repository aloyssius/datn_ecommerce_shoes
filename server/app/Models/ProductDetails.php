<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class ProductDetails extends BaseModel
{
    protected $table = 'product_details';

    protected $fillable = [
        'sku',
        'quantity',
        'price',
        'status',
        'product_id',
        'color_id',
        'size_id',
    ];

    protected $casts = [
        'price' => 'float',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
