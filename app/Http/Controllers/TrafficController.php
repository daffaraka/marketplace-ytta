<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use App\Models\AiConversation;
use App\Models\AdminFallbackMessage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class TrafficController extends Controller
{
    public function index()
    {
        // Active sessions from DB
        $activeSessions = DB::table('sessions')
            ->where('last_activity', '>=', Carbon::now()->subMinutes(30)->timestamp)
            ->count();

        // New customers per day (last 14 days)
        $newCustomersPerDay = Customer::where('created_at', '>=', Carbon::now()->subDays(14))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Bot activity (AI conversations per day, last 14 days)
        $botActivity = AiConversation::where('created_at', '>=', Carbon::now()->subDays(14))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Unresolved fallback messages
        $unresolvedFallbacks = AdminFallbackMessage::where('is_resolved', false)->count();

        // System info
        $systemInfo = [
            'php_version' => phpversion(),
            'laravel_version' => app()->version(),
            'server_time' => now()->format('d M Y, H:i:s'),
            'timezone' => config('app.timezone'),
            'total_customers' => Customer::count(),
            'total_orders' => Order::count(),
            'total_ai_chats' => AiConversation::count(),
            'active_sessions' => $activeSessions,
            'unresolved_fallbacks' => $unresolvedFallbacks,
        ];

        return Inertia::render('Reports/TrafficIndex', [
            'newCustomersPerDay' => $newCustomersPerDay,
            'botActivity' => $botActivity,
            'systemInfo' => $systemInfo,
        ]);
    }
}
