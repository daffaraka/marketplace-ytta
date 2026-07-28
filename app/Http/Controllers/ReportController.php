<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        // Revenue per day (last 30 days)
        $dailyRevenue = Order::where('status', '!=', 'pending')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(total_price) as revenue, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top selling products
        $topProducts = OrderItem::selectRaw('product_id, SUM(quantity) as total_sold, SUM(subtotal) as total_revenue')
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->with('product:id,name,price,image')
            ->get();

        // Order status distribution
        $statusDistribution = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Monthly revenue (last 12 months)
        $monthlyRevenue = Order::where('status', '!=', 'pending')
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(total_price) as revenue, COUNT(*) as orders')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Summary stats
        $totalRevenue = Order::where('status', '!=', 'pending')->sum('total_price');
        $totalOrders = Order::count();
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        return Inertia::render('Reports/ReportsIndex', [
            'dailyRevenue' => $dailyRevenue,
            'topProducts' => $topProducts,
            'statusDistribution' => $statusDistribution,
            'monthlyRevenue' => $monthlyRevenue,
            'summary' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'avgOrderValue' => round($avgOrderValue),
            ],
        ]);
    }
}
