import { API_BASE_URL } from '../config';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };
}

export async function fetchFavorites() {
  const response = await fetch(`${API_BASE_URL}/api/favorites`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener favoritos');
  }
  return response.json();
}

export async function addFavorite(productId) {
  const response = await fetch(`${API_BASE_URL}/api/favorites`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ product_id: productId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al agregar favorito');
  }
  return response.json();
}

export async function removeFavorite(productId) {
  const response = await fetch(`${API_BASE_URL}/api/favorites/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar favorito');
  }
  return response.json();
}
