<?php

namespace App\Exceptions;

use Exception;
use RuntimeException;

class RestApiObjectException extends RuntimeException
{

    protected $errors = [];

    public function setErrors($errors)
    {
        $this->errors = $errors;
    }

    public function getErrors()
    {
        return $this->errors;
    }
}
