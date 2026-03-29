
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
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
            {user && <li className="nav-item"><a className="nav-link" href="/my-products"> <i className="bi bi-box me-1"></i>Mis Productos</a></li>}
            {user && <li className="nav-item"><a className="nav-link" href="/favorites"> <i className="bi bi-heart me-1"></i>Favoritos</a></li>}
            {user && <li className="nav-item"><a className="nav-link" href="/orders"> <i className="bi bi-receipt me-1"></i>Mis Pedidos</a></li>}
          </ul>
          <ul className="navbar-nav align-items-center gap-1">
            {user && (
              <li className="nav-item">
                <a href="/cart" className="nav-link position-relative">
                  <i className="bi bi-cart3 fs-5"></i>
                  <span id="cart-count" className="badge bg-danger badge-cart" style={{display:'none'}}>0</span>
                </a>
              </li>
            )}
            {user && (
              <li className="nav-item"><a className="nav-link" href="/edit-profile"> <i className="bi bi-person-gear me-1"></i>Mi Perfil</a></li>
            )}
            {user && (
              <li className="nav-item"><a className="nav-link" href="/logout" onClick={e => {e.preventDefault();logout();}}> <i className="bi bi-box-arrow-right me-1"></i>Salir</a></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

import Footer from '../components/Footer.jsx';
import { useToast } from '../components/Toast.jsx';
import { removeFromCart, updateCartItem, clearCart } from '../services/cartService';

const Cart = () => {
  const { cart, loading, error, auth, reloadCart } = useCart();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  // Cálculos
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Vaciar carrito
  const [emptying, setEmptying] = useState(false);
  const handleEmptyCart = async () => {
    if (emptying) return;
    if (!window.confirm('¿Vaciar todo el carrito?')) return;
    setEmptying(true);
    try {
      await clearCart();
      showToast('Carrito vaciado', 'success');
      reloadCart();
    } catch (e) {
      showToast(e?.message || 'Error al vaciar carrito', 'error');
    }
    setEmptying(false);
  };

  return (
    <>
      <Navbar />
      <main className="container py-5">
        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando carrito...</p>
          </div>
        )}
        {!loading && !auth && (
          <div className="text-center py-5">
            <i className="bi bi-lock fs-1 text-muted"></i>
            <h4 className="mt-3">Inicia sesión para ver tu carrito</h4>
            <a href="/login" className="btn btn-primary mt-2">Iniciar sesión</a>
          </div>
        )}
        {!loading && auth && cart.length === 0 && (
          <div className="alert alert-info text-center" id="emptyCart">
            <i className="bi bi-cart-x fs-2"></i><br />
            Tu carrito está vacío.
          </div>
        )}
        {!loading && auth && cart.length > 0 && (
          <div id="cartContent">
            <h1 className="mb-4 fw-bold"><i className="bi bi-cart3 me-2"></i>Carrito de Compras</h1>
            <div className="row g-4">
              <div className="col-lg-8">
                <div id="cartItems" className="card p-3 mb-3">
                  {cart.map(item => (
                    <div className="card border-0 shadow-sm p-3 mb-3" key={item.id}>
                      <div className="row align-items-center g-3">
                        <div className="col-auto">
                          <img src={item.image_url || 'https://via.placeholder.com/80'} className="cart-item-img" alt={item.name} style={{width:80, height:80, objectFit:'contain'}} onError={e => e.target.src='https://via.placeholder.com/80'} />
                        </div>
                        <div className="col">
                          <h6 className="fw-bold mb-0">{item.name}</h6>
                          <small className="text-muted">{item.category_name || ''}</small>
                          <p className="text-primary fw-semibold mb-0 mt-1">${parseFloat(item.price).toFixed(2)} c/u</p>
                          <small className={`text-${item.stock < item.quantity ? 'danger' : 'success'}`}>
                            {item.stock < item.quantity ? 'Sin stock suficiente' : 'Stock disponible'}
                          </small>
                        </div>
                        <div className="col-auto d-flex flex-column align-items-end gap-2">
                          <div className="input-group input-group-sm mb-2" style={{width: '110px'}}>
                            <button className="btn btn-outline-secondary" type="button" title="Quitar uno" disabled={item.quantity <= 1} onClick={async () => {
                              try {
                                await updateCartItem(item.id, item.quantity - 1);
                                showToast('Cantidad actualizada', 'success');
                                reloadCart();
                              } catch (e) {
                                showToast(e?.message || 'Error al actualizar cantidad', 'error');
                              }
                            }}>-</button>
                            <input type="text" className="form-control text-center" value={item.quantity} readOnly style={{maxWidth:40}} />
                            <button className="btn btn-outline-secondary" type="button" title="Agregar uno" disabled={item.quantity >= item.stock} onClick={async () => {
                              try {
                                await updateCartItem(item.id, item.quantity + 1);
                                showToast('Cantidad actualizada', 'success');
                                reloadCart();
                              } catch (e) {
                                showToast(e?.message || 'Error al actualizar cantidad', 'error');
                              }
                            }}>+</button>
                          </div>
                          <button className="btn btn-sm btn-outline-danger" title="Eliminar del carrito" onClick={async () => {
                            try {
                              await removeFromCart(item.id);
                              showToast('Producto eliminado del carrito', 'success');
                              reloadCart();
                            } catch (e) {
                              showToast(e?.message || 'Error al eliminar producto', 'error');
                            }
                          }}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card p-3 mb-3">
                  <h5 className="fw-bold mb-3">Resumen</h5>
                  <ul className="list-group mb-3">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Ítems:</span>
                      <span>{cart.length}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Total unidades:</span>
                      <span>{totalItems}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Total:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </li>
                  </ul>
                  <button className="btn btn-outline-danger w-100 mb-2" onClick={handleEmptyCart} disabled={emptying}>
                    <i className="bi bi-trash me-1"></i>{emptying ? 'Vaciando...' : 'Vaciar carrito'}
                  </button>
                  <button className="btn btn-primary w-100 mt-3" onClick={async () => {
                    // Lógica real de finalizar compra (checkout)
                    try {
                      const mod = await import('../services/orderService');
                      await mod.createOrder();
                      // Actualizar badge del carrito
                      const badge = document.getElementById('cart-count');
                      if (badge) { badge.textContent = '0'; badge.style.display = 'none'; }
                      alert('¡Compra realizada con éxito!');
                      window.location.href = '/orders';
                    } catch (e) {
                      alert(e?.message || 'Error al procesar la compra');
                    }
                  }}><i className="bi bi-credit-card me-1"></i>Finalizar compra</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center mt-4">Error al cargar el carrito</div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Cart;
