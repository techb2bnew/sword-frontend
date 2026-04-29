import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API } from "../config";
import Modal from "../components/Modal";

export default function Warehouse({ products, push }) {
  const [tab, setTab] = useState("locations");
  const [warehouses, setWarehouses] = useState([]);
  const [bins, setBins] = useState([]);
  const [movements, setMovements] = useState([]);
  const [selectedWhId, setSelectedWhId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Warehouse Form
  const [showWModal, setShowWModal] = useState(false);
  const [wForm, setWForm] = useState({ name: "", location: "", capacity_sqft: "", manager_name: "" });

  // Transfer Form
  const [showTModal, setShowTModal] = useState(false);
  const [tForm, setTForm] = useState({ product_id: "", from_warehouse_id: "", to_warehouse_id: "", to_bin_id: "", quantity: "", reason: "" });

  const fetchData = useCallback(async () => {
    try {
      const [wRes, mRes, bRes] = await Promise.all([
        axios.get(`${API}/warehouse`),
        axios.get(`${API}/warehouse/movements`),
        axios.get(`${API}/warehouse/bins`)
      ]);
      setWarehouses(wRes.data);
      if (wRes.data.length > 0 && !selectedWhId) setSelectedWhId(wRes.data[0].id);
      setMovements(mRes.data);
      setBins(bRes.data);
    } catch { push("Failed to load warehouse data", "error"); }
  }, [push]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addWarehouse = async () => {
    if (!wForm.name) return push("Warehouse name is required", "error");
    setLoading(true);
    try {
      await axios.post(`${API}/warehouse`, wForm);
      push("Warehouse added successfully");
      setWForm({ name: "", location: "", capacity_sqft: "", manager_name: "" });
      setShowWModal(false);
      fetchData();
    } catch { push("Error adding warehouse", "error"); }
    finally { setLoading(false); }
  };

  const createTransfer = async () => {
    if (!tForm.product_id || !tForm.to_warehouse_id || !tForm.quantity) return push("Missing required fields", "error");
    setLoading(true);
    try {
      await axios.post(`${API}/warehouse/movements`, tForm);
      push("Stock transfer completed!");
      setTForm({ product_id: "", from_warehouse_id: "", to_warehouse_id: "", to_bin_id: "", quantity: "", reason: "" });
      setShowTModal(false);
      fetchData();
    } catch { push("Error transferring stock", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fade-up">
      <div className="login-tab-row" style={{ marginBottom: 24, justifyContent: "flex-start", gap: 10 }}>
        <button className={`login-tab ${tab === "locations" ? "active" : ""}`} onClick={() => setTab("locations")}>Warehouses</button>
        <button className={`login-tab ${tab === "bins" ? "active" : ""}`} onClick={() => setTab("bins")}>Bins & Racks</button>
        <button className={`login-tab ${tab === "movements" ? "active" : ""}`} onClick={() => setTab("movements")}>Stock Movements</button>
      </div>

      {tab === "locations" && (
        <>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <div className="section-title">Warehouse Management</div>
            <button className="btn btn-primary" onClick={() => setShowWModal(true)}>＋ New Warehouse</button>
          </div>

          {showWModal && (
            <Modal title="Add New Warehouse" onClose={() => setShowWModal(false)} onConfirm={addWarehouse} loading={loading}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group"><label>Warehouse Name</label><input value={wForm.name} onChange={e => setWForm({...wForm, name: e.target.value})} placeholder="e.g. South Zone Hub" /></div>
                <div className="form-group"><label>Location / Address</label><input value={wForm.location} onChange={e => setWForm({...wForm, location: e.target.value})} /></div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group"><label>Capacity (Sqft)</label><input type="number" value={wForm.capacity_sqft} onChange={e => setWForm({...wForm, capacity_sqft: e.target.value})} /></div>
                  <div className="form-group"><label>Manager Name</label><input value={wForm.manager_name} onChange={e => setWForm({...wForm, manager_name: e.target.value})} /></div>
                </div>
              </div>
            </Modal>
          )}

          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {warehouses.map(w => (
              <div key={w.id} className="stat-card c2">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                  <div className="stat-icon i2">🏠</div>
                  <span className="pill green">{w.status}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>{w.name}</div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 15 }}>{w.location}</div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span>Manager: {w.manager_name}</span>
                  <span>Cap: {w.capacity_sqft}sqft</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "bins" && (
        <>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <div className="section-title">Warehouse Layout & Occupancy</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="pill blue" style={{ padding: '8px 15px' }}>Total Bins: {bins.length}</div>
              <div className="pill green" style={{ padding: '8px 15px' }}>Available: {bins.filter(b => b.status === 'Empty').length}</div>
              <div className="pill yellow" style={{ padding: '8px 15px' }}>Occupied: {bins.filter(b => b.status === 'Occupied').length}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <select 
                className="btn btn-secondary" 
                style={{ width: 200, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                value={selectedWhId || ""}
                onChange={(e) => setSelectedWhId(parseInt(e.target.value))}
              >
                <option value="">All Warehouses</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <button className="btn btn-primary" onClick={() => push("Feature coming soon!")}>＋ Add New Rack</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 30 }}>
            {Array.from(new Set(bins
              .filter(b => !selectedWhId || b.warehouse_id === selectedWhId)
              .map(b => b.rack_code)
            )).map(rack => (
              <div key={rack} style={{ flex: '1 1 300px', minWidth: 300 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="pill purple" style={{ padding: '4px 12px' }}>Rack: {rack}</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                  {bins
                    .filter(b => b.rack_code === rack && (!selectedWhId || b.warehouse_id === selectedWhId))
                    .map(bin => (
                    <div 
                      key={bin.id} 
                      className={`card ${bin.status === 'Occupied' ? 'occupied' : 'empty'}`}
                      style={{ 
                        padding: 12, 
                        border: '1px solid var(--border)', 
                        background: bin.status === 'Occupied' ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderRadius: 12
                      }}
                      onClick={() => {
                        setTForm({ ...tForm, to_bin_id: bin.id, to_warehouse_id: bin.warehouse_id });
                        setShowTModal(true);
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{bin.bin_code}</div>
                        <div className={`status-dot ${bin.status === 'Occupied' ? 'active' : ''}`} style={{ width: 8, height: 8, borderRadius: '50%', background: bin.status === 'Occupied' ? '#10b981' : '#cbd5e1' }}></div>
                      </div>
                      
                      {bin.status === 'Occupied' ? (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-1)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bin.product_name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Qty: {bin.product_stock} {bin.uom}</div>
                        </>
                      ) : (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>Empty - Click to Assign</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "movements" && (
        <>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <div className="section-title">Internal Stock Transfers</div>
            <button className="btn btn-primary" onClick={() => setShowTModal(true)}>＋ Record Movement</button>
          </div>

          {showTModal && (
            <Modal title="Record Stock Movement" onClose={() => setShowTModal(false)} onConfirm={createTransfer} loading={loading}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group">
                  <label>Product</label>
                  <select value={tForm.product_id} onChange={e => setTForm({...tForm, product_id: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Select Item</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Current Stock: {p.stock})</option>)}
                  </select>
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label>From Warehouse</label>
                    <select value={tForm.from_warehouse_id} onChange={e => setTForm({...tForm, from_warehouse_id: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                      <option value="">Select Origin</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>To Warehouse</label>
                    <select value={tForm.to_warehouse_id} onChange={e => setTForm({...tForm, to_warehouse_id: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                      <option value="">Select Destination</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label>Target Rack / Bin</label>
                    <select disabled={!tForm.to_warehouse_id} value={tForm.to_bin_id} onChange={e => setTForm({...tForm, to_bin_id: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                      <option value="">Select Bin</option>
                      {bins.filter(b => b.warehouse_id === parseInt(tForm.to_warehouse_id)).map(b => (
                        <option key={b.id} value={b.id}>{b.rack_code} · {b.bin_code} ({b.status})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="number" value={tForm.quantity} onChange={e => setTForm({...tForm, quantity: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <input value={tForm.reason} onChange={e => setTForm({...tForm, reason: e.target.value})} placeholder="e.g. Weekly replenishment" />
                </div>
              </div>
            </Modal>
          )}

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Item</th><th>From</th><th>To (WH / Bin)</th><th>Qty</th><th>Reason</th></tr></thead>
                <tbody>
                  {movements.map(m => (
                    <tr key={m.id}>
                      <td>{new Date(m.movement_date).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>{m.product_name}</td>
                      <td><span className="pill yellow">{m.from_warehouse || "External"}</span></td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{m.to_warehouse}</div>
                        {m.to_rack && <div style={{ fontSize: 10, opacity: 0.6 }}>Rack: {m.to_rack} · Bin: {m.to_bin}</div>}
                      </td>
                      <td style={{ fontWeight: 700 }}>{m.quantity}</td>
                      <td style={{ fontSize: 12, opacity: 0.7 }}>{m.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
