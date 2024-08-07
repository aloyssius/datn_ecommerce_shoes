<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class BillHistory extends BaseModel
{
    protected $table = 'bill_histories';

    use SoftDeletes;

    protected $fillable = [
        'status_timeline',
        'note',
        'bill_id',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }

    public function getCreatedAtAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d/m/Y');
        }
        return null;
    }
}
