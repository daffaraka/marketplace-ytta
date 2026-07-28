<?php
namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('customer')->latest()->get();
        return Inertia::render('Orders/OrdersIndex', ['orders' => $orders]);
    }

    public function show($id)
    {
        $order = Order::with(['customer', 'items.product'])->findOrFail($id);
        return Inertia::render('Orders/OrdersShow', ['order' => $order]);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:pending,diproses,lunas,selesai',
        ]);
        $order->update($validated);

        // Update customer's completed order count
        if ($validated['status'] === 'selesai' && $order->customer) {
            $order->customer->increment('total_pesanan_selesai');
        }

        return redirect()->back()->with('success', 'Status pesanan berhasil diubah!');
    }

    public function destroy($id)
    {
        Order::findOrFail($id)->delete();
        return redirect()->route('orders')->with('success', 'Pesanan berhasil dihapus!');
    }

    public function printInvoice($id)
    {
        $order = Order::with(['customer', 'items.product'])->findOrFail($id);
        $pdf = Pdf::loadView('pdf.invoice', ['order' => $order]);
        return $pdf->download('struk-pesanan-' . $order->id . '.pdf');
    }
}
