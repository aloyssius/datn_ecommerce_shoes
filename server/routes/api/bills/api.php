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

Route::get('/bills', [BillController::class, 'index']);
Route::post('/bills', [BillController::class, 'store']);
Route::put('/bills', [BillController::class, 'update']);
Route::put('/bills/status', [BillController::class, 'updateStatus']);
Route::get('/bills/{id}', [BillController::class, 'show']);
