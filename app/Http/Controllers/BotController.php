<?php

namespace App\Http\Controllers;

use App\Models\AdminFallbackMessage;
use App\Models\AiConversation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BotController extends Controller
{
    public function index()
    {
        $fallbacks = AdminFallbackMessage::where('is_resolved', false)->latest()->get();
        // Get unique chats or latest messages. For demo, just fetching recent history.
        $history = AiConversation::latest()->limit(50)->get();
        
        return Inertia::render('Bot/BotIndex', [
            'fallbacks' => $fallbacks,
            'history' => $history
        ]);
    }

    public function chatHistory()
    {
        $conversations = AiConversation::latest()->get();
        
        // Group by telegram_chat_id to get unique chats
        $chatIds = AiConversation::select('telegram_chat_id')
            ->distinct()
            ->pluck('telegram_chat_id');
        
        return Inertia::render('Bot/BotChatHistory', [
            'conversations' => $conversations,
            'chatIds' => $chatIds,
        ]);
    }
}
