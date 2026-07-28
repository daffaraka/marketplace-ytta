import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function BotIndex({ auth, fallbacks, history }) {
    return (
        <AuthenticatedLayout user={auth.user} header="AI Chat & Inbox Fallback">
            <Head title="Bot Inbox" />
            
            <div id="page-bot" className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
                {/* Chat List (Inbox) */}
                <div id="section-bot-inbox" className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Menunggu Balasan Admin</h3>
                        <p className="text-xs text-gray-500 mt-1">Bot dimatikan untuk user ini.</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {fallbacks.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                Hore! Tidak ada komplain hari ini.
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {fallbacks.map(fb => (
                                    <li key={fb.id} className="p-4 hover:bg-blue-50 cursor-pointer transition">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-semibold text-sm text-gray-900">{fb.telegram_chat_id}</span>
                                            <span className="text-xs text-gray-400">Baru</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{fb.message}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                
                {/* Chat Window */}
                <div id="section-bot-chat" className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center bg-white shadow-sm z-10">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                            AI
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Log Aktivitas AI Terkini</h3>
                            <p className="text-xs text-emerald-500">Live feed</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 space-y-4">
                        {history.reverse().map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                                }`}>
                                    <span className="block font-semibold text-xs opacity-50 mb-1">{msg.telegram_chat_id}</span>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-4 bg-white border-t border-gray-100">
                        <input 
                            type="text" 
                            disabled
                            className="w-full bg-gray-100 border-transparent rounded-xl px-4 py-3 text-sm focus:ring-0 cursor-not-allowed text-gray-400" 
                            placeholder="Pilih pesan di sebelah kiri untuk mengambil alih chat..." 
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
