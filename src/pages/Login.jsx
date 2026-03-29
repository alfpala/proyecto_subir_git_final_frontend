import React from 'react';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer';

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

const Login = () => {
  const { login } = useAuth();
  const {
    form, showPwd, loading, error, success,
    handleChange, handleTogglePwd, handleSubmit
  } = useLogin(login);
  return (
    <>
      <Navbar />
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card auth-card p-4 shadow-sm">
              <h2 className="mb-4 text-center fw-bold">Iniciar sesión</h2>
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {success && <div className="alert alert-success py-2 small">{success}</div>}
              <form autoComplete="on" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input type="email" className="form-control" id="email" name="email" value={form.email} onChange={handleChange} required autoFocus />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <div className="input-group">
                    <input type={showPwd ? 'text' : 'password'} className="form-control" id="password" name="password" value={form.password} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary" tabIndex={-1} onClick={handleTogglePwd} title="Mostrar/ocultar contraseña">
                      <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn w-100"
                  style={{ background: 'var(--primary)', color: '#fff' }}
                  disabled={loading}
                >
                  {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
              </form>
              <div className="text-center mt-3">
                <a href="/register">¿No tienes cuenta? Regístrate</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};


export default Login;
