<?php

namespace App\Constants;

class VoucherStatus
{
    const ON_GOING = 'on_going';
    const UP_COMMING = 'up_comming';
    const FINISHED = 'finished';
    public static function toArray(): array
    {
        return [
            self::ON_GOING,
            self::UP_COMMING,
            self::FINISHED,
        ];
    }
}
