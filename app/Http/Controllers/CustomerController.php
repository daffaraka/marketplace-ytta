<?php
namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::latest()->get();
        return Inertia::render('Customers/CustomersIndex', ['customers' => $customers]);
    }

    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        $orders = $customer->orders()->with('items.product')->latest()->get();
        return Inertia::render('Customers/CustomersShow', [
            'customer' => $customer,
            'orders' => $orders,
        ]);
    }

    public function destroy($id)
    {
        Customer::findOrFail($id)->delete();
        return redirect()->route('customers')->with('success', 'Pelanggan berhasil dihapus!');
    }
}
