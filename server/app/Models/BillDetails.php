<?php

namespace App\Models;

class BillDetails extends BaseModel
{
    protected $table = 'bill_details';

    protected $fillable = [
        'quantity',
        'price',
        'price_after_promotion',
        'product_details_id',
        'bill_id',
    ];

    protected $casts = [
        'price_after_promotion' => 'float',
        'price' => 'float',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
