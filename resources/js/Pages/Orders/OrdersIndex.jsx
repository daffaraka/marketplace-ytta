import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useMemo } from 'react';
import { Eye, Trash2, CheckCircle } from 'lucide-react';

export default function OrdersIndex({ auth, orders }) {
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
            router.delete(route('orders.destroy', id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        router.patch(route('orders.updateStatus', id), { status: newStatus }, {
            preserveScroll: true
        });
    };

    const getSelectStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500 focus:border-amber-500';
            case 'diproses': return 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500 focus:border-blue-500';
            case 'lunas': return 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500';
            case 'selesai': return 'bg-gray-50 text-gray-700 border-gray-200 focus:ring-gray-500 focus:border-gray-500';
            default: return 'bg-gray-50 text-gray-700 border-gray-200 focus:ring-gray-500 focus:border-gray-500';
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Order ID',
            accessorKey: 'id',
            cell: info => <span className="font-medium text-gray-900">#{info.getValue()}</span>
        },
        {
            header: 'Pelanggan',
            accessorFn: row => row.customer?.name || 'Unknown',
            id: 'customer_name',
            cell: info => <span className="font-medium text-gray-800">{info.getValue()}</span>
        },
        {
            header: 'Total Harga',
            accessorKey: 'total_price',
            cell: info => <span className="font-semibold text-gray-800">Rp {Number(info.getValue()).toLocaleString('id-ID')}</span>
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: info => (
                <select
                    value={info.getValue()}
                    onChange={(e) => handleStatusChange(info.row.original.id, e.target.value)}
                    className={`text-xs font-semibold rounded-full border px-3 py-1 pr-8 uppercase tracking-wider transition-colors cursor-pointer ${getSelectStyle(info.getValue())}`}
                >
                    <option value="pending">PENDING</option>
                    <option value="diproses">DIPROSES</option>
                    <option value="lunas">LUNAS</option>
                    <option value="selesai">SELESAI</option>
                </select>
            )
        },
        {
            header: 'Tanggal',
            accessorKey: 'created_at',
            cell: info => <span className="text-gray-500 text-sm">{new Date(info.getValue()).toLocaleDateString('id-ID')}</span>
        },
        {
            header: 'Aksi',
            id: 'actions',
            cell: info => (
                <div className="flex items-center space-x-2">
                    <Link 
                        href={route('orders.show', info.row.original.id)} 
                        className="p-2 rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
                        title="Detail Pesanan"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                    <button 
                        onClick={() => handleDelete(info.row.original.id)}
                        className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors shadow-sm"
                        title="Hapus Pesanan"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout user={auth.user} header="Manajemen Pesanan">
            <Head title="Pesanan" />
            <div id="page-orders">

            {flash?.success && (
                <div id="section-orders-flash" className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center text-green-700 shadow-sm">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">{flash.success}</span>
                </div>
            )}
            
            <div id="section-orders-header" className="mt-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar Pesanan</h2>
                <div id="table-orders" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <DataTable 
                        columns={columns} 
                        data={orders} 
                        searchPlaceholder="Cari pesanan (ID, Pelanggan, Status)..."
                    />
                </div>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}
