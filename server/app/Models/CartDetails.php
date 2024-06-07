<?php

namespace App\Models;

class CartDetails extends BaseModel
{
    protected $table = 'cart_details';

    protected $fillable = [
        'quantity',
        'cart_id',
        'product_details_id',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
