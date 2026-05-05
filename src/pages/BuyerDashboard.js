import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { API } from "../config";

// ── Dummy supplier catalog (prototype) ───────────────────────────────────────
const SUPPLIER_CATALOG = {
  // keyed by supplier id — will be merged with fetched suppliers
  1: {
    items: [
      { name: "Wheat Flour (Atta)", category: "Grains", qty_purchased: 1200, unit: "kg", avg_price: 42, last_price: 44, last_order: "2026-04-28" },
      { name: "Rice (Basmati)", category: "Grains", qty_purchased: 800, unit: "kg", avg_price: 95, last_price: 98, last_order: "2026-04-25" },
      { name: "Soybean Oil", category: "Oils", qty_purchased: 300, unit: "ltr", avg_price: 145, last_price: 140, last_order: "2026-04-20" },
    ],
    total_orders: 34, total_spent: 875000, rating: 4.5,
  },
  2: {
    items: [
      { name: "Red Chilli Powder", category: "Spices", qty_purchased: 500, unit: "kg", avg_price: 280, last_price: 290, last_order: "2026-04-30" },
      { name: "Turmeric Powder", category: "Spices", qty_purchased: 350, unit: "kg", avg_price: 180, last_price: 175, last_order: "2026-04-22" },
      { name: "Cumin Seeds", category: "Spices", qty_purchased: 200, unit: "kg", avg_price: 420, last_price: 430, last_order: "2026-04-18" },
    ],
    total_orders: 21, total_spent: 432000, rating: 4.2,
  },
  3: {
    items: [
      { name: "BOPP Bags (25kg)", category: "Packaging", qty_purchased: 5000, unit: "pcs", avg_price: 18, last_price: 19, last_order: "2026-04-10" },
      { name: "Corrugated Boxes", category: "Packaging", qty_purchased: 2000, unit: "pcs", avg_price: 35, last_price: 34, last_order: "2026-03-28" },
    ],
    total_orders: 12, total_spent: 198000, rating: 3.8,
  },
};

const supplierCatalogList = Object.entries(SUPPLIER_CATALOG).map(([id, data]) => ({
  id,
  name:
    id === "1"
      ? "Agro Fresh Pvt Ltd"
      : id === "2"
      ? "Krishna Spices & Co"
      : id === "3"
      ? "National Packaging Solutions"
      : `Supplier ${id}`,
  contact_person:
    id === "1"
      ? "Ramesh Sharma"
      : id === "2"
      ? "Sunil Verma"
      : id === "3"
      ? "Priya Mehta"
      : "",
  items: data.items
}));

function formatCurrency(val) {
  return "£" + Number(val).toLocaleString("en-IN");
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = "";
  for (let i = 0; i < full; i++) s += "★";
  if (half) s += "½";
  return s;
}

export default function BuyerDashboard({ products, push }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quotationForm, setQuotationForm] = useState({
    supplier_id: "",
    product_id: "",
    quantity: 1,
    unit_price: "",
    valid_until: "",
    expected_delivery: "",
    notes: "",
    credit_days: 0
  });

  const [buyerQuotations, setBuyerQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(true);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [statusPayload, setStatusPayload] = useState({ status: 'Confirmed', supplier_notes: '' });

  // Supplier dropdown state
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
  const [expandedSupplier, setExpandedSupplier] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSupplierDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch suppliers registered by the admin
  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/purchases/suppliers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("erp_token")}` }
      });
      setSuppliers(res.data);
    } catch {
      if (push) push("Failed to fetch suppliers", "error");
    }
  }, [push]);

  // Fetch quotations made by the buyer to these suppliers
  const fetchQuotations = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/quotations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("erp_token")}` }
      });
      setBuyerQuotations(res.data);
    } catch {
      if (push) push("Failed to fetch past quotations", "error");
    } finally {
      setLoadingQuotations(false);
    }
  }, [push]);

  useEffect(() => {
    fetchSuppliers();
    fetchQuotations();
  }, [fetchSuppliers, fetchQuotations]);

  const openStatusModal = (quotation) => {
    console.log("Selected quotation:", quotation);
    setSelectedQuotation(quotation);
    setStatusPayload({
      status: quotation.status === 'Confirmed' ? 'Received' : 'Confirmed',
      supplier_notes: quotation.supplier_notes || ''
    });
    setStatusModal(true);
  };

  const closeStatusModal = () => {
    setStatusModal(false);
    setSelectedQuotation(null);
    setStatusPayload({ status: 'Confirmed', supplier_notes: '' });
  };

  const updateQuotationStatus = async () => {
  if (!selectedQuotation?.id) {
    if (push) push("Quotation ID missing", "error");
    return;
  }

  const payload = {
    status: statusPayload.status,
    supplier_notes: statusPayload.supplier_notes
  };

  setLoading(true);

  try {
    await axios.put(`${API}/quotations/${selectedQuotation.id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("erp_token")}`
      }
    });

    if (push) push("Quotation status updated successfully", "success");

    await fetchQuotations();
    closeStatusModal();
  } catch (err) {
    if (push) {
      push(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Error updating quotation status",
        "error"
      );
    }
  } finally {
    setLoading(false);
  }
};

  const submitQuotation = async (e) => {
    e.preventDefault();
    if (!quotationForm.supplier_id || !quotationForm.product_id || !quotationForm.quantity || !quotationForm.unit_price) {
      if (push) push("Please fill all required fields", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/quotations`, quotationForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem("erp_token")}` }
      });
      if (push) push("Quotation successfully requested from Supplier!", "success");
      
      // Reset form
      setQuotationForm({
        supplier_id: "",
        product_id: "",
        quantity: 1,
        unit_price: "",
        valid_until: "",
        expected_delivery: "",
        notes: "",
        credit_days: 0
      });
      
      fetchQuotations(); // Refresh list
    } catch (err) {
      if (push) push(err.response?.data?.error || "Error submitting quotation", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">Buyer & Procurement Dashboard</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Select a supplier and request a quotation to buy goods.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        
        {/* RFQ Form Section */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header" style={{ padding: '20px 20px 0', borderBottom: 'none' }}>
            <div className="section-title">New Request for Quotation</div>
          </div>
          <div className="card-body">
            <form onSubmit={submitQuotation} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              <div className="form-group">
                <label>Target Supplier</label>
                <select
                  className="form-control"
                  value={quotationForm.supplier_id}
                  onChange={(e) =>
                    setQuotationForm({
                      ...quotationForm,
                      supplier_id: e.target.value,
                      product_id: ""
                    })
                  }
                  required
                >
                  <option value="">-- Choose Supplier --</option>

                  {supplierCatalogList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.contact_person})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Target Product</label>
                <select
                  className="form-control"
                  value={quotationForm.product_id}
                  onChange={(e) =>
                    setQuotationForm({
                      ...quotationForm,
                      product_id: e.target.value
                    })
                  }
                  required
                  disabled={!quotationForm.supplier_id}
                >
                  <option value="">
                    {quotationForm.supplier_id ? "-- Choose Product --" : "-- Choose Supplier First --"}
                  </option>

                  {supplierCatalogList
                    .find((s) => String(s.id) === String(quotationForm.supplier_id))
                    ?.items.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label>Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-control" 
                    value={quotationForm.quantity} 
                    onChange={e => setQuotationForm({...quotationForm, quantity: parseInt(e.target.value)})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Expected Price (£)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 500"
                    value={quotationForm.unit_price} 
                    onChange={e => setQuotationForm({...quotationForm, unit_price: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label>Valid Until</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={quotationForm.valid_until} 
                    onChange={e => setQuotationForm({...quotationForm, valid_until: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Expected Delivery</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={quotationForm.expected_delivery} 
                    onChange={e => setQuotationForm({...quotationForm, expected_delivery: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Credit Days</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={quotationForm.credit_days} 
                  onChange={e => setQuotationForm({...quotationForm, credit_days: parseInt(e.target.value)})}
                />
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea 
                  className="form-control" 
                  style={{ minHeight: 60, padding: 10, fontFamily: 'Inter', fontSize: 13, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  placeholder="Any special requirements..."
                  value={quotationForm.notes} 
                  onChange={e => setQuotationForm({...quotationForm, notes: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8, padding: 12, justifyContent: 'center' }}>
                {loading ? 'Submitting...' : 'Send Quotation Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Sent Quotations List Section */}
        <div className="card">
          <div className="card-header" style={{ padding: '20px 20px 0', borderBottom: 'none' }}>
            <div className="section-title">My Submitted Quotations</div>
          </div>
          <div className="table-wrap">
            {loadingQuotations ? (
              <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>Loading...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Supplier</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Expected Price</th>
                    <th>Status</th>
                    <th>Supplier Notes</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buyerQuotations.map(q => (
                    <tr key={q.id}>
                      <td>{new Date(q.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>{q.supplier_name}</td>
                      <td>{q.product_name}</td>
                      <td>{q.quantity}</td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-4)' }}>£{q.unit_price}</td>
                      <td>
                        <span className={`pill ${q.status === 'Accepted' ? 'green' : q.status === 'Rejected' ? 'red' : 'blue'}`}>
                          {q.status}
                        </span>
                      </td>
                      <td>{q.supplier_notes || "-"}</td>

                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => openStatusModal(q)}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                  {buyerQuotations.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
                        No quotation requests sent yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>


      {statusModal && selectedQuotation && (
  <div className="modal-overlay">
    <div className="modal" style={{ maxWidth: 480 }}>
      <div className="modal-header">
        <div>
          <h3 style={{ margin: 0, fontSize: 20 }}>Update Status</h3>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
            Update quotation status and supplier notes.
          </p>
        </div>

        <button
          type="button"
          onClick={closeStatusModal}
          style={{
            border: "none",
            background: "transparent",
            fontSize: 24,
            cursor: "pointer",
            color: "var(--text-muted)"
          }}
        >
          ×
        </button>
      </div>

      <div className="modal-body" style={{ paddingTop: 18 }}>
        <div className="form-group">
          <label>Status</label>
          <select
            className="form-control"
            value={statusPayload.status}
            onChange={(e) =>
              setStatusPayload({ ...statusPayload, status: e.target.value })
            }
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Received">Received</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="form-group">
          <label>Supplier Notes</label>
          <textarea
            className="form-control"
            style={{ minHeight: 90, resize: "vertical" }}
            value={statusPayload.supplier_notes}
            onChange={(e) =>
              setStatusPayload({
                ...statusPayload,
                supplier_notes: e.target.value
              })
            }
            placeholder="Write supplier notes here..."
          />
        </div>
      </div>

      <div
        className="modal-footer"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          paddingTop: 16
        }}
      >
        <button type="button" className="btn btn-secondary" onClick={closeStatusModal}>
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-primary"
          disabled={loading}
          onClick={updateQuotationStatus}
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  </div>
)}      

    </div>
  );
}
