<?php

namespace App\Models;

class PromotionDetails extends BaseModel
{
    protected $table = 'promotion_product_details';

    protected $fillable = [
        'price',
        'price_after_promotion',
        'promotion_id',
        'product_details_id',
    ];

    protected $casts = [
        'price' => 'float',
        'price_after_promotion' => 'float',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
