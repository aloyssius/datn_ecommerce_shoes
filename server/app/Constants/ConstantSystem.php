<?php

namespace App\Constants;

class ConstantSystem
{
    const CODE_MAX_LENGTH = 20;
    const DEFAULT_MAX_LENGTH = 255;
    const ADDRESS_MAX_LENGTH = 255;
    const FULL_NAME_MAX_LENGTH = 55;
    const PHONE_NUMBER_MAX_LENGTH = 15;
    const PASSWORD_MAX_LENGTH = 32;
    const EMAIL_MAX_LENGTH = 254;
    const IDENTITY_CARD_MAX_LENGTH = 12;
    const URL_MAX_LENGTH = 2048;

    const CURRENT_PAGE = 1;
    const PAGE_SIZE = 10;

    const SERVER_ERROR = 'SERVER_ERROR';
    const SERVER_ERROR_CODE = 500;

    const MODEL_NOT_FOUND = 'MODEL_NOT_FOUND';
    const END_POINT_NOT_FOUND = 'END_POINT_NOT_FOUND';
    const NOT_FOUND_CODE = 404;

    const VALIDATION_ERROR_CODE = 422;
    const VALIDATION_ERROR = 'VALIDATION_ERROR';

    const BAD_REQUEST_CODE = 400;
    const BAD_REQUEST = 'BAD_REQUEST';

    const UNAUTHORIZED_CODE = 401;
    const UNAUTHORIZED = 'UNAUTHORIZED';

    const CREATED_CODE = 201;
    const SUCCESS_CODE = 200;

    const CUSTOMER_CODE_PREFIX = 'KH';
    const EMPLOYEE_CODE_PREFIX = 'NV';
    const BILL_CODE_PREFIX = 'HD';
}
