<?php

namespace App\Exceptions;

use Exception;
use RuntimeException;

class VNPayException extends RuntimeException
{
    protected $code;

    public function __construct($message, $code = 0, Exception $previous = null)
    {
        $this->code = $code;
        parent::__construct($message, $code, $previous);
    }

    public function getRspCode()
    {
        return $this->code;
    }
}
