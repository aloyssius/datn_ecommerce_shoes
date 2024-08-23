<?php

use App\Http\Controllers\Api\Bills\BillController;
use App\Http\Controllers\Api\Accounts\CustomerController;
use App\Http\Controllers\Api\Accounts\EmployeeController;
use App\Http\Controllers\Api\Vouchers\VoucherController;
use App\Http\Controllers\Api\Promotions\PromotionController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!

*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

DB::enableQueryLog();

Route::middleware(['api', 'cors'])->group(function () {
    require __DIR__ . '/api/accounts/api.php';
    require __DIR__ . '/api/bills/api.php';
    require __DIR__ . '/api/products/api.php';
    require __DIR__ . '/api/vouchers/api.php';
    require __DIR__ . '/api/promotions/api.php';
    require __DIR__ . '/api/carts/api.php';
});
