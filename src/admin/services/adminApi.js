// admin/services/adminApi.js
import { getAdminToken } from "../context/adminAuth";

const BASE = "https://proyecto-subir-git-final-backend.onrender.com";

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAdminToken() || ""}`,
  };
}

async function req(method, path, body = null) {
  const opts = { method, headers: headers() };
  if (body) opts.body = JSON.stringify(body);
  let res;
  try {
    res = await fetch(`${BASE}${path}`, opts);
  } catch {
    throw new Error("Sin conexión con el servidor");
  }
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (res.status === 401 || res.status === 403) {
    // TODO: handle admin logout
    throw new Error("No autorizado");
  }
  if (!res.ok) {
    const msg = data.message || data.msg || `Error ${res.status}`;
    throw Object.assign(new Error(msg), { data });
  }
  return data;
}

const get = (p) => req("GET", p);
const post = (p, b) => req("POST", p, b);

export const dashboardAPI = {
  get: () => get("/api/admin/dashboard"),
};

export const ordersAPI = {
  list: (p = {}) => get("/api/admin/orders?" + new URLSearchParams(p)),
  get: (id) => get(`/api/admin/orders/${id}`),
  updateStatus: (id, status) => req("PUT", `/api/admin/orders/${id}/status`, { status }),
};

// API para autenticación de admin
export const authAPI = {
  login: (email, password) => post("/api/auth/login", { email, password }),
};

// API para gestión de usuarios
export const usersAPI = {
  list: (p = {}) => get("/api/admin/users?" + new URLSearchParams(p)),
  get: (id) => get(`/api/admin/users/${id}`),
  create: (data) => post("/api/admin/users", data),
  update: (id, data) => req("PUT", `/api/admin/users/${id}`, data),
  delete: (id) => req("DELETE", `/api/admin/users/${id}`),
};

// API para gestión de categorías
export const categoriesAPI = {
  list: (p = {}) => get("/api/admin/categories?" + new URLSearchParams(p)),
  get: (id) => get(`/api/admin/categories/${id}`),
  create: (data) => post("/api/admin/categories", data),
  update: (id, data) => req("PUT", `/api/admin/categories/${id}`, data),
  delete: (id) => req("DELETE", `/api/admin/categories/${id}`),
};

// API para gestión de favoritos
export const favoritesAPI = {
  list: (p = {}) => get("/api/admin/favorites?" + new URLSearchParams(p)),
  delete: (id) => req("DELETE", `/api/admin/favorites/${id}`),
};

// API para gestión de productos
export const productsAPI = {
  list: (p = {}) => get("/api/admin/products?" + new URLSearchParams(p)),
  get: (id) => get(`/api/admin/products/${id}`),
  create: (data) => post("/api/admin/products", data),
  update: (id, data) => req("PUT", `/api/admin/products/${id}`, data),
  delete: (id) => req("DELETE", `/api/admin/products/${id}`),
};
