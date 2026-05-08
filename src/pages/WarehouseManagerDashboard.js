import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Grid, PerspectiveCamera, PivotControls } from "@react-three/drei";
import { API } from "../config";
import Modal from "../components/Modal";

/* ---------------------- Helpers ---------------------- */

const getStatusColor = (ratio) => {
  if (ratio <= 0) return "#94a3b8"; 
  if (ratio <= 0.25) return "#ef4444"; 
  if (ratio <= 0.5) return "#f59e0b"; 
  return "#22c55e"; 
};

const calculateGeo = (baseLat, baseLng, offset) => {
  if (!baseLat || !baseLng) return { lat: "-", lng: "-" };
  const latMeters = 111111;
  const lngMeters = 111111 * Math.cos(baseLat * Math.PI / 180);
  const newLat = baseLat - (offset[2] / latMeters);
  const newLng = baseLng + (offset[0] / lngMeters);
  return { lat: newLat.toFixed(7), lng: newLng.toFixed(7) };
};

/* ---------------------- 3D Components ---------------------- */

function Bin3D({ bin, position, onSelect, selected, hideLabels }) {
  const stock = bin.stock || 0;
  const capacity = bin.capacity || 5000;
  const fillRatio = Math.max(0, Math.min(stock / capacity, 1));
  const fillHeight = Math.max(fillRatio * 1.8, stock > 0 ? 0.08 : 0);
  const statusColor = getStatusColor(fillRatio);
  const isLow = fillRatio > 0 && fillRatio <= 0.25;

  const contentRef = React.useRef();
  useFrame((state) => {
    if (isLow && contentRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      contentRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(bin); }} castShadow receiveShadow>
        <boxGeometry args={[1.8, 2, 1.8]} />
        <meshStandardMaterial color={selected ? "#4f46e5" : "#e5e7eb"} transparent opacity={0.8} />
      </mesh>
      {stock > 0 && (
        <mesh ref={contentRef} position={[0, -1 + fillHeight / 2, 0]} castShadow>
          <boxGeometry args={[1.5, fillHeight, 1.5]} />
          <meshStandardMaterial color={statusColor} emissive={isLow ? statusColor : "#000000"} emissiveIntensity={isLow ? 0.5 : 0} />
        </mesh>
      )}
      {!hideLabels && (
        <Html position={[0, 1.35, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{ background: isLow ? "#ef4444" : "rgba(255,255,255,0.9)", color: isLow ? "white" : "#111827", padding: "2px 6px", borderRadius: 4, fontSize: 8, fontWeight: 800, whiteSpace: "nowrap", border: "1px solid #e5e7eb", boxShadow: isLow ? "0 0 10px rgba(239, 68, 68, 0.5)" : "none" }}>
            {isLow ? "⚠️ " : ""}{bin.bin_code}
          </div>
        </Html>
      )}
    </group>
  );
}

function Rack3D({ rackCode, bins, position, onSelectBin, selectedBin, hideLabels, onMove }) {
  const columns = 2;
  const colGap = 2.4;
  const rowGap = 2.5;
  const rackRef = React.useRef();

  return (
    <group position={position}>
      <PivotControls anchor={[0, -1, 0]} depthTest={false} scale={2} lineWidth={2} fixed={true} 
        onDragEnd={() => {
          if (rackRef.current) {
            const worldPos = new THREE.Vector3();
            rackRef.current.getWorldPosition(worldPos);
            onMove(rackCode, [worldPos.x, 0, worldPos.z]);
          }
        }}
      >
        <group ref={rackRef}>
          <mesh position={[0.8, -1.2, 2.5]} receiveShadow><boxGeometry args={[6.2, 0.2, 8.2]} /><meshStandardMaterial color="#64748b" /></mesh>
          {!hideLabels && (
            <Html position={[0.8, 4.2, 2.5]} center style={{ pointerEvents: 'none' }}>
              <div style={{ background: "#ffffff", color: "#2563eb", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb" }}>{rackCode}</div>
            </Html>
          )}
          {bins.map((bin, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            return <Bin3D key={bin.id} bin={bin} position={[col * colGap - 1.2, 0, row * rowGap]} onSelect={onSelectBin} selected={selectedBin?.id === bin.id} hideLabels={hideLabels} />;
          })}
        </group>
      </PivotControls>
    </group>
  );
}

/* ---------------------- Main Dashboard Page ---------------------- */

export default function WarehouseManagerDashboard({ products: allProducts, push, user }) {
  const [activeTab, setActiveTab] = useState("3d-view");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [selectedBin, setSelectedBin] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRackModal, setShowRackModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  
  const [warehouses, setWarehouses] = useState([]);
  const [bins, setBins] = useState([]);
  const [rackPositions, setRackPositions] = useState({});
  const [cityPresets, setCityPresets] = useState({});
  const [fleet, setFleet] = useState([]);

  // Barcode Scanning
  const [scanQuery, setScanQuery] = useState("");
  const [scanResult, setScanResult] = useState(null);

  // Forms
  const [prodForm, setProdForm] = useState({ name: "", price: "", barcode: "", stock: 0, warehouse_id: "", bin_id: "" });
  const [rackForm, setRackForm] = useState({ warehouse_id: "", rack_code: "", bin_count: 4 });
  const [warehouseForm, setWarehouseForm] = useState({ name: "", city: "Pune, MH" });

  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      const [wRes, bRes, pRes, cRes, fRes] = await Promise.all([
        axios.get(`${API}/warehouse`, { headers }),
        axios.get(`${API}/warehouse/bins`, { headers }),
        axios.get(`${API}/warehouse/rack-positions`, { headers }),
        axios.get(`${API}/warehouse/city-presets`, { headers }),
        axios.get(`${API}/transport/vehicles`, { headers })
      ]);
      setWarehouses(wRes.data);
      setBins(bRes.data);
      setRackPositions(pRes.data);
      setCityPresets(cRes.data);
      setFleet(fRes.data);
      if (wRes.data.length > 0 && !selectedWarehouseId) setSelectedWarehouseId(wRes.data[0].id);
    } catch (err) { console.error("Data fetch failed", err); }
  }, [selectedWarehouseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentWarehouse = useMemo(() => warehouses.find(w => String(w.id) === String(selectedWarehouseId)), [warehouses, selectedWarehouseId]);

  const rackGroups = useMemo(() => {
    const groups = {};
    const filteredBins = bins.filter(b => String(b.warehouse_id) === String(selectedWarehouseId));
    filteredBins.forEach(bin => {
      if (!groups[bin.rack_code]) groups[bin.rack_code] = [];
      const product = allProducts.find(p => p.bin_id === bin.id);
      const rackPos = rackPositions[bin.rack_code] || [0, 0, 0];
      const geo = currentWarehouse ? calculateGeo(currentWarehouse.lat, currentWarehouse.lng, rackPos) : { lat: "-", lng: "-" };
      groups[bin.rack_code].push({ ...bin, product_name: product?.name || "", stock: product?.stock || 0, capacity: bin.capacity || 5000, geo_lat: geo.lat, geo_lng: geo.lng });
    });
    return groups;
  }, [bins, allProducts, rackPositions, currentWarehouse, selectedWarehouseId]);

  const handleBarcodeScan = async (e) => {
    if (e && e.key !== "Enter") return;
    if (!scanQuery) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      const res = await axios.get(`${API}/inventory/lookup`, { params: { barcode: scanQuery }, headers });
      if (res.data) {
        setScanResult(res.data);
        setShowScanModal(true);
        if (res.data.type === "bin") {
          setSelectedWarehouseId(res.data.warehouse_id || selectedWarehouseId);
          const binObj = bins.find(b => b.id === res.data.id);
          if (binObj) setSelectedBin(binObj);
        }
      } else push("No data found", "error");
    } catch { push("Scan failed", "error"); } finally { setLoading(false); setScanQuery(""); }
  };

  const handleUpdateRackPosition = async (rackCode, position) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      await axios.post(`${API}/warehouse/rack-positions`, { rackCode, position }, { headers });
      setRackPositions(prev => ({ ...prev, [rackCode]: position }));
    } catch (err) { console.error("Failed to save rack position", err); }
  };

  const handleAddWarehouse = async () => {
    if (!warehouseForm.name || !warehouseForm.city) return push("Missing fields", "error");
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      const res = await axios.post(`${API}/warehouse`, warehouseForm, { headers });
      push(`Warehouse ${warehouseForm.name} created!`);
      setShowWarehouseModal(false);
      fetchData();
      setSelectedWarehouseId(res.data.id);
    } catch { push("Failed", "error"); } finally { setLoading(false); }
  };

  const handleSaveProduct = async () => {
    if (!prodForm.name || !prodForm.price) return push("Missing fields", "error");
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      await axios.post(`${API}/inventory/products`, prodForm, { headers });
      push("Inventory updated!");
      setShowAddModal(false);
      fetchData();
    } catch { push("Failed", "error"); } finally { setLoading(false); }
  };

  const handleAddRack = async () => {
    if (!rackForm.warehouse_id || !rackForm.rack_code) return push("Missing fields", "error");
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      await axios.post(`${API}/warehouse/bins/bulk`, rackForm, { headers });
      push(`Rack ${rackForm.rack_code} created!`);
      setShowRackModal(false);
      fetchData();
    } catch { push("Error", "error"); } finally { setLoading(false); }
  };

  const handleBinSelect = (bin) => {
    setSelectedBin(bin);
    setProdForm(prev => ({ ...prev, bin_id: bin.id, warehouse_id: bin.warehouse_id, name: bin.product_name || prev.name, stock: bin.stock || 0 }));
  };

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div><div className="section-title">Warehouse Manager Command Center</div><div style={{ fontSize: 12, opacity: 0.6 }}>Manage real-time inventory and spatial logistics</div></div>
          <div style={{ background: "white", padding: "6px 12px", borderRadius: 12, border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
             <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>📍 SITE:</span>
             <select value={selectedWarehouseId} onChange={(e) => { setSelectedWarehouseId(e.target.value); setSelectedBin(null); }} style={{ border: "none", outline: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", background: "transparent" }}>
               {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
             </select>
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "center", width: 240 }}>
             <span style={{ position: "absolute", left: 12, fontSize: 16 }}>🔍</span>
             <input value={scanQuery} onChange={(e) => setScanQuery(e.target.value)} onKeyDown={handleBarcodeScan} placeholder="Scan Barcode (Enter)..." style={{ width: "100%", padding: "10px 12px 10px 40px", borderRadius: 12, border: "1px solid var(--border)", fontSize: 13, background: "#f8fafc" }} />
             <div style={{ position: "absolute", right: 10, fontSize: 10, opacity: 0.4, border: "1px solid #cbd5e1", padding: "2px 4px", borderRadius: 4 }}>SCANNER</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
           <button className="btn btn-secondary" onClick={() => { if(window.confirm("Reset mock data?")) { localStorage.removeItem("prototype_mock_state_v1"); window.location.reload(); } }}>🔄 Reset</button>
           <button className="btn btn-secondary" onClick={() => setShowWarehouseModal(true)}>🏢 Add Warehouse</button>
           <button className="btn btn-secondary" onClick={() => setShowRackModal(true)}>🏗️ New Rack</button>
           <button className="btn btn-primary" onClick={() => { setProdForm({ name: "", price: "", barcode: "", stock: 0, warehouse_id: selectedWarehouseId, bin_id: "" }); setShowAddModal(true); }}>＋ Add Product</button>
        </div>
      </div>

      <div className="login-tab-row" style={{ marginBottom: 20, justifyContent: "flex-start", gap: 10 }}>
        <button className={`login-tab ${activeTab === "3d-view" ? "active" : ""}`} onClick={() => setActiveTab("3d-view")}>3D Spatial View</button>
        <button className={`login-tab ${activeTab === "geo-sync" ? "active" : ""}`} onClick={() => setActiveTab("geo-sync")}>Geo-Sync Tracking</button>
        <button className={`login-tab ${activeTab === "inventory" ? "active" : ""}`} onClick={() => setActiveTab("inventory")}>Inventory List</button>
      </div>

      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {activeTab === "3d-view" && (
          <div style={{ display: "flex", height: "100%", gap: 20 }}>
            <div style={{ flex: 1, background: "#f8fafc", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", position: "relative" }}>
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 20, 30]} /><OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} /><ambientLight intensity={0.7} /><directionalLight position={[10, 20, 10]} intensity={1.5} castShadow /><Grid position={[0, -1.2, 0]} args={[100, 100]} cellSize={1} sectionSize={5} cellColor="#cbd5e1" sectionColor="#94a3b8" />
                {Object.keys(rackGroups).map((code, idx) => {
                  const savedPos = rackPositions[code] || [idx * 12 - 15, 0, -4];
                  return <Rack3D key={code} rackCode={code} bins={rackGroups[code]} position={savedPos} onSelectBin={handleBinSelect} selectedBin={selectedBin} hideLabels={showAddModal || showRackModal || showWarehouseModal || showScanModal} onMove={handleUpdateRackPosition} />;
                })}
              </Canvas>
              <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(255,255,255,0.8)", padding: "10px 15px", borderRadius: 12, fontSize: 11, pointerEvents: "none", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>📍 Site Geolocation</div>
                <div>{currentWarehouse?.name}: {currentWarehouse?.lat}, {currentWarehouse?.lng}</div>
              </div>
            </div>
            <div style={{ width: 320, background: "white", borderRadius: 20, border: "1px solid var(--border)", padding: 20, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: "var(--accent)" }}>Spatial Intelligence</div>
              {selectedBin ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                  <div className="stat-card c2" style={{ padding: 12 }}><div style={{ fontSize: 10, opacity: 0.6 }}>LOCATOR</div><div style={{ fontWeight: 700 }}>{selectedBin.rack_code} / {selectedBin.bin_code}</div></div>
                  <div style={{ background: "#f8fafc", padding: 15, borderRadius: 16, border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                       <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b" }}>STOCK LEVEL</div>
                       <div style={{ fontSize: 10, fontWeight: 800, color: getStatusColor(selectedBin.stock / selectedBin.capacity) }}>{Math.round((selectedBin.stock / selectedBin.capacity) * 100)}% {selectedBin.stock / selectedBin.capacity <= 0.25 ? "🚨 LOW" : "✅ STABLE"}</div>
                    </div>
                    <div style={{ width: "100%", height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${(selectedBin.stock / selectedBin.capacity) * 100}%`, height: "100%", background: getStatusColor(selectedBin.stock / selectedBin.capacity), transition: "width 0.5s ease" }} /></div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: 12, borderRadius: 12, border: "1px solid #f1f5f9" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>🛰️ GPS Coordinates</div><div style={{ fontSize: 12, fontFamily: "monospace" }}>Lat: {selectedBin.geo_lat}</div><div style={{ fontSize: 12, fontFamily: "monospace" }}>Lng: {selectedBin.geo_lng}</div></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><div style={{ background: "#f1f5f9", padding: 10, borderRadius: 10 }}><div style={{ fontSize: 9, opacity: 0.6 }}>ITEM</div><div style={{ fontWeight: 600, fontSize: 12 }}>{selectedBin.product_name || "Empty"}</div></div><div style={{ background: "#f1f5f9", padding: 10, borderRadius: 10 }}><div style={{ fontSize: 9, opacity: 0.6 }}>STOCK</div><div style={{ fontWeight: 600, fontSize: 12 }}>{selectedBin.stock} units</div></div></div>
                  <button className="btn btn-secondary" style={{ marginTop: 10, width: "100%" }} onClick={() => setShowAddModal(true)}>Modify Stock</button>
                </div>
              ) : (<div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "#94a3b8" }}><div style={{ fontSize: 40, marginBottom: 10 }}>🛰️</div><div style={{ fontSize: 12 }}>Select a bin to see its precise global GPS coordinates</div></div>)}
            </div>
          </div>
        )}

        {activeTab === "geo-sync" && (
          <div className="card fade-up" style={{ height: "100%", display: "flex", flexDirection: "column", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
               <div><div style={{ fontWeight: 700, fontSize: 16 }}>Live Global Sync Tracking</div><div style={{ fontSize: 13, opacity: 0.6 }}>Real-time GPS broadcast of warehouse assets and active fleet</div></div>
               <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", padding: "6px 12px", borderRadius: 20, border: "1px solid #dcfce7" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#166534" }}>LIVE BROADCASTING</span>
               </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 20, flex: 1, minHeight: 0 }}>
               <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                  <div className="stat-card" style={{ padding: 15, background: "var(--accent-4)", color: "white" }}><div style={{ fontSize: 10, fontWeight: 700 }}>ACTIVE SITES</div><div style={{ fontSize: 24, fontWeight: 800 }}>{warehouses.length}</div></div>
                  <div className="stat-card" style={{ padding: 15, background: "#f8fafc", border: "1px solid var(--border)" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>EN-ROUTE VEHICLES</div><div style={{ fontSize: 24, fontWeight: 800 }}>{fleet.filter(v => v.status === "On Trip").length}</div></div>
                  <div style={{ flex: 1, background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1", padding: 15, display: "flex", flexDirection: "column", overflow: "auto" }}>
                     <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 10, color: "var(--accent)" }}>Fleet Live Feed</div>
                     {fleet.filter(v => v.status === "On Trip").map(v => (
                       <div key={v.id} style={{ padding: 8, borderBottom: "1px solid #e2e8f0", fontSize: 10 }}>
                          <div style={{ fontWeight: 700 }}>🚛 {v.number}</div>
                          <div style={{ opacity: 0.6 }}>Driver: {v.driver_name}</div>
                          <div style={{ color: "#2563eb", marginTop: 4 }}>📍 Heading to: {warehouses[0]?.name}</div>
                       </div>
                     ))}
                     {fleet.filter(v => v.status === "On Trip").length === 0 && <div style={{ fontSize: 10, opacity: 0.5, textAlign: "center", marginTop: 20 }}>No active routes found.</div>}
                  </div>
               </div>

               <div style={{ background: "white", borderRadius: 20, border: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <span style={{ fontSize: 12, fontWeight: 700 }}>Active Asset & Fleet GPS Log</span>
                     <span style={{ fontSize: 10, opacity: 0.5 }}>Updated every 15s</span>
                  </div>
                  <div className="table-wrap" style={{ flex: 1 }}>
                     <table style={{ fontSize: 11 }}>
                        <thead>
                           <tr><th>Type</th><th>ID / Barcode</th><th>Current Location</th><th>Lat / Lng</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                           {/* Fleet rows */}
                           {fleet.filter(v => v.status === "On Trip").map(v => (
                             <tr key={`v-${v.id}`} style={{ background: "#eff6ff" }}>
                                <td><span className="pill blue" style={{ fontSize: 9 }}>FLEET</span></td>
                                <td style={{ fontWeight: 700 }}>{v.number}</td>
                                <td>In Transit (Near {warehouses[0]?.name})</td>
                                <td style={{ fontFamily: "monospace" }}>18.5204 / 73.8567</td>
                                <td><span className="pill green" style={{ fontSize: 9 }}>EN-ROUTE</span></td>
                             </tr>
                           ))}
                           {/* Asset rows */}
                           {bins.map(bin => {
                             const wh = warehouses.find(w => w.id === bin.warehouse_id);
                             const product = allProducts.find(p => p.bin_id === bin.id);
                             const ratio = product ? product.stock / bin.capacity : 0;
                             const rackPos = rackPositions[bin.rack_code] || [0, 0, 0];
                             const geo = wh ? calculateGeo(wh.lat, wh.lng, rackPos) : { lat: "-", lng: "-" };
                             return (
                               <tr key={bin.id}>
                                  <td><span className="pill gray" style={{ fontSize: 9 }}>ASSET</span></td>
                                  <td style={{ fontWeight: 700, color: "var(--accent)" }}>{bin.barcode}</td>
                                  <td>{wh?.name}</td>
                                  <td style={{ fontFamily: "monospace" }}>{geo.lat} / {geo.lng}</td>
                                  <td><span className={`pill ${ratio <= 0.25 ? 'red' : 'green'}`} style={{ fontSize: 9 }}>{ratio <= 0.25 ? 'LOW STOCK' : 'STABLE'}</span></td>
                               </tr>
                             );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="card fade-up"><div className="table-wrap"><table><thead><tr><th>Product</th><th>Warehouse</th><th>Bin</th><th>Level</th><th>Status</th></tr></thead><tbody>{allProducts.filter(p => String(p.warehouse_id) === String(selectedWarehouseId)).map((p) => {
            const bin = bins.find(b => b.id === p.bin_id);
            const ratio = bin ? p.stock / bin.capacity : 0;
            return (
              <tr key={p.id}>
                <td><div style={{ fontWeight: 600 }}>{p.name}</div></td>
                <td>{p.warehouse_name}</td>
                <td><span className="pill blue">{p.locations}</span></td>
                <td><div style={{ width: 60, height: 4, background: "#e2e8f0", borderRadius: 2, marginTop: 8 }}><div style={{ width: `${Math.min(ratio * 100, 100)}%`, height: "100%", background: getStatusColor(ratio), borderRadius: 2 }} /></div><div style={{ fontSize: 9, marginTop: 4, fontWeight: 700 }}>{Math.round(ratio * 100)}%</div></td>
                <td><span className={`pill ${ratio <= 0.25 ? 'red' : 'green'}`}>{ratio <= 0.25 ? '🚨 LOW STOCK' : 'STABLE'}</span></td>
              </tr>
            )})}</tbody></table></div></div>
        )}
      </div>

      {/* Modals omitted for brevity */}
      {showScanModal && scanResult && (
        <Modal title={scanResult.type === "bin" ? `Asset Found: ${scanResult.rack_code}/${scanResult.bin_code}` : `Product Found: ${scanResult.name}`} onClose={() => { setShowScanModal(false); setScanResult(null); }} hideConfirm>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
               <div style={{ background: "#f8fafc", padding: 15, borderRadius: 12 }}><div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>SITE LOCATION</div><div style={{ fontWeight: 700, fontSize: 16 }}>{scanResult.warehouse_name}</div></div>
               <div style={{ background: "#f8fafc", padding: 15, borderRadius: 12 }}><div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>BARCODE ID</div><div style={{ fontWeight: 700, fontSize: 16 }}>{scanResult.barcode}</div></div>
            </div>
            {scanResult.type === "bin" && (
              <div style={{ background: "#eff6ff", padding: 20, borderRadius: 16, border: "1px solid #dbeafe" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#1e40af", marginBottom: 12 }}>CURRENT OCCUPANCY</div>
                {scanResult.product ? (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: 700, fontSize: 18 }}>{scanResult.product.name}</div><div style={{ fontSize: 12, opacity: 0.6 }}>SKU: {scanResult.product.barcode}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 24, fontWeight: 800, color: "#1e40af" }}>{scanResult.product.stock}</div><div style={{ fontSize: 10, fontWeight: 700 }}>UNITS</div></div></div>) : (<div style={{ color: "#1e40af", opacity: 0.6, fontStyle: "italic" }}>No product assigned.</div>)}
              </div>
            )}
            <button className="btn btn-primary" onClick={() => setShowScanModal(false)} style={{ width: "100%" }}>Done</button>
          </div>
        </Modal>
      )}

      {showWarehouseModal && (
        <Modal title="Register New Warehouse Site" onClose={() => setShowWarehouseModal(false)} onConfirm={handleAddWarehouse} loading={loading}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}><div className="form-group"><label>Warehouse Name</label><input value={warehouseForm.name} onChange={e => setWarehouseForm({...warehouseForm, name: e.target.value})} /></div><div className="form-group"><label>Select City</label><select value={warehouseForm.city} onChange={e => setWarehouseForm({...warehouseForm, city: e.target.value})}>{Object.keys(cityPresets).map(city => <option key={city} value={city}>{city}</option>)}</select></div></div>
        </Modal>
      )}

      {showAddModal && (
        <Modal title={selectedBin ? `Manage Stock: ${selectedBin.rack_code}/${selectedBin.bin_code}` : "Add Product"} onClose={() => setShowAddModal(false)} onConfirm={handleSaveProduct} loading={loading}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}><div className="form-group"><label>Name</label><input value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} /></div><div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}><div className="form-group"><label>Quantity</label><input type="number" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: e.target.value})} /></div><div className="form-group"><label>Price</label><input type="number" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} /></div></div><div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}><div className="form-group"><label>Warehouse</label><select value={prodForm.warehouse_id} onChange={e => setProdForm({...prodForm, warehouse_id: e.target.value})}>{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div><div className="form-group"><label>Bin ID</label><input value={prodForm.bin_id} disabled /></div></div></div>
        </Modal>
      )}

      {showRackModal && (
        <Modal title="Create Rack" onClose={() => setShowRackModal(false)} onConfirm={handleAddRack} loading={loading}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}><div className="form-group"><label>Warehouse</label><select value={rackForm.warehouse_id} onChange={e => setRackForm({...rackForm, warehouse_id: e.target.value})}>{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div><div className="form-group"><label>Rack Code</label><input value={rackForm.rack_code} onChange={e => setRackForm({...rackForm, rack_code: e.target.value})} /></div><div className="form-group"><label>Bins</label><input type="number" value={rackForm.bin_count} onChange={e => setRackForm({...rackForm, bin_count: e.target.value})} /></div></div>
        </Modal>
      )}
    </div>
  );
}
