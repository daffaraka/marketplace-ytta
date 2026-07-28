import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useMemo } from 'react';
import { Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';

export default function CatalogIndex({ auth, products }) {
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
            router.delete(route('catalog.destroy', id));
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Foto',
            accessorKey: 'image',
            cell: info => (
                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                    <img src={info.getValue()} alt="Menu" className="w-full h-full object-cover" />
                </div>
            )
        },
        {
            header: 'Nama Menu',
            accessorKey: 'name',
            cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>
        },
        {
            header: 'Kategori',
            accessorFn: row => row.category?.name,
            id: 'category_name'
        },
        {
            header: 'Harga',
            accessorKey: 'price',
            cell: info => <span className="font-semibold text-gray-700">Rp {Number(info.getValue()).toLocaleString('id-ID')}</span>
        },
        {
            header: 'Stok',
            accessorKey: 'stock',
            cell: info => <span className="font-medium text-gray-700">{info.getValue()}</span>
        },
        {
            header: 'Aksi',
            id: 'actions',
            cell: info => (
                <div className="flex items-center space-x-2">
                    <Link 
                        href={route('catalog.edit', info.row.original.id)} 
                        className="p-2 rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                        <Pencil className="w-4 h-4" />
                    </Link>
                    <button 
                        onClick={() => handleDelete(info.row.original.id)}
                        className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ], []);

    return (
        <AuthenticatedLayout user={auth.user} header="Katalog & Inventaris">
            <Head title="Katalog" />
            <div id="page-catalog">

            {flash?.success && (
                <div id="section-catalog-flash" className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center text-green-700 shadow-sm">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">{flash.success}</span>
                </div>
            )}

            <div id="section-catalog-header" className="flex justify-between items-center mb-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-800">Manajemen Katalog & Inventaris</h2>
                <Link
                    href={route('catalog.create')}
                    className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-sm transition-all font-medium text-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Menu Baru
                </Link>
            </div>
            
            <div id="table-catalog" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable 
                    columns={columns} 
                    data={products} 
                    searchPlaceholder="Cari menu, kategori..."
                />
            </div>
            </div>
        </AuthenticatedLayout>
    );
}
