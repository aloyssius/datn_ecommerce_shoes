<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'id',
        'code',
        'name',
        'value',
        'type_discount',
        'max_discount_value',
        'min_order_value',
        'quantity',
        'status',
        'start_time',
        'end_time',
    ];
    protected $casts = [
        'value' => 'float',
        'max_discount_value' => 'float',
        'min_order_value' => 'float',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }

    public function getStartTimeAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d-m-Y');
        }
        return null;
    }

    public function getEndTimeAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d-m-Y');
        }
        return null;
    }
}
