import { useState, useEffect } from 'react';
import { fetchFavorites } from '../services/favoriteService';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = () => {
    setLoading(true);
    fetchFavorites()
      .then(favs => {
        setFavorites(favs);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar favoritos');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return { favorites, loading, error, reload: loadFavorites };
}
