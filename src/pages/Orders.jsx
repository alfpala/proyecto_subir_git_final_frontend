import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer.jsx';
import { useCart } from '../hooks/useCart';
import { useToast } from '../components/Toast.jsx';
const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{background: 'linear-gradient(135deg,#1e293b,#2563eb)'}}>
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">Market<span>Tech</span></a>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><a className="nav-link" href="/"> <i className="bi bi-house me-1"></i>Inicio</a></li>
            <li className="nav-item"><a className="nav-link" href="/products"> <i className="bi bi-grid me-1"></i>Productos</a></li>
            {user && user.role !== 'user' && <li className="nav-item"><a className="nav-link" href="/my-products"> <i className="bi bi-box me-1"></i>Mis Productos</a></li>}
            {user && <li className="nav-item"><a className="nav-link" href="/favorites"> <i className="bi bi-heart me-1"></i>Favoritos</a></li>}
            {user && <li className="nav-item"><a className="nav-link active" href="/orders"> <i className="bi bi-receipt me-1"></i>Mis Pedidos</a></li>}
          </ul>
          <ul className="navbar-nav align-items-center gap-1">
            {user && (
              <li className="nav-item">
                <a href="/cart" className="nav-link position-relative">
                  <i className="bi bi-cart3 fs-5"></i>
                  <span id="cart-count" className="badge bg-danger badge-cart" style={{display: totalItems > 0 ? 'flex' : 'none'}}>{totalItems}</span>
                </a>
              </li>
            )}
            {user && (
              <li className="nav-item"><a className="nav-link" href="/edit-profile"> <i className="bi bi-person-gear me-1"></i>Mi Perfil</a></li>
            )}
            {!user && (
              <li className="nav-item" id="nav-auth">
                <a className="nav-link" href="/login"> <i className="bi bi-person me-1"></i>Iniciar sesión</a>
              </li>
            )}
            {user && (
              <>
                <li className="nav-item">
                  <span className="nav-link text-warning fw-semibold">{user.name}</span>
                </li>
                <li className="nav-item">
                  <a href="#" className="btn btn-sm btn-outline-light ms-1" onClick={e => {e.preventDefault();logout();}}>
                    <i className="bi bi-box-arrow-right me-1"></i>Salir
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const Orders = () => {
  const { orders, loading, error, auth } = useOrders();

  return (
    <>
      <Navbar />
      <main className="container py-5">
        <h1 className="mb-4 fw-bold"><i className="bi bi-receipt me-2"></i>Mis Pedidos <span className="badge bg-primary align-middle">{orders.length}</span></h1>
        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando órdenes...</p>
          </div>
        )}
        {!loading && !auth && (
          <div className="alert alert-warning text-center">
            <i className="bi bi-exclamation-triangle me-2"></i>Debes iniciar sesión para ver tus órdenes.
          </div>
        )}
        {!loading && auth && error && (
          <div className="alert alert-danger text-center">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <span>{error}</span>
          </div>
        )}
        {!loading && auth && !error && orders.length === 0 && (
          <div className="alert alert-info text-center">
            <i className="bi bi-inbox me-2"></i>No tienes órdenes registradas.
          </div>
        )}
        {!loading && auth && !error && orders.length > 0 && (
          <div className="row g-4">
            {orders.map(order => {
              // Estado visual
              const STATUS_LABELS = {
                pending:   { label: "Pendiente",   icon: "bi-clock",           class: "status-pending" },
                confirmed: { label: "Confirmado",  icon: "bi-check-circle",    class: "status-confirmed" },
                shipped:   { label: "En camino",   icon: "bi-truck",           class: "status-shipped" },
                delivered: { label: "Entregado",   icon: "bi-house-check",     class: "status-delivered" },
                cancelled: { label: "Cancelado",   icon: "bi-x-circle",        class: "status-cancelled" },
              };
              const st = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
              const date = new Date(order.created_at).toLocaleDateString("es-ES", {year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});

              // Progreso visual
              const STATUS_STEPS = ["pending","confirmed","shipped","delivered"];
              const current = STATUS_STEPS.indexOf(order.status);
              const progress = order.status === "cancelled"
                ? (<div className="alert alert-danger py-2 small mt-2"><i className="bi bi-x-circle me-2"></i>Esta orden fue cancelada</div>)
                : (
                  <div className="d-flex align-items-center gap-0 mt-3">
                    {STATUS_STEPS.map((s, i) => {
                      const info = STATUS_LABELS[s];
                      const done = i <= current;
                      const active = i === current;
                      return (
                        <React.Fragment key={s}>
                          <div className="text-center flex-fill">
                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-1" style={{width:36,height:36,background:done?'#2563eb':'#e2e8f0',color:done?'#fff':'#94a3b8'}}>
                              <i className={`bi ${info.icon}`}></i>
                            </div>
                            <div className={`small ${active?'fw-bold text-primary':'text-muted'}`}>{info.label}</div>
                          </div>
                          {i < STATUS_STEPS.length-1 && (
                            <div className="flex-fill" style={{height:3,background:i<current?'#2563eb':'#e2e8f0',maxWidth:60,marginBottom:20}}></div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                );

              return (
                <div className="col-12" key={order.id}>
                  <div className="card border-0 shadow-sm overflow-hidden mb-3">
                    {/* Header */}
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2 bg-white border-bottom">
                      <div>
                        <span className="fw-bold">Orden #{order.id}</span>
                        <small className="text-muted ms-2">{date}</small>
                      </div>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <span className={`order-status ${st.class}`}><i className={`bi ${st.icon} me-1`}></i>{st.label}</span>
                        <span className="fw-bold text-primary fs-5">${Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                    {/* Progreso */}
                    <div className="px-4 py-3 bg-light border-bottom">
                      {progress}
                    </div>
                    {/* Items */}
                    <div className="card-body p-3">
                      {/* Resumen de productos y total */}
                      <div className="mb-2 fw-semibold">
                        {order.items?.length || 0} producto(s) Total: <span className="text-primary">${Number(order.total).toFixed(2)}</span>
                      </div>
                      <div className="row g-2">
                        {(order.items || []).map(item => (
                          <div className="col-sm-6 col-md-4" key={item.id}>
                            <div className="d-flex align-items-center gap-2 p-2 bg-light rounded position-relative">
                              <img
                                src={item.image_url||'https://via.placeholder.com/80'}
                                style={{width:80,height:80,objectFit:'cover',borderRadius:'var(--radius-sm)',boxShadow:'0 2px 8px rgba(0,0,0,.08)'}}
                                className="cart-item-img"
                                onError={e => e.target.src='https://via.placeholder.com/80'}
                                alt={item.name||'Producto eliminado'}
                              />
                              <div className="overflow-hidden">
                                <p className="mb-0 small fw-semibold text-truncate">{item.name||'Producto eliminado'}</p>
                                <small className="text-muted">x{item.quantity} ${parseFloat(item.unit_price).toFixed(2)} c/u</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Footer */}
                    <div className="card-footer bg-white border-top d-flex justify-content-end align-items-center flex-wrap gap-2">
                      <a href={`https://wa.me/3204567890?text=Hola%2C%20quiero%20consultar%20mi%20orden%20%23${order.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-success">
                        <i className="bi bi-whatsapp me-1"></i>Consultar orden
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Orders;
