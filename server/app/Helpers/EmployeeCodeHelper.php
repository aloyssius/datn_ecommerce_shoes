<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;

class EmployeeCodeHelper
{
    public static function generateCode($model, $prefixCode)
    {
        $result = $prefixCode;

        $lastModel = $model->orderBy('created_at', 'desc')->first();
        if ($lastModel) {
            $lastCode = substr($lastModel->code, 2); // ex: 'NV0001' -> '0001'
            $nextCode = str_pad((int) $lastCode + 1, 4, '0', STR_PAD_LEFT);
            $result = $result . $nextCode;
        } else {
            $result = $result . '0001';
        }

        return $result;
    }
}
