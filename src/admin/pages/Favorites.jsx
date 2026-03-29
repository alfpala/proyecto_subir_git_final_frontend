import React, { useEffect, useState } from "react";
import { favoritesAPI } from "../services/adminApi";
import Sidebar from "../components/Sidebar";
import "../styles/admin.css";

const PAGE_SIZE = 20;

export default function AdminFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteFav, setDeleteFav] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setLoading(true);
    favoritesAPI.list({ page, limit: PAGE_SIZE }).then(({ favorites, total }) => {
      setFavorites(favorites);
      setTotal(total);
      setLoading(false);
    });
  }, [page]);

  const filtered = search
    ? favorites.filter(f =>
        (f.user_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (f.user_email || "").toLowerCase().includes(search.toLowerCase()) ||
        (f.product_name || "").toLowerCase().includes(search.toLowerCase())
      )
    : favorites;

  const openDelete = (fav) => {
    setDeleteFav(fav);
    setDeleteError("");
  };
  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await favoritesAPI.delete(deleteFav.id);
      setDeleteFav(null);
      setLoading(true);
      favoritesAPI.list({ page, limit: PAGE_SIZE }).then(({ favorites, total }) => {
        setFavorites(favorites);
        setTotal(total);
        setLoading(false);
      });
    } catch (e) {
      setDeleteError(e.message || "Error al eliminar favorito");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="admin-main">
      <Sidebar activePage="favorites" />
      <header className="admin-topbar">
        <button className="btn-toggle-sidebar" id="sidebarToggle"><i className="bi bi-list"></i></button>
        <div className="topbar-title">
          <h5><i className="bi bi-heart-fill me-2 text-danger"></i>Favoritos</h5>
          <small>Productos marcados como favoritos por los usuarios</small>
        </div>
      </header>
      <div className="admin-content">
        <div className="row g-3 mb-3">
          <div className="col-sm-4 col-xl-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#fff1f2" }}><i className="bi bi-heart-fill text-danger"></i></div>
              <div className="stat-body"><div className="stat-label">Total Favoritos</div><div className="stat-value text-danger">{total}</div></div>
            </div>
          </div>
        </div>
        <div className="row g-2 mb-3">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
              <input type="search" className="form-control" placeholder="Buscar por usuario o producto…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setLoading(true); favoritesAPI.list({ page, limit: PAGE_SIZE }).then(({ favorites, total }) => { setFavorites(favorites); setTotal(total); setLoading(false); }); }}><i className="bi bi-arrow-clockwise me-1"></i>Refrescar</button>
          </div>
        </div>
        <div className="table-card">
          <div className="table-card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0"><i className="bi bi-table me-2"></i>Favoritos <span className="badge bg-danger ms-1">{total}</span></h6>
            <div className="admin-pagination">
              {Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, i) => (
                <button key={i} className={`btn btn-sm ${page === i + 1 ? "btn-danger" : "btn-light"}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Usuario</th><th>Email</th><th>Producto</th><th>Precio</th><th>Agregado</th><th className="text-end">Acción</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="loading-row"><td colSpan={7}><span className="spinner-border spinner-border-sm me-2"></span>Cargando…</td></tr>
                ) : !filtered.length ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted"><i className="bi bi-heart fs-3 d-block mb-2"></i>Sin favoritos encontrados</td></tr>
                ) : (
                  filtered.map(f => (
                    <tr key={f.id}>
                      <td className="text-muted">#{f.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="user-avatar" style={{ width: 30, height: 30, fontSize: ".75rem", flexShrink: 0 }}>{(f.user_name || "?").charAt(0).toUpperCase()}</div>
                          <span className="fw-semibold">{f.user_name || "—"}</span>
                        </div>
                      </td>
                      <td className="text-muted small">{f.user_email || "—"}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {f.image_url && <img src={f.image_url} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} onError={e => (e.target.style.display = "none")} alt="" />}
                          <div>
                            <span className="fw-semibold">{f.product_name || "—"}</span>
                            {f.featured && <i className="bi bi-star-fill text-warning ms-1"></i>}
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold">${parseFloat(f.price || 0).toFixed(2)}</td>
                      <td className="text-muted small">{new Date(f.created_at).toLocaleDateString("es-ES")}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger btn-sm-action" onClick={() => openDelete(f)}><i className="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal Eliminar */}
        {deleteFav && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.2)" }}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content text-center">
                <div className="modal-body p-4">
                  <i className="bi bi-heart-fill text-danger fs-1 mb-3 d-block"></i>
                  <h6 className="fw-bold">¿Eliminar favorito?</h6>
                  <p className="text-muted small">Favorito de "{deleteFav.user_name}" sobre "{deleteFav.product_name}".</p>
                  {deleteError && <div className="alert alert-danger small">{deleteError}</div>}
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-light btn-sm" onClick={() => setDeleteFav(null)}>Cancelar</button>
                    <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                      <span style={{ display: deleting ? "none" : "inline" }}><i className="bi bi-trash me-1"></i>Eliminar</span>
                      <span style={{ display: deleting ? "inline" : "none" }} className="spinner-border spinner-border-sm"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
