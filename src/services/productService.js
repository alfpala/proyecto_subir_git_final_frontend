// Obtener un producto por id
export async function getProductById(id) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener producto');
  }
  return response.json();
}
import { API_BASE_URL } from '../config';

export async function fetchMyProducts() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/products/my/list`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener productos');
  }
  const data = await response.json();
  // Si la respuesta es { products: [...] }, devolver el array; si es array, devolver directo
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.products)) return data.products;
  return [];
}

export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear producto');
  }
  return response.json();
}

export async function updateProduct(productId, productData) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar producto');
  }
  return response.json();
}

export async function deleteProduct(productId) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar producto');
  }
  return response.json();
}

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.search) params.append('search', filters.search);

  const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener productos');
  }
  return response.json(); // Se espera { products, total }
}
