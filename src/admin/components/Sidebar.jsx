// admin/components/Sidebar.jsx
import React from "react";
import "../styles/admin.css";

export default function Sidebar({ activePage }) {
  return (
    <aside className="admin-sidebar" id="adminSidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <i className="bi bi-lightning-charge-fill brand-icon"></i>
        <div>
          <div className="brand-text">MarketTech</div>
          <div className="brand-sub">Panel Admin</div>
        </div>
      </div>
      {/* Main nav */}
      <div className="sidebar-section">Principal</div>
      <a href="/admin/dashboard" className={`nav-item-admin${activePage === "dashboard" ? " active" : ""}`}><i className="bi bi-grid-1x2-fill"></i>Dashboard</a>
      <div className="sidebar-section">Gestión</div>
      <a href="/admin/users" className={`nav-item-admin${activePage === "users" ? " active" : ""}`}><i className="bi bi-people-fill"></i>Usuarios</a>
      <a href="/admin/categories" className={`nav-item-admin${activePage === "categories" ? " active" : ""}`}><i className="bi bi-tags-fill"></i>Categorías</a>
      <a href="/admin/products" className={`nav-item-admin${activePage === "products" ? " active" : ""}`}><i className="bi bi-box-seam-fill"></i>Productos</a>
      <div className="sidebar-section">Ventas</div>
      <a href="/admin/orders" className={`nav-item-admin${activePage === "orders" ? " active" : ""}`}><i className="bi bi-receipt-cutoff"></i>Pedidos</a>
      <a href="/admin/favorites" className={`nav-item-admin${activePage === "favorites" ? " active" : ""}`}><i className="bi bi-heart-fill"></i>Favoritos</a>
      <div className="sidebar-section">Tienda</div>
      <a href="/" className="nav-item-admin" target="_blank"><i className="bi bi-shop"></i>Ver tienda <i className="bi bi-box-arrow-up-right ms-1" style={{ fontSize: ".7rem" }}></i></a>
      {/* User info */}
      <div className="sidebar-footer">
        <div className="user-info-sidebar mb-2">
          <div className="user-avatar" id="sidebarAvatar">A</div>
          <div>
            <div className="user-name" id="sidebarName">Administrador</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
        <a href="#" id="logoutBtn" className="nav-item-admin" style={{ padding: ".45rem .75rem", borderRadius: 8, marginTop: ".25rem" }}>
          <i className="bi bi-box-arrow-right"></i>Cerrar sesión
        </a>
      </div>
    </aside>
  );
}
