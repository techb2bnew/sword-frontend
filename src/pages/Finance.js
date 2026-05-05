import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API } from "../config";
import Modal from "../components/Modal";

export default function Finance({ push }) {
  const [stats, setStats] = useState({ cashOnHand: "₹0", receivables: "₹0", payables: "₹0", netProfit: "₹0" });
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    type: "Debit",
    amount: "",
    status: "Completed",
    category: "Other",
    reference_id: ""
  });

  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      const [statsRes, ledgerRes] = await Promise.all([
        axios.get(`${API}/finance/stats`, { headers }),
        axios.get(`${API}/finance/ledger`, { headers })
      ]);
      setStats(statsRes.data);
      setLedger(ledgerRes.data);
    } catch {
      push("Failed to load finance data", "error");
    }
  }, [push]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddTransaction = async () => {
    if (!form.description || !form.amount) return push("Description and Amount are required", "error");
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      await axios.post(`${API}/finance/ledger`, form, { headers });
      push("Transaction added successfully", "success");
      setShowModal(false);
      setForm({ date: new Date().toISOString().split('T')[0], description: "", type: "Debit", amount: "", status: "Completed", category: "Other", reference_id: "" });
      fetchData();
    } catch {
      push("Failed to add transaction", "error");
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("erp_token")}` };
      await axios.put(`${API}/finance/ledger/${id}/status`, { status: 'Completed' }, { headers });
      push("Transaction marked as completed", "success");
      fetchData();
    } catch {
      push("Failed to update status", "error");
    }
  };

  const statCards = [
    { label: "Cash on Hand", value: stats.cashOnHand, icon: "🏦", c: "c1 i1" },
    { label: "Receivables (Sales)",  value: stats.receivables, icon: "📩", c: "c2 i2" },
    { label: "Payables (Purchases)", value: stats.payables, icon: "📤", c: "c5 i5" },
    { label: "Net Profit",   value: stats.netProfit, icon: "📈", c: "c4 i4" },
  ];

  return (
    <div className="fade-up">
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div className="section-title">Finance & Automated Accounts</div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ Record Manual Transaction</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {statCards.map((s) => (
          <div key={s.label} className={`stat-card ${s.c.split(" ")[0]}`}>
            <div className={`stat-icon ${s.c.split(" ")[1]}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((l) => (
                <tr key={`${l.id}-${l.source}`}>
                  <td style={{ fontWeight: 600 }}>{new Date(l.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                  <td>
                    <span className="pill gray" style={{ fontSize: 10, background: l.source === 'auto' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)', color: l.source === 'auto' ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {l.source === 'auto' ? '⚡ ' : '📝 '}{l.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{l.description}</div>
                  </td>
                  <td style={{ color: l.type === "Credit" ? "var(--accent-4)" : "var(--accent-5)", fontWeight: 700 }}>{l.type.toUpperCase()}</td>
                  <td style={{ fontWeight: 800, fontSize: 15 }}>₹{parseFloat(l.amount).toLocaleString('en-IN')}</td>
                  <td><span className={`pill ${l.status === "Completed" ? "green" : "yellow"}`}>{l.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    {l.status === "Pending" && l.source === "manual" ? (
                      <button className="btn btn-secondary btn-sm" onClick={() => markCompleted(l.id)}>Mark Paid</button>
                    ) : <span style={{ opacity: 0.3 }}>—</span>}
                  </td>
                </tr>
              ))}
              {ledger.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Record Manual Transaction" onClose={() => setShowModal(false)} onConfirm={handleAddTransaction} loading={loading}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            <div className="form-group">
              <label>Transaction Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="Debit">Debit (Money Out)</option>
                <option value="Credit">Credit (Money In)</option>
              </select>
            </div>
            
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Expense / Income Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="Driver Salary">Driver Salary</option>
                <option value="Transport Cost">Transport Cost / Fuel</option>
                <option value="Utilities">Utilities (Electricity, Water)</option>
                <option value="Warehouse Rent">Warehouse Rent</option>
                <option value="Equipment Maintenance">Equipment Maintenance</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Description / Notes</label><input placeholder="e.g. Ramesh Monthly Salary" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            
            <div className="form-group"><label>Amount (₹)</label><input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
            <div className="form-group">
              <label>Payment Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="Completed">Completed / Paid</option>
                <option value="Pending">Pending / Unpaid</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
