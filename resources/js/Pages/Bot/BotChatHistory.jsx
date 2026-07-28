import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { MessageSquare, User, Bot } from 'lucide-react';

export default function BotChatHistory({ auth, conversations, chatIds }) {
    const [selectedChatId, setSelectedChatId] = useState(chatIds?.[0] || null);

    const filteredConversations = useMemo(() => {
        if (!selectedChatId || !conversations) return [];
        return conversations.filter(c => String(c.telegram_chat_id) === String(selectedChatId));
    }, [conversations, selectedChatId]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Riwayat Chat AI</h2>}
        >
            <Head title="Riwayat Chat AI" />

            <div id="page-bot-history" className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex h-[600px] rounded-2xl border border-gray-100">
                        {/* Sidebar */}
                        <div id="section-bot-history-sidebar" className="w-1/3 border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                                    Daftar Obrolan
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {chatIds && chatIds.length > 0 ? (
                                    chatIds.map(chatId => (
                                        <button
                                            key={chatId}
                                            onClick={() => setSelectedChatId(chatId)}
                                            className={`w-full text-left p-4 border-b border-gray-100 hover:bg-indigo-50 transition-colors flex items-center gap-3 ${String(selectedChatId) === String(chatId) ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className="bg-indigo-100 p-2 rounded-full">
                                                <User className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">ID: {chatId}</p>
                                                <p className="text-xs text-gray-500 truncate">Percakapan bot</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <p>Belum ada riwayat chat.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chat Panel */}
                        <div id="section-bot-history-messages" className="w-2/3 flex flex-col bg-gray-50">
                            {selectedChatId ? (
                                <>
                                    <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-800">Obrolan dengan ID: {selectedChatId}</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {filteredConversations.length > 0 ? (
                                            filteredConversations.map(msg => {
                                                const isUser = msg.role === 'user';
                                                return (
                                                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                                                        <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                                            <div className={`p-1.5 rounded-full ${isUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
                                                                {isUser ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-gray-600" />}
                                                            </div>
                                                            <div className={`px-4 py-2 rounded-2xl shadow-sm ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'}`}>
                                                                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-400 mt-1 mx-8">
                                                            {new Date(msg.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                                <p>Tidak ada pesan dalam percakapan ini.</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                    <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                                    <p className="text-lg font-medium">Pilih percakapan di sebelah kiri</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
