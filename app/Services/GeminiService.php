<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = \App\Models\Setting::get('gemini_api_key', config('services.gemini.api_key', ''));
        $this->model = \App\Models\Setting::get('gemini_model', config('services.gemini.model', 'gemini-2.0-flash'));
    }

    public function handleChat(string $chatId, array $history): string
    {
        if (empty($this->apiKey)) {
            Log::warning('Gemini API key not set. Returning fallback.');
            return 'Maaf, layanan AI sedang tidak tersedia. Silakan coba lagi nanti.';
        }

        try {
            $systemPrompt = "Kamu adalah asisten AI untuk YTTA Marketplace, sebuah aplikasi pemesanan makanan diaspora Indonesia. "
                . "Tugasmu: menjawab pertanyaan tentang menu, harga, status pesanan, dan FAQ. "
                . "Kamu TIDAK boleh membuat pesanan baru, mengubah harga, atau mengubah data apapun. "
                . "Jawab dengan ramah dalam Bahasa Indonesia. "
                . "Jika kamu tidak bisa menjawab atau pelanggan meminta bicara dengan admin, jawab HANYA dengan: __HANDOFF__";

            $contents = [];
            
            // Add system instruction as first user message
            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => $systemPrompt]]
            ];
            $contents[] = [
                'role' => 'model', 
                'parts' => [['text' => 'Baik, saya siap membantu pelanggan YTTA Marketplace!']]
            ];

            // Add conversation history
            foreach ($history as $msg) {
                $role = $msg['role'] === 'user' ? 'user' : 'model';
                $contents[] = [
                    'role' => $role,
                    'parts' => [['text' => $msg['content']]]
                ];
            }

            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

            $response = Http::timeout(30)->post($url, [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 500,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? '__HANDOFF__';
            }

            Log::error('Gemini API error: ' . $response->body());
            return '__HANDOFF__';

        } catch (\Exception $e) {
            Log::error('Gemini Service error: ' . $e->getMessage());
            return '__HANDOFF__';
        }
    }
}
