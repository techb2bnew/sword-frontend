import React, { useState, useEffect, useCallback } from "react";

// ── Dummy Reorder History with consumption data ─────────────────────────────
const DUMMY_REORDER_HISTORY = [
  {
    id: 1,
    product_id: 101,
    product_name: "Wheat Flour (Atta)",
    supplier_id: 1,
    supplier_name: "Agro Fresh Pvt Ltd",
    quantity: 1200,
    unit_price: 42,
    total_amount: 50400,
    status: "Received",
    last_order_date: "2026-04-28",
    notes: "Good quality, delivered on time",
    consumption_per_day: 60,
    days_in_stock: 40,
    price_trend: -5,
    reorder_point: 500,
    lead_time_days: 5,
  },
  {
    id: 2,
    product_id: 102,
    product_name: "Rice (Basmati)",
    supplier_id: 1,
    supplier_name: "Agro Fresh Pvt Ltd",
    quantity: 800,
    unit_price: 95,
    total_amount: 76000,
    status: "Received",
    last_order_date: "2026-04-25",
    notes: "Premium quality basmati",
    consumption_per_day: 32,
    days_in_stock: 50,
    price_trend: 3,
    reorder_point: 350,
    lead_time_days: 7,
  },
  {
    id: 3,
    product_id: 103,
    product_name: "Soybean Oil",
    supplier_id: 1,
    supplier_name: "Agro Fresh Pvt Ltd",
    quantity: 300,
    unit_price: 145,
    total_amount: 43500,
    status: "Accepted",
    last_order_date: "2026-04-20",
    notes: "Cold pressed oil",
    consumption_per_day: 5,
    days_in_stock: 9,
    price_trend: 8,
    reorder_point: 100,
    lead_time_days: 5,
  },
  {
    id: 4,
    product_id: 104,
    product_name: "Red Chilli Powder",
    supplier_id: 2,
    supplier_name: "Krishna Spices & Co",
    quantity: 500,
    unit_price: 280,
    total_amount: 140000,
    status: "Received",
    last_order_date: "2026-04-30",
    notes: "Fine grind, excellent quality",
    consumption_per_day: 20,
    days_in_stock: 42,
    price_trend: -2,
    reorder_point: 200,
    lead_time_days: 6,
  },
  {
    id: 5,
    product_id: 105,
    product_name: "Turmeric Powder",
    supplier_id: 2,
    supplier_name: "Krishna Spices & Co",
    quantity: 350,
    unit_price: 180,
    total_amount: 63000,
    status: "Received",
    last_order_date: "2026-04-22",
    notes: "",
    consumption_per_day: 10,
    days_in_stock: 62,
    price_trend: 0,
    reorder_point: 150,
    lead_time_days: 6,
  },
  {
    id: 6,
    product_id: 106,
    product_name: "Cumin Seeds",
    supplier_id: 2,
    supplier_name: "Krishna Spices & Co",
    quantity: 200,
    unit_price: 420,
    total_amount: 84000,
    status: "Confirmed",
    last_order_date: "2026-04-18",
    notes: "Fresh crop seeds",
    consumption_per_day: 4,
    days_in_stock: 70,
    price_trend: 5,
    reorder_point: 100,
    lead_time_days: 8,
  },
  {
    id: 7,
    product_id: 107,
    product_name: "BOPP Bags (25kg)",
    supplier_id: 3,
    supplier_name: "National Packaging Solutions",
    quantity: 5000,
    unit_price: 18,
    total_amount: 90000,
    status: "Received",
    last_order_date: "2026-04-10",
    notes: "Durable bags, 50 micron thickness",
    consumption_per_day: 200,
    days_in_stock: 42,
    price_trend: -3,
    reorder_point: 2000,
    lead_time_days: 4,
  },
  {
    id: 8,
    product_id: 108,
    product_name: "Corrugated Boxes",
    supplier_id: 3,
    supplier_name: "National Packaging Solutions",
    quantity: 2000,
    unit_price: 35,
    total_amount: 70000,
    status: "Received",
    last_order_date: "2026-03-28",
    notes: "Standard brown corrugated boxes",
    consumption_per_day: 80,
    days_in_stock: 40,
    price_trend: 2,
    reorder_point: 800,
    lead_time_days: 5,
  },
];

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  container: {
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: "4px",
  },
  controlBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    minWidth: "200px",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: 14,
    fontFamily: "Inter",
  },
  filterSelect: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: 14,
    fontFamily: "Inter",
    backgroundColor: "white",
    cursor: "pointer",
  },
  btn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter",
  },
  btnPrimary: {
    backgroundColor: "#4a90e2",
    color: "white",
  },
  btnSecondary: {
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "1px solid #ddd",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    marginBottom: "16px",
  },
  cardHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableWrap: {
    overflow: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    backgroundColor: "#f9f9f9",
    fontWeight: 600,
    color: "#1a1a1a",
    borderBottom: "1px solid #e0e0e0",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f0f0f0",
  },
  pill: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: 12,
    fontWeight: 500,
  },
  pillGreen: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  pillBlue: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
  },
  pillOrange: {
    backgroundColor: "#fff3e0",
    color: "#e65100",
  },
  pillRed: {
    backgroundColor: "#ffebee",
    color: "#c62828",
  },
  pillOrange: {
    backgroundColor: "#fff3e0",
    color: "#e65100",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  summaryCard: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: 500,
  },
  emptyState: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#999",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: "12px",
  },
  modal: {
    display: "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  modalActive: {
    display: "flex",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    padding: "20px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalBody: {
    padding: "20px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: "6px",
    color: "#1a1a1a",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: 14,
    fontFamily: "Inter",
    boxSizing: "border-box",
  },
  modalFooter: {
    padding: "16px 20px",
    borderTop: "1px solid #f0f0f0",
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    color: "#666",
  },
  loading: {
    padding: "40px",
    textAlign: "center",
    color: "#666",
  },
};

// ── Helper Functions ────────────────────────────────────────────────────────
function formatCurrency(val) {
  return "£" + (val || 0).toLocaleString("en-GB", { minimumFractionDigits: 0 });
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB");
}

// ── BuyerReorders Component ──────────────────────────────────────────────────
export default function BuyerReorders({ push }) {
  const [reorderHistory, setReorderHistory] = useState([]);
  const [filteredReorders, setFilteredReorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [showQuickReorderModal, setShowQuickReorderModal] = useState(false);
  const [selectedReorder, setSelectedReorder] = useState(null);
  const [reorderForm, setReorderForm] = useState({
    quantity: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showBulkReorder, setShowBulkReorder] = useState(false);
  const [selectedForBulk, setSelectedForBulk] = useState([]);

  // Fetch reorder history (using dummy data for prototype)
  const fetchReorderHistory = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setReorderHistory(DUMMY_REORDER_HISTORY);
      setFilteredReorders(DUMMY_REORDER_HISTORY);

      // Extract unique suppliers
      const uniqueSuppliers = [...new Set(DUMMY_REORDER_HISTORY.map((r) => r.supplier_name))];
      setSuppliers(uniqueSuppliers);
    } catch (err) {
      push("Failed to load reorder history", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    fetchReorderHistory();
  }, [fetchReorderHistory]);

  // Calculate smart reorder recommendations
  useEffect(() => {
    const smart_recommendations = DUMMY_REORDER_HISTORY.map((item) => {
      const daysUntilStockout =
        item.days_in_stock - item.lead_time_days;
      const recommendedQty = Math.ceil(
        item.consumption_per_day * 30
      );
      const potentialSavings = (
        (recommendedQty - item.quantity) *
        item.unit_price *
        0.02
      ).toFixed(0);

      return {
        product_id: item.product_id,
        product_name: item.product_name,
        supplier_name: item.supplier_name,
        reason:
          daysUntilStockout < 5
            ? "⚠️ Urgent - Stock will run out soon"
            : item.price_trend < -3
            ? "📉 Price dropping - Buy now"
            : item.price_trend > 5
            ? "📈 Price rising - Consider bulk"
            : "💡 Regular reorder due",
        urgency:
          daysUntilStockout < 5
            ? "urgent"
            : item.price_trend < -3
            ? "high"
            : "medium",
        recommended_qty: recommendedQty,
        current_price: item.unit_price,
        potential_savings: potentialSavings,
      };
    });

    setRecommendations(
      smart_recommendations.sort((a, b) => {
        const urgencyOrder = { urgent: 0, high: 1, medium: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      })
    );
  }, [reorderHistory]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...reorderHistory];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.product_name.toLowerCase().includes(term) ||
          r.supplier_name.toLowerCase().includes(term)
      );
    }

    if (filterSupplier !== "all") {
      filtered = filtered.filter((r) => r.supplier_name === filterSupplier);
    }

    setFilteredReorders(filtered);
  }, [searchTerm, filterSupplier, reorderHistory]);

  // Handle bulk reorder
  const handleBulkReorder = async () => {
    if (selectedForBulk.length === 0) {
      push("Please select items for bulk reorder", "error");
      return;
    }

    try {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      selectedForBulk.forEach((productId) => {
        const rec = recommendations.find(
          (r) => r.product_id === productId
        );
        const item = DUMMY_REORDER_HISTORY.find(
          (r) => r.product_id === productId
        );

        if (rec && item) {
          const newReorder = {
            id: Math.max(...DUMMY_REORDER_HISTORY.map((r) => r.id)) + 1,
            product_id: item.product_id,
            product_name: item.product_name,
            supplier_id: item.supplier_id,
            supplier_name: item.supplier_name,
            quantity: rec.recommended_qty,
            unit_price: item.unit_price,
            total_amount: rec.recommended_qty * item.unit_price,
            status: "Pending",
            last_order_date: new Date()
              .toISOString()
              .split("T")[0],
            notes: `Bulk order: ${rec.reason}`,
            consumption_per_day: item.consumption_per_day,
            days_in_stock: rec.recommended_qty / item.consumption_per_day,
            price_trend: item.price_trend,
            reorder_point: item.reorder_point,
            lead_time_days: item.lead_time_days,
          };
          DUMMY_REORDER_HISTORY.unshift(newReorder);
        }
      });

      setReorderHistory([...DUMMY_REORDER_HISTORY]);
      setFilteredReorders([...DUMMY_REORDER_HISTORY]);
      push(
        `${selectedForBulk.length} items bulk ordered successfully`,
        "success"
      );
      setShowBulkReorder(false);
      setSelectedForBulk([]);
    } catch (err) {
      push("Failed to create bulk order", "error");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Open quick reorder modal
  const handleQuickReorder = (reorder) => {
    setSelectedReorder(reorder);
    setReorderForm({
      quantity: reorder.quantity,
      notes: "",
    });
    setShowQuickReorderModal(true);
  };

  // Submit quick reorder (dummy data prototype)
  const handleSubmitReorder = async () => {
    if (!reorderForm.quantity || reorderForm.quantity <= 0) {
      push("Please enter a valid quantity", "error");
      return;
    }

    try {
      setSubmitting(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Create a new reorder entry (simulated)
      const newReorder = {
        id: Math.max(...DUMMY_REORDER_HISTORY.map((r) => r.id)) + 1,
        product_id: selectedReorder.product_id,
        product_name: selectedReorder.product_name,
        supplier_id: selectedReorder.supplier_id,
        supplier_name: selectedReorder.supplier_name,
        quantity: parseInt(reorderForm.quantity),
        unit_price: selectedReorder.unit_price,
        total_amount: parseInt(reorderForm.quantity) * selectedReorder.unit_price,
        status: "Pending",
        last_order_date: new Date().toISOString().split("T")[0],
        notes: reorderForm.notes || `Re-order of previous purchase (Qty: ${selectedReorder.quantity})`,
      };

      // Add to dummy history
      DUMMY_REORDER_HISTORY.unshift(newReorder);
      setReorderHistory([...DUMMY_REORDER_HISTORY]);
      setFilteredReorders([...DUMMY_REORDER_HISTORY]);

      push("Re-order created successfully", "success");
      setShowQuickReorderModal(false);
      setReorderForm({ quantity: "", notes: "" });
    } catch (err) {
      push("Failed to create re-order", "error");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading reorder history...</div>
      </div>
    );
  }

  // Summary stats
  const totalOrders = reorderHistory.length;
  const totalSpent = reorderHistory.reduce((sum, r) => sum + r.total_amount, 0);
  const uniqueProducts = new Set(reorderHistory.map((r) => r.product_id)).size;
  const uniqueSuppliers = new Set(reorderHistory.map((r) => r.supplier_id)).size;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Reorder Management</h1>
        <p style={styles.subtitle}>
          Quick reorder from your previous purchases
        </p>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{totalOrders}</div>
          <div style={styles.summaryLabel}>Previous Orders</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{uniqueProducts}</div>
          <div style={styles.summaryLabel}>Products Ordered</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{uniqueSuppliers}</div>
          <div style={styles.summaryLabel}>Suppliers</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{formatCurrency(totalSpent)}</div>
          <div style={styles.summaryLabel}>Total Spent</div>
        </div>
      </div>

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
              ⚡ Smart Reorder Recommendations
            </h2>
            <button
              onClick={() => setShowBulkReorder(true)}
              style={{
                ...styles.btn,
                ...styles.btnPrimary,
                fontSize: 12,
                padding: "6px 12px",
              }}
            >
              📦 Bulk Order
            </button>
          </div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}></th>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Supplier</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Recommended Qty</th>
                  <th style={styles.th}>Est. Cost</th>
                  <th style={styles.th}>Savings</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedForBulk.includes(
                          rec.product_id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedForBulk([
                              ...selectedForBulk,
                              rec.product_id,
                            ]);
                          } else {
                            setSelectedForBulk(
                              selectedForBulk.filter(
                                (id) => id !== rec.product_id
                              )
                            );
                          }
                        }}
                      />
                    </td>
                    <td style={styles.td}>
                      <strong>{rec.product_name}</strong>
                    </td>
                    <td style={styles.td}>{rec.supplier_name}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.pill,
                          ...(rec.urgency === "urgent"
                            ? { ...styles.pillRed }
                            : rec.urgency === "high"
                            ? styles.pillOrange
                            : styles.pillBlue),
                        }}
                      >
                        {rec.reason}
                      </span>
                    </td>
                    <td style={styles.td}>{rec.recommended_qty} units</td>
                    <td style={styles.td}>
                      {formatCurrency(
                        rec.recommended_qty * rec.current_price
                      )}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          color: "#2e7d32",
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(rec.potential_savings)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => {
                          const item = DUMMY_REORDER_HISTORY.find(
                            (r) => r.product_id === rec.product_id
                          );
                          setSelectedReorder(item);
                          setReorderForm({
                            quantity: rec.recommended_qty,
                            notes: rec.reason,
                          });
                          setShowQuickReorderModal(true);
                        }}
                        style={{
                          ...styles.btn,
                          ...styles.btnSecondary,
                          fontSize: 12,
                          padding: "4px 8px",
                        }}
                      >
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={styles.controlBar}>
        <input
          type="text"
          placeholder="Search by product or supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterSupplier}
          onChange={(e) => setFilterSupplier(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Suppliers</option>
          {suppliers.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Order History Table */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            Order History
          </h2>
          <span style={{ color: "#666", fontSize: 14 }}>
            {filteredReorders.length} orders
          </span>
        </div>

        {filteredReorders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p>No reorder history found</p>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Supplier</th>
                  <th style={styles.th}>Last Qty</th>
                  <th style={styles.th}>Unit Price</th>
                  <th style={styles.th}>Price Trend</th>
                  <th style={styles.th}>Stock Status</th>
                  <th style={styles.th}>Last Order</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReorders.map((reorder) => (
                  <tr key={reorder.id}>
                    <td style={styles.td}>
                      <strong>{reorder.product_name}</strong>
                    </td>
                    <td style={styles.td}>{reorder.supplier_name}</td>
                    <td style={styles.td}>{reorder.quantity} units</td>
                    <td style={styles.td}>{formatCurrency(reorder.unit_price)}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          fontWeight: 600,
                          color:
                            reorder.price_trend < 0
                              ? "#2e7d32"
                              : reorder.price_trend > 0
                              ? "#c62828"
                              : "#999",
                        }}
                      >
                        {reorder.price_trend < 0
                          ? `📉 ${reorder.price_trend}%`
                          : reorder.price_trend > 0
                          ? `📈 +${reorder.price_trend}%`
                          : "➡️ 0%"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontSize: 12, marginBottom: 4 }}>
                        {reorder.days_in_stock} days stock
                      </div>
                      <span
                        style={{
                          ...styles.pill,
                          ...(reorder.days_in_stock < 5
                            ? styles.pillRed
                            : reorder.days_in_stock < 15
                            ? styles.pillOrange
                            : styles.pillGreen),
                        }}
                      >
                        {reorder.days_in_stock < 5
                          ? "Critical"
                          : reorder.days_in_stock < 15
                          ? "Low"
                          : "Healthy"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {formatDate(reorder.last_order_date)}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleQuickReorder(reorder)}
                        style={{
                          ...styles.btn,
                          ...styles.btnPrimary,
                          fontSize: 12,
                          padding: "6px 12px",
                        }}
                      >
                        Re-order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Reorder Modal */}
      <div
        style={{
          ...styles.modal,
          ...(showQuickReorderModal && styles.modalActive),
        }}
        onClick={() => setShowQuickReorderModal(false)}
      >
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Quick Re-order</h2>
            <button
              style={styles.closeBtn}
              onClick={() => setShowQuickReorderModal(false)}
            >
              ✕
            </button>
          </div>

          {selectedReorder && (
            <div style={styles.modalBody}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "6px",
                  marginBottom: "16px",
                }}
              >
                <p style={{ margin: "0 0 8px 0", fontSize: 13, color: "#666" }}>
                  Product:
                </p>
                <p style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 600 }}>
                  {selectedReorder.product_name}
                </p>
                <p style={{ margin: "0 0 8px 0", fontSize: 13, color: "#666" }}>
                  Supplier:
                </p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                  {selectedReorder.supplier_name}
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={reorderForm.quantity}
                  onChange={(e) =>
                    setReorderForm({
                      ...reorderForm,
                      quantity: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Unit Price: {formatCurrency(selectedReorder.unit_price)}
                </label>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "6px",
                    fontSize: 14,
                    color: "#666",
                  }}
                >
                  Estimated Total:{" "}
                  <strong>
                    {formatCurrency(
                      (reorderForm.quantity || 0) * selectedReorder.unit_price
                    )}
                  </strong>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes (Optional)</label>
                <textarea
                  value={reorderForm.notes}
                  onChange={(e) =>
                    setReorderForm({
                      ...reorderForm,
                      notes: e.target.value,
                    })
                  }
                  style={{
                    ...styles.input,
                    minHeight: 60,
                    fontFamily: "Inter",
                  }}
                />
              </div>
            </div>
          )}

          <div style={styles.modalFooter}>
            <button
              onClick={() => setShowQuickReorderModal(false)}
              style={{ ...styles.btn, ...styles.btnSecondary }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReorder}
              style={{ ...styles.btn, ...styles.btnPrimary }}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Re-order"}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Reorder Modal */}
      <div
        style={{
          ...styles.modal,
          ...(showBulkReorder && styles.modalActive),
        }}
        onClick={() => setShowBulkReorder(false)}
      >
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={{ margin: 0, fontSize: 18 }}>📦 Bulk Reorder</h2>
            <button
              style={styles.closeBtn}
              onClick={() => setShowBulkReorder(false)}
            >
              ✕
            </button>
          </div>

          <div style={styles.modalBody}>
            <p style={{ color: "#666", marginBottom: 16 }}>
              {selectedForBulk.length} items selected for bulk ordering
            </p>

            <div
              style={{
                maxHeight: 300,
                overflow: "auto",
                marginBottom: 16,
              }}
            >
              {recommendations
                .filter((r) => selectedForBulk.includes(r.product_id))
                .map((rec, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 12,
                      backgroundColor: "#f9f9f9",
                      borderRadius: 6,
                      marginBottom: 8,
                      fontSize: 13,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {rec.product_name}
                    </div>
                    <div style={{ color: "#666", marginBottom: 4 }}>
                      {rec.recommended_qty} units × {formatCurrency(rec.current_price)} ={" "}
                      <strong>
                        {formatCurrency(
                          rec.recommended_qty * rec.current_price
                        )}
                      </strong>
                    </div>
                    <div style={{ color: "#2e7d32", fontSize: 12 }}>
                      Save {formatCurrency(rec.potential_savings)}
                    </div>
                  </div>
                ))}
            </div>

            <div
              style={{
                padding: 12,
                backgroundColor: "#e8f5e9",
                borderRadius: 6,
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                Total Estimated Cost
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
                {formatCurrency(
                  recommendations
                    .filter((r) => selectedForBulk.includes(r.product_id))
                    .reduce((sum, r) => sum + r.recommended_qty * r.current_price, 0)
                )}
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button
              onClick={() => setShowBulkReorder(false)}
              style={{ ...styles.btn, ...styles.btnSecondary }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleBulkReorder}
              style={{ ...styles.btn, ...styles.btnPrimary }}
              disabled={submitting || selectedForBulk.length === 0}
            >
              {submitting ? "Processing..." : "Confirm Bulk Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
