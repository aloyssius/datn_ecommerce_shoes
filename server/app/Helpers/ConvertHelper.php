<?php

namespace App\Helpers;

use DateTime;
use Illuminate\Support\Str;

class ConvertHelper
{
    public static function convertColumnsToSnakeCase(array $data, array $moreColunms = [])
    {
        $convertedData = [];

        foreach ($data as $key => $value) {
            $convertedKey = Str::snake($key);
            $convertedValue = $value;

            if (DateTime::createFromFormat('d-m-Y', $value)) {
                $convertedValue = date('Y-m-d', strtotime($value));
            }

            $convertedData[$convertedKey] = $convertedValue;
        }

        // add more colunms
        foreach ($moreColunms as $key => $value) {
            $convertedData[Str::snake($key)] = $value;
        }

        return $convertedData;
    }
}
