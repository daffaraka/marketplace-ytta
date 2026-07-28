<?php

namespace App\Http\Controllers;

use App\Models\AdminFallbackMessage;
use App\Models\AiConversation;
use App\Models\Customer;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleTelegram(Request $request, GeminiService $gemini)
    {
        $update = $request->all();

        // 0. Ensure it's a message
        if (!isset($update['message']['text'])) {
            return response()->json(['status' => 'ignored']);
        }

        $chatId = $update['message']['chat']['id'];
        $text = $update['message']['text'];
        $name = $update['message']['from']['first_name'] ?? 'User';

        // 1. Guardrails (Sensor Kata Kotor) - Layer 1
        $badWords = ['bodoh', 'anjing', 'babi', 'tolol'];
        foreach ($badWords as $word) {
            if (stripos($text, $word) !== false) {
                $this->sendMessage($chatId, "Mohon gunakan bahasa yang sopan ya kak. 😊");
                return response()->json(['status' => 'rejected']);
            }
        }

        // 2. Register or Get Customer
        $customer = Customer::firstOrCreate(
            ['telegram_chat_id' => $chatId],
            ['name' => $name]
        );

        // Check if handoff is active (Admin is handling)
        if (cache()->has("handoff_{$chatId}")) {
            // Forward to admin fallback inbox
            AdminFallbackMessage::create([
                'telegram_chat_id' => $chatId,
                'message' => $text,
            ]);
            // Silent to user, let admin reply manually via dashboard
            return response()->json(['status' => 'handoff_active']);
        }

        // 3. Save User Message to History
        AiConversation::create([
            'telegram_chat_id' => $chatId,
            'role' => 'user',
            'content' => $text
        ]);

        // Fetch last 5 messages for conversational context
        $history = AiConversation::where('telegram_chat_id', $chatId)
                    ->orderBy('id', 'desc')
                    ->limit(5)
                    ->get()
                    ->reverse()
                    ->map(fn($c) => ['role' => $c->role, 'content' => $c->content])
                    ->values()
                    ->toArray();

        // 4. Send to OpenAI via Service
        $aiResponseText = $gemini->handleChat((string)$chatId, $history);

        // Handoff Trigger
        if ($aiResponseText === "__HANDOFF__") {
            // Lock bot for 2 hours
            cache()->put("handoff_{$chatId}", true, now()->addHours(2));
            $aiResponseText = "Mohon tunggu sebentar ya kak, saya sambungkan ke admin kami untuk membantu lebih lanjut...";
            
            AdminFallbackMessage::create([
                'telegram_chat_id' => $chatId,
                'message' => "[System Auto-Eskalasi] User meminta admin. Pesan terakhir: " . $text,
            ]);
        }

        // Save AI Response to History
        AiConversation::create([
            'telegram_chat_id' => $chatId,
            'role' => 'assistant',
            'content' => $aiResponseText
        ]);

        // 5. Reply to Telegram
        $this->sendMessage($chatId, $aiResponseText);

        return response()->json(['status' => 'ok']);
    }

    private function sendMessage($chatId, $text)
    {
        $token = \App\Models\Setting::get('telegram_bot_token', env('TELEGRAM_BOT_TOKEN'));
        if (!$token) {
            // Mock mode for local dev without token
            Log::info("MOCK TELEGRAM BOT -> To: $chatId | Message: $text");
            return;
        }

        Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $text
        ]);
    }
}
