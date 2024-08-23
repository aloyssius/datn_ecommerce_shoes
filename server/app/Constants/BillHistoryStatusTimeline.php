<?php

namespace App\Constants;

class BillHistoryStatusTimeline
{
    const CREATED = 'created';
    const WAITTING_DELIVERY = 'waitting_delivery';
    const DELYVERING = 'delivering';
    const COMPLETED = 'completed';
    const CANCELED = 'canceled';

    public static function toArray(): array
    {
        return [
            self::CREATED,
            self::WAITTING_DELIVERY,
            self::DELYVERING,
            self::COMPLETED,
            self::CANCELED,
        ];
    }
}
