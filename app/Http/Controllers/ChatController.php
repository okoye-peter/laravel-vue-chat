<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Chat;
use App\Events\NewMessageEvent;
use Illuminate\Http\Request;
use App\Http\Traits\FileTraits;

class ChatController extends Controller
{
    use FileTraits;

    public function store(Request $request)
    {
        $data = $this->validate($request, [
            'receiver_id' => 'required|integer|exists:users,id',
            'message' => 'required|string',
            'image' => 'sometimes|image|max:2048',
        ]);
        if ($request->receiver_id == auth()->id()) {
            return response(['error' => 'you can\'t send message to yourself'], 400);
        }
        if($request->has('image') && $request->file('image')->isValid()) {
            $data['message'] = $this->uploadFile($request->file('image'), 'images/uploads/chats/');
            $data['type'] = 1;
            unset($data['image']);
        }

        $data['user_id'] = $request->user()->id;

        $chat = Chat::create($data);
        broadcast(new NewMessageEvent($chat));

        return response(['chat' => $chat], 200);
    }

    public function markAsRead($id)
    {
        $timeStamp = Carbon::now();
        Chat::where('receiver_id', auth()->id())->where('user_id',$id)->whereNull('read_at')->get()->each(function($chat) use ($timeStamp){
            $chat->update(['read_at' => $timeStamp]);
        });
        return response(['timestamp' => $timeStamp->toDateTimeString(),'user_id' => $id, 'receiver_id' => auth()->id()]);   
    }

    public function index()
    {
        $chats = Chat::where('user_id', auth()->id())->Orwhere('receiver_id', auth()->id())->get();
        return response(['chat' => $chats], 200);
    }
}
