import { useEffect, useState } from 'react';

// Simulación de llamada a API. Reemplaza esto por tu llamada real a la API.
async function fetchProducts(params) {
  // Aquí deberías usar fetch o axios para llamar a tu backend real
  // Ejemplo: return fetch('/api/products').then(res => res.json());
  return { products: [], total: 0, limit: 12 };
}

export function useProducts(initialState = { page: 1, limit: 12, category: '', minPrice: 0, maxPrice: 2000, search: '' }) {
  const [state, setState] = useState(initialState);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts(state)
      .then(data => {
        setProducts(data.products);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [state]);

  return { state, setState, products, total, loading, error };
}
