import { useEffect, useState } from 'react';

// Simulación de llamada a API. Reemplaza esto por tu llamada real a la API.
async function fetchProductDetail(id) {
  // Aquí deberías usar fetch o axios para llamar a tu backend real
  // Ejemplo: return fetch(`/api/products/${id}`).then(res => res.json());
  return null;
}

export function useProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetchProductDetail(productId)
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [productId]);

  return { product, loading, error };
}
