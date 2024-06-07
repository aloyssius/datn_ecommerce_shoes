<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'content',
        'is_seen',
        'url',
        'account_id',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
