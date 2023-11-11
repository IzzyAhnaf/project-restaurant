<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\UbahstokController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/AddItems', [MenuController::class, 'Add']);
Route::delete('/DeleteItems/{id}', [MenuController::class, 'Delete']);
Route::post('/UpdateItems/{id}', [MenuController::class, 'Update']);
Route::post('/UpdateItemsStock', [UbahstokController::class, 'Add']);
Route::resource('GetItems', MenuController::class);
Route::get('/GetInvoices', [InvoiceController::class, 'index']);
Route::post('/AddInvoices', [InvoiceController::class, 'Store']);
Route::post('/Transaction', [InvoiceController::class, 'Charge']);