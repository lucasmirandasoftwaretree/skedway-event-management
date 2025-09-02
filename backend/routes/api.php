<?php
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response('OK', 200);
});

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/users', [UserController::class, 'index']);

Route::get('/reservations', [ReservationController::class, 'index']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);
