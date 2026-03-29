import { useCart } from '../hooks/useCart';
import { useToast } from '../components/Toast.jsx';
import React from 'react';
import { useEditProfile } from '../hooks/useEditProfile';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer.jsx';

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

const EditProfile = () => {
  const {
    profile, loading, auth, error, success, form, showPwd, showConfirm,
    handleChange, handleTogglePwd, handleToggleConfirm, handleSubmit
  } = useEditProfile();
  const initials = profile?.name ? profile.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() : '?';
  return (
    <>
      <Navbar />
      {/* PAGE HEADER */}
      <div style={{background:'linear-gradient(135deg,#1e3a5f,#2563eb)'}} className="py-4">
        <div className="container">
          <h1 className="text-white fw-bold mb-1"><i className="bi bi-person-gear me-2"></i>Mi Perfil</h1>
          <nav aria-label="breadcrumb"><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><a href="/" className="text-white-50">Inicio</a></li>
            <li className="breadcrumb-item active text-white">Mi Perfil</li>
          </ol></nav>
        </div>
      </div>

      <main className="container py-5">
        {!auth && (
          <div className="text-center py-5">
            <i className="bi bi-lock fs-1 text-muted"></i>
            <h4 className="mt-3">Inicia sesión para ver tu perfil</h4>
            <a href="/login" className="btn btn-primary mt-2">Iniciar sesión</a>
          </div>
        )}
        {loading && auth && (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando…</span></div>
          </div>
        )}
        {!loading && auth && (
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#2563eb,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',fontWeight:700,color:'#fff',margin:'0 auto'}}>
                      {initials}
                    </div>
                    <p className="text-muted small mt-2 mb-0">Rol: {profile?.role}</p>
                    {profile?.created_at && (
                      <p className="text-muted small">Miembro desde {new Date(profile.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</p>
                    )}
                  </div>
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}
                  {success && <div className="alert alert-success py-2 small">{success}</div>}
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo electrónico</label>
                      <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rol</label>
                      <input type="text" className="form-control" name="role" value={form.role} disabled />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nueva contraseña</label>
                      <div className="input-group">
                        <input type={showPwd ? 'text' : 'password'} className="form-control" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" />
                        <button type="button" className="btn btn-outline-secondary" tabIndex={-1} onClick={handleTogglePwd} title="Mostrar/ocultar contraseña">
                          <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirmar contraseña</label>
                      <div className="input-group">
                        <input type={showConfirm ? 'text' : 'password'} className="form-control" name="confirm" value={form.confirm} onChange={handleChange} autoComplete="new-password" />
                        <button type="button" className="btn btn-outline-secondary" tabIndex={-1} onClick={handleToggleConfirm} title="Mostrar/ocultar confirmación">
                          <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Guardar cambios</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default EditProfile;
