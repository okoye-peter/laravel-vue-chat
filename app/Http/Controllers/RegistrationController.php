<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Traits\FileTraits;
use App\Events\NewRegistrationEvent;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class RegistrationController extends Controller
{
    use FileTraits;

    public function register(Request $request)
    {
        // Validator
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|string|email|unique:users,email',
            'image' => 'required|image|max:4000',
            'password' => 'required|string'
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
        $data = $validator->validated();
        $data['image'] = $this->uploadFile($request->file('image'), 'images/uploads/users/');
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);
        broadcast(new NewRegistrationEvent($user))->toOthers();

        return response()->json(['message' => 'registration successful'], 200);
    }
}

