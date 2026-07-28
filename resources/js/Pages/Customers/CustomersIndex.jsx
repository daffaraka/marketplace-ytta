import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useMemo } from 'react';
import { Eye, Trash2, CheckCircle } from 'lucide-react';

export default function CustomersIndex({ auth, customers }) {
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
            router.delete(route('customers.destroy', id));
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Nama Pelanggan',
            accessorKey: 'name',
            cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>
        },
        {
            header: 'Chat ID (Telegram)',
            accessorKey: 'telegram_chat_id',
            cell: info => <span className="text-gray-500 text-sm font-mono">{info.getValue()}</span>
        },
        {
            header: 'Telepon',
            accessorKey: 'phone',
            cell: info => <span className="text-gray-600">{info.getValue() || '-'}</span>
        },
        {
            header: 'Total Repeat Order',
            accessorKey: 'total_pesanan_selesai',
            cell: info => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    info.getValue() > 10 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                }`}>
                    {info.getValue()} Kali
                </span>
            )
        },
        {
            header: 'Aksi',
            id: 'actions',
            cell: info => (
                <div className="flex items-center space-x-2">
                    <Link 
                        href={route('customers.show', info.row.original.id)} 
                        className="p-2 rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
                        title="Detail Pelanggan"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                    <button 
                        onClick={() => handleDelete(info.row.original.id)}
                        className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors shadow-sm"
                        title="Hapus Pelanggan"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout user={auth.user} header="Pelanggan & Loyalitas">
            <Head title="Pelanggan" />
            <div id="page-customers">

            {flash?.success && (
                <div id="section-customers-flash" className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center text-green-700 shadow-sm">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">{flash.success}</span>
                </div>
            )}
            
            <div id="section-customers-header" className="mt-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Database Pelanggan</h2>
                <div id="table-customers" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <DataTable 
                        columns={columns} 
                        data={customers} 
                        searchPlaceholder="Cari pelanggan..."
                    />
                </div>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}
