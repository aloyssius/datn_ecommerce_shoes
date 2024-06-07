<?php

namespace App\Models;

class Address extends BaseModel
{
    protected $table = 'addresses';

    protected $fillable = [
        'full_name',
        'address',
        'phone_number',
        'province_id',
        'district_id',
        'ward_code',
        'is_default',
        'account_id',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
