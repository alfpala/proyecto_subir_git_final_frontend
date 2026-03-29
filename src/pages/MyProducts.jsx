import React from 'react';
import { useMyProducts } from '../hooks/useMyProducts';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer.jsx';

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
            {user && <li className="nav-item"><a className="nav-link active" href="/my-products"> <i className="bi bi-box me-1"></i>Mis Productos</a></li>}
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

const MyProducts = () => {
  const {
    products, categories, loading, auth, error, success, form, editMode, showForm, setShowForm,
    handleChange, handleImagePreview, handleEdit, handleNew, handleDelete, handleSubmit
  } = useMyProducts();
  return (
    <>
      <Navbar />
      {!auth && (
        <div className="text-center py-5">
          <i className="bi bi-lock fs-1 text-muted"></i>
          <h4 className="mt-3">Inicia sesión para ver tus productos</h4>
          <a href="/login" className="btn btn-primary mt-2">Iniciar sesión</a>
        </div>
      )}
      {loading && auth && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando…</span></div>
        </div>
      )}
      {!loading && auth && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Mis Productos <span className="badge bg-primary align-middle">{products.length}</span></h2>
            <button className="btn btn-success" onClick={handleNew}><i className="bi bi-plus-lg me-1"></i>Nuevo producto</button>
          </div>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {success && <div className="alert alert-success py-2 small">{success}</div>}
          {/* Tabla de productos */}
          {products.length === 0 ? (
            <div className="alert alert-info text-center">No tienes productos registrados.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle" id="productsTable">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Destacado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.image_url || 'https://via.placeholder.com/60'} style={{width:60,height:60,objectFit:'cover',borderRadius:8}} alt={p.name} onError={e => e.target.src='https://via.placeholder.com/60'} /></td>
                      <td><div className="fw-semibold">{p.name}</div><small className="text-muted">{(p.description||'').substring(0,50)}{(p.description||'').length>50?'…':''}</small></td>
                      <td><span className="badge bg-light text-secondary">{p.category_name||''}</span></td>
                      <td className="fw-bold text-primary">${parseFloat(p.price).toFixed(2)}</td>
                      <td><span className={`badge ${p.stock>0?'bg-success':'bg-danger'}`}>{p.stock}</span></td>
                      <td>{p.featured ? <i className="bi bi-star-fill text-warning fs-5"></i> : <i className="bi bi-star text-muted"></i>}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <a href={`/product-detail?id=${p.id}`} className="btn btn-sm btn-outline-info" title="Ver"><i className="bi bi-eye"></i></a>
                          <button className="btn btn-sm btn-outline-warning" title="Editar" onClick={() => handleEdit(p)}><i className="bi bi-pencil"></i></button>
                          <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => handleDelete(p.id)}><i className="bi bi-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Formulario de producto */}
          {showForm && (
            <div className="card mt-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">{editMode ? 'Editar producto' : 'Nuevo producto'}</h5>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Categoría</label>
                      <select className="form-select" name="category_id" value={form.category_id} onChange={handleChange} required>
                        <option value="">Selecciona</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Precio</label>
                      <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Stock</label>
                      <input type="number" className="form-control" name="stock" value={form.stock} onChange={handleChange} required min="0" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Imagen (URL)</label>
                      <input type="text" className="form-control" name="image_url" value={form.image_url} onChange={e => { handleChange(e); handleImagePreview(e); }} />
                      {form.image_url && <img src={form.image_url} alt="preview" style={{width:80,height:80,objectFit:'cover',borderRadius:8,marginTop:8}} onError={e => e.target.style.display='none'} />}
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                      <div className="form-check mt-4">
                        <input className="form-check-input" type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="featuredCheck" />
                        <label className="form-check-label" htmlFor="featuredCheck">Destacado</label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 d-flex gap-2">
                    <button type="submit" className="btn btn-primary">{editMode ? 'Guardar cambios' : 'Crear producto'}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      <Footer />
    </>
  );
};

export default MyProducts;
