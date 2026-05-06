import React, { useState, useEffect } from "react";

// ── Dummy KPI & Activity Data ────────────────────────────────────────────────
const MONTHLY_SPEND = [
  { month: "Nov", spend: 312000 },
  { month: "Dec", spend: 485000 },
  { month: "Jan", spend: 398000 },
  { month: "Feb", spend: 521000 },
  { month: "Mar", spend: 447000 },
  { month: "Apr", spend: 589000 },
  { month: "May", spend: 263000 },
];

const CATEGORY_SPEND = [
  { name: "Grains & Cereals", amount: 926000, pct: 38, color: "#4a90e2" },
  { name: "Spices", amount: 635000, pct: 26, color: "#f5a623" },
  { name: "Packaging", amount: 488000, pct: 20, color: "#7ed321" },
  { name: "Oils & Fats", amount: 293000, pct: 12, color: "#e45b5b" },
  { name: "Others", amount: 97000, pct: 4, color: "#9b59b6" },
];

const TOP_SUPPLIERS = [
  { name: "Agro Fresh Pvt Ltd", orders: 34, spend: 875000, rating: 4.5, onTime: 97 },
  { name: "Krishna Spices & Co", orders: 21, spend: 432000, rating: 4.2, onTime: 91 },
  { name: "National Packaging Solutions", orders: 12, spend: 198000, rating: 3.8, onTime: 88 },
];

const RECENT_ACTIVITY = [
  { type: "po", icon: "🛒", title: "PO #1042 Confirmed", detail: "Agro Fresh – 1200kg Wheat Flour", time: "2 hours ago", color: "#4a90e2" },
  { type: "alert", icon: "⚠️", title: "Low Stock Alert", detail: "Soybean Oil – only 9 days remaining", time: "5 hours ago", color: "#e45b5b" },
  { type: "quotation", icon: "📄", title: "Quotation Accepted", detail: "Krishna Spices – Red Chilli Powder", time: "Yesterday", color: "#7ed321" },
  { type: "payment", icon: "💳", title: "Payment Due", detail: "National Packaging – £70,000 due in 3 days", time: "Yesterday", color: "#f5a623" },
  { type: "delivery", icon: "🚛", title: "Delivery Received", detail: "PO #1039 – Turmeric Powder 350kg", time: "2 days ago", color: "#9b59b6" },
];

const REORDER_ALERTS = [
  { product: "Soybean Oil", daysLeft: 4, supplier: "Agro Fresh Pvt Ltd", urgency: "critical" },
  { product: "Red Chilli Powder", daysLeft: 12, supplier: "Krishna Spices & Co", urgency: "warning" },
  { product: "BOPP Bags (25kg)", daysLeft: 18, supplier: "National Packaging Solutions", urgency: "info" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(val) {
  if (val >= 1000000) return "£" + (val / 1000000).toFixed(1) + "M";
  if (val >= 1000) return "£" + (val / 1000).toFixed(0) + "K";
  return "£" + val;
}

function Stars({ rating }) {
  return (
    <span style={{ color: "#f5a623", letterSpacing: 1 }}>
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "½" : ""}
      {"☆".repeat(5 - Math.ceil(rating))}
      <span style={{ color: "#999", fontSize: 11, marginLeft: 4 }}>({rating})</span>
    </span>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function BuyerOverview({ push, setActiveModule }) {
  const [animatedBars, setAnimatedBars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedBars(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const maxSpend = Math.max(...MONTHLY_SPEND.map((m) => m.spend));
  const totalSpend = MONTHLY_SPEND.reduce((s, m) => s + m.spend, 0);
  const totalOrders = TOP_SUPPLIERS.reduce((s, sup) => s + sup.orders, 0);

  const kpis = [
    {
      label: "Total Spend (YTD)",
      value: formatCurrency(totalSpend),
      icon: "💰",
      trend: "+11.4%",
      up: true,
      color: "#4a90e2",
      bg: "rgba(74,144,226,0.08)",
    },
    {
      label: "Purchase Orders",
      value: totalOrders,
      icon: "🛒",
      trend: "+8 this month",
      up: true,
      color: "#7ed321",
      bg: "rgba(126,211,33,0.08)",
    },
    {
      label: "Pending Quotations",
      value: 5,
      icon: "📄",
      trend: "Awaiting response",
      up: null,
      color: "#f5a623",
      bg: "rgba(245,166,35,0.08)",
    },
    {
      label: "Reorder Alerts",
      value: REORDER_ALERTS.length,
      icon: "⚠️",
      trend: "1 critical",
      up: false,
      color: "#e45b5b",
      bg: "rgba(228,91,91,0.08)",
    },
    {
      label: "Active Suppliers",
      value: TOP_SUPPLIERS.length,
      icon: "🏢",
      trend: "All active",
      up: true,
      color: "#9b59b6",
      bg: "rgba(155,89,182,0.08)",
    },
  ];

  return (
    <div className="fade-up" style={{ maxWidth: 1400 }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "var(--text-primary)" }}>
          👋 Welcome back, Buyer
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-muted)" }}>
          Here's your procurement overview for today — {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.label}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "18px 20px",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: k.color,
                borderRadius: "12px 12px 0 0",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: k.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {k.icon}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 20,
                  background: k.up === true ? "rgba(126,211,33,0.12)" : k.up === false ? "rgba(228,91,91,0.12)" : "rgba(245,166,35,0.12)",
                  color: k.up === true ? "#5a9e1c" : k.up === false ? "#c0392b" : "#b07800",
                }}
              >
                {k.trend}
              </span>
            </div>
            <div style={{ marginTop: 14, fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: -0.5 }}>
              {k.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontWeight: 500 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Spend Chart + Reorder Alerts ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Monthly Spend Bar Chart */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Monthly Purchase Spend</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Last 7 months — Total: {formatCurrency(totalSpend)}</div>
            </div>
            <div
              style={{
                fontSize: 12,
                background: "rgba(74,144,226,0.1)",
                color: "#4a90e2",
                padding: "4px 12px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              📊 YTD View
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 180 }}>
            {MONTHLY_SPEND.map((m, i) => {
              const heightPct = (m.spend / maxSpend) * 100;
              const isLatest = i === MONTHLY_SPEND.length - 1;
              return (
                <div
                  key={m.month}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
                >
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>
                    {formatCurrency(m.spend)}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: animatedBars ? `${heightPct}%` : "0%",
                      background: isLatest
                        ? "linear-gradient(180deg, #4a90e2, #2c5aa0)"
                        : "linear-gradient(180deg, rgba(74,144,226,0.5), rgba(74,144,226,0.2))",
                      borderRadius: "6px 6px 0 0",
                      transition: `height 0.6s ease ${i * 0.08}s`,
                      position: "relative",
                      minHeight: 4,
                    }}
                  />
                  <div style={{ fontSize: 11, color: isLatest ? "#4a90e2" : "var(--text-muted)", fontWeight: isLatest ? 700 : 400 }}>
                    {m.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reorder Alerts */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
            ⚠️ Reorder Alerts
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {REORDER_ALERTS.map((alert) => {
              const color =
                alert.urgency === "critical" ? "#e45b5b" :
                alert.urgency === "warning" ? "#f5a623" : "#4a90e2";
              const bg =
                alert.urgency === "critical" ? "rgba(228,91,91,0.06)" :
                alert.urgency === "warning" ? "rgba(245,166,35,0.06)" : "rgba(74,144,226,0.06)";
              return (
                <div
                  key={alert.product}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: bg,
                    border: `1px solid ${color}33`,
                    borderLeft: `4px solid ${color}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{alert.product}</div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color,
                        background: bg,
                        padding: "2px 8px",
                        borderRadius: 20,
                        border: `1px solid ${color}44`,
                      }}
                    >
                      {alert.daysLeft}d left
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{alert.supplier}</div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setActiveModule && setActiveModule("buyer-reorders")}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "10px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter",
            }}
          >
            View All Reorders →
          </button>
        </div>
      </div>

      {/* ── Row 3: Spend by Category + Top Suppliers ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 20 }}>
        {/* Category Breakdown */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
            🏷️ Spend by Category
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {CATEGORY_SPEND.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{cat.name}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {formatCurrency(cat.amount)} <strong style={{ color: cat.color }}>({cat.pct}%)</strong>
                  </span>
                </div>
                <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: animatedBars ? `${cat.pct}%` : "0%",
                      background: cat.color,
                      borderRadius: 4,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Suppliers Table */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
            🏢 Top Suppliers
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Supplier", "Orders", "Spend", "Rating", "On-Time"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_SUPPLIERS.map((sup, i) => (
                <tr
                  key={sup.name}
                  style={{ borderBottom: i < TOP_SUPPLIERS.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <td style={{ padding: "12px 10px", fontWeight: 600, color: "var(--text-primary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: ["#4a90e2", "#7ed321", "#f5a623"][i] + "22",
                          color: ["#4a90e2", "#7ed321", "#f5a623"][i],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        {sup.name.charAt(0)}
                      </div>
                      <span style={{ fontSize: 12 }}>{sup.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 10px", color: "var(--text-muted)" }}>{sup.orders}</td>
                  <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {formatCurrency(sup.spend)}
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <Stars rating={sup.rating} />
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: sup.onTime >= 95 ? "#5a9e1c" : sup.onTime >= 90 ? "#b07800" : "#c0392b",
                      }}
                    >
                      {sup.onTime}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Row 4: Recent Activity + Quick Actions ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        {/* Recent Activity Feed */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
            🕐 Recent Activity
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {RECENT_ACTIVITY.map((act, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "12px 0",
                  borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: act.color + "18",
                    border: `1px solid ${act.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {act.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{act.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{act.detail}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", marginTop: 2 }}>
                  {act.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
            ⚡ Quick Actions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "New Quotation Request", icon: "📄", module: "buyer-dashboard", color: "#4a90e2" },
              { label: "View Purchase Orders", icon: "🛒", module: "buyer-purchases", color: "#7ed321" },
              { label: "Reorder History", icon: "🔄", module: "buyer-reorders", color: "#f5a623" },
              { label: "My Suppliers", icon: "🏢", module: "buyer-suppliers", color: "#9b59b6" },
              { label: "My Inventory", icon: "📦", module: "buyer-inventory", color: "#e45b5b" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => setActiveModule && setActiveModule(action.module)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: action.color + "10",
                  border: `1px solid ${action.color}33`,
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "Inter",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = action.color + "22";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = action.color + "10";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <span style={{ fontSize: 18 }}>{action.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{action.label}</span>
                <span style={{ marginLeft: "auto", color: action.color, fontSize: 16, fontWeight: 700 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
