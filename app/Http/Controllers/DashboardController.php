<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', '!=', 'pending')->sum('total_price');
        $totalCustomers = Customer::count();
        $totalProducts = Product::count();
        $recentOrders = Order::with('customer')->latest()->limit(10)->get();
        $lowStockProducts = Product::where('stock', '<', 10)->orderBy('stock')->limit(5)->get();
        $pendingOrders = Order::where('status', 'pending')->count();

        return Inertia::render('Dashboard/DashboardIndex', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalCustomers' => $totalCustomers,
                'totalProducts' => $totalProducts,
                'pendingOrders' => $pendingOrders,
            ],
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
