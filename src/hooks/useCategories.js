import { useEffect, useState } from 'react';

// Simulación de llamada a API. Reemplaza esto por tu llamada real a la API.
async function fetchCategories() {
  // Aquí deberías usar fetch o axios para llamar a tu backend real
  // Ejemplo: return fetch('/api/categories').then(res => res.json());
  return [];
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCategories()
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
}
