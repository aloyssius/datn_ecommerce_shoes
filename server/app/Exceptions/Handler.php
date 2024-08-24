<?php

namespace App\Exceptions;

use App\Constants\ConstantSystem;
use App\Helpers\ApiResponse;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($exception instanceof NotFoundHttpException) {
            return ApiResponse::responseError(
                ConstantSystem::NOT_FOUND_CODE,
                ConstantSystem::END_POINT_NOT_FOUND,
                'Đường dẫn api không tồn tại.'
            );
        } else if ($exception instanceof RestApiException) {
            return ApiResponse::responseError(
                ConstantSystem::BAD_REQUEST_CODE,
                ConstantSystem::BAD_REQUEST,
                $exception->getMessage(),
            );
        } else if ($exception instanceof VNPayException) {
            return ApiResponse::responseErrorVnPay(
                $exception->getRspCode(),
                $exception->getMessage(),
                ConstantSystem::BAD_REQUEST_CODE,
            );
        } else if ($exception instanceof NotFoundException) {
            return ApiResponse::responseError(
                ConstantSystem::NOT_FOUND_CODE,
                ConstantSystem::MODEL_NOT_FOUND,
                $exception->getMessage(),
            );
        } else if ($exception instanceof Exception) {
            return ApiResponse::responseError(
                ConstantSystem::SERVER_ERROR_CODE,
                ConstantSystem::SERVER_ERROR,
                $exception->getMessage(),
            );
        }

        return parent::render($request, $exception);
    }
}
