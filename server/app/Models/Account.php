<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'full_name',
        'birth_date',
        'phone_number',
        'password',
        'identity_card',
        'avatar_url',
        'email',
        'gender',
        'status',
        'role_id',
    ];

    protected $casts = [
        'gender' => 'integer',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }

    public function getBirthDateAttribute($value)
    {
        return Carbon::parse($value)->format('d-m-Y');
    }
}
