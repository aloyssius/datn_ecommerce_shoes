<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'total_money',
        'type',
        'note',
        'trading_code',
        'bill_id',
    ];

    protected $casts = [
        'total_money' => 'float',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
