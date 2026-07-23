import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export const dashboardStats = [
    { title: "Total Penjualan", value: "Rp 12.500.000", icon: DollarSign, trend: "+14.5%", color: "blue" },
    { title: "Pesanan Aktif", value: "24", icon: ShoppingCart, trend: "+5.2%", color: "rose" },
    { title: "Pelanggan Baru", value: "156", icon: Users, trend: "+12.1%", color: "blue" },
    { title: "Konversi", value: "3.2%", icon: TrendingUp, trend: "-1.1%", color: "slate" }
];

export const recentOrders = [
    { id: "ORD-001", customer: "Budi Santoso", items: "Nasi Padang, Es Teh", status: "Menunggu Verifikasi", time: "5 menit lalu" },
    { id: "ORD-002", customer: "Siti Aminah", items: "Sate Ayam (2x)", status: "Lunas", time: "12 menit lalu" },
    { id: "ORD-003", customer: "Andi Wijaya", items: "Rendang Daging", status: "Lunas", time: "1 jam lalu" },
    { id: "ORD-004", customer: "Rina Kumala", items: "Gado-Gado", status: "Batal", time: "3 jam lalu" },
    { id: "ORD-005", customer: "Doni Pratama", items: "Soto Ayam", status: "Siap Diambil", time: "4 jam lalu" },
];
