import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API } from "../config";
import Modal from "../components/Modal";
import MapPicker from "../components/MapPicker";
import RouteViewer from "../components/RouteViewer";

export default function Transport({ push }) {
  const [tab, setTab] = useState("shipments");
  const [vehicles, setVehicles] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Vehicle Form
  const [showVModal, setShowVModal] = useState(false);
  const [vForm, setVForm] = useState({ plate_number: "", vehicle_type: "", capacity: "", driver_name: "" });

  const [originName, setOriginName] = useState("Loading...");
  const [destinationName, setDestinationName] = useState("Loading...");

  // Shipment Form
  const [showSModal, setShowSModal] = useState(false);
  const [sForm, setSForm] = useState({ 
    order_id: "", 
    vehicle_id: "", 
    route_details: "", 
    estimated_delivery: "",
    origin_lat: null,
    origin_lng: null,
    dest_lat: null,
    dest_lng: null,
    distance_km: 0
  });

  // Map Viewer Modal
  const [selectedShipment, setSelectedShipment] = useState(null);
    const [calculatedDistance, setCalculatedDistance] = useState(
    selectedShipment?.distance_km || 0
  );

  useEffect(() => {
    if (!selectedShipment) return;

    const loadLocations = async () => {
      const fromLocation = await getLocationName(
        selectedShipment.origin_lat,
        selectedShipment.origin_lng
      );

      const toLocation = await getLocationName(
        selectedShipment.dest_lat,
        selectedShipment.dest_lng
      );

      setOriginName(fromLocation);
      setDestinationName(toLocation);
    };

    loadLocations();
  }, [selectedShipment]);


  const fetchData = useCallback(async () => {
    try {
      const [vRes, sRes] = await Promise.all([
        axios.get(`${API}/transport/vehicles`),
        axios.get(`${API}/transport/shipments`)
      ]);
      setVehicles(vRes.data);
      setShipments(sRes.data);
    } catch { push("Failed to load transport data", "error"); }
  }, [push]);

  useEffect(() => { fetchData(); }, [fetchData]);

  

    const getLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await response.json();

      return (
        data?.address?.road ||
        data?.address?.suburb ||
        data?.address?.city ||
        data?.display_name ||
        "Unknown Location"
      );
    } catch (error) {
      console.error("Location fetch error:", error);
      return "Unknown Location";
    }
  };

  const addVehicle = async () => {
    if (!vForm.plate_number) return push("Plate number is required", "error");
    setLoading(true);
    try {
      await axios.post(`${API}/transport/vehicles`, vForm);
      push("Vehicle added successfully");
      setVForm({ plate_number: "", vehicle_type: "", capacity: "", driver_name: "" });
      setShowVModal(false);
      fetchData();
    } catch { push("Error adding vehicle", "error"); }
    finally { setLoading(false); }
  };

  const createShipment = async () => {
    if (!sForm.vehicle_id || !sForm.order_id) return push("Vehicle and Order ID are required", "error");
    if (!sForm.origin_lat || !sForm.dest_lat) return push("Please select route on map", "error");
    
    setLoading(true);
    try {
      await axios.post(`${API}/transport/shipments`, sForm);
      push("Shipment dispatched!");
      setSForm({ 
        order_id: "", vehicle_id: "", route_details: "", estimated_delivery: "",
        origin_lat: null, origin_lng: null, dest_lat: null, dest_lng: null, distance_km: 0
      });
      setShowSModal(false);
      fetchData();
    } catch { push("Error dispatching shipment", "error"); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/transport/shipments/${id}/status`, { status });
      push(`Shipment marked as ${status}`);
      fetchData();
    } catch { push("Error updating status", "error"); }
  };

  return (
    <div className="fade-up">
      <div className="login-tab-row" style={{ marginBottom: 24, justifyContent: "flex-start", gap: 10 }}>
        <button className={`login-tab ${tab === "shipments" ? "active" : ""}`} onClick={() => setTab("shipments")}>Active Shipments</button>
        <button className={`login-tab ${tab === "vehicles" ? "active" : ""}`} onClick={() => setTab("vehicles")}>Fleet Management</button>
      </div>

      {tab === "vehicles" && (
        <>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <div className="section-title">Fleet Directory</div>
            <button className="btn btn-primary" onClick={() => setShowVModal(true)}>＋ Register Vehicle</button>
          </div>

          {showVModal && (
            <Modal title="Register New Vehicle" onClose={() => setShowVModal(false)} onConfirm={addVehicle} loading={loading}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group"><label>Plate Number</label><input value={vForm.plate_number} onChange={e => setVForm({...vForm, plate_number: e.target.value})} placeholder="e.g. MH-12-AB-1234" /></div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group"><label>Vehicle Type</label><input value={vForm.vehicle_type} onChange={e => setVForm({...vForm, vehicle_type: e.target.value})} placeholder="e.g. Truck, Van" /></div>
                  <div className="form-group"><label>Capacity</label><input value={vForm.capacity} onChange={e => setVForm({...vForm, capacity: e.target.value})} placeholder="e.g. 5 Ton" /></div>
                </div>
                <div className="form-group"><label>Driver Name</label><input value={vForm.driver_name} onChange={e => setVForm({...vForm, driver_name: e.target.value})} /></div>
              </div>
            </Modal>
          )}

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Plate #</th><th>Type</th><th>Capacity</th><th>Driver</th><th>Status</th></tr></thead>
                <tbody>
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 700 }}>{v.plate_number}</td>
                      <td>{v.vehicle_type}</td>
                      <td>{v.capacity}</td>
                      <td>{v.driver_name}</td>
                      <td><span className={`pill ${v.status === 'Available' ? 'green' : 'yellow'}`}>{v.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "shipments" && (
        <>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <div className="section-title">Delivery Routes & Navigation</div>
            <button className="btn btn-primary" onClick={() => setShowSModal(true)}>＋ Dispatch New Shipment</button>
          </div>

          {showSModal && (
            <Modal title="Dispatch Shipment" onClose={() => setShowSModal(false)} onConfirm={createShipment} loading={loading}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group"><label>Select Route & Calculate Distance</label>
                  <MapPicker onSelect={(data) => setSForm(prev => ({...prev, ...data}))} />
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group"><label>Order Reference #</label><input value={sForm.order_id} onChange={e => setSForm({...sForm, order_id: e.target.value})} placeholder="e.g. SO-1042" /></div>
                  <div className="form-group"><label>Distance (kms)</label><input value={sForm.distance_km} readOnly style={{ background: 'var(--bg-card)' }} /></div>
                </div>
                <div className="form-group">
                  <label>Assign Vehicle</label>
                  <select value={sForm.vehicle_id} onChange={e => setSForm({...sForm, vehicle_id: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Select Available Vehicle</option>
                    {vehicles.filter(v => v.status === 'Available').map(v => (
                      <option key={v.id} value={v.id}>{v.plate_number} ({v.driver_name})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group"><label>Navigation Notes</label><textarea value={sForm.route_details} onChange={e => setSForm({...sForm, route_details: e.target.value})} placeholder="Enter delivery instructions..." style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', minHeight: 60 }} /></div>
                <div className="form-group"><label>Est. Delivery Date</label><input type="date" value={sForm.estimated_delivery} onChange={e => setSForm({...sForm, estimated_delivery: e.target.value})} /></div>
              </div>
            </Modal>
          )}

         {selectedShipment && (
  <Modal
    title={`Navigation: Shipment #SHP-${selectedShipment.id}`}
    onClose={() => setSelectedShipment(null)}
    hideConfirm
  >
    <RouteViewer
      shipment={selectedShipment}
      onDistanceChange={(distanceKm) => {
        setCalculatedDistance(distanceKm);
      }}
    />

    <div
      style={{
        marginTop: 16,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <strong>From:</strong> {originName}
      </div>

      <div>
        <strong>To:</strong> {destinationName}
      </div>

      <div>
        <strong>Total Distance:</strong> {calculatedDistance} km
      </div>
    </div>
  </Modal>
)}

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Shipment ID</th><th>Order #</th><th>Vehicle</th><th>Distance</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {shipments.map(s => (
                    <tr key={s.id}>
                      <td style={{ color: "var(--accent)", fontWeight: 700 }}>#SHP-{s.id}</td>
                      <td>{s.order_id}</td>
                      <td>{s.plate_number} <br/><small style={{color:'var(--text-secondary)'}}>{s.driver_name}</small></td>
                      <td>{s.distance_km ? `${s.distance_km} km` : 'N/A'}</td>
                      <td><span className={`pill ${s.status === 'Pending' ? 'yellow' : s.status === 'In Transit' ? 'cyan' : 'green'}`}>{s.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedShipment(s)}>📍 Map</button>
                          {s.status === 'Pending' && <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(s.id, 'In Transit')}>Start</button>}
                          {s.status === 'In Transit' && <button className="btn btn-primary btn-sm" onClick={() => updateStatus(s.id, 'Delivered')}>Finish</button>}
                        </div>
                      </td>
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

