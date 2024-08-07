<?php

use App\Http\Controllers\Api\Products\AttributeBrandController;
use App\Http\Controllers\Api\Products\AttributeCategoryController;
use App\Http\Controllers\Api\Products\AttributeColorController;
use App\Http\Controllers\Api\Products\AttributeSizeController;
use App\Http\Controllers\Api\Products\ProductController;
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


// product client
Route::get('/product-list', [ProductController::class, 'clientIndex']);
Route::get('/product-list/male', [ProductController::class, 'clientIndexMale']);
Route::get('/product-list/female', [ProductController::class, 'clientIndexFemale']);
Route::get('/product-details/{sku}', [ProductController::class, 'findBySkuClient']);
Route::get('/product-detail/{id}', [ProductController::class, 'findByClientId']);
Route::get('/product-home', [ProductController::class, 'indexHomeClient']);

Route::group([
    'middleware' => 'jwt.verify',
    'prefix' => 'auth'

], function ($router) {
    // product
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/products/attributes/all', [ProductController::class, 'indexAttributes']);
    Route::post('/products/attributes', [ProductController::class, 'storeAttributes']);
    Route::put('/products/status', [ProductController::class, 'updateStatus']);
    Route::put('/products', [ProductController::class, 'update']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::delete('/products', [ProductController::class, 'destroy']);

    // color
    Route::get('/attributes/colors', [AttributeColorController::class, 'index']);
    Route::put('/attributes/colors/status', [AttributeColorController::class, 'updateStatus']);
    Route::put('/attributes/colors', [AttributeColorController::class, 'update']);
    Route::post('/attributes/colors', [AttributeColorController::class, 'store']);
    Route::delete('/attributes/colors', [AttributeColorController::class, 'destroy']);

    // category
    Route::get('/attributes/categories', [AttributeCategoryController::class, 'index']);
    Route::put('/attributes/categories/status', [AttributeCategoryController::class, 'updateStatus']);
    Route::put('/attributes/categories', [AttributeCategoryController::class, 'update']);
    Route::post('/attributes/categories', [AttributeCategoryController::class, 'storeCategory']);
    Route::delete('/attributes/categories', [AttributeCategoryController::class, 'destroy']);

    // brand
    Route::get('/attributes/brands', [AttributeBrandController::class, 'index']);
    Route::put('/attributes/brands/status', [AttributeBrandController::class, 'updateStatus']);
    Route::put('/attributes/brands', [AttributeBrandController::class, 'update']);
    Route::post('/attributes/brands', [AttributeBrandController::class, 'storeBrand']);
    Route::delete('/attributes/brands', [AttributeBrandController::class, 'destroy']);

    // size
    Route::get('/attributes/sizes', [AttributeSizeController::class, 'index']);
    Route::put('/attributes/sizes/status', [AttributeSizeController::class, 'updateStatus']);
    Route::put('/attributes/sizes', [AttributeSizeController::class, 'update']);
    Route::post('/attributes/sizes', [AttributeSizeController::class, 'storeSize']);
    Route::delete('/attributes/sizes', [AttributeSizeController::class, 'destroy']);
});
