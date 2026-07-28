import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft } from 'lucide-react';

export default function BotFaqEdit({ auth, faq }) {
    const { data, setData, put, processing, errors } = useForm({
        question: faq.question || '',
        answer: faq.answer || '',
        is_active: faq.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('bot.faq.update', faq.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit FAQ</h2>}
        >
            <Head title="Edit FAQ" />

            <div id="page-bot-faq-edit" className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('bot.faq')}
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Daftar FAQ
                        </Link>
                    </div>

                    <div id="section-bot-faq-edit-form" className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="p-6 sm:p-8">
                            <form onSubmit={submit} className="space-y-6">
                                <div id="field-faq-question">
                                    <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                                        Pertanyaan
                                    </label>
                                    <input
                                        type="text"
                                        id="question"
                                        value={data.question}
                                        onChange={(e) => setData('question', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Masukkan pertanyaan yang sering ditanyakan"
                                    />
                                    {errors.question && <p className="mt-2 text-sm text-red-600">{errors.question}</p>}
                                </div>

                                <div id="field-faq-answer">
                                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                                        Jawaban
                                    </label>
                                    <textarea
                                        id="answer"
                                        rows={6}
                                        value={data.answer}
                                        onChange={(e) => setData('answer', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Masukkan jawaban atau template balasan"
                                    />
                                    {errors.answer && <p className="mt-2 text-sm text-red-600">{errors.answer}</p>}
                                </div>

                                <div id="field-faq-active" className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700 select-none">
                                        Aktif
                                    </label>
                                </div>

                                <div id="section-bot-faq-edit-actions" className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 shadow-sm"
                                    >
                                        <Save className="w-4 h-4" />
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
