<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::where('id','!=', $request->user()->id)->get();
        return response(['users' => $users],200);
    }

    public function getUser(Request $request)
    {
        $user = $request->user();
        auth()->guard()->login($user);
        return $user;
    }
}
