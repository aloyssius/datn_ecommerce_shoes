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

            if (DateTime::createFromFormat('d-m-Y H:i', $value)) {
                $convertedValue = date('Y-m-d H:i', strtotime($value));
            }

            $convertedData[$convertedKey] = $convertedValue;
        }

        // add more colunms
        foreach ($moreColunms as $key => $value) {
            $convertedData[Str::snake($key)] = $value;
        }

        return $convertedData;
    }

    public static function formatCurrencyVnd($data)
    {
        $hasNonZeroNumber = preg_match('/\d*[1-9]\d*/', $data);

        if ($hasNonZeroNumber) {
            $formattedNumber = number_format($data, 0, ',', '.');
            return str_replace('.', ',', $formattedNumber);
        }
        return "";
    }

    public static function formatNumberString($data)
    {
        $hasNonZeroNumber = preg_match('/\d*[1-9]\d*/', $data);

        if ($hasNonZeroNumber) {
            return preg_replace('/[^0-9]+/', '', $data);
        }

        return '';
    }
}
