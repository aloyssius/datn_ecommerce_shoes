<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $baseFillable = [
        'created_by',
        'updated_by',
    ];

    public function getBaseFillable()
    {
        return $this->baseFillable;
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
