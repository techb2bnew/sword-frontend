import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5001/api";

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === "success" ? "✅" : "❌"}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);
  return { toasts, push };
}

// ── Auth Page ──────────────────────────────────────────────────────────────
function AuthPage({ onLogin, push }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "staff" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (tab === "login") {
        const res = await axios.post(`${API}/auth/login`, { email: form.email, password: form.password });
        localStorage.setItem("erp_token", res.data.token);
        localStorage.setItem("erp_user", JSON.stringify(res.data.user));
        onLogin(res.data.user);
        push("Welcome back, " + res.data.user.username + "!");
      } else {
        await axios.post(`${API}/auth/register`, { username: form.username, email: form.email, password: form.password, role: form.role });
        push("Account created! Please log in.");
        setTab("login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow g1" />
      <div className="login-bg-glow g2" />
      <div className="login-card fade-up">
        <div className="login-logo">
          <div className="login-logo-icon">S</div>
          <div className="login-logo-text">Sword<span>ERP</span></div>
        </div>
        <div className="login-tab-row">
          <button className={`login-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`login-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Register</button>
        </div>
        <p className="login-sub">{tab === "login" ? "Access your ERP dashboard" : "Create a new account"}</p>
        <div className="login-form">
          {error && <div className="login-error">{error}</div>}
          {tab === "register" && (
            <div>
              <label>Username</label>
              <input placeholder="johndoe" value={form.username} onChange={set("username")} />
            </div>
          )}
          <div>
            <label>Email Address</label>
            <input type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
          </div>
          {tab === "register" && (
            <div>
              <label>Role</label>
              <select value={form.role} onChange={set("role")}>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <button className="login-btn" onClick={submit} disabled={loading}>
            {loading ? "Please wait…" : tab === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ products }) {
  const bars = [35, 55, 40, 70, 60, 85, 75, 90, 65, 80, 95, 70];
  const activity = [
    { color: "#6366f1", text: <><strong>New product</strong> added to Inventory</>, time: "2 min ago" },
    { color: "#22d3ee", text: <><strong>Sales order</strong> #1042 dispatched</>, time: "15 min ago" },
    { color: "#10b981", text: <><strong>Stock replenished</strong> for SKU-4421</>, time: "1 hr ago" },
    { color: "#f59e0b", text: <><strong>Low stock alert</strong> on 3 items</>, time: "2 hr ago" },
    { color: "#f43f5e", text: <><strong>Finance report</strong> generated for April</>, time: "Today" },
  ];
  return (
    <div className="fade-up">
      <div className="stats-grid">
        {[
          { label: "Total Products", value: products.length, icon: "📦", trend: "+12%", up: true, c: "c1 i1" },
          { label: "Sales Orders",   value: "148",           icon: "🛒", trend: "+8%",  up: true, c: "c2 i2" },
          { label: "Revenue (₹)",    value: "4.2L",          icon: "💰", trend: "+21%", up: true, c: "c3 i3" },
          { label: "Warehouse Bins", value: "320",           icon: "🏭", trend: "+3%",  up: true, c: "c4 i4" },
          { label: "Pending GST",    value: "₹18K",          icon: "🧾", trend: "-2%",  up: false, c: "c5 i5" },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.c.split(" ")[0]}`}>
            <div className="stat-header">
              <div className={`stat-icon ${s.c.split(" ")[1]}`}>{s.icon}</div>
              <span className={`stat-trend ${s.up ? "up" : "down"}`}>{s.trend}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-body">
            <div className="section-header">
              <div className="section-title">Monthly Revenue <span>2026</span></div>
            </div>
            <div className="mini-chart" style={{ height: 80 }}>
              {bars.map((h, i) => (
                <div key={i} className="mini-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--text-muted)" }}>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="section-header">
              <div className="section-title">Recent Activity</div>
            </div>
            <div className="activity-list">
              {activity.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{ background: a.color }} />
                  <div>
                    <div className="activity-text">{a.text}</div>
                    <div className="activity-time">{a.time}</div>
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

// ── Inventory ──────────────────────────────────────────────────────────────
function Inventory({ products, onRefresh, push }) {
  const [form, setForm] = useState({ name: "", price: "", barcode: "", stock: 0 });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const resetForm = () => {
    setForm({ name: "", price: "", barcode: "", stock: 0 });
    setEditId(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      push("Name and Price are required", "error");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/inventory/products/${editId}`, form);
        push("Product updated successfully!");
      } else {
        await axios.post(`${API}/inventory/products`, form);
        push("Product added successfully!");
      }
      resetForm();
      await onRefresh();
    } catch {
      push(`Failed to ${editId ? "update" : "add"} product`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, price: p.price, barcode: p.barcode || "", stock: p.stock || 0 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/inventory/products/${id}`);
      push("Product deleted successfully!");
      await onRefresh();
    } catch {
      push("Failed to delete product", "error");
    }
  };

  const getStockPill = (stock) => {
    if (stock <= 0) return <span className="pill red">Out of Stock</span>;
    if (stock <= 10) return <span className="pill yellow">Low Stock ({stock})</span>;
    return <span className="pill green">In Stock ({stock})</span>;
  };

  return (
    <div className="fade-up">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <div className="section-header">
            <div className="section-title">{editId ? "Edit Product" : "Add New Product"}</div>
            {editId && (
              <button className="btn btn-secondary btn-sm" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input placeholder="e.g. Wireless Keyboard" value={form.name} onChange={set("name")} />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" placeholder="e.g. 1299" value={form.price} onChange={set("price")} />
            </div>
            <div className="form-group">
              <label>Barcode / SKU</label>
              <input placeholder="e.g. SKU-4421" value={form.barcode} onChange={set("barcode")} />
            </div>
            <div className="form-group">
              <label>Quantity in Stock</label>
              <input type="number" placeholder="0" value={form.stock} onChange={set("stock")} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : editId ? "Update Product" : "＋ Add Product"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div className="section-header">
            <div className="section-title">
              Product Catalogue <span>{products.length} items</span>
            </div>
          </div>
        </div>
        <div className="table-wrap">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📦</div>
              <p>No products yet. Add your first one above.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Barcode</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                    <td>{p.name}</td>
                    <td style={{ color: "#10b981", fontWeight: 600 }}>
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span style={{ fontFamily: "monospace", color: "var(--accent-2)", fontSize: 12 }}>
                        {p.barcode || "—"}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.stock || 0}</td>
                    <td>{getStockPill(p.stock)}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)} style={{ padding: "5px 10px", fontSize: 12, marginRight: 5 }}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)} style={{ padding: "5px 10px", fontSize: 12 }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sales ──────────────────────────────────────────────────────────────────
function Sales({ push }) {
  const orders = [
    { id: "#SO-1042", customer: "Raj Enterprises", items: 5, value: "₹12,400", date: "28 Apr 2026", status: "Dispatched" },
    { id: "#SO-1041", customer: "TechZone Pvt Ltd", items: 2, value: "₹3,200",  date: "27 Apr 2026", status: "Processing" },
    { id: "#SO-1040", customer: "Mega Retail Co.",  items: 8, value: "₹28,900", date: "26 Apr 2026", status: "Delivered" },
    { id: "#SO-1039", customer: "Sunrise Trading",  items: 3, value: "₹6,750",  date: "25 Apr 2026", status: "On Hold" },
  ];
  const statusClass = { Dispatched: "cyan", Processing: "yellow", Delivered: "green", "On Hold": "red" };
  return (
    <div className="fade-up">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { label: "Total Orders", value: "148", icon: "🛒", c: "c2 i2" },
          { label: "Delivered",    value: "120", icon: "✅", c: "c4 i4" },
          { label: "Pending",      value: "28",  icon: "⏳", c: "c3 i3" },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.c.split(" ")[0]}`}>
            <div className={`stat-icon ${s.c.split(" ")[1]}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div className="section-header">
            <div className="section-title">Sales Orders</div>
            <button className="btn btn-primary" onClick={() => push("Feature coming soon!", "error")}>＋ New Order</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Value</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ color: "#a5b4fc", fontWeight: 600 }}>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.items}</td>
                  <td style={{ color: "#10b981", fontWeight: 600 }}>{o.value}</td>
                  <td>{o.date}</td>
                  <td><span className={`pill ${statusClass[o.status]}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Warehouse ──────────────────────────────────────────────────────────────
function Warehouse() {
  const bins = [
    { bin: "A-01", product: "Wireless Keyboard", qty: 120, capacity: 200, status: "Normal" },
    { bin: "A-02", product: "USB-C Hub",          qty: 15,  capacity: 100, status: "Low" },
    { bin: "B-01", product: "Monitor Stand",      qty: 200, capacity: 200, status: "Full" },
    { bin: "B-03", product: "Laptop Sleeve 15\"", qty: 80,  capacity: 150, status: "Normal" },
    { bin: "C-02", product: "Mechanical Mouse",   qty: 5,   capacity: 80,  status: "Critical" },
  ];
  const sc = { Normal: "green", Low: "yellow", Full: "blue", Critical: "red" };
  return (
    <div className="fade-up">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {[
          { label: "Total Bins", value: "320", icon: "🏭", c: "c1 i1" },
          { label: "Occupied",   value: "218", icon: "📦", c: "c2 i2" },
          { label: "Low Stock",  value: "14",  icon: "⚠️", c: "c3 i3" },
          { label: "Dispatches", value: "32",  icon: "🚚", c: "c4 i4" },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.c.split(" ")[0]}`}>
            <div className={`stat-icon ${s.c.split(" ")[1]}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Bin Occupancy</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Bin</th><th>Product</th><th>Qty</th><th>Occupancy</th><th>Status</th></tr></thead>
            <tbody>
              {bins.map((b) => (
                <tr key={b.bin}>
                  <td style={{ color: "#a5b4fc", fontWeight: 600 }}>{b.bin}</td>
                  <td>{b.product}</td>
                  <td>{b.qty} / {b.capacity}</td>
                  <td style={{ minWidth: 140 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(b.qty / b.capacity) * 100}%` }} />
                    </div>
                  </td>
                  <td><span className={`pill ${sc[b.status]}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Finance ────────────────────────────────────────────────────────────────
function Finance() {
  const ledger = [
    { date: "28 Apr", desc: "Sales Revenue – April",    debit: "",        credit: "₹4,20,000", balance: "₹4,20,000" },
    { date: "27 Apr", desc: "Purchase – Raw Materials", debit: "₹80,000", credit: "",          balance: "₹3,40,000" },
    { date: "25 Apr", desc: "GST Payment Q1",           debit: "₹18,000", credit: "",          balance: "₹3,22,000" },
    { date: "22 Apr", desc: "Vendor Payment – LogiCo",  debit: "₹12,500", credit: "",          balance: "₹3,09,500" },
    { date: "20 Apr", desc: "Customer Advance Received",debit: "",        credit: "₹25,000",   balance: "₹3,34,500" },
  ];
  return (
    <div className="fade-up">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {[
          { label: "Total Revenue", value: "₹4.2L", icon: "💰", c: "c4 i4" },
          { label: "Expenses",      value: "₹1.1L", icon: "📉", c: "c5 i5" },
          { label: "GST Payable",   value: "₹18K",  icon: "🧾", c: "c3 i3" },
          { label: "Net Profit",    value: "₹3.1L", icon: "📈", c: "c1 i1" },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.c.split(" ")[0]}`}>
            <div className={`stat-icon ${s.c.split(" ")[1]}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>General Ledger</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Description</th><th>Debit</th><th>Credit</th><th>Balance</th></tr></thead>
            <tbody>
              {ledger.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--text-muted)" }}>{r.date}</td>
                  <td>{r.desc}</td>
                  <td style={{ color: "#f43f5e", fontWeight: 600 }}>{r.debit || "—"}</td>
                  <td style={{ color: "#10b981", fontWeight: 600 }}>{r.credit || "—"}</td>
                  <td style={{ color: "#a5b4fc", fontWeight: 700 }}>{r.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard",  icon: "⚡", section: "main" },
  { id: "inventory", label: "Inventory",  icon: "📦", section: "main" },
  { id: "sales",     label: "Sales",      icon: "🛒", section: "main" },
  { id: "warehouse", label: "Warehouse",  icon: "🏭", section: "main" },
  { id: "finance",   label: "Finance",    icon: "💰", section: "main" },
  { id: "reports",   label: "Reports",    icon: "📊", section: "tools", badge: "New" },
];

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("erp_user")); } catch { return null; }
  });
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const { toasts, push } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/inventory/products`);
      setProducts(res.data);
    } catch {}
  }, []);

  useEffect(() => { if (user) fetchProducts(); }, [user, fetchProducts]);

  const logout = () => {
    localStorage.removeItem("erp_token");
    localStorage.removeItem("erp_user");
    setUser(null);
    push("Logged out successfully");
  };

  if (!user) return (<><AuthPage onLogin={setUser} push={push} /><Toast toasts={toasts} /></>);

  const titles = { dashboard: "Dashboard", inventory: "Inventory Management", sales: "Sales & Orders", warehouse: "Warehouse", finance: "Finance & Ledger", reports: "Reports" };

  return (
    <>
      <div className="app-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">S</div>
            <div className="sidebar-logo-text">Sword<span>ERP</span></div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Main Menu</div>
            {NAV.filter(n => n.section === "main").map((n) => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span> {n.label}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Tools</div>
            {NAV.filter(n => n.section === "tools").map((n) => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span> {n.label}
                {n.badge && <span className="nav-badge">{n.badge}</span>}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="user-card" onClick={logout} title="Click to logout">
              <div className="user-avatar">{user.username?.[0]?.toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                <div className="user-role">{user.role} · Sign out</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="main-content">
          <header className="topbar">
            <div style={{ flex: 1 }}>
              <div className="topbar-title">{titles[page]}</div>
              <div className="topbar-subtitle">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            <div className="topbar-search">
              <span className="search-icon">🔍</span>
              <input placeholder="Search anything…" />
            </div>
            <div className="topbar-btn" title="Notifications"><span>🔔</span><span className="badge">3</span></div>
            <div className="topbar-btn" title="Settings"><span>⚙️</span></div>
          </header>

          <main className="page">
            {page === "dashboard" && <Dashboard products={products} />}
            {page === "inventory" && <Inventory products={products} onRefresh={fetchProducts} push={push} />}
            {page === "sales"     && <Sales push={push} />}
            {page === "warehouse" && <Warehouse />}
            {page === "finance"   && <Finance />}
            {page === "reports"   && (
              <div className="empty-state fade-up">
                <div className="icon">📊</div>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 600 }}>Reports module coming soon</p>
                <p>Advanced analytics and export features are under development.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Toast toasts={toasts} />
    </>
  );
}