<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->get();
        return Inertia::render('Catalog/CatalogIndex', ['products' => $products]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Catalog/CatalogCreate', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = '/storage/' . $request->file('image')->store('products', 'public');
        }

        Product::create($validated);
        return redirect()->route('catalog')->with('success', 'Menu berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $product = Product::with('category')->findOrFail($id);
        $categories = Category::all();
        return Inertia::render('Catalog/CatalogEdit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                $oldPath = str_replace('/storage/', '', $product->image);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['image'] = '/storage/' . $request->file('image')->store('products', 'public');
        }

        $product->update($validated);
        return redirect()->route('catalog')->with('success', 'Menu berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product->image) {
            $oldPath = str_replace('/storage/', '', $product->image);
            Storage::disk('public')->delete($oldPath);
        }
        $product->delete();
        return redirect()->route('catalog')->with('success', 'Menu berhasil dihapus!');
    }

    public function stockManagement()
    {
        $products = Product::with('category')->orderBy('stock')->get();
        return Inertia::render('Catalog/CatalogStock', ['products' => $products]);
    }

    public function bulkUpdateStock(Request $request)
    {
        $validated = $request->validate([
            'stocks' => 'required|array',
            'stocks.*.id' => 'required|exists:products,id',
            'stocks.*.stock' => 'required|integer|min:0',
        ]);

        foreach ($validated['stocks'] as $item) {
            Product::where('id', $item['id'])->update(['stock' => $item['stock']]);
        }

        return redirect()->back()->with('success', 'Stok berhasil diperbarui!');
    }
}
