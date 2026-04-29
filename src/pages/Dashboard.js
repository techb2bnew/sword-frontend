import React from "react";

export default function Dashboard() {
  const stats = [
    { label: "Total Revenue", value: "₹4.8M", icon: "💰", trend: "+12.5%", up: true, c: "c1 i1" },
    { label: "Active Orders", value: "142", icon: "🛒", trend: "+8.2%", up: true, c: "c2 i2" },
    { label: "Production", value: "85%", icon: "🏭", trend: "-2.4%", up: false, c: "c3 i3" },
    { label: "Customers", value: "892", icon: "👥", trend: "+14.1%", up: true, c: "c4 i4" },
    { label: "Alerts", value: "12", icon: "⚠️", trend: "Critical", up: false, c: "c5 i5" },
  ];

  return (
    <div className="fade-up">
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card ${s.c.split(" ")[0]}`}>
            <div className="stat-header">
              <div className={`stat-icon ${s.c.split(" ")[1]}`}>{s.icon}</div>
              <div className={`stat-trend ${s.up ? "up" : "down"}`}>{s.trend}</div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-body">
            <div className="section-title">Operational Efficiency</div>
            <div style={{ height: "200px", display: "flex", alignItems: "flex-end", gap: "10px", padding: "20px 0" }}>
              {[60, 80, 45, 90, 70, 85, 95].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: "var(--accent-glow)", borderRadius: "4px", position: "relative" }}>
                  <div style={{ position: "absolute", bottom: 0, width: "100%", height: "40%", background: "var(--accent)", borderRadius: "4px" }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="section-title">Recent Activity</div>
            <div className="activity-list" style={{ marginTop: "15px" }}>
              {[
                { user: "System", action: "Stock updated for SKU-882", time: "2 mins ago" },
                { user: "Rajesh", action: "Created Sales Order #SO-1042", time: "15 mins ago" },
                { user: "Anita", action: "Marked PO #102 as Received", time: "1 hour ago" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyCenter: "center", fontSize: "12px" }}>👤</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>{a.user} <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>{a.action}</span></div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
