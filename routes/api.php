<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PasswordResetController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['middleware' => 'guest'], function(){
    Route::post('/register', [RegistrationController::class, 'register']);
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/send-reset-link', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});

Route::group(['middleware' => 'auth:api'], function(){
    Route::get('/users/profile', [UserController::class, 'getUser']);
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/chats', [ChatController::class, 'index']);
    Route::get('/chats/{id}', [ChatController::class, 'markAsRead']);
    Route::post('/chats/create', [ChatController::class, 'store']);
});