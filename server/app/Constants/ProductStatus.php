<?php

namespace App\Constants;

class ProductStatus
{
    const IS_ACTIVE = 'is_active';
    const UN_ACTIVE = 'un_active';

    public static function toArray(): array
    {
        return [
            self::IS_ACTIVE,
            self::UN_ACTIVE,
        ];
    }
}
