<?php

namespace App\Constants;

class OrderStatus
{
    const PENDING_COMFIRM = 'pending_confirm';
    const WAITTING_DELIVERY = 'waitting_delivery';
    const DELIVERING = 'delivering';
    const COMPLETED = 'completed';
    const CANCELED = 'canceled';

    public static function toArray(): array
    {
        return [
            self::PENDING_COMFIRM,
            self::WAITTING_DELIVERY,
            self::DELIVERING,
            self::COMPLETED,
            self::CANCELED,
        ];
    }
}
