import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Settings, Bot, Key, Eye, EyeOff, Save, CheckCircle, MessageSquare } from 'lucide-react';

export default function SettingsIndex({ auth, settings }) {
    const { flash } = usePage().props;
    const [showTelegramToken, setShowTelegramToken] = useState(false);
    const [showGeminiKey, setShowGeminiKey] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        telegram_bot_token: settings?.telegram_bot_token || '',
        gemini_api_key: settings?.gemini_api_key || '',
        gemini_model: settings?.gemini_model || 'gemini-1.5-flash',
        bot_enabled: settings?.bot_enabled ?? true,
        bot_welcome_message: settings?.bot_welcome_message || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('settings.update'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan Bot & Integrasi</h2>}
        >
            <Head title="Pengaturan Bot & Integrasi" />

            <div id="page-settings" className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash.success && (
                        <div id="section-settings-flash" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2 shadow-sm">
                            <CheckCircle className="w-5 h-5" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Telegram Config */}
                        <div id="section-settings-telegram" className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <section>
                                <header className="flex items-center gap-2 mb-4">
                                    <MessageSquare className="w-6 h-6 text-blue-500" />
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">Konfigurasi Telegram</h2>
                                        <p className="mt-1 text-sm text-gray-600">Atur token bot Telegram untuk integrasi.</p>
                                    </div>
                                </header>
                                
                                <div>
                                    <label htmlFor="telegram_bot_token" className="block text-sm font-medium text-gray-700">Token Bot Telegram</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type={showTelegramToken ? 'text' : 'password'}
                                            id="telegram_bot_token"
                                            value={data.telegram_bot_token}
                                            onChange={(e) => setData('telegram_bot_token', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm shadow-sm"
                                            placeholder="1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowTelegramToken(!showTelegramToken)}
                                        >
                                            {showTelegramToken ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.telegram_bot_token && <p className="mt-2 text-sm text-red-600">{errors.telegram_bot_token}</p>}
                                </div>
                            </section>
                        </div>

                        {/* Gemini Config */}
                        <div id="section-settings-gemini" className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <section>
                                <header className="flex items-center gap-2 mb-4">
                                    <Key className="w-6 h-6 text-indigo-500" />
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">Konfigurasi AI (Gemini)</h2>
                                        <p className="mt-1 text-sm text-gray-600">Pengaturan untuk Gemini AI dari Google.</p>
                                    </div>
                                </header>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="gemini_api_key" className="block text-sm font-medium text-gray-700">API Key Gemini</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                type={showGeminiKey ? 'text' : 'password'}
                                                id="gemini_api_key"
                                                value={data.gemini_api_key}
                                                onChange={(e) => setData('gemini_api_key', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowGeminiKey(!showGeminiKey)}
                                            >
                                                {showGeminiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.gemini_api_key && <p className="mt-2 text-sm text-red-600">{errors.gemini_api_key}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="gemini_model" className="block text-sm font-medium text-gray-700">Model Gemini</label>
                                        <select
                                            id="gemini_model"
                                            value={data.gemini_model}
                                            onChange={(e) => setData('gemini_model', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm shadow-sm"
                                        >
                                            <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                                            <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                                            <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                                        </select>
                                        {errors.gemini_model && <p className="mt-2 text-sm text-red-600">{errors.gemini_model}</p>}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Bot Config */}
                        <div id="section-settings-bot" className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <section>
                                <header className="flex items-center gap-2 mb-4">
                                    <Bot className="w-6 h-6 text-green-500" />
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">Pengaturan Bot</h2>
                                        <p className="mt-1 text-sm text-gray-600">Kontrol perilaku bot Anda secara umum.</p>
                                    </div>
                                </header>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input
                                                type="checkbox"
                                                id="bot_enabled"
                                                checked={data.bot_enabled}
                                                onChange={(e) => setData('bot_enabled', e.target.checked)}
                                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none focus:ring-0 checked:right-0 checked:border-green-500 duration-200"
                                            />
                                            <label htmlFor="bot_enabled" className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${data.bot_enabled ? 'bg-green-500' : ''}`}></label>
                                        </div>
                                        <label htmlFor="bot_enabled" className="text-sm font-medium text-gray-700 cursor-pointer">Bot Aktif</label>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="bot_welcome_message" className="block text-sm font-medium text-gray-700">Pesan Selamat Datang</label>
                                        <textarea
                                            id="bot_welcome_message"
                                            rows={4}
                                            value={data.bot_welcome_message}
                                            onChange={(e) => setData('bot_welcome_message', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {errors.bot_welcome_message && <p className="mt-2 text-sm text-red-600">{errors.bot_welcome_message}</p>}
                                    </div>
                                </div>
                            </section>
                        </div>
                        
                        <div id="section-settings-actions" className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 shadow-sm"
                            >
                                <Save className="w-4 h-4" />
                                Simpan Pengaturan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style jsx>{`
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #22c55e;
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #22c55e;
                }
                .toggle-checkbox {
                    right: 4px;
                    border-color: #d1d5db;
                }
                .toggle-label {
                    background-color: #d1d5db;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
