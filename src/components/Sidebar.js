import React from "react";

export default function Sidebar({ activeModule, setActiveModule, user, onLogout }) {
  const adminMenu = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "warehouse", label: "Warehouse", icon: "🏘️" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "purchases", label: "Purchases", icon: "🤝" },
    { id: "customer-orders", label: "Customer Orders", icon: "🛒", badge: "New" },
    { id: "transport", label: "Transport", icon: "🚛" },
    // { id: "manufacturing", label: "Manufacturing", icon: "🏭" },
    { id: "finance", label: "Finance & Accounts", icon: "💰" },
    { id: "reports", label: "Reports", icon: "📈" },
  ];

  const supplierMenu = [
    { id: "supplier-dashboard", label: "Supplier Dashboard", icon: "📊" },
    { id: "supplier-quotations", label: "Quotations", icon: "📄" },
    { id: "inventory", label: "Products List", icon: "📦" },
  ];

  const customerMenu = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "customer-orders", label: "My Orders", icon: "🛒", badge: "Live" },
    { id: "profile", label: "My Profile", icon: "👤" },
  ];

  const buyerMenu = [
    { id: "buyer-dashboard", label: "Buyer Dashboard", icon: "🤝" },
    { id: "buyer-suppliers", label: "My Suppliers", icon: "🏢" },
    // { id: "buyer-quotations", label: "Quotations", icon: "📄" },
    { id: "inventory", label: "Inventory", icon: "📦" },
  ];



  const menu = user?.role === 'supplier' ? supplierMenu : user?.role === 'customer' ? customerMenu : user?.role === 'buyer' ? buyerMenu : adminMenu;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">G</div>
        <div className="sidebar-logo-text">GYRO<span>FOODS</span></div>
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
          <div className="user-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.5 }}>🚪</span>
        </div>
      </div>
    </aside>
  );
}
