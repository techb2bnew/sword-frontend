import React from "react";

export default function Finance() {
  return (
    <div className="fade-up">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {[
          { label: "Cash on Hand", value: "₹2.4M", icon: "🏦", c: "c1 i1" },
          { label: "Receivables",  value: "₹840k", icon: "📩", c: "c2 i2" },
          { label: "Payables",     value: "₹310k", icon: "📤", c: "c5 i5" },
          { label: "Net Profit",   value: "₹1.2M", icon: "📈", c: "c4 i4" },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.c.split(" ")[0]}`}>
            <div className={`stat-icon ${s.c.split(" ")[1]}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-body">
          <div className="section-title">General Ledger (Recent)</div>
          <div className="table-wrap" style={{ marginTop: "15px" }}>
            <table>
              <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  { d: "28 Apr", desc: "Purchase – Raw Materials", t: "Debit",  a: "₹45,000", s: "Completed" },
                  { d: "27 Apr", desc: "Sales Income – #SO-1040",   t: "Credit", a: "₹28,900", s: "Completed" },
                  { d: "26 Apr", desc: "Electricity Bill",          t: "Debit",  a: "₹12,400", s: "Pending" },
                ].map((l, i) => (
                  <tr key={i}>
                    <td>{l.d}</td>
                    <td>{l.desc}</td>
                    <td style={{ color: l.t === "Credit" ? "var(--accent-4)" : "var(--accent-5)" }}>{l.t}</td>
                    <td style={{ fontWeight: 600 }}>{l.a}</td>
                    <td><span className={`pill ${l.s === "Completed" ? "green" : "yellow"}`}>{l.s}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
