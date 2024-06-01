<?php

namespace App\Constants;

class OrderType
{
    const AT_THE_COUNTER = 'at_the_counter';
    const DELIVERY = 'delivery';
    const CLIENT = 'client';

    public static function toArray(): array
    {
        return [
            self::AT_THE_COUNTER,
            self::DELIVERY,
            self::CLIENT,
        ];
    }
}
