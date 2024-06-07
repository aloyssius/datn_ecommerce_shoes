<?php

namespace App\Models;

class Role extends BaseModel
{

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
