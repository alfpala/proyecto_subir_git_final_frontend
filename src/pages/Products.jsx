import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { useProductsCatalog } from '../hooks/useProductsCatalog';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer';

import { useCart } from '../hooks/useCart';
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
            <li className="nav-item"><a className="nav-link active" href="/products"> <i className="bi bi-grid me-1"></i>Productos</a></li>
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

const Products = () => {
  // Integración de hooks
  const {
    products,
    categories,
    total,
    loading,
    error,
    filters,
    setFilters
  } = useProductsCatalog();
  const [search, setSearch] = useState('');

  // Filtros handlers
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setFilters(f => ({ ...f, search: e.target.value, page: 1 }));
  };
  const handleCategory = (catId) => {
    setFilters(f => ({ ...f, category: catId, page: 1 }));
  };
  const handlePrice = (min, max) => {
    setFilters(f => ({ ...f, minPrice: min, maxPrice: max, page: 1 }));
  };
  const handlePage = (page) => {
    setFilters(f => ({ ...f, page }));
  };

  return (
    <>
      <Navbar />
      {/* Encabezado de Productos */}
      <div style={{background:'linear-gradient(135deg,#1e40af,#7c3aed)'}} className="py-4">
        <div className="container">
          <h1 className="text-white fw-bold mb-1"><i className="bi bi-grid me-2"></i>Catálogo de Productos</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/" className="text-white-50">Inicio</a></li>
              <li className="breadcrumb-item active text-white">Productos</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="container py-5">
        <div className="row g-4">
          {/* FILTROS LATERALES */}
          <div className="col-lg-3">
            <div className="filter-card card p-3 mb-3">
              <h6 className="fw-bold mb-3"><i className="bi bi-search me-2 text-primary"></i>Buscar</h6>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar productos..."
                value={search}
                onChange={handleSearch}
              />
              <h6 className="fw-bold mb-3"><i className="bi bi-tags me-2 text-primary"></i>Categorías</h6>
              {loading ? (
                <div className="text-center text-muted">Cargando...</div>
              ) : (
                <div id="categoryList" className="d-flex flex-column gap-2">
                  <button
                    className={`btn btn-sm ${!filters.category ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => handleCategory('')}
                  >Todas</button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`btn btn-sm category-pill text-start ${filters.category === cat.id ? 'btn-primary active' : 'btn-outline-primary'}`}
                      onClick={() => handleCategory(cat.id)}
                    >{cat.name}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* GRID DE PRODUCTOS */}
          <div className="col-lg-9">
            <div className="row" id="productGrid">
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <div className="col-sm-6 col-xl-4" key={i}>
                    <div className="card product-card"><div className="skeleton" style={{height:'200px'}}></div><div className="card-body"><div className="skeleton mb-2" style={{height:'20px',width:'80%'}}></div><div className="skeleton" style={{height:'16px',width:'50%'}}></div></div></div>
                  </div>
                ))
              ) : error ? (
                <div className="col-12 text-center py-5 text-danger">Error al cargar productos</div>
              ) : products.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <i className="bi bi-search fs-1 text-muted"></i>
                  <p className="mt-3 text-muted">Sin resultados para tu búsqueda</p>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => { setSearch(''); setFilters(f => ({...f, search: '', category: '', page: 1})); }}>Limpiar filtros</button>
                </div>
              ) : (
                products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
            <Pagination
              page={filters.page}
              total={total}
              limit={filters.limit}
              onPageChange={num => setFilters(f => ({ ...f, page: num }))}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};


export default Products;
