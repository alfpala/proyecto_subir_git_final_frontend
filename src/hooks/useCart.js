
import { useEffect, useState, useCallback } from 'react';
import { fetchCart as fetchCartAPI } from '../services/cartService';
import { isLoggedIn, getUser } from '../services/userService';

export function useCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auth, setAuth] = useState(true);

  const loadCart = useCallback(() => {
    if (!isLoggedIn()) {
      setAuth(false);
      setLoading(false);
      setCart([]);
      return;
    }
    setAuth(true);
    setLoading(true);
    fetchCartAPI()
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return { cart, loading, error, auth, reloadCart: loadCart };
}
