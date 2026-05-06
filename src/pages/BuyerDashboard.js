import React, { useState } from "react";

// ── Dummy Data ───────────────────────────────────────────────────────────────
const SUPPLIERS = [
  { id: 1, name: "Agro Fresh Pvt Ltd",           contact: "Ramesh Sharma",  rating: 4.5 },
  { id: 2, name: "Krishna Spices & Co",           contact: "Sunil Verma",   rating: 4.2 },
  { id: 3, name: "National Packaging Solutions",  contact: "Priya Mehta",   rating: 3.8 },
];

const PRODUCTS_BY_SUPPLIER = {
  1: [
    { name: "Wheat Flour (Atta)", unit: "kg",  avg_price: 42 },
    { name: "Rice (Basmati)",     unit: "kg",  avg_price: 95 },
    { name: "Soybean Oil",        unit: "ltr", avg_price: 145 },
  ],
  2: [
    { name: "Red Chilli Powder", unit: "kg", avg_price: 280 },
    { name: "Turmeric Powder",   unit: "kg", avg_price: 180 },
    { name: "Cumin Seeds",       unit: "kg", avg_price: 420 },
  ],
  3: [
    { name: "BOPP Bags (25kg)",    unit: "pcs", avg_price: 18 },
    { name: "Corrugated Boxes",    unit: "pcs", avg_price: 35 },
  ],
};

let DUMMY_QUOTATIONS = [
  { id: "RFQ-2001", supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd",          product_name: "Wheat Flour (Atta)", quantity: 1200, unit_price: 44,  status: "Accepted",  created_at: "2026-04-28", valid_until: "2026-05-28", expected_delivery: "2026-05-05", notes: "Urgent stock", supplier_notes: "Will deliver on time", credit_days: 30 },
  { id: "RFQ-2002", supplier_id: 2, supplier_name: "Krishna Spices & Co",          product_name: "Red Chilli Powder",  quantity: 500,  unit_price: 290, status: "Pending",   created_at: "2026-04-30", valid_until: "2026-05-30", expected_delivery: "2026-05-10", notes: "Fine grind only", supplier_notes: "", credit_days: 15 },
  { id: "RFQ-2003", supplier_id: 3, supplier_name: "National Packaging Solutions", product_name: "BOPP Bags (25kg)",   quantity: 5000, unit_price: 19,  status: "Pending",   created_at: "2026-04-20", valid_until: "2026-05-20", expected_delivery: "2026-04-30", notes: "",             supplier_notes: "", credit_days: 45 },
  { id: "RFQ-2004", supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd",          product_name: "Rice (Basmati)",     quantity: 800,  unit_price: 98,  status: "Confirmed", created_at: "2026-04-25", valid_until: "2026-05-25", expected_delivery: "2026-05-08", notes: "Premium grade", supplier_notes: "Premium basmati confirmed", credit_days: 30 },
  { id: "RFQ-2005", supplier_id: 2, supplier_name: "Krishna Spices & Co",          product_name: "Turmeric Powder",    quantity: 350,  unit_price: 175, status: "Rejected",  created_at: "2026-04-15", valid_until: "2026-05-15", expected_delivery: "2026-04-22", notes: "",             supplier_notes: "Out of stock", credit_days: 30 },
];

const STATUS_CONFIG = {
  Pending:   { color: "#f5a623", bg: "rgba(245,166,35,0.1)"  },
  Accepted:  { color: "#7ed321", bg: "rgba(126,211,33,0.1)"  },
  Confirmed: { color: "#4a90e2", bg: "rgba(74,144,226,0.1)"  },
  Rejected:  { color: "#e45b5b", bg: "rgba(228,91,91,0.1)"   },
  Cancelled: { color: "#6c757d", bg: "rgba(108,117,125,0.1)" },
};

const EMPTY_FORM = {
  supplier_id: "", product_name: "", quantity: 1, unit_price: "",
  valid_until: "", expected_delivery: "", notes: "", credit_days: 30,
};

function fmt(v) { return "£" + Number(v).toLocaleString("en-GB"); }

// ── Component ────────────────────────────────────────────────────────────────
export default function BuyerDashboard({ push }) {
  const [quotations, setQuotations] = useState(DUMMY_QUOTATIONS);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [detailQ, setDetailQ]       = useState(null);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // KPIs
  const total     = quotations.length;
  const pending   = quotations.filter(q => q.status === "Pending").length;
  const accepted  = quotations.filter(q => q.status === "Accepted" || q.status === "Confirmed").length;
  const rejected  = quotations.filter(q => q.status === "Rejected").length;

  // Filtered list
  const filtered = quotations.filter(q => {
    const s = search.toLowerCase();
    const matchSearch = q.id.toLowerCase().includes(s) || q.product_name.toLowerCase().includes(s) || q.supplier_name.toLowerCase().includes(s);
    const matchStatus = filterStatus === "all" || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Product list for selected supplier
  const supplierProducts = PRODUCTS_BY_SUPPLIER[form.supplier_id] || [];
  const selectedProduct  = supplierProducts.find(p => p.name === form.product_name);

  // Submit new RFQ
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplier_id || !form.product_name || !form.quantity || !form.unit_price) {
      if (push) push("Please fill all required fields", "error");
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const sup = SUPPLIERS.find(s => String(s.id) === String(form.supplier_id));
    const newQ = {
      id: `RFQ-${2006 + quotations.length}`,
      supplier_id: Number(form.supplier_id),
      supplier_name: sup?.name || "",
      product_name: form.product_name,
      quantity: Number(form.quantity),
      unit_price: Number(form.unit_price),
      status: "Pending",
      created_at: new Date().toISOString().split("T")[0],
      valid_until: form.valid_until,
      expected_delivery: form.expected_delivery,
      notes: form.notes,
      supplier_notes: "",
      credit_days: Number(form.credit_days),
    };
    DUMMY_QUOTATIONS = [newQ, ...DUMMY_QUOTATIONS];
    setQuotations([...DUMMY_QUOTATIONS]);
    setSubmitting(false);
    setShowForm(false);
    setForm(EMPTY_FORM);
    if (push) push("RFQ sent to supplier!", "success");
  };

  // Update status
  const updateStatus = (id, status, notes = "") => {
    const updated = quotations.map(q => q.id === id ? { ...q, status, supplier_notes: notes || q.supplier_notes } : q);
    setQuotations(updated);
    DUMMY_QUOTATIONS = updated;
    if (detailQ?.id === id) setDetailQ(prev => ({ ...prev, status }));
    if (push) push(`${id} marked as ${status}`, "success");
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", border: "1px solid var(--border)",
    borderRadius: 8, fontSize: 13, fontFamily: "Inter",
    background: "var(--bg-base)", color: "var(--text-primary)", boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700, marginBottom: 5,
    color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4,
  };

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>📄 Quotation Requests</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>Send RFQs to suppliers and track responses</p>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding: "10px 20px", background: "var(--accent)", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>
          + New RFQ
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total RFQs",  value: total,    icon: "📋", color: "#4a90e2" },
          { label: "Awaiting",    value: pending,  icon: "⏳", color: "#f5a623" },
          { label: "Accepted",    value: accepted, icon: "✅", color: "#7ed321" },
          { label: "Rejected",    value: rejected, icon: "❌", color: "#e45b5b" },
        ].map(k => (
          <div key={k.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input type="text" placeholder="Search by RFQ#, product, supplier..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: 220 }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: "auto", minWidth: 160 }}>
          <option value="all">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-base)" }}>
                {["RFQ #", "Supplier", "Product", "Qty", "Expected Price", "Total", "Date", "Valid Until", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>No quotations found.</td></tr>
              ) : filtered.map((q, i) => {
                const sc = STATUS_CONFIG[q.status] || STATUS_CONFIG.Pending;
                return (
                  <tr key={q.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-base)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--accent)", cursor: "pointer" }} onClick={() => setDetailQ(q)}>{q.id}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-primary)" }}>{q.supplier_name}</td>
                    <td style={{ padding: "12px 16px" }}>{q.product_name}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{q.quantity.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{fmt(q.unit_price)}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>{fmt(q.quantity * q.unit_price)}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{new Date(q.created_at).toLocaleDateString("en-GB")}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{q.valid_until ? new Date(q.valid_until).toLocaleDateString("en-GB") : "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>{q.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setDetailQ(q)}
                          style={{ padding: "4px 10px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "Inter", color: "var(--text-primary)" }}>View</button>
                        {q.status === "Pending" && (
                          <button onClick={() => updateStatus(q.id, "Cancelled")}
                            style={{ padding: "4px 10px", background: "rgba(228,91,91,0.1)", border: "1px solid #e45b5b44", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "Inter", color: "#e45b5b", fontWeight: 600 }}>Cancel</button>
                        )}
                        {q.status === "Accepted" && (
                          <button onClick={() => updateStatus(q.id, "Confirmed")}
                            style={{ padding: "4px 10px", background: "rgba(74,144,226,0.1)", border: "1px solid #4a90e244", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "Inter", color: "#4a90e2", fontWeight: 600 }}>Confirm</button>
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

      {/* ── Create RFQ Modal ── */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--bg-card)", borderRadius: 16, width: "100%", maxWidth: 540, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>New Request for Quotation</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>Send a pricing request to a supplier</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--text-muted)" }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Supplier */}
              <div>
                <label style={labelStyle}>Supplier *</label>
                <select value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value, product_name: "" })} style={inputStyle} required>
                  <option value="">-- Select Supplier --</option>
                  {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.contact})</option>)}
                </select>
              </div>

              {/* Product */}
              <div>
                <label style={labelStyle}>Product *</label>
                <select value={form.product_name} onChange={e => {
                  const prod = supplierProducts.find(p => p.name === e.target.value);
                  setForm({ ...form, product_name: e.target.value, unit_price: prod?.avg_price || "" });
                }} style={inputStyle} required disabled={!form.supplier_id}>
                  <option value="">{form.supplier_id ? "-- Select Product --" : "-- Select Supplier First --"}</option>
                  {supplierProducts.map(p => <option key={p.name} value={p.name}>{p.name} (avg: £{p.avg_price}/{p.unit})</option>)}
                </select>
              </div>

              {/* Qty + Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Quantity *</label>
                  <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Expected Price (£) *</label>
                  <input type="number" min="0" step="0.01" value={form.unit_price} onChange={e => setForm({ ...form, unit_price: e.target.value })} style={inputStyle} required />
                </div>
              </div>

              {/* Total preview */}
              {form.quantity && form.unit_price && (
                <div style={{ padding: "10px 14px", background: "rgba(74,144,226,0.08)", border: "1px solid #4a90e244", borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#4a90e2" }}>
                  Estimated Total: {fmt(Number(form.quantity) * Number(form.unit_price))}
                </div>
              )}

              {/* Dates + Credit */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Valid Until</label>
                  <input type="date" value={form.valid_until} onChange={e => setForm({ ...form, valid_until: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Expected Delivery</label>
                  <input type="date" value={form.expected_delivery} onChange={e => setForm({ ...form, expected_delivery: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Credit Days</label>
                  <input type="number" min="0" value={form.credit_days} onChange={e => setForm({ ...form, credit_days: e.target.value })} style={inputStyle} />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Special requirements..." style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                  style={{ padding: "10px 20px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "Inter", color: "var(--text-primary)" }}>Cancel</button>
                <button type="submit" disabled={submitting}
                  style={{ padding: "10px 24px", background: "var(--accent)", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Sending..." : "Send RFQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {detailQ && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--bg-card)", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>{detailQ.id}</h2>
                <span style={{ display: "inline-block", marginTop: 6, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: STATUS_CONFIG[detailQ.status]?.bg, color: STATUS_CONFIG[detailQ.status]?.color }}>
                  {detailQ.status}
                </span>
              </div>
              <button onClick={() => setDetailQ(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--text-muted)" }}>×</button>
            </div>

            <div style={{ padding: 24 }}>
              {[
                ["Supplier",           detailQ.supplier_name],
                ["Product",            detailQ.product_name],
                ["Quantity",           detailQ.quantity.toLocaleString() + " units"],
                ["Expected Price",     fmt(detailQ.unit_price)],
                ["Total Value",        fmt(detailQ.quantity * detailQ.unit_price)],
                ["Sent On",            new Date(detailQ.created_at).toLocaleDateString("en-GB")],
                ["Valid Until",        detailQ.valid_until ? new Date(detailQ.valid_until).toLocaleDateString("en-GB") : "—"],
                ["Expected Delivery",  detailQ.expected_delivery ? new Date(detailQ.expected_delivery).toLocaleDateString("en-GB") : "—"],
                ["Credit Days",        detailQ.credit_days + " days"],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{label}</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: label === "Total Value" ? 800 : 500 }}>{val}</span>
                </div>
              ))}

              {detailQ.notes && (
                <div style={{ marginTop: 12, padding: 12, background: "var(--bg-base)", borderRadius: 8, fontSize: 13, color: "var(--text-muted)" }}>
                  <strong>Your Notes:</strong> {detailQ.notes}
                </div>
              )}
              {detailQ.supplier_notes && (
                <div style={{ marginTop: 8, padding: 12, background: "rgba(126,211,33,0.06)", border: "1px solid #7ed32133", borderRadius: 8, fontSize: 13, color: "var(--text-primary)" }}>
                  <strong>Supplier Response:</strong> {detailQ.supplier_notes}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                {detailQ.status === "Accepted" && (
                  <button onClick={() => updateStatus(detailQ.id, "Confirmed")}
                    style={{ padding: "10px 18px", background: "#4a90e2", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>
                    ✓ Confirm Quotation
                  </button>
                )}
                {detailQ.status === "Pending" && (
                  <button onClick={() => updateStatus(detailQ.id, "Cancelled")}
                    style={{ padding: "10px 18px", background: "rgba(228,91,91,0.1)", color: "#e45b5b", border: "1px solid #e45b5b44", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>
                    ✕ Cancel RFQ
                  </button>
                )}
                <button onClick={() => setDetailQ(null)}
                  style={{ padding: "10px 18px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "Inter", color: "var(--text-primary)", marginLeft: "auto" }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
