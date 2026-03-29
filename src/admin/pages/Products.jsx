import React, { useEffect, useState } from "react";
import { productsAPI, categoriesAPI } from "../services/adminApi";
import Sidebar from "../components/Sidebar";
import "../styles/admin.css";

const PAGE_SIZE = 15;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState({ name: "", description: "", price: "", stock: 0, featured: false, category_id: "", image_url: "" });
  const [modalMode, setModalMode] = useState("create");
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    categoriesAPI.list().then(setCategories);
  }, []);
  useEffect(() => {
    setLoading(true);
    productsAPI.list({ page, limit: PAGE_SIZE, search, category, featured }).then(({ products, total }) => {
      setProducts(products);
      setTotal(total);
      setLoading(false);
    });
  }, [page, search, category, featured]);

  const openCreate = () => {
    setModalProduct({ name: "", description: "", price: "", stock: 0, featured: false, category_id: "", image_url: "" });
    setModalMode("create");
    setModalError("");
    setShowModal(true);
  };
  const openEdit = async (id) => {
    setModalError("");
    setModalMode("edit");
    setSaving(false);
    const p = await productsAPI.get(id);
    setModalProduct({ ...p, category_id: p.category_id || "", image_url: p.image_url || "" });
    setShowModal(true);
  };
  const handleSave = async () => {
    setModalError("");
    setSaving(true);
    const { name, price, stock, image_url } = modalProduct;
    if (!name || name.length < 2) { setModalError("El nombre debe tener al menos 2 caracteres"); setSaving(false); return; }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) { setModalError("Precio inválido, debe ser mayor a 0"); setSaving(false); return; }
    if (isNaN(parseInt(stock)) || parseInt(stock) < 0) { setModalError("Stock inválido, debe ser 0 o mayor"); setSaving(false); return; }
    if (image_url && !/^https?:\/\/.+/.test(image_url)) { setModalError("URL de imagen inválida"); setSaving(false); return; }
    try {
      if (modalMode === "edit") {
        await productsAPI.update(modalProduct.id, modalProduct);
      } else {
        await productsAPI.create(modalProduct);
      }
      setShowModal(false);
      setPage(1);
      setSearch("");
      setCategory("");
      setFeatured("");
    } catch (e) {
      setModalError(e.message || "Error al guardar producto");
    } finally {
      setSaving(false);
    }
  };
  const openDelete = (p) => {
    setDeleteProduct(p);
    setDeleteError("");
  };
  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await productsAPI.delete(deleteProduct.id);
      setDeleteProduct(null);
      setPage(1);
    } catch (e) {
      setDeleteError(e.message || "Error al eliminar producto");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="admin-main">
      <Sidebar activePage="products" />
      <header className="admin-topbar">
        <button className="btn-toggle-sidebar" id="sidebarToggle"><i className="bi bi-list"></i></button>
        <div className="topbar-title">
          <h5><i className="bi bi-box-seam-fill me-2" style={{ color: "#7c3aed" }}></i>Gestión de Productos</h5>
          <small>CRUD completo de productos con categorías</small>
        </div>
        <button className="btn btn-sm me-1" style={{ background: "#7c3aed", color: "#fff" }} onClick={openCreate}><i className="bi bi-plus-lg me-1"></i>Nuevo Producto</button>
      </header>
      <div className="admin-content">
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
              <input type="search" className="form-control" placeholder="Buscar producto…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
              <option value="">Todas las categorías</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={featured} onChange={e => { setFeatured(e.target.value); setPage(1); }}>
              <option value="">Todos</option>
              <option value="true">Destacados</option>
              <option value="false">No destacados</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setPage(1); setSearch(""); setCategory(""); setFeatured(""); }}><i className="bi bi-arrow-clockwise me-1"></i>Refrescar</button>
          </div>
        </div>
        <div className="table-card">
          <div className="table-card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0"><i className="bi bi-table me-2"></i>Productos <span className="badge ms-1" style={{ background: "#7c3aed" }}>{total}</span></h6>
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
                  <th>ID</th><th>Imagen</th><th>Nombre</th><th>Categoría</th>
                  <th>Precio</th><th>Stock</th><th>Destacado</th><th>Vendedor</th><th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="loading-row"><td colSpan={9}><span className="spinner-border spinner-border-sm me-2"></span>Cargando…</td></tr>
                ) : !products.length ? (
                  <tr><td colSpan={9} className="text-center py-4 text-muted"><i className="bi bi-box-seam fs-3 d-block mb-2"></i>Sin productos encontrados</td></tr>
                ) : (
                  products.map(p => (
                    <tr key={p.id}>
                      <td className="text-muted">#{p.id}</td>
                      <td><img src={p.image_url || 'https://via.placeholder.com/44'} className="product-thumb" onError={e => (e.target.src = 'https://via.placeholder.com/44')} alt="" /></td>
                      <td>
                        <span className="fw-semibold">{p.name}</span>
                        {p.description && <><br /><small className="text-muted">{p.description.substring(0, 45)}…</small></>}
                      </td>
                      <td><span className="badge bg-light text-dark border">{p.category_name || "—"}</span></td>
                      <td className="fw-bold">${parseFloat(p.price).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${p.stock > 5 ? 'bg-success' : p.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>{p.stock}</span>
                      </td>
                      <td className="text-center">
                        {p.featured ? <i className="bi bi-star-fill text-warning fs-5" title="Destacado"></i> : <i className="bi bi-star text-muted"></i>}
                      </td>
                      <td className="text-muted small">{p.seller_name || "—"}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary btn-sm-action me-1" onClick={() => openEdit(p.id)}><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger btn-sm-action" onClick={() => openDelete(p)}><i className="bi bi-trash"></i></button>
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
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalMode === "edit" ? "Editar Producto" : "Nuevo Producto"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label">Nombre <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="Nombre del producto" required maxLength={200} value={modalProduct.name} onChange={e => setModalProduct({ ...modalProduct, name: e.target.value })} />
                        <div className="invalid-feedback" style={{ display: modalError && modalError.includes("nombre") ? "block" : "none" }}>El nombre es obligatorio (mín. 2 caracteres)</div>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Categoría</label>
                        <select className="form-select" value={modalProduct.category_id || ""} onChange={e => setModalProduct({ ...modalProduct, category_id: e.target.value })}>
                          <option value="">Sin categoría</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Precio (USD) <span className="text-danger">*</span></label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input type="number" className="form-control" placeholder="0.00" min="0.01" step="0.01" required value={modalProduct.price} onChange={e => setModalProduct({ ...modalProduct, price: e.target.value })} />
                        </div>
                        <div className="invalid-feedback" style={{ display: modalError && modalError.includes("Precio") ? "block" : "none" }}>Precio obligatorio, mayor a 0</div>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Stock <span className="text-danger">*</span></label>
                        <input type="number" className="form-control" placeholder="0" min="0" step="1" required value={modalProduct.stock} onChange={e => setModalProduct({ ...modalProduct, stock: e.target.value })} />
                        <div className="invalid-feedback" style={{ display: modalError && modalError.includes("Stock") ? "block" : "none" }}>Stock obligatorio, mayor o igual a 0</div>
                      </div>
                      <div className="col-md-4 d-flex align-items-end pb-1">
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="pFeatured" checked={modalProduct.featured} onChange={e => setModalProduct({ ...modalProduct, featured: e.target.checked })} />
                          <label className="form-check-label fw-semibold" htmlFor="pFeatured"><i className="bi bi-star-fill text-warning me-1"></i>Producto Destacado</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Descripción</label>
                        <textarea className="form-control" rows={3} placeholder="Descripción del producto…" maxLength={2000} value={modalProduct.description} onChange={e => setModalProduct({ ...modalProduct, description: e.target.value })} />
                        <div className="form-text">{modalProduct.description.length}/2000 caracteres</div>
                      </div>
                      <div className="col-12">
                        <label className="form-label">URL de Imagen</label>
                        <input type="url" className="form-control" placeholder="https://…" value={modalProduct.image_url} onChange={e => setModalProduct({ ...modalProduct, image_url: e.target.value })} />
                        <div className="invalid-feedback" style={{ display: modalError && modalError.includes("URL") ? "block" : "none" }}>Ingresa una URL válida</div>
                        {modalProduct.image_url && /^https?:\/\/.+/.test(modalProduct.image_url) && (
                          <img src={modalProduct.image_url} alt="Vista previa" className="img-preview mt-2" style={{ maxHeight: 140, objectFit: "cover", borderRadius: 8, border: "1.5px solid #e2e8f0" }} onError={e => (e.target.style.display = "none")} />
                        )}
                      </div>
                    </div>
                  </form>
                  {modalError && <div className="alert alert-danger small mt-2">{modalError}</div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="button" className="btn btn-sm text-white" style={{ background: "#7c3aed" }} onClick={handleSave} disabled={saving}>
                    <span style={{ display: saving ? "none" : "inline" }}><i className="bi bi-check-lg me-1"></i>Guardar Producto</span>
                    <span style={{ display: saving ? "inline" : "none" }} className="spinner-border spinner-border-sm"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal Eliminar */}
        {deleteProduct && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.2)" }}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content text-center">
                <div className="modal-body p-4">
                  <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
                  <h6 className="fw-bold">¿Eliminar producto?</h6>
                  <p className="text-muted small">"{deleteProduct.name}" será eliminado permanentemente.</p>
                  {deleteError && <div className="alert alert-danger small">{deleteError}</div>}
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-light btn-sm" onClick={() => setDeleteProduct(null)}>Cancelar</button>
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
