import React, { useState } from "react";
import axios from "axios";
import { API } from "../config";

export default function AuthPage({ onLogin, push }) {
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
      setError(err.response?.data?.error || "Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow g1"></div>
      <div className="login-bg-glow g2"></div>
      
      <div className="login-card fade-up">
        <div className="login-logo">
          <div className="login-logo-icon">S</div>
          <div className="login-logo-text">SWORD<span>ERP</span></div>
        </div>

        <div className="login-tab-row">
          <button className={`login-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
          <button className={`login-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Register</button>
        </div>

        {error && <div style={{ color: "var(--accent-5)", background: "rgba(244,63,94,0.1)", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "13px" }}>{error}</div>}

        <div className="form-group" style={{ marginBottom: "15px" }}>
          {tab === "register" && (
            <>
              <label>Username</label>
              <input value={form.username} onChange={set("username")} placeholder="John Doe" />
            </>
          )}
          <label style={{ marginTop: tab === "register" ? "15px" : 0 }}>Email Address</label>
          <input value={form.email} onChange={set("email")} placeholder="name@company.com" />
          
          <label style={{ marginTop: "15px" }}>Password</label>
          <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />

          {tab === "register" && (
            <>
              <label style={{ marginTop: "15px" }}>Role</label>
              <select value={form.role} onChange={set("role")} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "var(--bg-base)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
        </div>

        <button className="btn btn-primary" onClick={submit} style={{ width: "100%", height: "45px", marginTop: "10px" }} disabled={loading}>
          {loading ? "Authenticating..." : tab === "login" ? "Sign In" : "Create Account"}
        </button>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "var(--text-muted)" }}>
          {tab === "login" ? "Forgot your password?" : "By joining, you agree to our Terms"}
        </div>
      </div>
    </div>
  );
}
