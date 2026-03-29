import { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import { isLoggedIn } from '../services/userService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auth, setAuth] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      setAuth(false);
      setLoading(false);
      return;
    }
    setAuth(true);
    setLoading(true);
    getOrders()
      .then(orders => {
        setOrders(orders);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || 'Error al cargar órdenes');
        setLoading(false);
      });
  }, []);

  return { orders, loading, error, auth };
}
