<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class ProductDetails extends BaseModel
{
    protected $table = 'product_details';

    use SoftDeletes;

    protected $fillable = [
        'sub-sku',
        'quantity',
        'price',
        'status',
        'promotion_price',
        'product_id',
        'category_id',
        'brand_id',
        'color_id',
        'size_id',
    ];

    protected $casts = [
        'promotion_price' => 'float',
        'price' => 'float',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
