<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promotion extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'value',
        'status',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'value' => 'float',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }

    public function getStartTimeAttribute($value)
    {
        return Carbon::parse($value)->format('H:i:s d-m-Y');
    }

    public function getEndTimeAttribute($value)
    {
        return Carbon::parse($value)->format('H:i:s d-m-Y');
    }
}
