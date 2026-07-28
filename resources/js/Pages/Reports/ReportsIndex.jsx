import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useMemo } from 'react';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ReportsIndex({ auth, dailyRevenue = [], topProducts = [], statusDistribution = [], monthlyRevenue = [], summary = { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 } }) {
    
    const chartData = dailyRevenue.map(d => ({
        date: new Date(d.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        revenue: Number(d.revenue),
        orders: d.orders
    }));

    const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
    const monthlyData = monthlyRevenue.map(d => ({
        month: monthNames[d.month - 1] + ' ' + d.year,
        revenue: Number(d.revenue),
        orders: d.orders
    }));

    const COLORS = { pending: '#f59e0b', diproses: '#3b82f6', lunas: '#10b981', selesai: '#6b7280' };
    const pieData = statusDistribution.map(d => ({
        name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
        value: d.count,
        color: COLORS[d.status] || '#6b7280'
    }));

    const columns = useMemo(() => [
        {
            accessorKey: 'rank',
            header: 'Rank',
            cell: info => info.row.index + 1,
            size: 60,
        },
        {
            accessorKey: 'product.name',
            header: 'Nama Menu',
            cell: info => info.getValue() || '-',
        },
        {
            accessorKey: 'total_sold',
            header: 'Terjual',
            cell: info => info.getValue() + ' unit',
        },
        {
            accessorKey: 'total_revenue',
            header: 'Revenue',
            cell: info => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(info.getValue()),
        },
    ], []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Penjualan</h2>}
        >
            <Head title="Laporan Penjualan" />

            <div id="page-reports" className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Row 1: Summary Cards */}
                    <div id="section-reports-summary" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <DollarSign className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(summary.totalRevenue)}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-full">
                                <ShoppingCart className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalOrders}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 rounded-full">
                                <TrendingUp className="w-8 h-8 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(summary.avgOrderValue)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Daily Revenue Chart */}
                    <div id="section-reports-daily-chart" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Harian (30 Hari Terakhir)</h3>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis 
                                        stroke="#9ca3af" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tickFormatter={(value) => `Rp ${value / 1000}k`}
                                    />
                                    <Tooltip 
                                        formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Row 3: Monthly & Pie Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div id="section-reports-monthly-chart" className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Bulanan</h3>
                            <div className="w-full h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis 
                                            stroke="#9ca3af" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(value) => `Rp ${value / 1000000}M`}
                                        />
                                        <Tooltip 
                                            formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)}
                                            cursor={{ fill: '#f3f4f6' }}
                                        />
                                        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div id="section-reports-status-chart" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Status Pesanan</h3>
                            <div className="w-full h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Top Products Table */}
                    <div id="section-reports-top-products">
                        <div id="table-reports-top-products" className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100">
                        <DataTable 
                            columns={columns} 
                            data={topProducts} 
                            searchPlaceholder="Cari menu..."
                            title="Top 10 Menu Terlaris"
                        />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
