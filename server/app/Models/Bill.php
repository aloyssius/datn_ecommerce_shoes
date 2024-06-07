<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bill extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'confirmation_date',
        'delivery_date',
        'completion_date',
        'note',
        'full_name',
        'email',
        'address',
        'phone_number',
        'money_ship',
        'total_money',
        'discount_amount',
        'customer_id',
        'employee_id',
    ];

    protected $casts = [
        'money_ship' => 'float',
        'total_money' => 'float',
        'discount_amount' => 'float',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }

    public function getConfirmationDateAttribute($value)
    {
        return Carbon::parse($value)->format('H:i:s d-m-Y');
    }

    public function getDeliveryDateAttribute($value)
    {
        return Carbon::parse($value)->format('H:i:s d-m-Y');
    }
    public function getCompletionDateAttribute($value)
    {
        return Carbon::parse($value)->format('H:i:s d-m-Y');
    }
}
