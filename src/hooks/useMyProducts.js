import { useState, useEffect } from 'react';
import { fetchMyProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { isLoggedIn } from '../services/userService';

export function useMyProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: '',
    featured: false
  });
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      setAuth(false);
      setLoading(false);
      return;
    }
    setAuth(true);
    setLoading(true);
    Promise.all([
      fetchMyProducts(),
      getCategories()
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }).catch(() => {
      setError('Error al cargar productos o categorías');
      setLoading(false);
    });
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImagePreview = e => {
    setForm(f => ({ ...f, image_url: e.target.value }));
  };

  const handleEdit = prod => {
    setForm({ ...prod });
    setEditMode(true);
    setShowForm(true);
  };

  const handleNew = () => {
    setForm({ id: null, name: '', description: '', price: '', stock: '', category_id: '', image_url: '', featured: false });
    setEditMode(false);
    setShowForm(true);
  };

  const handleDelete = async id => {
    setError(null);
    setSuccess(null);
    try {
      await deleteProduct(id);
      setProducts(ps => ps.filter(p => p.id !== id));
      setSuccess('Producto eliminado');
    } catch {
      setError('Error al eliminar producto');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.name || !form.price || !form.stock || !form.category_id) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    try {
      if (editMode) {
        const updated = await updateProduct(form.id, form);
        setProducts(ps => ps.map(p => p.id === form.id ? updated : p));
        setSuccess('Producto actualizado');
      } else {
        const created = await createProduct(form);
        setProducts(ps => [created, ...ps]);
        setSuccess('Producto creado');
      }
      setShowForm(false);
      setForm({ id: null, name: '', description: '', price: '', stock: '', category_id: '', image_url: '', featured: false });
      setEditMode(false);
    } catch {
      setError('Error al guardar producto');
    }
  };

  return {
    products,
    categories,
    loading,
    auth,
    error,
    success,
    form,
    editMode,
    showForm,
    setShowForm,
    handleChange,
    handleImagePreview,
    handleEdit,
    handleNew,
    handleDelete,
    handleSubmit
  };
}
