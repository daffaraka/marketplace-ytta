import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatCard from '@/Components/StatCard';
import DataTable from '@/Components/DataTable';
import { useMemo } from 'react';
import { Wallet, ShoppingBag, Users, Package, AlertTriangle, ArrowRight, Eye } from 'lucide-react';

export default function DashboardIndex({ auth, stats, recentOrders, lowStockProducts }) {
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
            cell: info => <span className="font-medium text-gray-900">#{info.getValue()}</span>
        },
        {
            header: 'Pelanggan',
            accessorFn: row => row.customer?.name || 'Unknown',
            id: 'customer_name'
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
                >
                    <Eye className="w-4 h-4" />
                </Link>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout user={auth.user} header="Dashboard">
            <Head title="Dashboard" />
            <div id="page-dashboard">

            {/* Action Panel */}
            <div id="section-dashboard-pending" className="bg-gray-900 rounded-2xl shadow-lg p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold mb-1">Selamat Datang, {auth.user.name}</h2>
                    <p className="text-gray-400">
                        {stats.pendingOrders > 0
                            ? `Ada ${stats.pendingOrders} pesanan pending yang perlu diproses hari ini.`
                            : 'Tidak ada pesanan pending saat ini. Selamat bersantai!'}
                    </p>
                </div>
                <div className="relative z-10 w-full md:w-auto">
                    <Link
                        href={route('orders')}
                        className="w-full md:w-auto inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-gray-900 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5"
                    >
                        Lihat Pesanan
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </div>

            <div id="section-dashboard-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Penjualan"
                    value={`Rp ${Number(stats.totalRevenue).toLocaleString('id-ID')}`}
                    icon={Wallet}
                    trend="+0%"
                />
                <StatCard
                    title="Total Pesanan"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    trend="+0%"
                />
                <StatCard
                    title="Total Pelanggan"
                    value={stats.totalCustomers}
                    icon={Users}
                    trend="+0%"
                />
                <StatCard
                    title="Pesanan Pending"
                    value={stats.pendingOrders}
                    icon={AlertTriangle}
                    trend="0"
                    trendUp={false}
                />
            </div>

            {lowStockProducts && lowStockProducts.length > 0 && (
                <div id="section-dashboard-low-stock" className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-rose-100 bg-rose-50 flex items-center">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg mr-4 flex-shrink-0">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-rose-800 mb-1">Peringatan Stok Menipis!</h3>
                            <p className="text-rose-600 text-sm">Beberapa menu memiliki stok kurang dari 10. Segera lakukan restock.</p>
                        </div>
                    </div>
                    <div id="table-dashboard-low-stock">
                        <DataTable
                            columns={[
                                {
                                    header: 'Nama Menu',
                                    accessorKey: 'name',
                                    cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>
                                },
                                {
                                    header: 'Stok',
                                    accessorKey: 'stock',
                                    cell: info => (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                                            {info.getValue()} tersisa
                                        </span>
                                    )
                                },
                                {
                                    header: 'Harga',
                                    accessorKey: 'price',
                                    cell: info => <span className="text-gray-600">Rp {Number(info.getValue()).toLocaleString('id-ID')}</span>
                                },
                                {
                                    header: 'Aksi',
                                    id: 'actions',
                                    cell: info => (
                                        <Link
                                            href={route('catalog.edit', info.row.original.id)}
                                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                        >
                                            Restock
                                        </Link>
                                    )
                                }
                            ]}
                            data={lowStockProducts}
                            searchPlaceholder="Cari menu stok tipis..."
                        />
                    </div>
                </div>
            )}

            <div id="section-dashboard-recent-orders" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h3>
                    <Link href={route('orders')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center">
                        Lihat Semua
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
                <div id="table-dashboard-recent-orders">
                    <DataTable
                        columns={columns}
                        data={recentOrders}
                        searchPlaceholder="Cari pesanan..."
                    />
                </div>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}
