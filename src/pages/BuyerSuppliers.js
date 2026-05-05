import React, { useState } from "react";

// ── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_SUPPLIERS = [
  {
    id: 1,
    name: "Agro Fresh Pvt Ltd",
    contact_person: "Ramesh Sharma",
    phone: "+91 98765 43210",
    email: "ramesh@agrofresh.in",
    location: "Indore, MP",
    rating: 4.5,
    total_orders: 34,
    total_spent: 875000,
    items: [
      { id: 1, name: "Wheat Flour (Atta)", category: "Grains", qty_purchased: 1200, unit: "kg", avg_price: 42, last_price: 44, last_order: "2026-04-28" },
      { id: 2, name: "Rice (Basmati)", category: "Grains", qty_purchased: 800, unit: "kg", avg_price: 95, last_price: 98, last_order: "2026-04-25" },
      { id: 3, name: "Soybean Oil", category: "Oils", qty_purchased: 300, unit: "ltr", avg_price: 145, last_price: 140, last_order: "2026-04-20" },
    ],
  },
  {
    id: 2,
    name: "Krishna Spices & Co",
    contact_person: "Sunil Verma",
    phone: "+91 87654 32109",
    email: "sunil@krishnaspices.com",
    location: "Jodhpur, RJ",
    rating: 4.2,
    total_orders: 21,
    total_spent: 432000,
    items: [
      { id: 4, name: "Red Chilli Powder", category: "Spices", qty_purchased: 500, unit: "kg", avg_price: 280, last_price: 290, last_order: "2026-04-30" },
      { id: 5, name: "Turmeric Powder", category: "Spices", qty_purchased: 350, unit: "kg", avg_price: 180, last_price: 175, last_order: "2026-04-22" },
      { id: 6, name: "Cumin Seeds", category: "Spices", qty_purchased: 200, unit: "kg", avg_price: 420, last_price: 430, last_order: "2026-04-18" },
      { id: 7, name: "Coriander Powder", category: "Spices", qty_purchased: 250, unit: "kg", avg_price: 160, last_price: 155, last_order: "2026-04-15" },
    ],
  },
  {
    id: 3,
    name: "National Packaging Solutions",
    contact_person: "Priya Mehta",
    phone: "+91 76543 21098",
    email: "priya@nationalpack.in",
    location: "Ahmedabad, GJ",
    rating: 3.8,
    total_orders: 12,
    total_spent: 198000,
    items: [
      { id: 8, name: "BOPP Bags (25kg)", category: "Packaging", qty_purchased: 5000, unit: "pcs", avg_price: 18, last_price: 19, last_order: "2026-04-10" },
      { id: 9, name: "Corrugated Boxes", category: "Packaging", qty_purchased: 2000, unit: "pcs", avg_price: 35, last_price: 34, last_order: "2026-03-28" },
    ],
  },
  {
    id: 4,
    name: "Bharat Dairy Supplies",
    contact_person: "Ankit Patel",
    phone: "+91 65432 10987",
    email: "ankit@bharatdairy.com",
    location: "Anand, GJ",
    rating: 4.7,
    total_orders: 45,
    total_spent: 1250000,
    items: [
      { id: 10, name: "Butter (Unsalted)", category: "Dairy", qty_purchased: 600, unit: "kg", avg_price: 480, last_price: 490, last_order: "2026-05-01" },
      { id: 11, name: "Paneer", category: "Dairy", qty_purchased: 400, unit: "kg", avg_price: 320, last_price: 330, last_order: "2026-04-29" },
      { id: 12, name: "Ghee", category: "Dairy", qty_purchased: 250, unit: "kg", avg_price: 550, last_price: 560, last_order: "2026-04-27" },
    ],
  },
  {
    id: 5,
    name: "Green Valley Farms",
    contact_person: "Deepika Joshi",
    phone: "+91 54321 09876",
    email: "deepika@greenvalley.in",
    location: "Nashik, MH",
    rating: 4.0,
    total_orders: 18,
    total_spent: 310000,
    items: [
      { id: 13, name: "Onion", category: "Vegetables", qty_purchased: 2000, unit: "kg", avg_price: 30, last_price: 35, last_order: "2026-05-02" },
      { id: 14, name: "Tomato", category: "Vegetables", qty_purchased: 1500, unit: "kg", avg_price: 40, last_price: 45, last_order: "2026-05-02" },
      { id: 15, name: "Potato", category: "Vegetables", qty_purchased: 1800, unit: "kg", avg_price: 25, last_price: 22, last_order: "2026-04-30" },
    ],
  },
];

// ── Helper ───────────────────────────────────────────────────────────────────
function formatCurrency(val) {
  return "£" + Number(val).toLocaleString("en-IN");
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = "";
  for (let i = 0; i < full; i++) stars += "★";
  if (half) stars += "½";
  return stars;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function BuyerSuppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = DUMMY_SUPPLIERS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fade-up">
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">My Suppliers</div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            View your suppliers, their product catalog, and purchase history.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Total Suppliers</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{DUMMY_SUPPLIERS.length}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Total Orders</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{DUMMY_SUPPLIERS.reduce((a, s) => a + s.total_orders, 0)}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Total Spent</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--accent-4)" }}>{formatCurrency(DUMMY_SUPPLIERS.reduce((a, s) => a + s.total_spent, 0))}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Unique Items</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{DUMMY_SUPPLIERS.reduce((a, s) => a + s.items.length, 0)}</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search suppliers, items, or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Main content: supplier list + detail */}
      <div style={{ display: "grid", gridTemplateColumns: selectedSupplier ? "1fr 2fr" : "1fr", gap: 24 }}>
        {/* Supplier List */}
        <div className="card">
          <div className="card-header" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Suppliers ({filtered.length})</div>
          </div>
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {filtered.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSupplier(s)}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border)",
                  background: selectedSupplier?.id === s.id ? "var(--bg-hover, rgba(99,102,241,0.06))" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <span style={{ fontSize: 13, color: "#f59e0b" }}>{renderStars(s.rating)} {s.rating}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>
                  {s.contact_person} &middot; {s.location}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
                  <span>{s.total_orders} orders</span>
                  <span>{s.items.length} items</span>
                  <span style={{ color: "var(--accent-4)", fontWeight: 600 }}>{formatCurrency(s.total_spent)}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", opacity: 0.5 }}>No suppliers found.</div>
            )}
          </div>
        </div>

        {/* Supplier Detail Panel */}
        {selectedSupplier && (
          <div>
            {/* Supplier Info Card */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{selectedSupplier.name}</h2>
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--text-muted)" }}>
                      {selectedSupplier.contact_person} &middot; {selectedSupplier.location}
                    </p>
                  </div>
                  <span
                    className="pill green"
                    style={{ fontSize: 13 }}
                  >
                    {renderStars(selectedSupplier.rating)} {selectedSupplier.rating}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 20 }}>
                  <div style={{ padding: "12px 16px", background: "var(--bg-base)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Phone</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{selectedSupplier.phone}</div>
                  </div>
                  <div style={{ padding: "12px 16px", background: "var(--bg-base)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Email</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{selectedSupplier.email}</div>
                  </div>
                  <div style={{ padding: "12px 16px", background: "var(--bg-base)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Total Orders</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedSupplier.total_orders}</div>
                  </div>
                  <div style={{ padding: "12px 16px", background: "var(--bg-base)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Total Spent</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent-4)" }}>{formatCurrency(selectedSupplier.total_spent)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="card">
              <div className="card-header" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Items Purchased ({selectedSupplier.items.length})</div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Qty Purchased</th>
                      <th>Avg Price</th>
                      <th>Last Price</th>
                      <th>Price Trend</th>
                      <th>Total Cost</th>
                      <th>Last Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSupplier.items.map((item) => {
                      const trend = item.last_price - item.avg_price;
                      const trendPct = ((trend / item.avg_price) * 100).toFixed(1);
                      const totalCost = item.qty_purchased * item.avg_price;
                      return (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td>
                            <span className="pill blue" style={{ fontSize: 11 }}>{item.category}</span>
                          </td>
                          <td>{item.qty_purchased.toLocaleString("en-IN")} {item.unit}</td>
                          <td>{formatCurrency(item.avg_price)}/{item.unit}</td>
                          <td style={{ fontWeight: 600 }}>{formatCurrency(item.last_price)}/{item.unit}</td>
                          <td>
                            <span style={{ color: trend > 0 ? "#ef4444" : trend < 0 ? "#22c55e" : "var(--text-muted)", fontWeight: 600, fontSize: 13 }}>
                              {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"} {trend !== 0 ? `${Math.abs(trendPct)}%` : ""}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, color: "var(--accent-4)" }}>{formatCurrency(totalCost)}</td>
                          <td>{new Date(item.last_order).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no supplier selected */}
        {!selectedSupplier && filtered.length > 0 && (
          <div className="card" style={{ display: "none" }}>
            {/* hidden since grid is single column when no supplier selected */}
          </div>
        )}
      </div>
    </div>
  );
}
