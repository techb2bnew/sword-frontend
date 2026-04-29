import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API } from "./config";

// Components
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Pages
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Transport from "./pages/Transport";
import Warehouse from "./pages/Warehouse";
import Finance from "./pages/Finance";

// ── Toast Hook ──────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);
  return { toasts, push };
}

// ── App Orchestrator ────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const { toasts, push } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/inventory/products`);
      setProducts(res.data);
    } catch {
      push("Failed to load inventory data", "error");
    }
  }, [push]);

  useEffect(() => {
    const savedUser = localStorage.getItem("erp_user");
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchProducts();
  }, [fetchProducts]);

  const handleLogout = () => {
    localStorage.removeItem("erp_token");
    localStorage.removeItem("erp_user");
    setUser(null);
    push("Logged out successfully");
  };

  if (!user) return <AuthPage onLogin={setUser} push={push} />;

  return (
    <div className="app-layout">
      <Toast toasts={toasts} />
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        user={user} 
        onLogout={handleLogout} 
      />

      <main className="main-content">
        <Topbar activeModule={activeModule} />
        
        <div className="page">
          {activeModule === "dashboard" && <Dashboard />}
          {activeModule === "warehouse" && <Warehouse products={products} push={push} />}
          {activeModule === "inventory" && <Inventory products={products} onRefresh={fetchProducts} push={push} />}
          {activeModule === "purchases" && <Purchases products={products} onRefreshProducts={fetchProducts} push={push} />}
          {activeModule === "sales" && <Sales push={push} />}
          {activeModule === "transport" && <Transport push={push} />}
          {activeModule === "finance" && <Finance />}
          {["manufacturing", "reports"].includes(activeModule) && (
            <div className="empty-state">
              <div className="icon">🏗️</div>
              <p>{activeModule.charAt(0).toUpperCase() + activeModule.slice(1)} module is under development.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;