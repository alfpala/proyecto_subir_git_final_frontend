import { useState, useEffect } from 'react';
// Ajustar los imports a los nombres reales exportados por productService.js
import { getProducts } from '../services/productService';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService';
import { addFavorite, removeFavorite, fetchFavorites } from '../services/favoriteService';
import { isLoggedIn, getUser } from '../services/userService';

export function useProductDetailActions(productId) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState('');
  const [favMsg, setFavMsg] = useState('');

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    // Obtener el producto por id y luego los relacionados
    getProductById(productId)
      .then(prod => {
        setProduct(prod);
        setLoading(false);
        if (prod?.category_id) {
          getProducts({ category: prod.category_id }).then(r => setRelated(r.products || []));
        }
      })
      .catch(() => {
        setError('Error al cargar el producto');
        setLoading(false);
      });
  }, [productId]);

  const handleQty = (delta) => {
    setQty(q => {
      const next = q + delta;
      if (!product) return 1;
      if (next < 1) return 1;
      if (next > product.stock) return product.stock;
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (!product || qty < 1) return;
    setCartLoading(true);
    setCartMsg('');
    try {
      await addToCart(product.id, qty);
      setCartMsg('Producto agregado al carrito');
    } catch {
      setCartMsg('Error al agregar al carrito');
    }
    setCartLoading(false);
  };

  const handleToggleFavorite = async () => {
    if (!product) return;
    const user = getUser();
    if (!user || !user.id) {
      setFavMsg('Debes iniciar sesión');
      return;
    }
    setFavLoading(true);
    setFavMsg('');
    try {
      if (fav) {
        await removeFavorite(product.id);
        setFav(false);
        setFavMsg('Quitado de favoritos');
      } else {
        await addFavorite(product.id);
        setFav(true);
        setFavMsg('Agregado a favoritos');
      }
    } catch {
      setFavMsg('Error al actualizar favorito');
    }
    setFavLoading(false);
  };

  return {
    product,
    related,
    loading,
    error,
    qty,
    fav,
    cartLoading,
    favLoading,
    cartMsg,
    favMsg,
    handleQty,
    handleAddToCart,
    handleToggleFavorite
  };
}
