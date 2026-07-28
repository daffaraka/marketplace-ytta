import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useMemo } from 'react';
import { ArrowLeft, User, Eye } from 'lucide-react';

export default function CustomersShow({ auth, customer, orders }) {
    const getBadgeStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'diproses': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'lunas': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'selesai': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Order ID',
            accessorKey: 'id',
            cell: info => <span className="font-medium">#{info.getValue()}</span>
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
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(info.getValue())} uppercase tracking-wider`}>
                    {info.getValue()}
                </span>
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
                <Link 
                    href={route('orders.show', info.row.original.id)} 
                    className="p-2 inline-block rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
                    title="Detail Pesanan"
                >
                    <Eye className="w-4 h-4" />
                </Link>
            )
        }
    ], []);

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?';
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Detail Pelanggan">
            <Head title={`Pelanggan - ${customer.name}`} />
            <div id="page-customers-show">

            <div id="section-customers-show-nav" className="mt-6 mb-6">
                <Link
                    href={route('customers')}
                    className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    {/* Info Pelanggan Card */}
                    <div id="section-customers-show-info" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 flex flex-col items-center border-b border-gray-50">
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-sm">
                                {getInitials(customer.name)}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center">{customer.name}</h3>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                                {customer.total_pesanan_selesai} Repeat Order
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50/50 space-y-4">
                            <div>
                                <span className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Telepon</span>
                                <span className="font-medium text-gray-900">{customer.phone || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Telegram Chat ID</span>
                                <span className="font-mono text-sm text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">{customer.telegram_chat_id || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Bergabung Sejak</span>
                                <span className="text-sm text-gray-700">
                                    {new Date(customer.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {/* Riwayat Pesanan */}
                    <div id="section-customers-show-orders" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">Riwayat Pesanan</h3>
                        </div>
                        <div id="table-customers-orders">
                            <DataTable 
                                columns={columns} 
                                data={orders} 
                                searchPlaceholder="Cari riwayat pesanan..."
                            />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}
