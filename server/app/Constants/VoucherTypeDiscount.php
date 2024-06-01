<?php

namespace App\Constants;

class VoucherTypeDiscount
{
    const PERCENT = 'percent';
    const VND = 'vnd';

    public static function toArray(): array
    {
        return [
            self::PERCENT,
            self::VND,
        ];
    }
}
