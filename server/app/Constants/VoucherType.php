<?php

namespace App\Constants;

class VoucherType
{
    const PUBLIC = 'public';
    const PRIVATE = 'private';

    public static function toArray(): array
    {
        return [
            self::PUBLIC,
            self::PRIVATE,
        ];
    }
}
