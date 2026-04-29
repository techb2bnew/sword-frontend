import React from "react";

export default function Topbar({ activeModule }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)}
        <div className="topbar-subtitle">Manage your {activeModule} and operations</div>
      </div>

      <div className="topbar-search">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search anything..." />
      </div>

      <div className="topbar-btn">
        <span>🔔</span>
        <div className="badge">3</div>
      </div>

      <div className="topbar-btn">
        <span>💬</span>
      </div>
    </header>
  );
}
