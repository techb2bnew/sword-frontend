import React, { useState, useEffect, useCallback } from "react";

// ── Dummy Inventory Data with advanced metrics ──────────────────────────────
const DUMMY_INVENTORY = [
  {
    id: 101,
    name: "Wheat Flour (Atta)",
    category: "Grains",
    stock: 2400,
    weight_kg: 50,
    price: 42,
    uom: "kg",
    warehouse_name: "Main Warehouse",
    bin_code: "RACK-A-BIN-01",
    supplier_name: "Agro Fresh Pvt Ltd",
    barcode: "WF-001-2026",
    monthly_consumption: 1800,
    stock_turnover_days: 40,
    safety_stock: 500,
    reorder_point: 500,
    supplier_rating: 4.5,
    last_price_change: -5,
  },
  {
    id: 102,
    name: "Rice (Basmati)",
    category: "Grains",
    stock: 1600,
    weight_kg: 20,
    price: 95,
    uom: "kg",
    warehouse_name: "Main Warehouse",
    bin_code: "RACK-A-BIN-02",
    supplier_name: "Agro Fresh Pvt Ltd",
    barcode: "RB-001-2026",
    monthly_consumption: 960,
    stock_turnover_days: 50,
    safety_stock: 350,
    reorder_point: 350,
    supplier_rating: 4.5,
    last_price_change: 3,
  },
  {
    id: 103,
    name: "Soybean Oil",
    category: "Oils",
    stock: 45,
    weight_kg: 15,
    price: 145,
    uom: "ltr",
    warehouse_name: "Main Warehouse",
    bin_code: "RACK-B-BIN-01",
    supplier_name: "Agro Fresh Pvt Ltd",
    barcode: "SO-001-2026",
    monthly_consumption: 150,
    stock_turnover_days: 9,
    safety_stock: 100,
    reorder_point: 100,
    supplier_rating: 4.5,
    last_price_change: 8,
  },
  {
    id: 104,
    name: "Red Chilli Powder",
    category: "Spices",
    stock: 850,
    weight_kg: 1,
    price: 280,
    uom: "kg",
    warehouse_name: "Spice Warehouse",
    bin_code: "RACK-C-BIN-01",
    supplier_name: "Krishna Spices & Co",
    barcode: "RCP-001-2026",
    monthly_consumption: 600,
    stock_turnover_days: 42,
    safety_stock: 200,
    reorder_point: 200,
    supplier_rating: 4.2,
    last_price_change: -2,
  },
  {
    id: 105,
    name: "Turmeric Powder",
    category: "Spices",
    stock: 620,
    weight_kg: 1,
    price: 180,
    uom: "kg",
    warehouse_name: "Spice Warehouse",
    bin_code: "RACK-C-BIN-02",
    supplier_name: "Krishna Spices & Co",
    barcode: "TP-001-2026",
    monthly_consumption: 300,
    stock_turnover_days: 62,
    safety_stock: 150,
    reorder_point: 150,
    supplier_rating: 4.2,
    last_price_change: 0,
  },
  {
    id: 106,
    name: "Cumin Seeds",
    category: "Spices",
    stock: 280,
    weight_kg: 1,
    price: 420,
    uom: "kg",
    warehouse_name: "Spice Warehouse",
    bin_code: "RACK-C-BIN-03",
    supplier_name: "Krishna Spices & Co",
    barcode: "CS-001-2026",
    monthly_consumption: 120,
    stock_turnover_days: 70,
    safety_stock: 100,
    reorder_point: 100,
    supplier_rating: 4.2,
    last_price_change: 5,
  },
  {
    id: 107,
    name: "BOPP Bags (25kg)",
    category: "Packaging",
    stock: 8500,
    weight_kg: 0.5,
    price: 18,
    uom: "pcs",
    warehouse_name: "Packaging Warehouse",
    bin_code: "RACK-D-BIN-01",
    supplier_name: "National Packaging Solutions",
    barcode: "PB-001-2026",
    monthly_consumption: 6000,
    stock_turnover_days: 42,
    safety_stock: 2000,
    reorder_point: 2000,
    supplier_rating: 3.8,
    last_price_change: -3,
  },
  {
    id: 108,
    name: "Corrugated Boxes",
    category: "Packaging",
    stock: 3200,
    weight_kg: 2,
    price: 35,
    uom: "pcs",
    warehouse_name: "Packaging Warehouse",
    bin_code: "RACK-D-BIN-02",
    supplier_name: "National Packaging Solutions",
    barcode: "CB-001-2026",
    monthly_consumption: 2400,
    stock_turnover_days: 40,
    safety_stock: 800,
    reorder_point: 800,
    supplier_rating: 3.8,
    last_price_change: 2,
  },
  {
    id: 109,
    name: "Black Cardamom",
    category: "Spices",
    stock: 45,
    weight_kg: 1,
    price: 680,
    uom: "kg",
    warehouse_name: "Spice Warehouse",
    bin_code: "RACK-C-BIN-04",
    supplier_name: "Krishna Spices & Co",
    barcode: "BCA-001-2026",
    monthly_consumption: 20,
    stock_turnover_days: 67,
    safety_stock: 30,
    reorder_point: 50,
    supplier_rating: 4.2,
    last_price_change: 2,
  },
  {
    id: 110,
    name: "Mustard Oil",
    category: "Oils",
    stock: 0,
    weight_kg: 15,
    price: 135,
    uom: "ltr",
    warehouse_name: "Main Warehouse",
    bin_code: "RACK-B-BIN-02",
    supplier_name: "Agro Fresh Pvt Ltd",
    barcode: "MO-001-2026",
    monthly_consumption: 90,
    stock_turnover_days: 0,
    safety_stock: 80,
    reorder_point: 100,
    supplier_rating: 4.5,
    last_price_change: -2,
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
  pillYellow: {
    backgroundColor: "#fffde7",
    color: "#f57f17",
  },
  pillRed: {
    backgroundColor: "#ffebee",
    color: "#c62828",
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
  loading: {
    padding: "40px",
    textAlign: "center",
    color: "#666",
  },
  progressBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e0e0e0",
    borderRadius: "3px",
    overflow: "hidden",
    marginTop: "4px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },
};

// ── Helper Functions ────────────────────────────────────────────────────────
function formatCurrency(val) {
  return "£" + (val || 0).toLocaleString("en-GB", { minimumFractionDigits: 0 });
}

function getStockStatus(stock, threshold = 100) {
  if (stock <= 0) return { label: "Out of Stock", color: "#c62828" };
  if (stock < threshold) return { label: "Low Stock", color: "#f57f17" };
  return { label: "In Stock", color: "#2e7d32" };
}

// ── BuyerInventory Component ────────────────────────────────────────────────
export default function BuyerInventory({ push, user }) {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("stock");
  const [viewMode, setViewMode] = useState("standard");
  const [abcAnalysis, setAbcAnalysis] = useState([]);

  // Fetch inventory (using dummy data for prototype)
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Transform and enrich product data
      const products = DUMMY_INVENTORY.map((p) => {
        const category = p.category || "General";
        return {
          id: p.id,
          name: p.name,
          category,
          stock: p.stock || 0,
          weight_kg: p.weight_kg || 0,
          price: p.price || 0,
          uom: p.uom || "units",
          warehouse_name: p.warehouse_name || "N/A",
          bin_code: p.bin_code || "N/A",
          supplier_name: p.supplier_name || "N/A",
          barcode: p.barcode || "N/A",
          stockStatus: getStockStatus(p.stock || 0),
          totalValue: (p.stock || 0) * (p.price || 0),
          reorderPoint: p.reorder_point || 100,
          monthly_consumption: p.monthly_consumption || 0,
          stock_turnover_days: p.stock_turnover_days || 0,
          safety_stock: p.safety_stock || 0,
          supplier_rating: p.supplier_rating || 0,
          last_price_change: p.last_price_change || 0,
        };
      });

      setInventory(products);
      setFilteredInventory(products);

      // Extract unique categories
      const uniqueCategories = [...new Set(products.map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      push("Failed to load inventory", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Calculate ABC Analysis (Pareto Analysis)
  const calculateABCAnalysis = useCallback(() => {
    if (inventory.length === 0) return;
    
    // Sort by total value (descending)
    const sortedByValue = [...inventory].sort(
      (a, b) => b.totalValue - a.totalValue
    );

    const totalValue = sortedByValue.reduce((sum, p) => sum + p.totalValue, 0);
    let cumulativeValue = 0;

    const analyzed = sortedByValue.map((product) => {
      cumulativeValue += product.totalValue;
      const percentage = (cumulativeValue / totalValue) * 100;

      let category = "C";
      if (percentage <= 80) {
        category = "A";
      } else if (percentage <= 95) {
        category = "B";
      }

      return {
        ...product,
        abc_category: category,
        value_percentage: ((product.totalValue / totalValue) * 100).toFixed(2),
      };
    });

    setAbcAnalysis(analyzed);
  }, [inventory]);

  // Recalculate ABC analysis when inventory changes
  useEffect(() => {
    if (inventory.length > 0) {
      calculateABCAnalysis();
    }
  }, [inventory, calculateABCAnalysis]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...inventory];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.barcode.toLowerCase().includes(term) ||
          p.supplier_name.toLowerCase().includes(term)
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }

    if (filterStatus === "low") {
      filtered = filtered.filter((p) => p.stock > 0 && p.stock < 100);
    } else if (filterStatus === "out") {
      filtered = filtered.filter((p) => p.stock === 0);
    } else if (filterStatus === "in") {
      filtered = filtered.filter((p) => p.stock >= 100);
    }

    // Sort
    if (sortBy === "stock") {
      filtered.sort((a, b) => a.stock - b.stock);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "value") {
      filtered.sort((a, b) => b.totalValue - a.totalValue);
    }

    setFilteredInventory(filtered);
  }, [searchTerm, filterCategory, filterStatus, inventory, sortBy]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading inventory...</div>
      </div>
    );
  }

  // Calculate summary stats
  const totalProducts = inventory.length;
  const totalStock = inventory.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = inventory.reduce((sum, p) => sum + p.totalValue, 0);
  const lowStockCount = inventory.filter(
    (p) => p.stock > 0 && p.stock < 100
  ).length;
  const outOfStockCount = inventory.filter((p) => p.stock === 0).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Buyer Inventory</h1>
        <p style={styles.subtitle}>
          Current stock levels and inventory management
        </p>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{totalProducts}</div>
          <div style={styles.summaryLabel}>Total Products</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{totalStock}</div>
          <div style={styles.summaryLabel}>Total Stock Units</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{formatCurrency(totalValue)}</div>
          <div style={styles.summaryLabel}>Total Inventory Value</div>
        </div>
        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryValue,
              color: outOfStockCount > 0 ? "#c62828" : "#2e7d32",
            }}
          >
            {outOfStockCount}
          </div>
          <div style={styles.summaryLabel}>Out of Stock</div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controlBar}>
        <input
          type="text"
          placeholder="Search by product name, barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="stock">Sort by Stock</option>
          <option value="name">Sort by Name</option>
          <option value="value">Sort by Value</option>
        </select>
      </div>

      {/* View Mode Toggle */}
      <div style={{...styles.controlBar, marginBottom: "16px"}}>
        <button
          onClick={() => setViewMode("standard")}
          style={{
            ...styles.btn,
            ...(viewMode === "standard" ? styles.btnPrimary : styles.btnSecondary),
          }}
        >
          📊 Standard View
        </button>
        <button
          onClick={() => setViewMode("abc")}
          style={{
            ...styles.btn,
            ...(viewMode === "abc" ? styles.btnPrimary : styles.btnSecondary),
          }}
        >
          📈 ABC Analysis
        </button>
      </div>

      {/* Inventory Table - Standard View */}
      {viewMode === "standard" && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
              Product Inventory
            </h2>
            <span style={{ color: "#666", fontSize: 14 }}>
              {filteredInventory.length} products
            </span>
          </div>

          {filteredInventory.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📦</div>
              <p>No products found in inventory</p>
            </div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Product Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Stock Level</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Unit Price</th>
                    <th style={styles.th}>Total Value</th>
                    <th style={styles.th}>Turnover (days)</th>
                    <th style={styles.th}>Supplier ⭐</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((product) => (
                    <tr key={product.id}>
                      <td style={styles.td}>
                        <div>
                          <strong>{product.name}</strong>
                          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                            {product.barcode}
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.pill,
                            backgroundColor: "#f0f0f0",
                            color: "#666",
                          }}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: 6 }}>
                            {product.stock} {product.uom}
                          </div>
                          <div style={styles.progressBar}>
                            <div
                              style={{
                                ...styles.progressFill,
                                width: `${Math.min(
                                  (product.stock / product.reorderPoint) * 100,
                                  100
                                )}%`,
                                backgroundColor: product.stockStatus.color,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.pill,
                            backgroundColor:
                              product.stockStatus.color === "#2e7d32"
                                ? "#e8f5e9"
                                : product.stockStatus.color === "#f57f17"
                                ? "#fffde7"
                                : "#ffebee",
                            color: product.stockStatus.color,
                          }}
                        >
                          {product.stockStatus.label}
                        </span>
                      </td>
                      <td style={styles.td}>{formatCurrency(product.price)}</td>
                      <td style={styles.td}>
                        <strong>{formatCurrency(product.totalValue)}</strong>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontSize: 13, color: "#666" }}>
                          {product.stock_turnover_days} days
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontSize: 13 }}>
                          {product.supplier_name}
                          <div style={{ fontSize: 12, color: "#f57f17", marginTop: 2 }}>
                            {"⭐".repeat(Math.round(product.supplier_rating))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ABC Analysis View */}
      {viewMode === "abc" && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
              📈 ABC Inventory Analysis
            </h2>
            <span style={{ color: "#666", fontSize: 14 }}>
              Pareto analysis - focus on high-value items
            </span>
          </div>

          {abcAnalysis.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📊</div>
              <p>No data for ABC analysis</p>
            </div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Product Name</th>
                    <th style={styles.th}>Total Value</th>
                    <th style={styles.th}>% of Total</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Monthly Use</th>
                    <th style={styles.th}>Price Trend</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {abcAnalysis.map((product) => {
                    const abcColor =
                      product.abc_category === "A"
                        ? { bg: "#e3f2fd", color: "#1565c0" }
                        : product.abc_category === "B"
                        ? { bg: "#fff3e0", color: "#e65100" }
                        : { bg: "#f3e5f5", color: "#6a1b9a" };

                    return (
                      <tr key={product.id}>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.pill,
                              backgroundColor: abcColor.bg,
                              color: abcColor.color,
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {product.abc_category}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <strong>{product.name}</strong>
                        </td>
                        <td style={styles.td}>
                          <strong>{formatCurrency(product.totalValue)}</strong>
                        </td>
                        <td style={styles.td}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>
                            {product.value_percentage}%
                          </div>
                          <div style={styles.progressBar}>
                            <div
                              style={{
                                ...styles.progressFill,
                                width: `${parseFloat(product.value_percentage)}%`,
                                backgroundColor: abcColor.color,
                              }}
                            />
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.pill,
                              backgroundColor:
                                product.stock > product.reorderPoint
                                  ? "#e8f5e9"
                                  : "#ffebee",
                              color:
                                product.stock > product.reorderPoint
                                  ? "#2e7d32"
                                  : "#c62828",
                            }}
                          >
                            {product.stock} {product.uom}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={{ fontSize: 13, color: "#666" }}>
                            {product.monthly_consumption} {product.uom}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              fontWeight: 600,
                              color:
                                product.last_price_change < 0
                                  ? "#2e7d32"
                                  : product.last_price_change > 0
                                  ? "#c62828"
                                  : "#999",
                            }}
                          >
                            {product.last_price_change < 0
                              ? `📉 ${product.last_price_change}%`
                              : product.last_price_change > 0
                              ? `📈 +${product.last_price_change}%`
                              : "➡️ 0%"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {product.abc_category === "A" && (
                            <span
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#e3f2fd",
                                color: "#1565c0",
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              ✓ Priority Focus
                            </span>
                          )}
                          {product.abc_category === "B" && (
                            <span
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#fff3e0",
                                color: "#e65100",
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              ○ Monitor
                            </span>
                          )}
                          {product.abc_category === "C" && (
                            <span
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#f3e5f5",
                                color: "#6a1b9a",
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              ◎ Low Priority
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ABC Legend */}
          <div style={{ padding: "16px 20px", backgroundColor: "#f9f9f9", borderTop: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: 12, marginBottom: 8 }}>
              <strong>ABC Analysis Guide:</strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", fontSize: 13 }}>
              <div>
                <span style={{ ...styles.pill, backgroundColor: "#e3f2fd", color: "#1565c0" }}>A</span>{" "}
                <strong>High Value (80%)</strong> - Strict control, forecast-based ordering
              </div>
              <div>
                <span style={{ ...styles.pill, backgroundColor: "#fff3e0", color: "#e65100" }}>B</span>{" "}
                <strong>Medium Value (15%)</strong> - Normal controls
              </div>
              <div>
                <span style={{ ...styles.pill, backgroundColor: "#f3e5f5", color: "#6a1b9a" }}>C</span>{" "}
                <strong>Low Value (5%)</strong> - Minimal controls, periodic review
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Alert Card */}
      {lowStockCount > 0 && (
        <div
          style={{
            ...styles.card,
            borderLeft: "4px solid #f57f17",
            backgroundColor: "#fffde7",
          }}
        >
          <div style={{ padding: "16px 20px" }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#f57f17", fontSize: 16 }}>
              ⚠️ Low Stock Alert
            </h3>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
              {lowStockCount} product(s) have low stock levels. Consider
              re-ordering to maintain optimal inventory levels.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
