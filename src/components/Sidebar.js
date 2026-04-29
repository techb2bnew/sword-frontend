import React from "react";

export default function Sidebar({ activeModule, setActiveModule, user, onLogout }) {
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "warehouse", label: "Warehouse", icon: "🏘️" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "purchases", label: "Purchases", icon: "🤝" },
    { id: "sales", label: "Sales Orders", icon: "🛒", badge: "28" },
    { id: "transport", label: "Transport", icon: "🚛" },
    { id: "manufacturing", label: "Manufacturing", icon: "🏭" },
    { id: "finance", label: "Finance & Accounts", icon: "💰" },
    { id: "reports", label: "Reports", icon: "📈" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">S</div>
        <div className="sidebar-logo-text">SWORD<span>ERP</span></div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Main Menu</div>
        {menu.map((m) => (
          <div
            key={m.id}
            className={`nav-item ${activeModule === m.id ? "active" : ""}`}
            onClick={() => setActiveModule(m.id)}
          >
            <span className="nav-icon">{m.icon}</span>
            <span>{m.label}</span>
            {m.badge && <span className="nav-badge">{m.badge}</span>}
          </div>
        ))}
      </div>

      <div className="sidebar-section" style={{ marginTop: "auto" }}>
        <div className="sidebar-section-label">System</div>
        <div className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-card" onClick={onLogout}>
          <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user.username}</div>
            <div className="user-role">{user.role}</div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.5 }}>🚪</span>
        </div>
      </div>
    </aside>
  );
}
