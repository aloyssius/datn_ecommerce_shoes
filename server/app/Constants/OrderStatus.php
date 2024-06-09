<?php

namespace App\Constants;

class OrderStatus
{
    const PENDING_COMFIRN = 'pending_confirm';
    const WAITTING_DELIVERY = 'waitting_delivery';
    const DELIVERING = 'delivering';
    const COMPLETED = 'completed';
    const CANCELED = 'canceled';

    public static function toArray(): array
    {
        return [
            self::PENDING_COMFIRN,
            self::WAITTING_DELIVERY,
            self::DELIVERING,
            self::COMPLETED,
            self::CANCELED,
        ];
    }
}
