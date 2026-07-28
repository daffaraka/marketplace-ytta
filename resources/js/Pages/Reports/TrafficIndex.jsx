import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Shield, Server, Users, Clock, ShoppingCart, MessageSquare, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrafficIndex({ auth, newCustomersPerDay = [], botActivity = [], systemInfo = {} }) {
    
    const formatChartData = (data) => {
        return data.map(d => ({
            date: new Date(d.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            count: d.count
        }));
    };

    const customerData = formatChartData(newCustomersPerDay);
    const botData = formatChartData(botActivity);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Traffic & Keamanan Sistem</h2>}
        >
            <Head title="Traffic & Keamanan Sistem" />

            <div id="page-traffic" className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Row 1: System Info Grid */}
                    <div id="section-traffic-system-info" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
                            <Server className="w-6 h-6 text-indigo-500 mb-2" />
                            <p className="text-xs text-gray-500 font-medium">PHP Version</p>
                            <p className="text-lg font-bold text-gray-900">{systemInfo.php_version || '-'}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
                            <Shield className="w-6 h-6 text-red-500 mb-2" />
                            <p className="text-xs text-gray-500 font-medium">Laravel Version</p>
                            <p className="text-lg font-bold text-gray-900">{systemInfo.laravel_version || '-'}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
                            <Users className="w-6 h-6 text-green-500 mb-2" />
                            <p className="text-xs text-gray-500 font-medium">Active Sessions</p>
                            <p className="text-lg font-bold text-gray-900">{systemInfo.active_sessions || '0'}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
                            <Clock className="w-6 h-6 text-blue-500 mb-2" />
                            <p className="text-xs text-gray-500 font-medium">Server Time</p>
                            <p className="text-sm font-bold text-gray-900">{systemInfo.server_time || '-'}</p>
                            <p className="text-xs text-gray-400">{systemInfo.timezone || '-'}</p>
                        </div>
                    </div>

                    {/* Row 2: Stats Cards */}
                    <div id="section-traffic-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Pelanggan</p>
                                <p className="text-2xl font-bold text-gray-900">{systemInfo.total_customers || 0}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-full">
                                <ShoppingCart className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Pesanan</p>
                                <p className="text-2xl font-bold text-gray-900">{systemInfo.total_orders || 0}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-full">
                                <MessageSquare className="w-8 h-8 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Chat AI</p>
                                <p className="text-2xl font-bold text-gray-900">{systemInfo.total_ai_chats || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div id="section-traffic-customers-chart" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Pelanggan Baru (14 Hari)</h3>
                            <div className="w-full h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={customerData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCustomers)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div id="section-traffic-bot-chart" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Bot AI (14 Hari)</h3>
                            <div className="w-full h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={botData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBot" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorBot)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Alert Card */}
                    {systemInfo.unresolved_fallbacks > 0 && (
                        <div id="section-traffic-fallback-alert" className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-sm flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-bold text-amber-800">Perhatian: Ada Pertanyaan Tidak Terjawab</h3>
                                <p className="text-amber-700 mt-1">
                                    Terdapat <span className="font-bold">{systemInfo.unresolved_fallbacks}</span> chat dari pelanggan yang tidak dimengerti oleh AI. 
                                    Harap periksa riwayat chat dan pertimbangkan untuk menambahkan template jawaban baru di FAQ.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
