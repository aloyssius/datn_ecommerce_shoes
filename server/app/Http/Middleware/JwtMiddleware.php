<?php

namespace App\Http\Middleware;

use App\Constants\ConstantSystem;
use App\Helpers\ApiResponse;
use Closure;
use JWTAuth;
use Exception;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;


class JwtMiddleware extends BaseMiddleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */

    public function handle($request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
                return ApiResponse::responseError(
                    ConstantSystem::UNAUTHORIZED_CODE,
                    ConstantSystem::UNAUTHORIZED,
                    'Token không hợp lệ.',
                );
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                return ApiResponse::responseError(
                    ConstantSystem::UNAUTHORIZED_CODE,
                    ConstantSystem::UNAUTHORIZED,
                    'Token hết hạn.',
                );
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenBlacklistedException) {
                return response()->json(['status' => 'Token is Blacklisted'], 400);
            } else {
                return ApiResponse::responseError(
                    ConstantSystem::UNAUTHORIZED_CODE,
                    ConstantSystem::UNAUTHORIZED,
                    'Thiếu token.',
                );
            }
        }
        return $next($request);
    }
}
