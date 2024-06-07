<?php

namespace App\Constants;

class Role
{
    const ADMIN = 'admin';
    const EMPLOYEE = 'employee';
    const CUSTOMER = 'customer';

    const ADMIN_VI = 'Quản trị viên';
    const EMPLOYEE_VI = 'Nhân viên';
    const CUSTOMER_VI = 'Khách hàng';

    public static function toArray(): array
    {
        return [
            self::ADMIN,
            self::EMPLOYEE,
            self::CUSTOMER,
        ];
    }
}
