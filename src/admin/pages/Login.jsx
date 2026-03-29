import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/adminApi";
import { getAdminUser } from "../context/adminAuth";
import "../styles/admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const navigate = useNavigate();

  // Redirigir si ya está logueado como admin
  React.useEffect(() => {
    const user = getAdminUser();
    if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", msg: "" });
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setAlert({ type: "warning", msg: "Ingresa un correo electrónico válido." });
      return;
    }
    if (!password) {
      setAlert({ type: "warning", msg: "Ingresa tu contraseña." });
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      if (data.user.role !== "admin") {
        setAlert({ type: "danger", msg: "Acceso denegado. Solo administradores pueden ingresar aquí." });
        setLoading(false);
        return;
      }
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      setAlert({ type: "success", msg: `¡Bienvenido, ${data.user.name}!` });
      setTimeout(() => navigate("/admin/dashboard"), 700);
    } catch (err) {
      setAlert({ type: "danger", msg: err.message || "Credenciales inválidas. Intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="login-card">
        <div className="login-header">
          <i className="bi bi-lightning-charge-fill text-warning fs-1"></i>
          <h4 className="text-white fw-bold mt-2 mb-0">MarketTech Admin</h4>
          <small className="text-white-50">Panel de Administración</small>
        </div>
        <div className="login-body">
          {alert.msg && (
            <div className={`alert alert-${alert.type} mb-3`} role="alert">
              {alert.msg}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-envelope text-muted"></i></span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="admin@admin.com"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <div className="invalid-feedback">Ingresa un correo válido</div>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-lock text-muted"></i></span>
                <input
                  type={showPwd ? "text" : "password"}
                  className="form-control"
                  placeholder="⬢⬢⬢⬢⬢⬢⬢⬢"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className="btn btn-outline-secondary" tabIndex={-1} onClick={() => setShowPwd(v => !v)}>
                  <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                <div className="invalid-feedback">Ingresa tu contraseña</div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary-admin btn btn-primary w-100 py-2 fw-semibold fs-6" disabled={loading}>
              <span style={{ display: loading ? "none" : "inline" }}><i className="bi bi-box-arrow-in-right me-2"></i>Ingresar</span>
              <span style={{ display: loading ? "inline" : "none" }}><span className="spinner-border spinner-border-sm me-2"></span>Verificando…</span>
            </button>
          </form>
          <div className="alert alert-light border mt-3 p-2 text-center small">
            <i className="bi bi-info-circle text-primary me-1"></i>
            <strong>Demo:</strong> admin@admin.com &nbsp;/&nbsp; admin123
          </div>
          <p className="text-center mt-3 mb-0 small text-muted">
            <a href="/" className="text-decoration-none"><i className="bi bi-arrow-left me-1"></i>Volver a la tienda</a>
          </p>
        </div>
      </div>
    </div>
  );
}
