<?php

use App\Http\Controllers\Api\Vouchers\VoucherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group([
    'middleware' => 'jwt.verify',
    'prefix' => 'auth'

], function ($router) {
    Route::get('/vouchers', [VoucherController::class, 'index']);
    Route::post('/vouchers', [VoucherController::class, 'store']);
    Route::put('/vouchers/{id}', [VoucherController::class, 'update']);
    Route::get('/vouchers/{id}', [VoucherController::class, 'show']);
    Route::put('/vouchers/{id}/end', [VoucherController::class, 'endVoucher']);
    Route::put('/vouchers/{id}/restore', [VoucherController::class, 'restoreVoucher']);
});
