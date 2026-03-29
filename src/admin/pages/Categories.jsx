import React, { useEffect, useState } from "react";
import { categoriesAPI } from "../services/adminApi";
import Sidebar from "../components/Sidebar";
import "../styles/admin.css";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalCategory, setModalCategory] = useState({ name: "", description: "" });
  const [modalMode, setModalMode] = useState("create");
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    categoriesAPI.list().then((cats) => {
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filtered = search
    ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.description || "").toLowerCase().includes(search.toLowerCase()))
    : categories;

  const openCreate = () => {
    setModalCategory({ name: "", description: "" });
    setModalMode("create");
    setModalError("");
    setShowModal(true);
  };
  const openEdit = (cat) => {
    setModalCategory({ ...cat });
    setModalMode("edit");
    setModalError("");
    setShowModal(true);
  };
  const handleSave = async () => {
    setModalError("");
    setSaving(true);
    const { name, description, id } = modalCategory;
    if (!name || name.length < 2) { setModalError("El nombre debe tener al menos 2 caracteres"); setSaving(false); return; }
    try {
      if (modalMode === "edit") {
        await categoriesAPI.update(id, { name, description });
      } else {
        await categoriesAPI.create({ name, description });
      }
      setShowModal(false);
      setLoading(true);
      categoriesAPI.list().then((cats) => {
        setCategories(cats);
        setLoading(false);
      });
    } catch (e) {
      setModalError(e.message || "Error al guardar categoría");
    } finally {
      setSaving(false);
    }
  };
  const openDelete = (cat) => {
    setDeleteCategory(cat);
    setDeleteError("");
  };
  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await categoriesAPI.delete(deleteCategory.id);
      setDeleteCategory(null);
      setLoading(true);
      categoriesAPI.list().then((cats) => {
        setCategories(cats);
        setLoading(false);
      });
    } catch (e) {
      setDeleteError(e.message || "Error al eliminar categoría");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="admin-main">
      <Sidebar activePage="categories" />
      <header className="admin-topbar">
        <button className="btn-toggle-sidebar" id="sidebarToggle"><i className="bi bi-list"></i></button>
        <div className="topbar-title">
          <h5><i className="bi bi-tags-fill me-2 text-success"></i>Gestión de Categorías</h5>
          <small>Crear y administrar categorías de productos</small>
        </div>
        <button className="btn btn-success btn-sm" onClick={openCreate}><i className="bi bi-plus-lg me-1"></i>Nueva Categoría</button>
      </header>
      <div className="admin-content">
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
              <input type="search" className="form-control" placeholder="Buscar categoría…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setLoading(true); categoriesAPI.list().then((cats) => { setCategories(cats); setLoading(false); }); }}><i className="bi bi-arrow-clockwise me-1"></i>Refrescar</button>
          </div>
        </div>
        <div className="table-card">
          <div className="table-card-header">
            <h6 className="mb-0"><i className="bi bi-table me-2"></i>Categorías <span className="badge bg-success ms-1">{categories.length}</span></h6>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Productos</th><th className="text-end">Acciones</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr className="loading-row"><td colSpan={5}><span className="spinner-border spinner-border-sm me-2"></span>Cargando…</td></tr>
                ) : !filtered.length ? (
                  <tr><td colSpan={5} className="text-center py-4 text-muted"><i className="bi bi-tags fs-3 d-block mb-2"></i>Sin categorías encontradas</td></tr>
                ) : (
                  filtered.map(c => (
                    <tr key={c.id}>
                      <td className="text-muted">#{c.id}</td>
                      <td><span className="fw-semibold"><i className="bi bi-tag-fill text-success me-2"></i>{c.name}</span></td>
                      <td className="text-muted">{c.description ? c.description.substring(0,60) + (c.description.length > 60 ? "…" : "") : <em>Sin descripción</em>}</td>
                      <td><span className="badge bg-light text-dark border">{c.product_count} producto(s)</span></td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary btn-sm-action me-1" onClick={() => openEdit(c)}><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger btn-sm-action" onClick={() => openDelete(c)}><i className="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal Crear/Editar */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.2)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalMode === "edit" ? "Editar Categoría" : "Nueva Categoría"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <div className="mb-3">
                      <label className="form-label">Nombre <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="Ej: Electrónica" required maxLength={100} value={modalCategory.name} onChange={e => setModalCategory({ ...modalCategory, name: e.target.value })} />
                      <div className="invalid-feedback" style={{ display: modalError && modalError.includes("nombre") ? "block" : "none" }}>El nombre es obligatorio (mín. 2 caracteres)</div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" rows={3} placeholder="Descripción opcional…" maxLength={500} value={modalCategory.description} onChange={e => setModalCategory({ ...modalCategory, description: e.target.value })} />
                      <div className="form-text">Máximo 500 caracteres. {modalCategory.description.length}/500</div>
                    </div>
                  </form>
                  {modalError && <div className="alert alert-danger small mt-2">{modalError}</div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="button" className="btn btn-success" onClick={handleSave} disabled={saving}>
                    <span style={{ display: saving ? "none" : "inline" }}><i className="bi bi-check-lg me-1"></i>Guardar</span>
                    <span style={{ display: saving ? "inline" : "none" }} className="spinner-border spinner-border-sm"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal Eliminar */}
        {deleteCategory && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.2)" }}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content text-center">
                <div className="modal-body p-4">
                  <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
                  <h6 className="fw-bold">¿Eliminar categoría?</h6>
                  <p className="text-muted small">
                    <strong>"{deleteCategory.name}"</strong> será eliminada.
                    {deleteCategory.product_count > 0 && (
                      <><br /><span className="text-danger small"><i className="bi bi-exclamation-triangle me-1"></i>Tiene <strong>{deleteCategory.product_count}</strong> producto(s) asociado(s). Primero reasígnalos.</span></>
                    )}
                  </p>
                  {deleteError && <div className="alert alert-danger small">{deleteError}</div>}
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-light btn-sm" onClick={() => setDeleteCategory(null)}>Cancelar</button>
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
