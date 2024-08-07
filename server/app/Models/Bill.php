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
        'status',
        'money_ship',
        'total_money',
        'discount_amount',
        'customer_id',
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

    public function getCancellationDateAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d/m/Y');
        }
        return null;
    }

    public function getConfirmationDateAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d/m/Y');
        }
        return null;
    }

    public function getDeliveryDateAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d/m/Y');
        }
        return null;
    }
    public function getCompletionDateAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d/m/Y');
        }
        return null;
    }
}
