<?php

use App\Http\Controllers\Api\Bills\BillController;
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

    // admin
    Route::get('/statistics', [BillController::class, 'revenueStatistics']);
    Route::get('/bills', [BillController::class, 'index']);
    Route::put('/bills/status', [BillController::class, 'adminUpdateStatus']);
    Route::get('/bills/{id}', [BillController::class, 'showAdmin']);
    // Route::put('/bills/address', [BillController::class, 'adminUpdateAdress']);
    // Route::put('/bills/product/quantity', [BillController::class, 'adminUpdateQuantity']);
});

// client
Route::post('/bills', [BillController::class, 'clientStore']);
Route::get('/tracking-order', [BillController::class, 'showClient']);
Route::put('/bill/status/customer', [BillController::class, 'updateStatusCanceledByCustomer']);

Route::post('/bills/vn-pay/payment', [BillController::class, 're_vnpay_payment']);
Route::get('/bills/vn-pay/process-payment', [BillController::class, 'processPaymentBill']);

Route::put('/bill/payment-method', [BillController::class, 'updatePaymentMethodByCustomer']);
