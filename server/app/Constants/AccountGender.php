<?php

namespace App\Constants;

class AccountGender
{
    const MEN = 0;
    const WOMEN = 1;

    public static function toArray(): array
    {
        return [
            self::MEN,
            self::WOMEN,
        ];
    }
}
