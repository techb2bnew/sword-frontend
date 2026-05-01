import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API } from "../config";
import Modal from "../components/Modal";

const getStockPill = (stock) => {
  if (stock <= 5) return <span className="pill red">Low Stock</span>;
  if (stock <= 20) return <span className="pill yellow">Medium</span>;
  return <span className="pill green">Healthy</span>;
};

export default function Inventory({ products, onRefresh, push, user }) {
  const [form, setForm] = useState({ name: "", price: "", barcode: "", stock: 0, type: "finished_good", uom: "units", warehouse_id: "", bin_id: "", supplier_id: "" });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  const [warehouses, setWarehouses] = useState([]);
  const [bins, setBins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      const [wRes, bRes, sRes] = await Promise.all([
        axios.get(`${API}/warehouse`, { headers }),
        axios.get(`${API}/warehouse/bins`, { headers }),
        axios.get(`${API}/purchases/suppliers`, { headers })
      ]);
      setWarehouses(wRes.data);
      setBins(bRes.data);
      setSuppliers(sRes.data);
    } catch (err) { console.error("Failed to fetch data", err); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({ name: "", price: "", barcode: "", stock: 0, type: "finished_good", uom: "units", warehouse_id: "", bin_id: "", supplier_id: "" });
    setEditId(null);
    setShowModal(false);
  };

  const handleSave = async () => {
  if (!form.name || !form.price) {
    push("Name and Price are required", "error");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("erp_token"); 
    // agar authToken ya accessToken naam se store hai toh wahi use karo

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (editId) {
      await axios.put(
        `${API}/inventory/products/${editId}`,
        form,
        config
      );

      push("Product updated successfully!");
    } else {
      await axios.post(
        `${API}/inventory/products`,
        form,
        config
      );

      push("Product added successfully!");
    }

    resetForm();
    await onRefresh();

  } catch (error) {
    console.error("Save error:", error);

    push(
      `Failed to ${editId ? "update" : "add"} product`,
      "error"
    );
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ 
        name: p.name, 
        price: p.price, 
        barcode: p.barcode || "", 
        stock: p.stock || 0, 
        type: p.type || "finished_good", 
        uom: p.uom || "units",
        warehouse_id: p.warehouse_id || "",
        bin_id: p.bin_id || "",
        supplier_id: p.supplier_id || ""
    });
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API}/inventory/products/${deleteId}`);
      push("Product deleted successfully!");
      setShowDeleteModal(false);
      setDeleteId(null);
      await onRefresh();
    } catch {
      push("Failed to delete product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div className="section-title">Inventory Overview</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="topbar-search" style={{ margin: 0, width: 300, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Locate by Name or Barcode..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user.role === 'admin' && (
            <select 
              className="btn btn-secondary" 
              style={{ padding: '0 15px', height: 40, borderRadius: 8, background: 'var(--bg-surface)' }}
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
            >
              <option value="all">All Ownerships</option>
              <option value="in-house">🏠 In-house Only</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>🏭 {s.name}</option>)}
            </select>
          )}
          {<button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ Add New Product</button>}
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="stats-grid" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          <div className="stat-card c1">
            <div className="stat-label">Total SKUs</div>
            <div className="stat-value" style={{ fontSize: 24 }}>{products.length}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Unique items in catalog</div>
          </div>
          <div className="stat-card c4">
            <div className="stat-label">Stock Value</div>
            <div className="stat-value" style={{ fontSize: 24 }}>
              ₹{products.reduce((acc, p) => acc + (Number(p.price) * Number(p.stock || 0)), 0).toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Estimated total value</div>
          </div>
          <div className="stat-card c5">
            <div className="stat-label">Low Stock</div>
            <div className="stat-value" style={{ fontSize: 24, color: 'var(--accent-5)' }}>
              {products.filter(p => (p.stock || 0) <= 5).length}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Items requiring restock</div>
          </div>
          <div className="stat-card c2">
            <div className="stat-label">Total Volume</div>
            <div className="stat-value" style={{ fontSize: 24 }}>
              {products.reduce((acc, p) => acc + Number(p.stock || 0), 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Total items across WH</div>
          </div>
        </div>
      )}

      {showModal && (
        <Modal 
          title={editId ? "Edit Product" : "Add New Product"} 
          onClose={resetForm} 
          onConfirm={handleSave}
          loading={loading}
          confirmText={editId ? "Update Product" : "Save Product"}
        >
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="form-group">
              <label>Product Name</label>
              <input placeholder="e.g. Wireless Keyboard" value={form.name} onChange={set("name")} />
            </div>
            {user.role === 'admin' && (
              <div className="form-group">
                <label>Ownership / Supplier</label>
                <select value={form.supplier_id} onChange={set("supplier_id")} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  <option value="">In-house (Admin Owned)</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} (Supplier)</option>)}
                </select>
              </div>
            )}
            <div className="form-grid" style={{ gridTemplateColumns: user.role === 'supplier' ? '1fr' : '1fr 1fr' }}>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" placeholder="e.g. 1299" value={form.price} onChange={set("price")} />
              </div>
              {user.role !== 'supplier' && (
                <div className="form-group">
                  <label>Barcode / SKU</label>
                  <input placeholder="e.g. SKU-4421" value={form.barcode} onChange={set("barcode")} />
                </div>
              )}
            </div>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label>Quantity in Stock</label>
                <input type="number" placeholder="0" value={form.stock} onChange={set("stock")} />
              </div>
              <div className="form-group">
                <label>Product Type</label>
                <select value={form.type} onChange={set("type")}>
                  <option value="finished_good">Finished Good</option>
                  <option value="raw_material">Raw Material</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Unit of Measure (UOM)</label>
              <select value={form.uom} onChange={set("uom")}>
                <option value="units">Units / Items</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="metre">Metres (m)</option>
                <option value="litre">Litres (L)</option>
                <option value="box">Boxes</option>
                <option value="pkt">Packets</option>
              </select>
            </div>

            {user.role !== 'supplier' && (
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label>Assign Warehouse</label>
                  <select value={form.warehouse_id} onChange={set("warehouse_id")} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Select Warehouse</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign Rack / Bin</label>
                  <select disabled={!form.warehouse_id} value={form.bin_id} onChange={set("bin_id")} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Select Available Bin</option>
                    {bins.filter(b => b.warehouse_id === parseInt(form.warehouse_id)).map(b => (
                      <option key={b.id} value={b.id} disabled={b.status === 'Occupied' && b.id !== form.bin_id}>
                        {b.rack_code} · {b.bin_code} {b.status === 'Occupied' ? '(OCCUPIED)' : '(AVAILABLE)'}
                      </option>
                    ))}
                  </select>
                  <div style={{ fontSize: 10, marginTop: 5, color: 'var(--text-muted)' }}>
                    {warehouses.find(w => w.id === parseInt(form.warehouse_id)) && (
                      <span>Available space: {bins.filter(b => b.warehouse_id === parseInt(form.warehouse_id) && b.status === 'Empty').length} bins</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal 
          title="Delete Product" 
          type="danger"
          confirmText="Delete Anyway"
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={handleDelete}
          loading={loading}
        >
          <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this product? This action cannot be undone.</p>
        </Modal>
      )}

      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div className="section-title">Product List <span>({products.length} items)</span></div>
        </div>
        <div className="table-wrap">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📦</div>
              <p>No products found. Start by adding one!</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  {user.role === 'admin' && <th>Supplier</th>}
                  {user.role !== 'supplier' && <th>Location (WH / Rack / Bin)</th>}
                  <th>Price</th>
                  {user.role !== 'supplier' && <th>Barcode</th>}
                  {user.role !== 'supplier' && <th>Stock</th>}
                  {user.role !== 'supplier' && <th>Status</th>}
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p => {
                  const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                       (p.barcode && p.barcode.toLowerCase().includes(searchTerm.toLowerCase()));
                  const matchesSupplier = supplierFilter === "all" || 
                                         (supplierFilter === "in-house" && !p.supplier_id) || 
                                         (p.supplier_id === parseInt(supplierFilter));
                  return matchesSearch && matchesSupplier;
                }).map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 10, opacity: 0.6 }}>{p.type === 'raw_material' ? 'Raw Material' : 'Finished Good'}</div>
                    </td>
                    {user.role === 'admin' && (
                      <td>
                        <span className="pill purple" style={{ fontSize: 10 }}>{p.supplier_name || 'In-house'}</span>
                      </td>
                    )}
                    {user.role !== 'supplier' && (
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span className="pill blue" style={{ fontSize: 10 }}>{p.warehouse_name || 'Unassigned'}</span>
                          {p.locations && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {p.locations.split(', ').map(loc => (
                                <span key={loc} className="pill purple" style={{ fontSize: 9 }}>{loc}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                    <td style={{ color: "#10b981", fontWeight: 600 }}>
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </td>
                    {user.role !== 'supplier' && (
                      <td>
                        <span style={{ fontFamily: "monospace", color: "var(--accent-2)", fontSize: 12 }}>
                          {p.barcode || "—"}
                        </span>
                      </td>
                    )}
                    {user.role !== 'supplier' && (
                      <td style={{ fontWeight: 600 }}>
                        {p.stock || 0} <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>{p.uom || 'units'}</span>
                      </td>
                    )}
                    {user.role !== 'supplier' && <td>{getStockPill(p.stock)}</td>}
                    <td style={{ textAlign: "right" }}>
                      {/* {user.role !== 'supplier' && (
                        <>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)} style={{ padding: "5px 10px", fontSize: 12, marginRight: 5 }}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(p.id)} style={{ padding: "5px 10px", fontSize: 12 }}>
                            Delete
                          </button>
                        </>
                      )} */}
                       {(
                        <>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)} style={{ padding: "5px 10px", fontSize: 12, marginRight: 5 }}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(p.id)} style={{ padding: "5px 10px", fontSize: 12 }}>
                            Delete
                          </button>
                        </>
                      )}
                      {/* {user.role === 'supplier' && (
                        <button className="btn btn-secondary btn-sm" disabled style={{ padding: "5px 10px", fontSize: 12, opacity: 0.5 }}>
                          Read Only
                        </button>
                      )} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
