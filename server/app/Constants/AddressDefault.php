<?php

namespace App\Constants;

class AddressDefault
{
    const IS_DEFAULT = 1;
    const UN_DEFAULT = 0;

    public static function toArray(): array
    {
        return [
            self::IS_DEFAULT,
            self::UN_DEFAULT,
        ];
    }
}
