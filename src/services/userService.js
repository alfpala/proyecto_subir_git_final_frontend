// Iniciar sesión de usuario
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }
  return response.json();
}
import { API_BASE_URL } from '../config';

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar usuario');
  }

  return response.json();
}

// Verifica si el usuario está logueado (token en localStorage)
export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Obtener el perfil del usuario autenticado
export async function getProfile() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error al obtener perfil');
  }
  return response.json();
}

// Obtener el usuario desde localStorage
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

// Actualiza el perfil del usuario
export async function updateProfile(profileData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error al actualizar el perfil');
  }
  return await response.json();
}
