import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

// Simulación de llamada a API. Reemplaza esto por tu llamada real a la API.
async function fetchFeaturedProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products/featured`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener productos destacados');
  }
  return response.json();
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchFeaturedProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}
