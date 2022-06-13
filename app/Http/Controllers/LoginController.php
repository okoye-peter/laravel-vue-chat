<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Events\LoginEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $data = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if (!Auth::attempt($data->validated())) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);  
        }
        
        

        $user = auth()->user();
        $user->update([
            'online' => true,
            'last_logged_in' => Carbon::now()
        ]);
        broadcast(new LoginEvent($user->fresh()))->toOthers();

        return response()->json(['user' => $user, 'token' => Auth::user()->createToken('chat-app')->accessToken], 200);
    }

    public function logout()
    {
        $user = auth()->user();
        $user->update([
            'online' => false
        ]);
        broadcast(new LoginEvent($user->fresh()))->toOthers();

        auth()->logout();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }
}
