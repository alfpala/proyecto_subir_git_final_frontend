import React, { useEffect, useState } from "react";
import { ordersAPI } from "../services/adminApi";
import Sidebar from "../components/Sidebar";
import "../styles/admin.css";

const PAGE_SIZE = 15;
const STATUS_LABEL = { pending: "Pendiente", confirmed: "Confirmado", shipped: "En camino", delivered: "Entregado", cancelled: "Cancelado" };
const STATUS_CLASS = { pending: "s-pending", confirmed: "s-confirmed", shipped: "s-shipped", delivered: "s-delivered", cancelled: "s-cancelled" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [detailOrder, setDetailOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [statusOrder, setStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    setLoading(true);
    ordersAPI.list({ page, limit: PAGE_SIZE, status }).then(({ orders, total }) => {
      setOrders(orders);
      setTotal(total);
      setLoading(false);
    });
  }, [page, status]);

  const openDetail = async (id) => {
    setShowDetail(true);
    setDetailOrder(null);
    const o = await ordersAPI.get(id);
    setDetailOrder(o);
  };
  const openStatus = (order) => {
    setStatusOrder(order);
    setNewStatus(order.status);
    setShowStatus(true);
    setStatusError("");
  };
  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    setSavingStatus(true);
    setStatusError("");
    try {
      await ordersAPI.updateStatus(statusOrder.id, newStatus);
      setShowStatus(false);
      setLoading(true);
      ordersAPI.list({ page, limit: PAGE_SIZE, status }).then(({ orders, total }) => {
        setOrders(orders);
        setTotal(total);
        setLoading(false);
      });
    } catch (e) {
      setStatusError(e.message || "Error al actualizar estado");
    } finally {
      setSavingStatus(false);
    }
  };
  return (
    <div className="admin-main">
      <Sidebar activePage="orders" />
      <header className="admin-topbar">
        <button className="btn-toggle-sidebar" id="sidebarToggle"><i className="bi bi-list"></i></button>
        <div className="topbar-title">
          <h5><i className="bi bi-receipt-cutoff me-2" style={{ color: "#7c3aed" }}></i>Gestión de Pedidos</h5>
          <small>Consultar y actualizar el estado de todas las órdenes</small>
        </div>
      </header>
      <div className="admin-content">
        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <select className="form-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="shipped">En camino</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setLoading(true); ordersAPI.list({ page, limit: PAGE_SIZE, status }).then(({ orders, total }) => { setOrders(orders); setTotal(total); setLoading(false); }); }}><i className="bi bi-arrow-clockwise me-1"></i>Refrescar</button>
          </div>
        </div>
        <div className="table-card">
          <div className="table-card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0"><i className="bi bi-table me-2"></i>Pedidos <span className="badge ms-1" style={{ background: "#7c3aed" }}>{total}</span></h6>
            <div className="admin-pagination">
              {Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, i) => (
                <button key={i} className={`btn btn-sm ${page === i + 1 ? "btn-primary" : "btn-light"}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th>#</th><th>Usuario</th><th>Total</th><th>Estado</th><th>Items</th><th>Fecha</th><th className="text-end">Acciones</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="loading-row"><td colSpan={7}><span className="spinner-border spinner-border-sm me-2"></span>Cargando…</td></tr>
                ) : !orders.length ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted"><i className="bi bi-receipt fs-3 d-block mb-2"></i>Sin pedidos encontrados</td></tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id}>
                      <td className="fw-bold text-primary">#{o.id}</td>
                      <td>
                        <strong>{o.user_name || "—"}</strong>
                        <br /><small className="text-muted">{o.user_email || ""}</small>
                      </td>
                      <td className="fw-bold">${parseFloat(o.total).toFixed(2)}</td>
                      <td><span className={`status-badge ${STATUS_CLASS[o.status] || "s-pending"}`}>{STATUS_LABEL[o.status] || o.status}</span></td>
                      <td><span className="badge bg-light text-dark border">{(o.items || []).length} item(s)</span></td>
                      <td className="text-muted small">{new Date(o.created_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary btn-sm-action me-1" onClick={() => openDetail(o.id)}><i className="bi bi-eye"></i></button>
                        <button className="btn btn-sm btn-outline-warning btn-sm-action" onClick={() => openStatus(o)}><i className="bi bi-arrow-repeat"></i></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal Detalle */}
        {showDetail && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.2)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalle de Orden {detailOrder ? `#${detailOrder.id}` : ""}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDetail(false)}></button>
                </div>
                <div className="modal-body">
                  {!detailOrder ? (
                    <div className="text-center py-3"><span className="spinner-border"></span></div>
                  ) : (
                    <>
                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <small className="text-muted d-block">Cliente</small>
                          <strong>{detailOrder.user_name || "—"}</strong>
                          <div className="text-muted small">{detailOrder.user_email || ""}</div>
                        </div>
                        <div className="col-sm-3">
                          <small className="text-muted d-block">Estado</small>
                          <span className={`status-badge ${STATUS_CLASS[detailOrder.status] || "s-pending"} fs-6`}>{STATUS_LABEL[detailOrder.status] || detailOrder.status}</span>
                        </div>
                        <div className="col-sm-3">
                          <small className="text-muted d-block">Fecha</small>
                          <strong>{new Date(detailOrder.created_at).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}</strong>
                        </div>
                      </div>
                      <hr />
                      <h6 className="fw-bold mb-3">Productos del pedido</h6>
                      {(detailOrder.items || []).length === 0 ? (
                        <p className="text-muted">Sin items</p>
                      ) : (
                        detailOrder.items.map(i => (
                          <div className="d-flex align-items-center gap-3 p-2 border rounded mb-2" key={i.product_id}>
                            <img src={i.image_url || 'https://via.placeholder.com/50'} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }} onError={e => (e.target.src = 'https://via.placeholder.com/50')} alt="" />
                            <div className="flex-grow-1">
                              <div className="fw-semibold">{i.product_name || "Producto eliminado"}</div>
                              <small className="text-muted">x{i.quantity} — ${parseFloat(i.unit_price).toFixed(2)} c/u</small>
                            </div>
                            <div className="fw-bold text-primary">${(i.quantity * parseFloat(i.unit_price)).toFixed(2)}</div>
                          </div>
                        ))
                      )}
                      <div className="d-flex justify-content-end mt-3 pt-2 border-top">
                        <span className="fs-5 fw-bold">Total: <span className="text-primary">${parseFloat(detailOrder.total).toFixed(2)}</span></span>
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-light" onClick={() => setShowDetail(false)}>Cerrar</button>
                  {detailOrder && (
                    <button className="btn btn-primary btn-sm" onClick={() => { setShowDetail(false); openStatus(detailOrder); }}><i className="bi bi-arrow-repeat me-1"></i>Cambiar Estado</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal Cambiar Estado */}
        {showStatus && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.2)" }}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cambiar Estado</h5>
                  <button type="button" className="btn-close" onClick={() => setShowStatus(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted small mb-2">Orden <strong>#{statusOrder?.id}</strong></p>
                  <label className="form-label">Nuevo estado <span className="text-danger">*</span></label>
                  <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="shipped">En camino</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                  {statusError && <div className="invalid-feedback d-block">{statusError}</div>}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-light btn-sm" onClick={() => setShowStatus(false)}>Cancelar</button>
                  <button className="btn btn-primary btn-sm" onClick={handleStatusUpdate} disabled={savingStatus}>
                    <span style={{ display: savingStatus ? "none" : "inline" }}><i className="bi bi-check-lg me-1"></i>Actualizar</span>
                    <span style={{ display: savingStatus ? "inline" : "none" }} className="spinner-border spinner-border-sm"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
