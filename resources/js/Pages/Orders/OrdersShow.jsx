import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, Printer, Package, User } from 'lucide-react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';

export default function OrdersShow({ auth, order }) {
    const [status, setStatus] = useState(order.status);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = () => {
        setIsUpdating(true);
        router.patch(route('orders.updateStatus', order.id), { status }, {
            preserveScroll: true,
            onFinish: () => setIsUpdating(false),
        });
    };

    const getBadgeStyle = (statusName) => {
        switch (statusName) {
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'diproses': return 'bg-blue-100 text-blue-700';
            case 'lunas': return 'bg-emerald-100 text-emerald-700';
            case 'selesai': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const columns = useMemo(() => [
        {
            header: 'No',
            id: 'no',
            cell: info => <span className="text-gray-500">{info.row.index + 1}</span>
        },
        {
            header: 'Menu',
            id: 'menu',
            cell: info => {
                const item = info.row.original;
                return (
                    <div className="flex items-center">
                        {item.product?.image && (
                            <img src={item.product.image} alt="" className="w-10 h-10 rounded-lg object-cover mr-3 bg-gray-100" />
                        )}
                        <span className="font-medium text-gray-900">{item.product?.name || 'Item Dihapus'}</span>
                    </div>
                );
            }
        },
        {
            header: 'Harga Satuan',
            id: 'price',
            cell: info => <span className="text-gray-600">Rp {Number(info.row.original.product?.price || 0).toLocaleString('id-ID')}</span>
        },
        {
            header: 'Qty',
            accessorKey: 'quantity',
            cell: info => <div className="text-center font-medium">{info.getValue()}</div>
        },
        {
            header: 'Subtotal',
            accessorKey: 'subtotal',
            cell: info => <div className="text-right font-semibold text-gray-900">Rp {Number(info.getValue()).toLocaleString('id-ID')}</div>
        }
    ], []);

    return (
        <AuthenticatedLayout user={auth.user} header="Detail Pesanan">
            <Head title={`Pesanan #${order.id}`} />
            <div id="page-orders-show">

            <div id="section-orders-show-nav" className="mt-6 mb-6 flex justify-between items-center">
                <Link
                    href={route('orders')}
                    className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali
                </Link>

                <div id="section-orders-show-actions" className="flex space-x-3">
                    <a
                        href={route('orders.print', order.id)}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm text-sm font-medium transition-colors"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Struk PDF
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div id="section-orders-show-items" className="lg:col-span-2 space-y-6">
                    {/* Item Pesanan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-emerald-600" />
                                Daftar Item Pesanan
                            </h3>
                        </div>
                        <div id="table-orders-items">
                            <DataTable
                                columns={columns}
                                data={order.items}
                                searchPlaceholder="Cari item..."
                            />
                        </div>
                        <div className="bg-gray-50 font-semibold border-t border-gray-200 text-gray-900 p-6 flex justify-between items-center">
                            <span className="text-gray-700">Total Keseluruhan:</span>
                            <span className="text-xl text-emerald-600">
                                Rp {Number(order.total_price).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Info Pesanan & Status */}
                    <div id="section-orders-show-info" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Info Pesanan</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span className="text-gray-500">Order ID</span>
                                    <span className="font-medium">#{order.id}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span className="text-gray-500">Tanggal</span>
                                    <span className="font-medium text-right">
                                        {new Date(order.created_at).toLocaleString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                
                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status Pesanan</label>
                                    <div className="flex space-x-2">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm sm:text-sm uppercase tracking-wider"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="diproses">Diproses</option>
                                            <option value="lunas">Lunas</option>
                                            <option value="selesai">Selesai</option>
                                        </select>
                                        <button
                                            onClick={handleStatusChange}
                                            disabled={isUpdating || status === order.status}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Pelanggan */}
                    <div id="section-orders-show-customer" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                                <User className="w-5 h-5 mr-2 text-blue-500" />
                                Info Pelanggan
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div>
                                    <span className="block text-xs text-gray-500 mb-1">Nama</span>
                                    <span className="font-medium text-gray-900">{order.customer?.name || '-'}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 mb-1">Nomor Telepon</span>
                                    <span className="font-medium text-gray-900">{order.customer?.phone || '-'}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 mb-1">Telegram Chat ID</span>
                                    <span className="font-mono text-sm text-gray-600">{order.customer?.telegram_chat_id || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}
