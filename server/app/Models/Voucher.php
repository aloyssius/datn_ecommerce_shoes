<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $primaryKey = 'id';

    use HasUuids;


    public $incrementing = false;
    protected $keyType = 'string';
    protected $dateFormat = 'd-m-Y';
}
