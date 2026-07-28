<?php
namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/SettingsIndex', [
            'settings' => [
                'telegram_bot_token' => Setting::get('telegram_bot_token', ''),
                'gemini_api_key' => Setting::get('gemini_api_key', ''),
                'gemini_model' => Setting::get('gemini_model', 'gemini-2.0-flash'),
                'bot_enabled' => Setting::get('bot_enabled', 'true'),
                'bot_welcome_message' => Setting::get('bot_welcome_message', 'Halo! Selamat datang di YTTA Marketplace. Ada yang bisa saya bantu?'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'telegram_bot_token' => 'nullable|string',
            'gemini_api_key' => 'nullable|string',
            'gemini_model' => 'nullable|string',
            'bot_enabled' => 'nullable|string',
            'bot_welcome_message' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan!');
    }
}
