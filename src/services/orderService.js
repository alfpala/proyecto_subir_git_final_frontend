
import { API_BASE_URL } from '../config';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };
}

export async function getOrders() {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener órdenes');
  }
  return response.json();
}

export async function createOrder(orderData) {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData || {}),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la orden');
  }
  return response.json();
}
