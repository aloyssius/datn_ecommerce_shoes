<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerVoucher extends BaseModel
{
    protected $table = 'customer_vouchers';

    use SoftDeletes;

    protected $fillable = [
        'content',
        'is_used',
        'account_id',
        'voucher_id',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
