import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useMemo } from 'react';
import { Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';

export default function BotFaqIndex({ auth, faqs }) {
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
            router.delete(route('bot.faq.destroy', id));
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'index',
            header: 'No',
            cell: info => info.row.index + 1,
            size: 60,
        },
        {
            accessorKey: 'question',
            header: 'Pertanyaan',
        },
        {
            accessorKey: 'answer',
            header: 'Jawaban',
            cell: info => (
                <div className="max-w-md truncate" title={info.getValue()}>
                    {info.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: info => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${info.getValue() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {info.getValue() ? 'Aktif' : 'Tidak Aktif'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: info => (
                <div className="flex gap-2">
                    <Link
                        href={route('bot.faq.edit', info.row.original.id)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded transition-colors"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => handleDelete(info.row.original.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded transition-colors"
                        title="Hapus"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ], []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">FAQ & Template Jawaban</h2>}
        >
            <Head title="FAQ & Template Jawaban" />

            <div id="page-bot-faq" className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash?.success && (
                        <div id="section-bot-faq-flash" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2 shadow-sm">
                            <CheckCircle className="w-5 h-5" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    <div id="section-bot-faq-header" className="flex justify-end mb-4">
                        <Link
                            href={route('bot.faq.create')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah FAQ
                        </Link>
                    </div>

                    <div id="table-bot-faq" className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100">
                        <DataTable 
                            columns={columns} 
                            data={faqs || []} 
                            searchPlaceholder="Cari pertanyaan..."
                            title="Daftar FAQ"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
