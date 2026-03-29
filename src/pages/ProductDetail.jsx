import React from 'react';
import { useProductDetailActions } from '../hooks/useProductDetailActions';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer';

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
            {user && user.role !== 'user' && <li className="nav-item"><a className="nav-link" href="/my-products"> <i className="bi bi-box me-1"></i>Mis Productos</a></li>}
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

const ProductDetail = () => {
  // Obtener el id del producto desde la URL (ejemplo: /product-detail?id=123)
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('id');
  const {
    product,
    related,
    loading,
    error,
    qty,
    fav,
    cartLoading,
    favLoading,
    cartMsg,
    favMsg,
    handleQty,
    handleAddToCart,
    handleToggleFavorite
  } = useProductDetailActions(productId);
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar />
      {/* BREADCRUMB */}
      <div className="container mt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Inicio</a></li>
            <li className="breadcrumb-item"><a href="/products"> <i className="bi bi-grid me-1"></i>Productos</a></li>
            <li className="breadcrumb-item active" aria-current="page" id="breadcrumbProduct">{product ? product.name : 'Producto'}</li>
          </ol>
        </nav>
      </div>

      {/* DETALLE DE PRODUCTO */}
      <div className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Cargando producto...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5 text-danger">Error al cargar el producto</div>
        ) : !product ? (
          <div className="text-center py-5 text-muted">Producto no encontrado</div>
        ) : (
          <div className="row align-items-center">
            <div className="col-md-6 text-center mb-4 mb-md-0">
              <img src={product.image_url || ''} alt={product.name} style={{maxHeight:'350px',objectFit:'contain',borderRadius:'12px',boxShadow:'0 20px 60px rgba(0,0,0,.1)'}} onError={e => e.target.style.display='none'} />
            </div>
            <div className="col-md-6">
              <h2 className="fw-bold mb-2">{product.name}</h2>
              <p className="text-muted mb-1">{product.category_name}</p>
              <p className="mb-3">{product.description}</p>
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="fs-2 fw-bold text-primary">${parseFloat(product.price).toFixed(2)}</span>
                <button className={`btn btn-${fav ? 'danger' : 'outline-danger'} btn-sm`} onClick={handleToggleFavorite} disabled={favLoading} title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                  <i className={`bi ${fav ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              </div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQty(-1)} disabled={qty <= 1}>-</button>
                <input type="text" value={qty} readOnly className="form-control form-control-sm text-center" style={{width:50}} />
                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQty(1)} disabled={qty >= product.stock}>+</button>
                <span className="text-muted small ms-2">Stock: {product.stock}</span>
              </div>
              <button className="btn btn-primary w-100 mb-2" onClick={handleAddToCart} disabled={cartLoading || product.stock < 1}>
                <i className="bi bi-cart-plus me-1"></i>Agregar al carrito
              </button>
              {cartMsg && <div className="alert alert-info py-1 small mt-2">{cartMsg}</div>}
              {favMsg && <div className="alert alert-info py-1 small mt-2">{favMsg}</div>}
            </div>
          </div>
        )}
        {/* Productos relacionados */}
        {related && related.length > 0 && (
          <div className="mt-5">
            <h5 className="fw-bold mb-3">Productos relacionados</h5>
            <div className="row g-3">
              {related.map(p => (
                <div className="col-sm-6 col-lg-3" key={p.id}>
                  <div className="card product-card h-100">
                    <img src={p.image_url || 'https://via.placeholder.com/300x200'} className="card-img-top" alt={p.name} style={{height:160,objectFit:'cover'}} onError={e => e.target.src='https://via.placeholder.com/300x200'} />
                    <div className="card-body">
                      <h6 className="fw-bold text-truncate">{p.name}</h6>
                      <p className="price-tag">${parseFloat(p.price).toFixed(2)}</p>
                      <a href={`/product-detail?id=${p.id}`} className="btn btn-primary btn-sm w-100">Ver producto</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};


export default ProductDetail;
