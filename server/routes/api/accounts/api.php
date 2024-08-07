<?php

use App\Http\Controllers\Api\Accounts\CustomerController;
use App\Http\Controllers\Api\Accounts\EmployeeController;
use App\Http\Controllers\Api\Bills\BillController;
use App\Http\Controllers\AuthController;
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

// admin
Route::get('/customers', [CustomerController::class, 'index']);
Route::post('/customers', [CustomerController::class, 'store']);
Route::put('/customers/{id}', [CustomerController::class, 'update']);
Route::get('/customers/{id}', [CustomerController::class, 'show']);

Route::get('/customers/address/{id}', [CustomerController::class, 'show']);
Route::post('/customers/address/', [CustomerController::class, 'storeAddress']);
Route::get('/customers/{id}/address', [CustomerController::class, 'index']);

Route::get('/employees', [EmployeeController::class, 'index']);
Route::post('/employees', [EmployeeController::class, 'store']);
Route::put('/employees/{id}', [EmployeeController::class, 'update']);
Route::get('/employees/{id}', [EmployeeController::class, 'show']);

Route::get('/employees/address/{id}', [EmployeeController::class, 'show']);
Route::post('/employees/address/', [EmployeeController::class, 'storeAddress']);
Route::get('/employees/{id}/address', [EmployeeController::class, 'index']);

Route::post('/customers/address/default', [CustomerController::class, 'storeAddressDefault']);

// client
Route::group(['prefix' => 'auth'], function ($router) {
    Route::post('/account/login', [AuthController::class, 'login']);
    Route::post('/account/register', [AuthController::class, 'register']);
    Route::post('/account/verify/{id}', [AuthController::class, 'verify']);
    Route::get('/account/register-success/{id}', [AuthController::class, 'showAccountRegister']);
    Route::post('/account/reset-password/{id}', [AuthController::class, 'resetPassword']);
});

Route::group([
    'middleware' => 'jwt.verify',
    'prefix' => 'auth'

], function ($router) {
    Route::post('/account/change-password/{id}', [AuthController::class, 'changePassword']);
    Route::post('/account/logout', [AuthController::class, 'logout']);
    Route::post('/account/refresh', [AuthController::class, 'refresh']);
    Route::post('/account/update', [AuthController::class, 'updateAccount']);
    Route::get('/account/my-account', [AuthController::class, 'show']);
    Route::get('/account/bills/{accountId}', [BillController::class, 'showBillsByAccount']);
});
