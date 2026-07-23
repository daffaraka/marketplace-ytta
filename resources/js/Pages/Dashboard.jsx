import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import StatCard from '@/Components/StatCard';
import DataTable from '@/Components/DataTable';
import { dashboardStats, recentOrders } from '@/Mock/dashboardData';

export default function Dashboard() {
    
    // Konfigurasi kolom untuk DataTable Pesanan Terkini
    const orderColumns = [
        { label: 'ID Pesanan', key: 'id', render: (row) => <span className="text-sm font-extrabold text-slate-900">{row.id}</span> },
        { label: 'Pelanggan & Item', key: 'customer', render: (row) => (
            <div>
                <div className="text-sm font-bold text-slate-900">{row.customer}</div>
                <div className="text-xs font-medium text-slate-500 mt-1 truncate max-w-[200px]">{row.items}</div>
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => {
            let statusClasses = 'bg-slate-100 text-slate-600 border-slate-200';
            let extraClasses = '';
            
            if (row.status === 'Lunas') statusClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            else if (row.status === 'Menunggu Verifikasi') {
                statusClasses = 'bg-blue-50 text-blue-700 border-blue-200';
                extraClasses = 'animate-pulse';
            }
            else if (row.status === 'Siap Diambil') statusClasses = 'bg-amber-50 text-amber-700 border-amber-200';
            else if (row.status === 'Batal') statusClasses = 'bg-rose-50 text-rose-700 border-rose-200';

            return (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${statusClasses} ${extraClasses}`}>
                    {row.status}
                </span>
            );
        }},
        { label: 'Waktu', key: 'time', align: 'right', render: (row) => (
            <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-400">
                <Clock size={14} />
                {row.time}
            </div>
        )}
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ringkasan Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Pantau aktivitas penjualan dan metrik utama hari ini.</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {dashboardStats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Recent Orders DataTable */}
                    <div className="xl:col-span-2">
                        <DataTable 
                            title="Pesanan Terkini" 
                            columns={orderColumns} 
                            data={recentOrders}
                            onSeeAll={() => console.log("Lihat semua pesanan")}
                        />
                    </div>

                    {/* Notification/Action Panel */}
                    <div className="bg-slate-950 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden flex flex-col border border-slate-800">
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-600 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-rose-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                        
                        <h3 className="text-lg font-extrabold mb-6 relative z-10 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
                            Aksi Menunggu
                        </h3>
                        
                        <div className="space-y-4 relative z-10 flex-1">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-all cursor-pointer group">
                                <h4 className="font-bold text-blue-400 text-sm flex items-center justify-between">
                                    1 Pembayaran Baru
                                    <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full">PRIORITAS</span>
                                </h4>
                                <p className="text-sm text-slate-300 mt-2 mb-4 leading-relaxed font-medium">Ada bukti transfer manual untuk pesanan ORD-001 yang butuh validasi segera.</p>
                                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-600/30">
                                    Verifikasi Sekarang
                                </button>
                            </div>
                            
                            <div className="bg-white/5 rounded-xl p-5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                <h4 className="font-bold text-slate-200 text-sm">1 Pesanan Siap Diambil</h4>
                                <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">Pesanan ORD-005 sudah siap untuk dipickup oleh pelanggan Doni Pratama.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
