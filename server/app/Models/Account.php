<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Address;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Account extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'full_name',
        'birth_date',
        'phone_number',
        'password',
        'identity_card',
        'email_verified_at',
        'avatar_url',
        'email',
        'gender',
        'status',
        'role_id',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'gender' => 'integer',
    ];

    protected $hidden = [
        'password',
        // 'remember_token',
    ];

    public function getBirthDateAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('d-m-Y');
        }
        return null;
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Asia/Ho_Chi_Minh')->format('H:i:s d-m-Y');
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Asia/Ho_Chi_Minh')->format('H:i:s d-m-Y');
    }

    public function getDeletedAtAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->timezone('Asia/Ho_Chi_Minh')->format('H:i:s d-m-Y');
        }
        return null;
    }
}
