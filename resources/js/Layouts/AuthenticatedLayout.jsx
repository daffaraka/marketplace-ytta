import Dropdown from '@/Components/Dropdown';
import SidebarItem from '@/Components/SidebarItem';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Users, 
    Settings, 
    Menu, 
    X,
    LogOut,
    User,
    Bell,
    ChevronsLeft,
    ChevronsRight,
    MessageSquare,
    TrendingUp,
    ShieldAlert,
    Bot,
    ClipboardList
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Grouping Menu (Arsitektur Modul Komprehensif)
    const menuGroups = [
        {
            title: 'Dashboard & Analitik',
            items: [
                { name: 'Ringkasan Utama', href: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
                { name: 'Laporan Penjualan', href: route('reports'), icon: TrendingUp, active: route().current('reports') },
                { name: 'Traffic & Keamanan', href: route('traffic'), icon: ShieldAlert, active: route().current('traffic') },
            ]
        },
        {
            title: 'Manajemen Pesanan',
            items: [
                { 
                    name: 'Daftar Pesanan', 
                    icon: ShoppingCart,
                    href: route('orders'),
                    active: route().current('orders')
                },
            ]
        },
        {
            title: 'Katalog & Inventaris',
            items: [
                { name: 'Daftar Menu', href: route('catalog'), icon: Package, active: route().current('catalog') },
                { name: 'Manajemen Stok', href: route('catalog.stock'), icon: ClipboardList, active: route().current('catalog.stock') },
            ]
        },
        {
            title: 'Pelanggan & Loyalitas',
            items: [
                { name: 'Database Pelanggan', href: route('customers'), icon: Users, active: route().current('customers') },
            ]
        },
        {
            title: 'Bot & AI Assistant',
            items: [
                { name: 'Manajemen AI', icon: Bot, badge: 'New', submenu: [
                    { name: 'Inbox (Tanya Admin)', href: route('bot'), active: route().current('bot') },
                    { name: 'Riwayat Chat AI', href: route('bot.history'), active: route().current('bot.history') },
                    { name: 'FAQ & Template', href: route('bot.faq'), active: route().current('bot.faq') },
                    { name: 'Pengaturan Telegram', href: route('settings'), active: route().current('settings') }
                ]}
            ]
        },
        {
            title: 'Sistem & Pengaturan',
            items: [
                { name: 'Pengaturan', href: route('settings'), icon: Settings, active: route().current('settings') },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
            
            {/* Mobile Sidebar Overlay */}
            <div 
                className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar (Bisa diperkecil/diperbesar) */}
            <aside 
                className={`fixed inset-y-0 left-0 bg-slate-950 border-r border-slate-900 z-50 flex flex-col transform transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none lg:relative lg:inset-0
                ${mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'} 
                ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
            >
                {/* Logo Area */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
                    <Link href="/" className={`flex items-center gap-3 group overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        <div className="bg-blue-600 min-w-[36px] min-h-[36px] flex items-center justify-center text-white rounded-xl group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30">
                            <Package size={22} strokeWidth={2.5} />
                        </div>
                        {!isCollapsed && (
                            <span className="font-extrabold text-xl text-white tracking-tight whitespace-nowrap transition-opacity duration-300">
                                Ytta<span className="text-blue-500">Market</span>
                            </span>
                        )}
                    </Link>
                    {/* Mobile close button */}
                    <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Floating Desktop Collapse Toggle */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute -right-3.5 top-8 bg-slate-900 border border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500 hover:bg-slate-800 rounded-full h-7 w-7 shadow-md items-center justify-center transition-all z-50"
                    title={isCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
                >
                    {isCollapsed ? <ChevronsRight size={16} strokeWidth={2} /> : <ChevronsLeft size={16} strokeWidth={2} />}
                </button>

                {/* Navigation */}
                <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto custom-scrollbar">
                    {menuGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-1.5">
                            {/* Group Title */}
                            {!isCollapsed ? (
                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">
                                    {group.title}
                                </div>
                            ) : (
                                <div className="h-px bg-slate-800 my-4 mx-3" title={group.title}></div>
                            )}

                            {/* Group Items */}
                            {group.items.map((item, idx) => (
                                <SidebarItem key={idx} item={item} isCollapsed={isCollapsed} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer / User Profile */}
                <div className="p-4 border-t border-slate-800">
                    <div className={`bg-slate-900 rounded-2xl flex items-center transition-all overflow-hidden ${isCollapsed ? 'p-2 justify-center' : 'p-4 gap-3'}`}>
                        <div className="h-10 w-10 min-w-[40px] rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-inner">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin'}</p>
                                <p className="text-[11px] text-slate-400 truncate">Administrator</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header Responsif (sm-xxl) */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 2xl:px-10 z-30 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                        >
                            <Menu size={24} />
                        </button>
                        
                        {header && (
                            <div className="hidden sm:block ml-2">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                        {/* Notification Bell */}
                        <button className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">
                            <Bell size={22} />
                            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button type="button" className="flex items-center gap-2 focus:outline-none group">
                                    <span className="hidden md:block text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{user?.name || 'Admin'}</span>
                                    <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:border-blue-300 group-hover:bg-blue-50 transition-all">
                                        <User size={18} />
                                    </div>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="48">
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                    <p className="text-sm font-bold text-slate-900">{user?.name || 'Admin'}</p>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email || 'admin@example.com'}</p>
                                </div>
                                <div className="p-1">
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2 rounded-md hover:bg-slate-50 hover:text-blue-600 transition-colors px-3 py-2 text-sm font-medium">
                                        <Settings size={16} /> Pengaturan
                                    </Dropdown.Link>
                                </div>
                                <div className="p-1 border-t border-slate-100">
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 rounded-md hover:bg-rose-50 hover:text-rose-600 transition-colors px-3 py-2 text-sm w-full text-left font-bold text-rose-500">
                                        <LogOut size={16} /> Keluar
                                    </Dropdown.Link>
                                </div>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content dengan scale sm-xxl */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 2xl:p-10">
                    <div className="mx-auto max-w-screen-2xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
