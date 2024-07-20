<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Address;


class Account extends BaseModel
{
    // use HasFactory;

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
        if ($value !== null) {
            return Carbon::parse($value)->format('d-m-Y');
        }
        return null;
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }
}
