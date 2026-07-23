import { Search, FileText, Download, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';

export default function DataTable({ title, columns, data, onSeeAll }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            {/* Table Header & Actions */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
                
                <div className="flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Cari data..." 
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-48 transition-all"
                        />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>

                    {/* Export Buttons */}
                    <button className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-2 rounded-lg text-sm font-bold border border-emerald-200 transition-colors">
                        <FileSpreadsheet size={16} />
                        <span className="hidden sm:inline">Excel</span>
                    </button>
                    <button className="flex items-center gap-2 bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-2 rounded-lg text-sm font-bold border border-rose-200 transition-colors">
                        <FileText size={16} />
                        <span className="hidden sm:inline">PDF</span>
                    </button>
                    
                    {onSeeAll && (
                        <button onClick={onSeeAll} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg ml-auto sm:ml-0">
                            Lihat Semua
                        </button>
                    )}
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-slate-50/50 text-xs uppercase tracking-widest text-slate-500 font-bold border-b border-slate-200">
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className={`px-6 py-5 ${col.align === 'right' ? 'text-right' : ''}`}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                                    Tidak ada data yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Mockup */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-medium text-slate-500">
                    Menampilkan <span className="font-bold text-slate-900">1</span> sampai <span className="font-bold text-slate-900">{data.length}</span> dari <span className="font-bold text-slate-900">{data.length}</span> data
                </span>
                <div className="flex items-center gap-1">
                    <button className="p-1 rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50" disabled>
                        <ChevronLeft size={18} />
                    </button>
                    <button className="w-7 h-7 rounded bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</button>
                    <button className="p-1 rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
