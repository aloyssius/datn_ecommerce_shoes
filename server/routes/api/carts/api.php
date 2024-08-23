<?php

use App\Http\Controllers\Api\Carts\CartController;
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

// product
Route::post('/carts', [CartController::class, 'store']);
Route::put('/carts', [CartController::class, 'update']);
Route::put('/carts/quantity', [CartController::class, 'updateQuantity']);
Route::delete('/carts/{id}', [CartController::class, 'destroy']);
Route::get('/carts', [CartController::class, 'index']);
Route::get('/carts/{accountId}', [CartController::class, 'indexByAccount']);
Route::get('/cart-voucher', [CartController::class, 'findVoucher']);
