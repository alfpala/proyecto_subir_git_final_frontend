// admin/context/adminAuth.js
// Simple helpers for admin token/user (to be improved with context/provider if needed)
export function getAdminToken() {
  return localStorage.getItem("admin_token");
}

export function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem("admin_user"));
  } catch {
    return null;
  }
}

export function isAdmin() {
  const u = getAdminUser();
  return !!u && u.role === "admin";
}

export function logoutAdmin() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
  window.location.href = "/admin/login";
}
