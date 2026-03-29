// Alias para compatibilidad con hooks que esperan getCategories
export { fetchCategories as getCategories };
import { API_BASE_URL } from '../config';

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener categorías');
  }
  return response.json();
}

export async function createCategory(categoryData) {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear categoría');
  }
  return response.json();
}

export async function updateCategory(categoryId, categoryData) {
  const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar categoría');
  }
  return response.json();
}

export async function deleteCategory(categoryId) {
  const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar categoría');
  }
  return response.json();
}
