import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Package, AlertTriangle, Save, CheckCircle } from 'lucide-react';
import DataTable from '@/Components/DataTable';

export default function CatalogStock({ auth, products = [] }) {
    const { flash } = usePage().props;
    
    // State to track modified stocks
    const [stocks, setStocks] = useState(
        products.map(p => ({ id: p.id, stock: p.stock }))
    );
    
    const [processing, setProcessing] = useState(false);

    const handleStockChange = (id, value) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 0) return;
        
        setStocks(prev => prev.map(s => s.id === id ? { ...s, stock: numValue } : s));
    };

    const submit = () => {
        setProcessing(true);
        router.put(route('catalog.stock.bulk'), { stocks }, {
            onFinish: () => setProcessing(false),
            preserveScroll: true
        });
    };

    // Calculate low stock items based on current state, not original props
    const lowStockCount = stocks.filter(s => s.stock < 10).length;

    const columns = useMemo(() => [
        {
            header: 'Foto',
            accessorKey: 'image',
            cell: info => (
                info.getValue() ? (
                    <img src={info.getValue().startsWith('http') ? info.getValue() : `/storage/${info.getValue()}`} alt="Menu" className="h-10 w-10 rounded-md object-cover border border-gray-200" />
                ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                        <Package className="w-5 h-5 text-gray-400" />
                    </div>
                )
            )
        },
        {
            header: 'Nama Menu',
            accessorKey: 'name',
            cell: info => <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
        },
        {
            header: 'Kategori',
            accessorFn: row => row.category?.name || '-',
            id: 'category_name',
            cell: info => <div className="text-sm text-gray-500">{info.getValue()}</div>
        },
        {
            header: 'Harga',
            accessorKey: 'price',
            cell: info => (
                <div className="text-sm text-gray-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(info.getValue())}
                </div>
            )
        },
        {
            header: 'Stok Saat Ini',
            accessorKey: 'stock',
            id: 'current_stock',
            cell: info => {
                const product = info.row.original;
                const currentStock = stocks.find(s => s.id === product.id)?.stock ?? product.stock;
                const isLowStock = currentStock < 10;
                return (
                    <input
                        type="number"
                        min="0"
                        value={currentStock}
                        onChange={(e) => handleStockChange(product.id, e.target.value)}
                        className={`block w-24 rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                            isLowStock 
                                ? 'border-red-300 text-red-900 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300'
                        }`}
                    />
                );
            }
        }
    ], [stocks]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Stok</h2>}
        >
            <Head title="Manajemen Stok" />

            <div id="page-catalog-stock" className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div id="section-stock-alert">
                    
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2 shadow-sm">
                            <CheckCircle className="w-5 h-5" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {lowStockCount > 0 && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <p className="text-amber-800 font-medium">
                                Perhatian: Ada {lowStockCount} menu dengan stok menipis (kurang dari 10).
                            </p>
                        </div>
                    )}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div id="section-stock-actions" className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Package className="w-5 h-5 text-indigo-500" />
                                Edit Stok Massal
                            </h3>
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 shadow-sm"
                            >
                                <Save className="w-4 h-4" />
                                Simpan Semua Perubahan
                            </button>
                        </div>
                        
                        <div id="table-catalog-stock">
                            <DataTable 
                                columns={columns}
                                data={products}
                                searchPlaceholder="Cari menu..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
