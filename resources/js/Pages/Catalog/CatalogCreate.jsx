import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function CatalogCreate({ auth, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        price: '',
        stock: 0,
        description: '',
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('catalog.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Tambah Menu Baru">
            <Head title="Tambah Menu Baru" />
            <div id="page-catalog-create">

            <div className="mt-6 mb-6">
                <Link
                    href={route('catalog')}
                    className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali
                </Link>
            </div>

            <div id="section-catalog-create-form" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl">
                <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
                    <div id="field-catalog-name">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm"
                            placeholder="Contoh: Kopi Susu Aren"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div id="field-catalog-category">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                        </div>

                        <div id="field-catalog-price">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm"
                                placeholder="0"
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                        </div>
                    </div>

                    <div id="field-catalog-stock">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            className="w-full md:w-1/2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm"
                            placeholder="0"
                        />
                        {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                    </div>

                    <div id="field-catalog-description">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows="4"
                            className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm"
                            placeholder="Tuliskan deskripsi menu..."
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div id="field-catalog-image">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Menu</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
                            </div>
                        )}
                        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                    </div>

                    <div id="section-catalog-create-actions" className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                        <Link
                            href={route('catalog')}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Menu'}
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}
