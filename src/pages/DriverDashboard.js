import React, { useState, useMemo, useEffect } from "react";
import { useMockStoreSnapshot } from "../mockData/mockHooks";
import { actions } from "../mockData/mockStore";
import { API } from "../config";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function warehouseMapIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:36px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:18px;">🏢</div>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20],
  });
}

function deliveryMapIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:36px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:18px;">📍</div>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20],
  });
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    const valid = positions.filter((p) => p && p.length === 2 && isFinite(p[0]) && isFinite(p[1]));
    if (valid.length >= 2) map.fitBounds(valid, { padding: [50, 50], maxZoom: 14 });
    else if (valid.length === 1) map.setView(valid[0], 14);
  }, [map, positions]);
  return null;
}

const STATUS_CFG = {
  assigned: { color: "#f5a623", bg: "rgba(245,166,35,0.1)", label: "Assigned" },
  picking: { color: "#4a90e2", bg: "rgba(74,144,226,0.1)", label: "Picking" },
  in_transit: { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", label: "In Transit" },
  delivered: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "Delivered" },
};

const cardStyle = {
  background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function DriverDashboard({ push }) {
  const [tab, setTab] = useState("dashboard");
  const [navAssignment, setNavAssignment] = useState(null); // assignment being navigated

  const assignments = useMockStoreSnapshot((s) => s?.driver?.assignments || []);
  const notifications = useMockStoreSnapshot((s) => s?.driver?.notifications || []);
  const allBins = useMockStoreSnapshot((s) => s?.warehouse?.bins || []);
  const rackPositions = useMockStoreSnapshot((s) => s?.warehouse?.rack_positions || {});
  const inventoryProducts = useMockStoreSnapshot((s) => s?.inventory?.products || []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const activeAssignment = assignments.find((a) => a.status === "assigned" || a.status === "picking");
  const completedToday = assignments.filter((a) => a.status === "delivered").length;
  const totalItems = assignments.filter((a) => a.status !== "delivered").reduce((s, a) => s + a.items.filter((i) => !i.picked).length, 0);

  const openNavigation = (assignment) => {
    setNavAssignment(assignment);
    setTab("navigate");
  };

  const openDelivery = (assignment) => {
    setNavAssignment(assignment);
    setTab("delivery");
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>🚛 Driver Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>Your assignments, pick lists & delivery routes</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "2px solid var(--border)" }}>
        {[
          { id: "dashboard", label: "Dashboard", icon: "📊" },
          { id: "navigate", label: "Warehouse Navigation", icon: "🗺️" },
          { id: "delivery", label: "Delivery Route", icon: "📍" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "12px 20px", background: "transparent",
              color: tab === t.id ? "var(--accent)" : "var(--text-muted)",
              border: "none", borderBottom: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
              cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 700 : 500, fontFamily: "Inter",
              whiteSpace: "nowrap", marginBottom: -2,
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <DashboardTab
          assignments={assignments}
          notifications={notifications}
          unreadCount={unreadCount}
          activeAssignment={activeAssignment}
          completedToday={completedToday}
          totalItems={totalItems}
          onNavigate={openNavigation}
          onDeliver={openDelivery}
          push={push}
        />
      )}
      {tab === "navigate" && (
        <NavigateTab
          assignment={navAssignment || activeAssignment}
          allBins={allBins}
          rackPositions={rackPositions}
          inventoryProducts={inventoryProducts}
          push={push}
        />
      )}
      {tab === "delivery" && (
        <DeliveryTab
          assignment={navAssignment || activeAssignment}
          push={push}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1: Dashboard
// ═══════════════════════════════════════════════════════════════════════════════

function DashboardTab({ assignments, notifications, unreadCount, activeAssignment, completedToday, totalItems, onNavigate, onDeliver, push }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSimulateAssignment = () => {
    actions.assignOrderToDriver({
      warehouse_id: 1,
      warehouse_name: "Warehouse A",
      warehouse_lat: 18.5089,
      warehouse_lng: 73.9259,
      delivery_address: "New Customer Site, Baner, Pune",
      delivery_lat: 18.5597,
      delivery_lng: 73.7799,
      total_distance_km: 15.2,
      items: [
        { product_id: 1001, product_name: "Red Chilli Powder", quantity: 50, unit: "kg", bin_id: 1, rack_code: "R-B1", bin_code: "B-201", bin_location: "R-B1/B-201", barcode: "SKU-CHILLI-RED" },
        { product_id: 1002, product_name: "Corrugated Boxes", quantity: 200, unit: "pcs", bin_id: 2, rack_code: "R-B1", bin_code: "B-201", bin_location: "R-B1/B-201", barcode: "SKU-BOX-CORR" }
      ]
    });
    if (push) push("🔔 New order assigned! Check notifications.", "success");
  };

  const handleMarkAllRead = () => {
    actions.markAllDriverNotificationsRead();
    if (push) push("All notifications marked as read", "success");
  };

  return (
    <>
      {/* Simulation Trigger (For Demo) */}
      <div style={{ marginBottom: 20, textAlign: "right" }}>
        <button 
          onClick={handleSimulateAssignment}
          style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px dashed #6366f1", color: "#6366f1", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          ➕ Simulate New Assignment
        </button>
      </div>

      {/* Notification Banner */}
      {unreadCount > 0 && (
        <div
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            padding: "14px 20px", marginBottom: 20, borderRadius: 12, cursor: "pointer",
            background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{unreadCount} unread notification{unreadCount > 1 ? "s" : ""}</span>
          </div>
          <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{showNotifications ? "Hide" : "Show"} ▾</span>
        </div>
      )}

      {/* Notification List */}
      {showNotifications && (
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
            <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", fontSize: 12, color: "var(--accent)", cursor: "pointer", fontWeight: 600, fontFamily: "Inter" }}>Mark all read</button>
          </div>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => { if (!n.is_read) actions.markDriverNotificationRead(n.id); }}
              style={{
                padding: "12px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                background: n.is_read ? "transparent" : "rgba(37,99,235,0.03)",
                display: "flex", gap: 12, alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 16, marginTop: 2 }}>{n.type === "assignment" ? "📋" : n.type === "reminder" ? "⏰" : "ℹ️"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: 13 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{n.message}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{timeAgo(n.created_at)}</div>
              {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", marginTop: 6, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "📋", label: "Total Assignments", value: assignments.length, color: "#4a90e2" },
          { icon: "✅", label: "Delivered", value: completedToday, color: "#22c55e" },
          { icon: "📦", label: "Items to Pick", value: totalItems, color: "#f5a623" },
          { icon: "🚛", label: "Active", value: assignments.filter((a) => a.status !== "delivered").length, color: "#7c3aed" },
        ].map((k) => (
          <div key={k.label} style={{ ...cardStyle, padding: "16px 20px", borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Assignment List */}
      <div style={cardStyle}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>My Assignments</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-base)" }}>
                {["Shipment", "Warehouse", "Vehicle", "Items", "Delivery To", "Distance", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, i) => {
                const sc = STATUS_CFG[a.status] || STATUS_CFG.assigned;
                const pickedCount = a.items.filter((it) => it.picked).length;
                return (
                  <tr key={a.id} style={{ borderBottom: i < assignments.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--accent)" }}>{a.shipment_id}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>{a.warehouse_name}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12 }}>{a.vehicle_number}</td>
                    <td style={{ padding: "12px 14px" }}>{pickedCount}/{a.items.length} picked</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.delivery_address}</td>
                    <td style={{ padding: "12px 14px" }}>{a.total_distance_km} km</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {(a.status === "assigned" || a.status === "picking") && (
                          <button onClick={() => onNavigate(a)} style={{ padding: "4px 12px", background: "rgba(74,144,226,0.1)", border: "1px solid #4a90e244", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Inter", color: "#4a90e2", fontWeight: 600 }}>Navigate</button>
                        )}
                        {a.status === "in_transit" && (
                          <button onClick={() => onDeliver(a)} style={{ padding: "4px 12px", background: "rgba(124,58,237,0.1)", border: "1px solid #7c3aed44", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Inter", color: "#7c3aed", fontWeight: 600 }}>Deliver</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Indoor Warehouse Floor Plan (SVG-based spatial map)
// ═══════════════════════════════════════════════════════════════════════════════

function WarehouseFloorPlan({ warehouseBins, rackPositions, targetBinIds, pickSequence, warehouseName, inventoryProducts }) {
  // Layout constants
  const SCALE = 16; // pixels per meter
  const BIN_COLS = 2; // bins per row inside a rack (matching the 3D view's 2-column layout)
  const BIN_W = 54;
  const BIN_H = 36;
  const BIN_GAP = 6;
  const RACK_PAD = 10;
  const RACK_LABEL_H = 26;
  const PADDING = 100;
  const AISLE_W = 30;

  const racksWithPos = useMemo(() => {
    const racks = {};
    for (const bin of warehouseBins) {
      if (!racks[bin.rack_code]) racks[bin.rack_code] = { code: bin.rack_code, bins: [], pos: rackPositions[bin.rack_code] || [0, 0, 0] };
      racks[bin.rack_code].bins.push(bin);
    }
    // If no stored positions, auto-layout racks in a row with spacing
    const vals = Object.values(racks);
    const hasPositions = vals.some((r) => r.pos[0] !== 0 || r.pos[2] !== 0);
    if (!hasPositions && vals.length > 1) {
      vals.forEach((r, i) => { r.pos = [i * 14, 0, 0]; }); // ~14m spacing between racks
    }
    return vals;
  }, [warehouseBins, rackPositions]);

  // Compute dynamic rack dimensions based on bin count
  const rackDims = (binCount) => {
    const cols = Math.min(binCount, BIN_COLS);
    const rows = Math.ceil(binCount / BIN_COLS);
    const w = RACK_PAD * 2 + cols * BIN_W + (cols - 1) * BIN_GAP;
    const h = RACK_LABEL_H + RACK_PAD + rows * BIN_H + (rows - 1) * BIN_GAP + RACK_PAD;
    return { w, h, cols, rows };
  };

  // Build product lookup for bin -> product name and stock
  const binProductMap = useMemo(() => {
    const map = {};
    for (const p of (inventoryProducts || [])) {
      if (p.bin_id) map[p.bin_id] = { name: p.name, stock: p.stock || 0, uom: p.uom || "" };
    }
    return map;
  }, [inventoryProducts]);

  // Compute SVG viewport
  const { svgW, svgH, rackRects, entrance } = useMemo(() => {
    if (racksWithPos.length === 0) return { svgW: 500, svgH: 400, rackRects: [], entrance: { x: 0, y: 0 } };

    let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
    const tempRects = racksWithPos.map((r) => {
      const d = rackDims(r.bins.length);
      const px = r.pos[0] * SCALE;
      const pz = r.pos[2] * SCALE;
      minX = Math.min(minX, px);
      maxX = Math.max(maxX, px + d.w);
      minZ = Math.min(minZ, pz);
      maxZ = Math.max(maxZ, pz + d.h);
      return { ...r, rw: d.w, rh: d.h, rawX: px, rawZ: pz };
    });

    const offsetX = -minX + PADDING;
    const offsetZ = -minZ + PADDING + 50;
    const w = Math.max(500, maxX - minX + PADDING * 2);
    const h = Math.max(400, maxZ - minZ + PADDING * 2 + 50);

    const rects = tempRects.map((r) => {
      const x = r.rawX + offsetX;
      const y = r.rawZ + offsetZ;
      const hasTarget = r.bins.some((b) => targetBinIds.has(b.id));
      return { ...r, x, y, hasTarget };
    });

    const ent = { x: w / 2, y: 30 };
    return { svgW: w, svgH: h, rackRects: rects, entrance: ent };
  }, [racksWithPos, targetBinIds]);

  // Walking path
  const pathPoints = useMemo(() => {
    const points = [entrance];
    for (const stop of pickSequence) {
      const rack = rackRects.find((r) => r.code === stop.rack_code);
      if (rack) points.push({ x: rack.x + rack.rw / 2, y: rack.y + rack.rh / 2 });
    }
    points.push(entrance);
    return points;
  }, [entrance, pickSequence, rackRects]);

  const pathD = pathPoints.length > 1 ? "M " + pathPoints.map((p) => `${p.x} ${p.y}`).join(" L ") : "";

  if (racksWithPos.length === 0) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No rack/bin data available for this warehouse.</div>;
  }

  return (
    <>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>🗺️ Indoor Warehouse Map &mdash; {warehouseName}</span>
        <div style={{ display: "flex", gap: 14, fontSize: 11, flexWrap: "wrap" }}>
          <span><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "#2563eb", marginRight: 4, verticalAlign: "middle" }} />Pick target</span>
          <span><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "#e2e8f0", marginRight: 4, verticalAlign: "middle" }} />Other bins</span>
          <span><span style={{ display: "inline-block", width: 14, height: 3, background: "#f97316", borderRadius: 1, marginRight: 4, verticalAlign: "middle" }} />Walking path</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#22c55e", marginRight: 4, verticalAlign: "middle" }} />Entrance</span>
          <span style={{ color: "var(--text-muted)" }}>{racksWithPos.length} racks &middot; {warehouseBins.length} bins</span>
        </div>
      </div>
      <div style={{ padding: 16, overflowX: "auto" }}>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block", margin: "0 auto", background: "#f8fafc", borderRadius: 14, border: "1px solid var(--border)", minWidth: 500 }}>
          {/* Floor grid */}
          {Array.from({ length: Math.ceil(svgW / 40) + 1 }).map((_, i) => (
            <line key={`gv${i}`} x1={i * 40} y1={0} x2={i * 40} y2={svgH} stroke="#eef2f7" strokeWidth={0.5} />
          ))}
          {Array.from({ length: Math.ceil(svgH / 40) + 1 }).map((_, i) => (
            <line key={`gh${i}`} x1={0} y1={i * 40} x2={svgW} y2={i * 40} stroke="#eef2f7" strokeWidth={0.5} />
          ))}

          {/* Warehouse walls */}
          <rect x={14} y={14} width={svgW - 28} height={svgH - 28} rx={10} fill="none" stroke="#94a3b8" strokeWidth={2.5} />
          {/* Loading dock */}
          <rect x={svgW / 2 - 40} y={14} width={80} height={6} rx={3} fill="#22c55e" opacity={0.3} />

          {/* Aisle labels */}
          <text x={30} y={svgH / 2} textAnchor="middle" fontSize={9} fill="#cbd5e1" fontWeight={600} transform={`rotate(-90, 30, ${svgH / 2})`}>MAIN AISLE</text>

          {/* Entrance */}
          <circle cx={entrance.x} cy={entrance.y} r={14} fill="#22c55e" stroke="white" strokeWidth={3} />
          <text x={entrance.x} y={entrance.y + 5} textAnchor="middle" fontSize={10} fill="white" fontWeight={800}>IN</text>
          <text x={entrance.x} y={entrance.y - 22} textAnchor="middle" fontSize={10} fill="#64748b" fontWeight={600} letterSpacing={1}>ENTRANCE / LOADING DOCK</text>

          {/* Walking path with animated dash */}
          {pathD && (
            <>
              <path d={pathD} fill="none" stroke="#fdba74" strokeWidth={6} strokeLinecap="round" opacity={0.25} />
              <path d={pathD} fill="none" stroke="#f97316" strokeWidth={3} strokeDasharray="10 6" strokeLinecap="round" opacity={0.9} />
            </>
          )}

          {/* Direction arrows on path segments */}
          {pathPoints.slice(0, -1).map((p, i) => {
            const next = pathPoints[i + 1];
            if (!next) return null;
            const mx = (p.x + next.x) / 2;
            const my = (p.y + next.y) / 2;
            const angle = Math.atan2(next.y - p.y, next.x - p.x) * (180 / Math.PI);
            return (
              <g key={`arr-${i}`} transform={`translate(${mx}, ${my}) rotate(${angle})`}>
                <polygon points="0,-5 10,0 0,5" fill="#f97316" opacity={0.7} />
              </g>
            );
          })}

          {/* Step numbers at target racks */}
          {pickSequence.map((stop, idx) => {
            const rack = rackRects.find((r) => r.code === stop.rack_code);
            if (!rack) return null;
            return (
              <g key={`step-${idx}`}>
                <circle cx={rack.x + rack.rw / 2} cy={rack.y - 16} r={14} fill="#f97316" stroke="white" strokeWidth={2.5} />
                <text x={rack.x + rack.rw / 2} y={rack.y - 12} textAnchor="middle" fontSize={11} fill="white" fontWeight={800}>{idx + 1}</text>
              </g>
            );
          })}

          {/* Racks */}
          {rackRects.map((rack) => {
            const d = rackDims(rack.bins.length);
            return (
              <g key={rack.code}>
                {/* Shadow */}
                <rect x={rack.x + 3} y={rack.y + 3} width={rack.rw} height={rack.rh} rx={8} fill="#00000008" />
                {/* Rack body */}
                <rect
                  x={rack.x} y={rack.y} width={rack.rw} height={rack.rh} rx={8}
                  fill={rack.hasTarget ? "#eff6ff" : "white"}
                  stroke={rack.hasTarget ? "#2563eb" : "#cbd5e1"}
                  strokeWidth={rack.hasTarget ? 2.5 : 1.5}
                />
                {/* Rack label bar */}
                <rect x={rack.x} y={rack.y} width={rack.rw} height={RACK_LABEL_H} rx={8} fill={rack.hasTarget ? "#2563eb" : "#64748b"} />
                <rect x={rack.x} y={rack.y + RACK_LABEL_H - 8} width={rack.rw} height={8} fill={rack.hasTarget ? "#2563eb" : "#64748b"} />
                <text x={rack.x + rack.rw / 2} y={rack.y + 17} textAnchor="middle" fontSize={12} fill="white" fontWeight={700}>
                  {rack.code}
                </text>

                {/* Bins in 2-column grid */}
                {rack.bins.map((bin, bi) => {
                  const col = bi % BIN_COLS;
                  const row = Math.floor(bi / BIN_COLS);
                  const bx = rack.x + RACK_PAD + col * (BIN_W + BIN_GAP);
                  const by = rack.y + RACK_LABEL_H + RACK_PAD + row * (BIN_H + BIN_GAP);
                  const isTarget = targetBinIds.has(bin.id);
                  const prod = binProductMap[bin.id];
                  return (
                    <g key={bin.id}>
                      <rect
                        x={bx} y={by} width={BIN_W} height={BIN_H} rx={4}
                        fill={isTarget ? "#2563eb" : "#f1f5f9"}
                        stroke={isTarget ? "#1d4ed8" : "#d1d5db"}
                        strokeWidth={isTarget ? 2 : 1}
                      />
                      {/* Bin code */}
                      <text x={bx + BIN_W / 2} y={by + 12} textAnchor="middle" fontSize={9} fill={isTarget ? "white" : "#374151"} fontWeight={700}>
                        {bin.bin_code}
                      </text>
                      {/* Product or status */}
                      {isTarget ? (
                        <text x={bx + BIN_W / 2} y={by + 24} textAnchor="middle" fontSize={8} fill="#bfdbfe" fontWeight={700}>
                          PICK
                        </text>
                      ) : prod ? (
                        <text x={bx + BIN_W / 2} y={by + 24} textAnchor="middle" fontSize={7} fill="#9ca3af">
                          {prod.stock > 0 ? `${prod.stock} ${prod.uom}` : "empty"}
                        </text>
                      ) : (
                        <text x={bx + BIN_W / 2} y={by + 24} textAnchor="middle" fontSize={7} fill="#d1d5db">empty</text>
                      )}
                      {/* Stock fill bar */}
                      {prod && prod.stock > 0 && (
                        <>
                          <rect x={bx + 4} y={by + BIN_H - 6} width={BIN_W - 8} height={3} rx={1.5} fill={isTarget ? "#1d4ed830" : "#e5e7eb"} />
                          <rect x={bx + 4} y={by + BIN_H - 6} width={Math.min(1, prod.stock / (bin.capacity || 5000)) * (BIN_W - 8)} height={3} rx={1.5} fill={isTarget ? "#93c5fd" : "#22c55e"} />
                        </>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Scale bar */}
          <g>
            <line x1={svgW - 110} y1={svgH - 30} x2={svgW - 110 + SCALE * 5} y2={svgH - 30} stroke="#64748b" strokeWidth={2} />
            <line x1={svgW - 110} y1={svgH - 35} x2={svgW - 110} y2={svgH - 25} stroke="#64748b" strokeWidth={1.5} />
            <line x1={svgW - 110 + SCALE * 5} y1={svgH - 35} x2={svgW - 110 + SCALE * 5} y2={svgH - 25} stroke="#64748b" strokeWidth={1.5} />
            <text x={svgW - 110 + SCALE * 2.5} y={svgH - 38} textAnchor="middle" fontSize={9} fill="#64748b" fontWeight={500}>5m</text>
          </g>
        </svg>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Scanner Component (Simulated)
// ═══════════════════════════════════════════════════════════════════════════════

function ScannerModal({ item, onScan, onClose, error }) {
  const [input, setInput] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "var(--bg-card)", width: "90%", maxWidth: 400, borderRadius: 20, padding: 30, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📷</div>
        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>Scan Product</h2>
        
        {/* Item Details (Prototype Focus) */}
        <div style={{ background: "rgba(99, 102, 241, 0.05)", padding: 16, borderRadius: 12, marginBottom: 20, border: "1px solid rgba(99, 102, 241, 0.2)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{item.product_name}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            Quantity: <strong>{item.quantity} {item.unit}</strong> &middot; Bin: <strong>{item.bin_code}</strong>
          </div>
          <div style={{ marginTop: 12, display: "inline-block", padding: "4px 12px", background: "var(--accent)", color: "white", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
            CODE: {item.barcode || item.product_id}
          </div>
        </div>

        {/* Simulated Camera View */}
        <div style={{ width: "100%", aspectRatio: "1/1", background: "#000", borderRadius: 12, marginBottom: 24, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 40, border: "2px solid #22c55e", borderRadius: 8, opacity: 0.6 }} />
          <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: 2, background: "#ef4444", boxShadow: "0 0 10px #ef4444", animation: "scanLine 2s infinite" }} />
          <span style={{ color: "white", fontSize: 12, opacity: 0.5, zIndex: 1 }}>Simulated Camera View</span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <input 
            autoFocus
            placeholder="Type barcode above to verify..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onScan(input)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `2px solid ${error ? "#ef4444" : "var(--border)"}`, background: "var(--bg-base)", color: "var(--text)", fontSize: 14, textAlign: "center", outline: "none" }}
          />
          {error && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 8, fontWeight: 600 }}>❌ {error}</div>}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onScan(input)} style={{ flex: 1, padding: "12px", background: "var(--accent)", border: "none", borderRadius: 10, color: "white", fontWeight: 700, cursor: "pointer" }}>Confirm Scan</button>
        </div>
      </div>
      <style>{`
        @keyframes scanLine {
          0% { top: 20%; opacity: 0; }
          50% { top: 50%; opacity: 1; }
          100% { top: 80%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2: Warehouse Navigation
// ═══════════════════════════════════════════════════════════════════════════════

function NavigateTab({ assignment, allBins, rackPositions, inventoryProducts, push }) {
  const [showScanner, setShowScanner] = useState(false);
  const [scanningItem, setScanningItem] = useState(null);
  const [scanError, setScanError] = useState("");

  const warehouseBins = useMemo(() => {
    if (!assignment) return [];
    return allBins.filter((b) => String(b.warehouse_id) === String(assignment.warehouse_id));
  }, [allBins, assignment]);

  // Group pick items by rack for efficient picking sequence
  const pickSequence = useMemo(() => {
    if (!assignment) return [];
    const rackMap = {};
    for (const item of assignment.items) {
      const key = item.rack_code;
      // Attach barcode from inventory if missing
      const invProd = inventoryProducts.find(p => p.id === item.product_id);
      const itemWithBarcode = { ...item, barcode: invProd?.barcode || String(item.product_id) };
      
      if (!rackMap[key]) rackMap[key] = { rack_code: key, bin_code: item.bin_code, bin_location: item.bin_location, items: [] };
      rackMap[key].items.push(itemWithBarcode);
    }
    return Object.values(rackMap);
  }, [assignment, inventoryProducts]);

  if (!assignment) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>No active assignment</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Select an assignment from the Dashboard tab to navigate.</div>
      </div>
    );
  }

  const pickedCount = assignment.items.filter((it) => it.picked).length;
  const allPicked = pickedCount === assignment.items.length;

  const handleOpenScanner = (item) => {
    setScanningItem(item);
    setScanError("");
    setShowScanner(true);
  };

  const handleScan = (code) => {
    if (!scanningItem) return;
    
    // Validate: must match item's barcode or product ID
    if (code === scanningItem.barcode || code === String(scanningItem.product_id)) {
      actions.markDriverItemPicked(assignment.id, scanningItem.product_id);
      if (push) push(`✓ Successfully picked ${scanningItem.product_name}`, "success");
      setShowScanner(false);
      setScanningItem(null);
      setScanError("");
    } else {
      setScanError("This product is not assigned");
    }
  };

  const handleStartTransit = () => {
    actions.updateDriverAssignmentStatus(assignment.id, "in_transit");
    if (push) push("All items picked! Starting transit.", "success");
  };

  // Target bin IDs from the assignment
  const targetBinIds = new Set(assignment.items.map((it) => it.bin_id));

  const whLat = Number(assignment.warehouse_lat);
  const whLng = Number(assignment.warehouse_lng);
  const hasValidCoords = isFinite(whLat) && isFinite(whLng);

  return (
    <>
      {/* Header */}
      <div style={{ ...cardStyle, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>🏢 {assignment.warehouse_name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              Shipment: <strong>{assignment.shipment_id}</strong> &middot; {assignment.items.length} items to pick
            </div>
            {hasValidCoords && (
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)", marginTop: 4 }}>GPS: {whLat.toFixed(6)}, {whLng.toFixed(6)}</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ padding: "8px 16px", background: allPicked ? "rgba(34,197,94,0.1)" : "rgba(245,166,35,0.1)", borderRadius: 20, fontSize: 13, fontWeight: 700, color: allPicked ? "#22c55e" : "#f5a623" }}>
              {pickedCount}/{assignment.items.length} picked
            </div>
            {allPicked && assignment.status === "picking" && (
              <button onClick={handleStartTransit} style={{ padding: "10px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>
                Start Delivery →
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Pick Sequence */}
        <div style={cardStyle}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>📋 Pick Sequence</div>
          <div style={{ padding: 16 }}>
            {pickSequence.map((stop, idx) => (
              <div key={stop.rack_code} style={{ marginBottom: idx < pickSequence.length - 1 ? 16 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Go to {stop.bin_location}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Rack {stop.rack_code} &middot; Bin {stop.bin_code}</div>
                  </div>
                </div>
                {stop.items.map((item) => (
                  <div key={item.product_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", marginLeft: 38, background: item.picked ? "rgba(34,197,94,0.05)" : "var(--bg-base)", borderRadius: 8, marginBottom: 4, border: `1px solid ${item.picked ? "#22c55e33" : "var(--border)"}` }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{item.product_name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {item.quantity} {item.unit} &middot; <span style={{ fontFamily: "monospace", color: "var(--accent)" }}>{item.barcode || item.product_id}</span>
                      </div>
                    </div>
                    {item.picked ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 6, border: "1px solid rgba(34,197,94,0.2)" }}>
                        <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>✓ Picked</span>
                      </div>
                    ) : (
                      <button onClick={() => handleOpenScanner(item)} style={{ padding: "5px 14px", background: "var(--accent)", color: "white", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Inter", display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 14 }}>📷</span> Scan to Pick
                      </button>
                    )}
                  </div>
                ))}
                {idx < pickSequence.length - 1 && (
                  <div style={{ marginLeft: 14, borderLeft: "2px dashed var(--border)", height: 16 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Indoor Warehouse Floor Plan */}
        <div style={cardStyle}>
          <WarehouseFloorPlan
            warehouseBins={warehouseBins}
            rackPositions={rackPositions}
            targetBinIds={targetBinIds}
            pickSequence={pickSequence}
            warehouseName={assignment.warehouse_name}
            inventoryProducts={inventoryProducts}
          />
        </div>
      </div>

      {/* Full Pick List Table */}
      <div style={cardStyle}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>📦 Full Pick List</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-base)" }}>
                {["Product", "Quantity", "Rack > Bin", "Location", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignment.items.map((item, i) => (
                <tr key={item.product_id} style={{ borderBottom: i < assignment.items.length - 1 ? "1px solid var(--border)" : "none", background: item.picked ? "rgba(34,197,94,0.03)" : "transparent" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                    {item.product_name}
                    <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "monospace", marginTop: 2 }}>{item.barcode || item.product_id}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--accent)" }}>{item.rack_code} &rsaquo; {item.bin_code}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, fontFamily: "monospace" }}>{item.bin_location}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: item.picked ? "rgba(34,197,94,0.1)" : "rgba(245,166,35,0.1)", color: item.picked ? "#22c55e" : "#f5a623" }}>
                      {item.picked ? "Picked" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    {!item.picked && (
                      <button onClick={() => handleOpenScanner({ ...item, barcode: inventoryProducts.find(p => p.id === item.product_id)?.barcode })} style={{ padding: "4px 12px", background: "var(--accent)", color: "white", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>Scan</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showScanner && scanningItem && (
        <ScannerModal 
          item={scanningItem} 
          onScan={handleScan} 
          onClose={() => setShowScanner(false)} 
          error={scanError}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3: Delivery Route
// ═══════════════════════════════════════════════════════════════════════════════

function DeliveryTab({ assignment, push }) {
  if (!assignment) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>No active delivery</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Pick all items first, then start delivery.</div>
      </div>
    );
  }

  const whLat = Number(assignment.warehouse_lat);
  const whLng = Number(assignment.warehouse_lng);
  const delLat = Number(assignment.delivery_lat);
  const delLng = Number(assignment.delivery_lng);
  const hasValidCoords = [whLat, whLng, delLat, delLng].every(isFinite);

  const handleMarkDelivered = () => {
    actions.updateDriverAssignmentStatus(assignment.id, "delivered");
    if (push) push("Delivery completed!", "success");
  };

  const sc = STATUS_CFG[assignment.status] || STATUS_CFG.assigned;

  return (
    <>
      {/* Delivery Info */}
      <div style={{ ...cardStyle, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{assignment.shipment_id}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{assignment.route_details}</div>
          </div>
          <span style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: sc.bg, color: sc.color }}>{sc.label}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 20 }}>
          {[
            { label: "From", value: assignment.warehouse_name, icon: "🏢" },
            { label: "To", value: assignment.delivery_address, icon: "📍" },
            { label: "Distance", value: `${assignment.total_distance_km} km`, icon: "📏" },
            { label: "Vehicle", value: assignment.vehicle_number, icon: "🚛" },
          ].map((f) => (
            <div key={f.label} style={{ padding: 14, background: "var(--bg-base)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{f.icon} {f.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      {hasValidCoords && (
        <div style={{ ...cardStyle, height: 400, marginBottom: 20 }}>
          <MapContainer center={[whLat, whLng]} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitBounds positions={[[whLat, whLng], [delLat, delLng]]} />
            <Marker position={[whLat, whLng]} icon={warehouseMapIcon()}>
              <Popup><strong>{assignment.warehouse_name}</strong><br />Origin</Popup>
            </Marker>
            <Marker position={[delLat, delLng]} icon={deliveryMapIcon()}>
              <Popup><strong>Delivery</strong><br />{assignment.delivery_address}</Popup>
            </Marker>
            <Polyline positions={[[whLat, whLng], [delLat, delLng]]} pathOptions={{ color: "#7c3aed", weight: 4, dashArray: "10 6" }} />
          </MapContainer>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {assignment.status === "in_transit" && (
          <button onClick={handleMarkDelivered} style={{ padding: "14px 32px", background: "#22c55e", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Inter" }}>
            ✓ Mark as Delivered
          </button>
        )}
        {assignment.status === "delivered" && (
          <div style={{ padding: "14px 32px", background: "rgba(34,197,94,0.1)", borderRadius: 10, fontSize: 15, fontWeight: 700, color: "#22c55e" }}>
            ✓ Delivery Completed
          </div>
        )}
        {(assignment.status === "assigned" || assignment.status === "picking") && (
          <div style={{ padding: "14px 32px", background: "rgba(245,166,35,0.1)", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#f5a623" }}>
            Pick all items first before starting delivery
          </div>
        )}
      </div>
    </>
  );
}
