<?php

namespace App\Constants;

class AccountGender
{
    const MEN = 1;
    const WOMEN = 0;

    public static function toArray(): array
    {
        return [
            self::MEN,
            self::WOMEN,
        ];
    }
}