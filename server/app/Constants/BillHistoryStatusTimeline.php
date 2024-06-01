<?php

namespace App\Constants;

class BillHistoryStatusTimeline
{
    const CREATED = 'created';
    const PENDING_CONFIRM = 'pending_confirm';
    const DELYVERING = 'delivering';
    const COMPLETED = 'completed';
    const CANCELED = 'canceled';

    public static function toArray(): array
    {
        return [
            self::CREATED,
            self::PENDING_CONFIRM,
            self::DELYVERING,
            self::COMPLETED,
            self::CANCELED,
        ];
    }
}
