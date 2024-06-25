<?php

use App\Http\Controllers\Api\Accounts\CustomerController;
use App\Http\Controllers\Api\Accounts\EmpolyeeController;
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

Route::get('/customers', [CustomerController::class, 'index']);
Route::post('/customers', [CustomerController::class, 'store']);
Route::put('/customers/{id}', [CustomerController::class, 'update']);
Route::get('/customers/{id}', [CustomerController::class, 'show']);

Route::get('/employees', [EmpolyeeController::class, 'index']);
