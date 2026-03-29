import React from 'react';
import { useFeaturedProducts } from '../hooks/useFeaturedProducts';
import { useAuth } from '../context/AuthContext.jsx';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap y estilos globales deben importarse en main.jsx o App.jsx
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../assets/styles.css';

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
            <li className="nav-item"><a className="nav-link active" href="/"> <i className="bi bi-house me-1"></i>Inicio</a></li>
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

const Home = () => {
  const { products, loading, error } = useFeaturedProducts();
  const { user, logout } = useAuth();

  const gradients = [
    "linear-gradient(135deg,#1e40af,#7c3aed)",
    "linear-gradient(135deg,#065f46,#0891b2)",
    "linear-gradient(135deg,#7c2d12,#b45309)",
    "linear-gradient(135deg,#1e293b,#475569)",
    "linear-gradient(135deg,#4c1d95,#db2777)"
  ];

  return (
    <>
      <Navbar />
      {/* CAROUSEL (productos destacados) usando react-bootstrap */}
      <section className="py-4 bg-white shadow-sm">
        <div className="container">
          {loading ? (
            <div className="text-center text-white px-3" style={{height:'480px',background:'linear-gradient(135deg,#1e40af,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'16px'}}>
              <div>
                <div className="spinner-border text-light" role="status"></div>
                <p className="mt-2">Cargando productos destacados⯦</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-white px-3" style={{height:'480px',background:'#dc2626',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'16px'}}>
              <p className="mt-2">Error al cargar productos destacados</p>
            </div>
          ) : products.length > 0 ? (
            <Carousel interval={4000} indicators={true} className="rounded-4 overflow-hidden">
              {products.map((p, i) => (
                <Carousel.Item key={p.id || i}>
                  <div className="hero-slide d-flex align-items-center" style={{background: gradients[i % gradients.length], minHeight:'480px'}}>
                    <div className="container position-relative z-1">
                      <div className="row align-items-center">
                        <div className="col-lg-7 text-white">
                          <span className="badge badge-featured mb-2"><i className="bi bi-star-fill me-1"></i>Destacado</span>
                          {p.category_name && <p className="text-white-50 mb-1 small text-uppercase fw-semibold">{p.category_name}</p>}
                          <h2 className="fw-bold display-5">{p.name}</h2>
                          <p className="fs-5 text-white-50 mb-3">{(p.description||"").substring(0,80)}{(p.description||"").length>80 ? '⯦' : ''}</p>
                          <div className="d-flex align-items-center gap-3 flex-wrap">
                            <span className="fs-2 fw-bold">${parseFloat(p.price).toFixed(2)}</span>
                            <a href={`/product-detail?id=${p.id}`} className="btn btn-light btn-lg fw-semibold">
                              <i className="bi bi-eye me-2"></i>Ver Producto
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-5 text-center mt-3 mt-lg-0 hide-mobile">
                          <img src={p.image_url || ''} alt={p.name}
                            style={{maxHeight:'280px',objectFit:'contain',borderRadius:'12px',boxShadow:'0 20px 60px rgba(0,0,0,.3)'}}
                            onError={e => e.target.style.display='none'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : null}
        </div>
      </section>
      {/* SECCIÓN DE PRODUCTOS DESTACADOS */}
      <section className="container py-5">
        <h2 className="fw-bold mb-4 text-primary"><i className="bi bi-star-fill me-2"></i>Productos Destacados</h2>
        <div className="row g-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div className="col-sm-6 col-xl-4" key={i}>
                <div className="card product-card"><div className="skeleton" style={{height:'200px'}}></div><div className="card-body"><div className="skeleton mb-2" style={{height:'20px',width:'80%'}}></div><div className="skeleton" style={{height:'16px',width:'50%'}}></div></div></div>
              </div>
            ))
          ) : error ? (
            <div className="col-12 text-center py-5 text-danger">Error al cargar productos destacados</div>
          ) : products.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-search fs-1 text-muted"></i>
              <p className="mt-3 text-muted">No hay productos destacados</p>
            </div>
          ) : (
            products.slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
      {/* FOOTER migrado */}
      <footer className="footer py-5 mt-auto bg-dark text-white">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h5 className="text-white fw-bold">Market<span className="text-warning">Tech</span></h5>
              <p className="small mt-2">Tu marketplace de confianza para tecnología, moda, hogar y más. Compra y vende de forma segura.</p>
            </div>
            <div className="col-md-3">
              <h6 className="text-white">Navegación</h6>
              <ul className="list-unstyled small mt-2">
                <li><a href="/" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Inicio</a></li>
                <li><a href="/products" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Productos</a></li>
                <li><a href="/cart" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Carrito</a></li>
                <li><a href="/orders" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Mis  órdenes</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="text-white">Cuenta</h6>
              <ul className="list-unstyled small mt-2">
                <li><a href="/login" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Iniciar sesión</a></li>
                <li><a href="/register" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Registrarse</a></li>
                <li><a href="/favorites" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Favoritos</a></li>
                <li><a href="/my-products" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Mis Productos</a></li>
              </ul>
            </div>
            <div className="col-md-2">
              <h6 className="text-white">Síguenos</h6>
              <div className="d-flex gap-2 mt-2 flex-wrap">
                <a href="https://facebook.com"  target="_blank" className="social-icon text-white-50" title="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="https://instagram.com" target="_blank" className="social-icon text-white-50" title="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="https://twitter.com"   target="_blank" className="social-icon text-white-50" title="Twitter/X"><i className="bi bi-twitter-x"></i></a>
                <a href="https://wa.me/1234567890?text=Hola%2C%20necesito%20ayuda%20con%20MarketTech"
                   target="_blank" className="social-icon text-white-50" title="WhatsApp" style={{background:'#25d366'}}>
                  <i className="bi bi-whatsapp"></i>
                </a>
              </div>
              <p className="small mt-3"><i className="bi bi-envelope me-1"></i>alfpala@gmail.com</p>
            </div>
          </div>
          <hr className="border-secondary mt-4"/>
          <p className="text-center small mb-0">&copy; 2026 MarketTech. Todos los derechos reservados. Desafío _Latam</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
