import React, { useEffect, useState } from "react";
import { usersAPI } from "../services/adminApi";
import Sidebar from "../components/Sidebar";
import "../styles/admin.css";

const PAGE_SIZE = 15;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [modalError, setModalError] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    usersAPI.list({ search, role, page, limit: PAGE_SIZE })
      .then(({ users, total }) => {
        setUsers(users);
        setTotal(total);
        setLoading(false);
      });
  }, [search, role, page]);

  const openCreate = () => {
    setModalUser({ name: "", email: "", password: "", role: "user" });
    setModalMode("create");
    setModalError("");
    setShowModal(true);
  };
  const openEdit = async (id) => {
    setModalError("");
    setModalMode("edit");
    setSaving(false);
    const u = await usersAPI.get(id);
    setModalUser({ ...u, password: "" });
    setShowModal(true);
  };
  const handleSave = async () => {
    setModalError("");
    setSaving(true);
    const { name, email, password, role, id } = modalUser;
    if (!name || name.length < 2) { setModalError("El nombre debe tener al menos 2 caracteres"); setSaving(false); return; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setModalError("Ingresa un correo electrónico válido"); setSaving(false); return; }
    if (modalMode === "create" && (!password || password.length < 6)) { setModalError("La contraseña debe tener al menos 6 caracteres"); setSaving(false); return; }
    if (modalMode === "edit" && password && password.length < 6) { setModalError("La contraseña debe tener al menos 6 caracteres"); setSaving(false); return; }
    try {
      if (modalMode === "edit") {
        const payload = { name, email, role };
        if (password) payload.password = password;
        await usersAPI.update(id, payload);
      } else {
        await usersAPI.create({ name, email, password, role });
      }
      setShowModal(false);
      setPage(1);
      setSearch("");
      setRole("");
    } catch (e) {
      setModalError(e.message || "Error al guardar usuario");
    } finally {
      setSaving(false);
    }
  };
  const openDelete = (u) => {
    setDeleteUser(u);
    setDeleteError("");
  };
  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await usersAPI.delete(deleteUser.id);
      setDeleteUser(null);
      setPage(1);
    } catch (e) {
      setDeleteError(e.message || "Error al eliminar usuario");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="admin-main">
      <Sidebar activePage="users" />
      <header className="admin-topbar">
        <button className="btn-toggle-sidebar" id="sidebarToggle"><i className="bi bi-list"></i></button>
        <div className="topbar-title">
          <h5><i className="bi bi-people-fill me-2 text-primary"></i>Gestión de Usuarios</h5>
          <small>Crear, editar y eliminar usuarios del sistema</small>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <i className="bi bi-person-plus me-1"></i>Nuevo Usuario
        </button>
      </header>
      <div className="admin-content">
        <div className="row g-2 mb-3">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
              <input type="search" className="form-control" placeholder="Buscar por nombre o email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={role} onChange={e => { setRole(e.target.value); setPage(1); }}>
              <option value="">Todos los roles</option>
              <option value="admin">Admin</option>
              <option value="user">Usuario</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setPage(1); setSearch(""); setRole(""); }}><i className="bi bi-arrow-clockwise me-1"></i>Refrescar</button>
          </div>
        </div>
        <div className="table-card">
          <div className="table-card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0"><i className="bi bi-table me-2"></i>Usuarios <span className="badge bg-primary ms-1">{total}</span></h6>
            {/* Pagination */}
            <div className="admin-pagination">
              {Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, i) => (
                <button key={i} className={`btn btn-sm ${page === i + 1 ? "btn-primary" : "btn-light"}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th>
                  <th>Registrado</th><th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="loading-row"><td colSpan={6}><span className="spinner-border spinner-border-sm me-2"></span>Cargando usuarios…</td></tr>
                ) : !users.length ? (
                  <tr><td colSpan={6} className="text-center py-4 text-muted"><i className="bi bi-person-x fs-3 d-block mb-2"></i>Sin usuarios encontrados</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td className="text-muted">#{u.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: ".8rem", flexShrink: 0 }}>{u.name.charAt(0).toUpperCase()}</div>
                          <span className="fw-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td className="text-muted">{u.email}</td>
                      <td><span className={`role-badge role-${u.role}`}>{u.role === "admin" ? "Admin" : "Usuario"}</span></td>
                      <td className="text-muted small">{new Date(u.created_at).toLocaleDateString("es-ES")}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary btn-sm-action me-1" onClick={() => openEdit(u.id)}><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger btn-sm-action" onClick={() => openDelete(u)} disabled={u.id === 1 /* no auto-delete */}><i className="bi bi-trash"></i></button>
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
                  <h5 className="modal-title">{modalMode === "edit" ? "Editar Usuario" : "Nuevo Usuario"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <div className="mb-3">
                      <label className="form-label">Nombre completo <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="Juan Pérez" required maxLength={120} value={modalUser.name} onChange={e => setModalUser({ ...modalUser, name: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo electrónico <span className="text-danger">*</span></label>
                      <input type="email" className="form-control" placeholder="usuario@email.com" required value={modalUser.email} onChange={e => setModalUser({ ...modalUser, email: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña <span className="text-danger">{modalMode === "create" ? "*" : ""}</span> <small className="text-muted">{modalMode === "edit" ? "(dejar vacío para no cambiar)" : null}</small></label>
                      <div className="input-group">
                        <input type="password" className="form-control" placeholder="Mínimo 6 caracteres" value={modalUser.password} onChange={e => setModalUser({ ...modalUser, password: e.target.value })} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rol <span className="text-danger">*</span></label>
                      <select className="form-select" required value={modalUser.role} onChange={e => setModalUser({ ...modalUser, role: e.target.value })}>
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  </form>
                  {modalError && <div className="alert alert-danger small mt-2">{modalError}</div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    <span style={{ display: saving ? "none" : "inline" }}><i className="bi bi-check-lg me-1"></i>Guardar</span>
                    <span style={{ display: saving ? "inline" : "none" }} className="spinner-border spinner-border-sm"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal Eliminar */}
        {deleteUser && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.2)" }}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content text-center">
                <div className="modal-body p-4">
                  <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
                  <h6 className="fw-bold">¿Eliminar usuario?</h6>
                  <p className="text-muted small">{`"${deleteUser.name}" será eliminado permanentemente.`}</p>
                  {deleteError && <div className="alert alert-danger small">{deleteError}</div>}
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-light btn-sm" onClick={() => setDeleteUser(null)}>Cancelar</button>
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
