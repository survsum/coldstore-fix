'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Package, Upload, Link, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: Date;
}

const emptyForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: 'Electronics',
  stock: '',
};

const categories = ['Electronics', 'Home', 'Accessories', 'Clothing', 'Beauty', 'Sports', 'Books', 'Other'];

// Smart image component that falls back gracefully for any source
function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-[var(--bg-secondary)] ${className}`}>
        <ImageIcon size={20} className="text-[var(--text-muted)]" />
      </div>
    );
  }
  // Use regular img tag - works with ALL sources without Next.js domain restrictions
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
}

export default function AdminProductsClient({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageTab('url');
    setImageError(false);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
    });
    setImageTab('url');
    setImageError(false);
    setShowModal(true);
  };

  // Handle file upload - accepts ALL image formats
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Client-side check
    if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|webp|gif|avif|heic|heif|svg|bmp|tiff|ico)$/i)) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setForm(prev => ({ ...prev, image: data.url }));
      setImageError(false);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        toast.success('Product updated!');
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setProducts(prev => [created, ...prev]);
        toast.success('Product created!');
      }
      setShowModal(false);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--cold-blue)] outline-none transition-colors';

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Products
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{products.length} products total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Product
        </motion.button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
        {products.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center gap-3">
            <Package size={40} className="text-[var(--text-muted)]" />
            <p className="text-[var(--text-muted)] text-sm">No products yet. Add your first one!</p>
            <button onClick={openCreate} className="text-[var(--accent)] text-sm underline underline-offset-4">Add Product</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="text-left px-6 py-3">Product</th>
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-left px-6 py-3">Price</th>
                  <th className="text-left px-6 py-3">Stock</th>
                  <th className="text-left px-6 py-3">Added</th>
                  <th className="text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {products.map(product => (
                    <motion.tr
                      key={product.id}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-primary)]/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--bg-primary)] flex-shrink-0">
                            <ProductImage src={product.image} alt={product.name} className="w-full h-full" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)] max-w-[200px] truncate">{product.name}</p>
                            <p className="text-xs text-[var(--text-muted)] max-w-[200px] truncate">{product.description.slice(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)]">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[var(--accent)]">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-amber-400' : 'text-green-500'}`}>{product.stock}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEdit(product)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--cold-blue)] hover:bg-[var(--cold-blue-light)] transition-all">
                            <Pencil size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-50">
                            {deletingId === product.id
                              ? <div className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin" />
                              : <Trash2 size={14} />}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <motion.div key="modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-[var(--bg-primary)] rounded-3xl border border-[var(--border)] shadow-2xl max-h-[92vh] overflow-y-auto">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
                  <h2 className="font-medium text-[var(--text-primary)]">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6 space-y-5">

                  {/* ── Image Section ── */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] mb-2 block uppercase tracking-wider">
                      Product Image
                    </label>

                    {/* Tab switcher */}
                    <div className="flex rounded-xl overflow-hidden border border-[var(--border)] mb-3">
                      <button
                        onClick={() => setImageTab('url')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all ${
                          imageTab === 'url'
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Link size={13} /> Paste URL
                      </button>
                      <button
                        onClick={() => setImageTab('upload')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all ${
                          imageTab === 'upload'
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Upload size={13} /> Upload File
                      </button>
                    </div>

                    {/* URL Tab */}
                    {imageTab === 'url' && (
                      <div className="space-y-2">
                        <input
                          value={form.image}
                          onChange={(e) => {
                            setForm({ ...form, image: e.target.value });
                            setImageError(false);
                          }}
                          placeholder="https://example.com/image.jpg  or  https://i.imgur.com/abc.png"
                          className={inputClass}
                        />
                        <p className="text-xs text-[var(--text-muted)]">
                          Works with any image URL — Imgur, Unsplash, Google Drive, Shopify CDN, your own server, etc.
                        </p>
                      </div>
                    )}

                    {/* Upload Tab */}
                    {imageTab === 'upload' && (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.heic,.heif"
                          onChange={onFileChange}
                          className="hidden"
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={onDrop}
                          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                            dragOver
                              ? 'border-[var(--cold-blue)] bg-[var(--cold-blue-light)]'
                              : 'border-[var(--border)] hover:border-[var(--cold-blue)] hover:bg-[var(--bg-secondary)]'
                          }`}
                        >
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 border-2 border-[var(--cold-blue)]/30 border-t-[var(--cold-blue)] rounded-full animate-spin" />
                              <p className="text-sm text-[var(--text-muted)]">Uploading...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Upload size={24} className="text-[var(--text-muted)]" />
                              <p className="text-sm font-medium text-[var(--text-primary)]">
                                Drop image here or click to browse
                              </p>
                              <p className="text-xs text-[var(--text-muted)]">
                                JPG, PNG, WebP, GIF, AVIF, HEIC, SVG, BMP · Max 10MB
                              </p>
                            </div>
                          )}
                        </div>
                        {form.image && form.image.startsWith('/uploads/') && (
                          <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                            <Check size={12} /> Image uploaded successfully
                          </p>
                        )}
                      </div>
                    )}

                    {/* Preview */}
                    {form.image && (
                      <div className="mt-3 relative h-44 rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)]">
                        {imageError ? (
                          <div className="flex flex-col items-center justify-center h-full gap-2 text-[var(--text-muted)]">
                            <AlertCircle size={20} />
                            <p className="text-xs">Can't preview this URL — but it may still work</p>
                          </div>
                        ) : (
                          <img
                            src={form.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                            onLoad={() => setImageError(false)}
                          />
                        )}
                        <button
                          onClick={() => { setForm({ ...form, image: '' }); setImageError(false); }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-[var(--text-primary)] flex items-center justify-center hover:bg-black/70 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Product Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Premium Wireless Headphones"
                      className={inputClass}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe your product..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Price + Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Price (₹) *</label>
                      <input
                        type="number" step="1" min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="999"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Stock</label>
                      <input
                        type="number" min="0"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        placeholder="100"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={inputClass}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving
                      ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      : <><Check size={15} />{editingProduct ? 'Save Changes' : 'Create Product'}</>
                    }
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
