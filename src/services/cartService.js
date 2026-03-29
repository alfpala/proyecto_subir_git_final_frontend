export async function clearCart() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/cart/clear`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al vaciar el carrito');
  }
  return response.json();
}
import { API_BASE_URL } from '../config';

export async function fetchCart() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el carrito');
  }
  return response.json();
}

export async function addToCart(productId, quantity = 1) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al agregar al carrito');
  }
  return response.json();
}

export async function updateCartItem(cartItemId, quantity) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el carrito');
  }
  return response.json();
}

export async function removeFromCart(cartItemId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar del carrito');
  }
  return response.json();
}
