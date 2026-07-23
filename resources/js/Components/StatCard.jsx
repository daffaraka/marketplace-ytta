import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, color }) {
    const isPositive = trend.startsWith('+');

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${
                    color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    color === 'rose' ? 'bg-rose-50 text-rose-600' :
                    'bg-slate-100 text-slate-600'
                } group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                    <Icon size={24} strokeWidth={2} />
                </div>
            </div>
            <div className="mt-5 flex items-center gap-2">
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${
                    isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                    <ArrowUpRight size={14} className={!isPositive ? "rotate-90" : ""} />
                    {trend}
                </span>
                <span className="text-xs font-medium text-slate-400">vs bulan lalu</span>
            </div>
        </div>
    );
}
