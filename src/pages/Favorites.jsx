import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { removeFavorite } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer.jsx';

const Favorites = () => {
  const { favorites, loading, error, reload } = useFavorites();
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar />
      <main className="container py-5">
        <h1 className="mb-4 fw-bold"><i className="bi bi-heart me-2"></i>Favoritos <span className="badge bg-primary align-middle">{favorites.length}</span></h1>
        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando favoritos...</p>
          </div>
        )}
        {!loading && !user && (
          <div className="alert alert-warning text-center">
            <i className="bi bi-exclamation-triangle me-2"></i>Debes iniciar sesión para ver tus favoritos.
          </div>
        )}
        {!loading && user && favorites.length === 0 && (
          <div className="alert alert-info text-center">
            <i className="bi bi-inbox me-2"></i>No tienes productos favoritos.
          </div>
        )}
        {!loading && user && favorites.length > 0 && (
          <div className="row g-4">
            {favorites.map(f => (
              <div className="col-sm-6 col-lg-4 col-xl-3" key={f.id}>
                <div className="card product-card h-100">
                  <div style={{overflow:'hidden'}}>
                    <img src={f.image_url || 'https://via.placeholder.com/400x200'} className="card-img-top" alt={f.name} style={{height:200,objectFit:'cover'}} onError={e => e.target.src='https://via.placeholder.com/400x200'} />
                  </div>
                  <div className="card-body d-flex flex-column gap-1">
                    {f.category_name && <span className="badge bg-light text-secondary small">{f.category_name}</span>}
                    {f.featured && <span className="badge badge-featured"><i className="bi bi-star-fill me-1"></i>Destacado</span>}
                    <h6 className="fw-bold mb-0 mt-1 text-truncate">{f.name}</h6>
                    <p className="price-tag mb-0">${parseFloat(f.price).toFixed(2)}</p>
                    <p className="text-muted small mb-1">{f.stock > 0 ? <span className="text-success"><i className="bi bi-check-circle"></i> Stock: {f.stock}</span> : <span className="text-danger"><i className="bi bi-x-circle"></i> Sin stock</span>}</p>
                    <div className="d-flex gap-2 mt-auto pt-1">
                      <a href={`/product-detail?id=${f.product_id}`} className="btn btn-primary btn-sm flex-grow-1"><i className="bi bi-eye me-1"></i>Ver</a>
                      <button className="btn btn-outline-primary btn-sm cart-btn" disabled={f.stock < 1} title="Agregar al carrito"><i className="bi bi-cart-plus"></i></button>
                      <button
                        className="btn btn-danger btn-sm rem-fav-btn"
                        title="Quitar de favoritos"
                        onClick={async () => {
                          await removeFavorite(f.product_id);
                          reload();
                        }}
                      >
                        <i className="bi bi-heart-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center mt-4">{error}</div>
        )}
      </main>
      <Footer />
    </>
  );
};

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
            {user && <li className="nav-item"><a className="nav-link active" href="/favorites"> <i className="bi bi-heart me-1"></i>Favoritos</a></li>}
            {user && <li className="nav-item"><a className="nav-link" href="/orders"> <i className="bi bi-receipt me-1"></i>Mis Pedidos</a></li>}
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

export default Favorites;
