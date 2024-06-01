<?php

namespace App\Constants;

class DiscountStatus
{
    const UP_COMMING = 'up_comming';
    const ON_GOING = 'on_going';
    const FINISHED = 'finished';

    public static function toArray(): array
    {
        return [
            self::UP_COMMING,
            self::ON_GOING,
            self::FINISHED,
        ];
    }
}
