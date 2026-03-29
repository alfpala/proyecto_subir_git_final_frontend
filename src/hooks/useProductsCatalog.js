import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

export function useProductsCatalog(initialState = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: '',
    minPrice: 0,
    maxPrice: 2000,
    search: '',
    ...initialState
  });

  useEffect(() => {
    setLoading(true);
    getProducts(filters)
      .then(({ products, total }) => {
        setProducts(products);
        setTotal(total);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar productos');
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return {
    products,
    categories,
    total,
    loading,
    error,
    filters,
    setFilters
  };
}
