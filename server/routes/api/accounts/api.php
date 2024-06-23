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

Route::get('/accounts/customer', [CustomerController::class, 'index']);

Route::get('/accounts/employee', [EmpolyeeController::class, 'index']);
