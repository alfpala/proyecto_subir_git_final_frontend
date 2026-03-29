import React, { useEffect, useState } from "react";
import { dashboardAPI, ordersAPI } from "../services/adminApi";
import Sidebar from "../components/Sidebar";
import "../styles/admin.css";

const STATUS_LABEL = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};
const STATUS_COLOR = {
  pending: "#f59e0b",
  confirmed: "#2563eb",
  shipped: "#7c3aed",
  delivered: "#059669",
  cancelled: "#dc2626",
};


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    dashboardAPI.get().then((d) => {
      setStats(d);
      setLoadingStats(false);
    });
    ordersAPI.list({ limit: 5 }).then((res) => {
      setOrders(res.orders || []);
      setLoadingOrders(false);
    });
  }, []);

  return (
    <div className="admin-main">
      <Sidebar activePage="dashboard" />
      <header className="admin-topbar">
        <button className="btn-toggle-sidebar" id="sidebarToggle">
          <i className="bi bi-list"></i>
        </button>
        <div className="topbar-title">
          <h5><i className="bi bi-grid-1x2 me-2 text-primary"></i>Dashboard</h5>
          <small>Resumen general del sistema</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success-subtle text-success fw-semibold">
            <i className="bi bi-circle-fill me-1" style={{ fontSize: ".5rem" }}></i>En línea
          </span>
        </div>
      </header>
      <div className="admin-content">
        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="row g-3 mb-4" id="statsRow">
          {loadingStats ? (
            <div className="text-center py-5 w-100">
              <span className="spinner-border spinner-border-sm"></span>
            </div>
          ) : (
            <>
              <div className="col-sm-6 col-xl-2"><StatCard label="Usuarios" value={stats.users} icon="bi-people-fill" color="text-primary" bg="#eff6ff" /></div>
              <div className="col-sm-6 col-xl-2"><StatCard label="Productos" value={stats.products} icon="bi-box-seam" color="text-success" bg="#f0fdf4" /></div>
              <div className="col-sm-6 col-xl-2"><StatCard label="Pedidos" value={stats.orders} icon="bi-receipt" color="text-purple" bg="#fdf4ff" customColor="#7c3aed" /></div>
              <div className="col-sm-6 col-xl-2"><StatCard label="Ingresos" value={`$${parseFloat(stats.revenue).toFixed(2)}`} icon="bi-currency-dollar" color="text-warning" bg="#fff7ed" /></div>
              <div className="col-sm-6 col-xl-2"><StatCard label="Favoritos" value={stats.favorites} icon="bi-heart" color="text-danger" bg="#fff1f2" /></div>
              <div className="col-sm-6 col-xl-2"><StatCard label="Inventario" value={`$${parseFloat(stats.inventory).toFixed(0)}`} icon="bi-archive" color="text-success" bg="#f0fdf4" /></div>
            </>
          )}
        </div>
        <div className="row g-3">
          {/* Pedidos por estado */}
          <div className="col-lg-5">
            <div className="table-card h-100">
              <div className="table-card-header">
                <h6><i className="bi bi-bar-chart me-2 text-primary"></i>Estado de Pedidos</h6>
              </div>
              <div className="p-3" id="statusChart">
                {loadingStats ? (
                  <div className="text-center text-muted py-3"><span className="spinner-border spinner-border-sm"></span></div>
                ) : !stats.ordersByStatus?.length ? (
                  <p className="text-muted text-center small py-3">Sin pedidos aún</p>
                ) : (
                  stats.ordersByStatus.map((s) => {
                    const percent = Math.round((s.count / (stats.orders || 1)) * 100);
                    return (
                      <div className="mb-3" key={s.status}>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-semibold">{STATUS_LABEL[s.status] || s.status}</span>
                          <span className="text-muted">{s.count} ({percent}%)</span>
                        </div>
                        <div className="progress" style={{ height: 10, borderRadius: 20 }}>
                          <div className="progress-bar" style={{ width: `${percent}%`, background: STATUS_COLOR[s.status] || "#94a3b8" }}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          {/* Últimos pedidos */}
          <div className="col-lg-7">
            <div className="table-card h-100">
              <div className="table-card-header d-flex justify-content-between align-items-center">
                <h6><i className="bi bi-clock-history me-2 text-primary"></i>Últimos Pedidos</h6>
                <a href="/admin/orders" className="btn btn-sm btn-outline-primary">Ver todos</a>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Usuario</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody id="recentOrdersBody">
                    {loadingOrders ? (
                      <tr className="loading-row">
                        <td colSpan={5}><span className="spinner-border spinner-border-sm"></span> Cargando…</td>
                      </tr>
                    ) : !orders.length ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">Sin pedidos</td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id}>
                          <td className="fw-bold">#{o.id}</td>
                          <td>{o.user_name || ""}<br /><small className="text-muted">{o.user_email || ""}</small></td>
                          <td className="fw-bold">${parseFloat(o.total).toFixed(2)}</td>
                          <td><span className={`status-badge s-${o.status || "pending"}`}>{STATUS_LABEL[o.status] || o.status}</span></td>
                          <td className="text-muted small">{new Date(o.created_at).toLocaleDateString("es-ES")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Acciones rápidas */}
          <div className="col-12">
            <div className="table-card">
              <div className="table-card-header"><h6><i className="bi bi-lightning me-2 text-warning"></i>Acciones Rápidas</h6></div>
              <div className="p-3 d-flex flex-wrap gap-2">
                <a href="/admin/products" className="btn btn-primary btn-sm"><i className="bi bi-plus-circle me-1"></i>Nuevo Producto</a>
                <a href="/admin/categories" className="btn btn-success btn-sm"><i className="bi bi-plus-circle me-1"></i>Nueva Categoría</a>
                <a href="/admin/users" className="btn btn-info btn-sm text-white"><i className="bi bi-person-plus me-1"></i>Nuevo Usuario</a>
                <a href="/admin/orders" className="btn btn-warning btn-sm"><i className="bi bi-receipt me-1"></i>Gestionar Pedidos</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg, customColor }) {
  return (
    <div className="stat-card h-100">
      <div className="stat-icon" style={{ background: bg }}>
        <i className={`bi ${icon} ${color}`} style={customColor ? { color: customColor } : {}}></i>
      </div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className={`stat-value ${color}`}>{value}</div>
      </div>
    </div>
  );
}
