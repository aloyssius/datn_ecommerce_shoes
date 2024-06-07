<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Color extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
