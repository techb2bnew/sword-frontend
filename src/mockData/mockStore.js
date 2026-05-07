// Shared prototype store for frontend-only mocking.
// Single source of truth, persisted to localStorage.

const STORAGE_KEY = "prototype_mock_state_v1";

const seedState = () => {
  const today = new Date();
  const isoDate = (d) => d.toISOString().split("T")[0];
  const getDate = (daysAgo) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - daysAgo);
    return dt;
  };

  // Suppliers (used by buyer quotation modules)
  const suppliers = [
    { id: 1, name: "Agro Fresh Pvt Ltd", company_name: "Agro Fresh Pvt Ltd", contact: "Ramesh Sharma", rating: 4.5 },
    { id: 2, name: "Krishna Spices & Co", company_name: "Krishna Spices & Co", contact: "Sunil Verma", rating: 4.2 },
    { id: 3, name: "National Packaging Solutions", company_name: "National Packaging Solutions", contact: "Priya Mehta", rating: 3.8 },
    { id: 4, name: "Bulk Trading Enterprises", company_name: "Bulk Trading Enterprises", contact: "—", rating: 4.0 },
    { id: 5, name: "Global Imports Ltd", company_name: "Global Imports Ltd", contact: "—", rating: 3.9 },
  ];

  // Products (used by inventory and buyer quotation dropdowns)
  // NOTE: Inventory module expects fields like id, name, price, stock/quantity, warehouse/bins.
  const products = [
    { id: 101, name: "Wheat Flour (Atta)", barcode: "SKU-WHEAT-ATTA", price: 42, type: "finished_good", uom: "kg" },
    { id: 102, name: "Rice (Basmati)", barcode: "SKU-RICE-BASM", price: 95, type: "finished_good", uom: "kg" },
    { id: 103, name: "Soybean Oil", barcode: "SKU-SOY-OIL", price: 145, type: "finished_good", uom: "ltr" },
    { id: 201, name: "Red Chilli Powder", barcode: "SKU-CHILLI-RED", price: 280, type: "finished_good", uom: "kg" },
    { id: 202, name: "Turmeric Powder", barcode: "SKU-TURMERIC", price: 180, type: "finished_good", uom: "kg" },
    { id: 203, name: "Cumin Seeds", barcode: "SKU-CUMIN", price: 420, type: "finished_good", uom: "kg" },
    { id: 301, name: "BOPP Bags (25kg)", barcode: "SKU-BOPP-25KG", price: 18, type: "packaging", uom: "pcs" },
    { id: 302, name: "Corrugated Boxes", barcode: "SKU-BOX-CORR", price: 35, type: "packaging", uom: "pcs" },
  ];

  // Warehouse + bins (Inventory module uses these)
  const warehouses = [
    { id: 1, name: "Warehouse A" },
    { id: 2, name: "Warehouse B" },
  ];

  const bins = [
    { id: 1, warehouse_id: 1, rack_code: "R-A1", bin_code: "B-101", status: "Available" },
    { id: 2, warehouse_id: 1, rack_code: "R-A1", bin_code: "B-102", status: "Available" },
    { id: 3, warehouse_id: 2, rack_code: "R-B1", bin_code: "B-201", status: "Available" },
    { id: 4, warehouse_id: 2, rack_code: "R-B2", bin_code: "B-202", status: "Available" },
  ];

  // Inventory products entries (what /inventory/products returns)
  // Inventory.js expects to receive array with fields used in grouping:
  // { id, name, type, uom, barcode, price, supplier_name, stock, warehouse_name, locations, locations?, ... }
  const inventory = [
    // Wheat
    { id: 1001, name: "Wheat Flour (Atta)", type: "finished_good", uom: "kg", barcode: "SKU-WHEAT-ATTA", price: 42, supplier_name: "Agro Fresh Pvt Ltd", stock: 1800, warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 1, locations: "R-A1/B-101" },
    { id: 1002, name: "Wheat Flour (Atta)", type: "finished_good", uom: "kg", barcode: "SKU-WHEAT-ATTA", price: 42, supplier_name: "Agro Fresh Pvt Ltd", stock: 400, warehouse_id: 2, warehouse_name: "Warehouse B", bin_id: 3, locations: "R-B1/B-201" },

    // Rice
    { id: 1101, name: "Rice (Basmati)", type: "finished_good", uom: "kg", barcode: "SKU-RICE-BASM", price: 95, supplier_name: "Agro Fresh Pvt Ltd", stock: 620, warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 2, locations: "R-A1/B-102" },
    { id: 1102, name: "Rice (Basmati)", type: "finished_good", uom: "kg", barcode: "SKU-RICE-BASM", price: 95, supplier_name: "Agro Fresh Pvt Ltd", stock: 120, warehouse_id: 2, warehouse_name: "Warehouse B", bin_id: 4, locations: "R-B2/B-202" },

    // Oil
    { id: 1201, name: "Soybean Oil", type: "finished_good", uom: "ltr", barcode: "SKU-SOY-OIL", price: 145, supplier_name: "Agro Fresh Pvt Ltd", stock: 48, warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 1, locations: "R-A1/B-101" },

    // Chilli
    { id: 2001, name: "Red Chilli Powder", type: "finished_good", uom: "kg", barcode: "SKU-CHILLI-RED", price: 280, supplier_name: "Krishna Spices & Co", stock: 240, warehouse_id: 2, warehouse_name: "Warehouse B", bin_id: 3, locations: "R-B1/B-201" },

    // Turmeric
    { id: 2101, name: "Turmeric Powder", type: "finished_good", uom: "kg", barcode: "SKU-TURMERIC", price: 180, supplier_name: "Krishna Spices & Co", stock: 80, warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 2, locations: "R-A1/B-102" },

    // Cumin
    { id: 2201, name: "Cumin Seeds", type: "finished_good", uom: "kg", barcode: "SKU-CUMIN", price: 420, supplier_name: "Krishna Spices & Co", stock: 0, warehouse_id: 2, warehouse_name: "Warehouse B", bin_id: 4, locations: "R-B2/B-202" },

    // Bags
    { id: 3001, name: "BOPP Bags (25kg)", type: "packaging", uom: "pcs", barcode: "SKU-BOPP-25KG", price: 18, supplier_name: "National Packaging Solutions", stock: 950, warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 1, locations: "R-A1/B-101" },

    // Boxes
    { id: 3101, name: "Corrugated Boxes", type: "packaging", uom: "pcs", barcode: "SKU-BOX-CORR", price: 35, supplier_name: "National Packaging Solutions", stock: 140, warehouse_id: 2, warehouse_name: "Warehouse B", bin_id: 3, locations: "R-B1/B-201" },
  ];

  // Buyer quotations (shared across BuyerDashboard + BuyerQuotations)
  let buyerQuotations = [
    { id: "RFQ-2001", buyer_id: 1, supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd", product_id: 101, product_name: "Wheat Flour (Atta)", quantity: 1200, unit_price: 44, total: 52800, status: "Accepted", created_at: "2026-04-28", valid_until: "2026-05-28", expected_delivery: "2026-05-05", notes: "Urgent stock", supplier_notes: "Will deliver on time", credit_days: 30 },
    { id: "RFQ-2002", buyer_id: 1, supplier_id: 2, supplier_name: "Krishna Spices & Co", product_id: 201, product_name: "Red Chilli Powder", quantity: 500, unit_price: 290, total: 145000, status: "Pending", created_at: "2026-04-30", valid_until: "2026-05-30", expected_delivery: "2026-05-10", notes: "Fine grind only", supplier_notes: "", credit_days: 15 },
    { id: "RFQ-2003", buyer_id: 1, supplier_id: 3, supplier_name: "National Packaging Solutions", product_id: 301, product_name: "BOPP Bags (25kg)", quantity: 5000, unit_price: 19, total: 95000, status: "Pending", created_at: "2026-04-20", valid_until: "2026-05-20", expected_delivery: "2026-04-30", notes: "", supplier_notes: "", credit_days: 45 },
    { id: "RFQ-2004", buyer_id: 1, supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd", product_id: 102, product_name: "Rice (Basmati)", quantity: 800, unit_price: 98, total: 78400, status: "Confirmed", created_at: "2026-04-25", valid_until: "2026-05-25", expected_delivery: "2026-05-08", notes: "Premium grade", supplier_notes: "Premium basmati confirmed", credit_days: 30 },
    { id: "RFQ-2005", buyer_id: 1, supplier_id: 2, supplier_name: "Krishna Spices & Co", product_id: 202, product_name: "Turmeric Powder", quantity: 350, unit_price: 175, total: 61250, status: "Rejected", created_at: "2026-04-15", valid_until: "2026-05-15", expected_delivery: "2026-04-22", notes: "", supplier_notes: "Out of stock", credit_days: 30 },
  ];

  // Buyer reorder history (used by BuyerReorders)
  const reorderHistory = [
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

  // Ledger/Finance seed (reuse existing mock structure; keep minimal for prototype)
  const purchaseOrders = [
    { id: "PO-1", supplier_id: 1, supplier_name: "Fresh Farms Supplier", order_date: isoDate(getDate(45)), expected_delivery: isoDate(getDate(35)), total_amount: 15000, status: "Received", item_count: 4 },
    { id: "PO-2", supplier_id: 5, supplier_name: "Global Imports Ltd", order_date: isoDate(getDate(30)), expected_delivery: isoDate(getDate(15)), total_amount: 28500, status: "Sent", item_count: 6 },
    { id: "PO-3", supplier_id: 3, supplier_name: "Premium Supplies Co", order_date: isoDate(getDate(20)), expected_delivery: isoDate(getDate(8)), total_amount: 12300, status: "Received", item_count: 3 },
  ];

  const salesOrders = [
    { id: "SO-1", customer_id: 1, customer_name: "Metro Retail Store", order_number: "SO-2026-001", created_at: getDate(60).toISOString(), total_amount: 8500, status: "delivered", delivery_date: isoDate(getDate(50)) },
    { id: "SO-2", customer_id: 2, customer_name: "City Supermarket", order_number: "SO-2026-002", created_at: getDate(50).toISOString(), total_amount: 12300, status: "delivered", delivery_date: isoDate(getDate(42)) },
  ];

  const ledgerEntries = [
    { id: 1000001, date: isoDate(getDate(50)), description: "Sales Revenue - SO-2026-001", type: "Credit", amount: 8500, status: "Completed", category: "Sales Revenue", source: "auto", reference: "SO-2026-001" },
    { id: 2000001, date: isoDate(getDate(45)), description: "Cost of Goods - PO#1", type: "Debit", amount: 15000, status: "Completed", category: "Cost of Goods", source: "auto", reference: "PO#1" },
  ];

  return {
    meta: { seededAt: Date.now(), version: 1 },
    auth: {
      erp_token: null,
      erp_user: null,
      token: null,
    },
    suppliers,
    products,
    warehouse: { warehouses, bins },
    inventory: { products: inventory },
    buyer: { quotations: buyerQuotations, purchaseOrders, reorderHistory },
    finance: { purchaseOrders, salesOrders, ledgerEntries },
  };
};

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);

    if (!parsed?.suppliers || !parsed?.inventory?.products) return seedState();
    if (!parsed?.buyer?.reorderHistory) parsed.buyer = { ...(parsed.buyer || {}), reorderHistory: seedState().buyer.reorderHistory };

    return parsed;
  } catch {
    return seedState();
  }
};

let state = loadFromStorage();

const listeners = new Set();

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

export const getMockState = () => state;

export const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const resetMockState = () => {
  state = seedState();
  persist();
  listeners.forEach((l) => l());
};

export const actions = {
  // Buyer quotations
  getBuyerQuotations: () => state.buyer.quotations,

  sendBuyerQuotation: (payload) => {
    const nextIdNum = 2006 + (state.buyer.quotations.length || 0);
    const id = `RFQ-${nextIdNum}`;

    const supplier = state.suppliers.find((s) => String(s.id) === String(payload.supplier_id));
    const product = state.products.find((p) => String(p.id) === String(payload.product_id));

    const total = Number(payload.quantity) * Number(payload.target_price || payload.unit_price || 0);

    const newQ = {
      id,
      buyer_id: payload.buyer_id ?? 1,
      supplier_id: Number(payload.supplier_id),
      supplier_name: supplier?.name || supplier?.company_name || "",
      product_id: Number(payload.product_id),
      product_name: product?.name || payload.product_name || "",
      quantity: Number(payload.quantity),
      unit_price: Number(payload.target_price || payload.unit_price || 0),
      total,
      status: "Pending",
      created_at: new Date().toISOString().split("T")[0],
      valid_until: payload.valid_until || payload.required_delivery_date || "",
      expected_delivery: payload.required_delivery_date || "",
      notes: payload.notes || "",
      supplier_notes: "",
      credit_days: Number(payload.credit_days ?? 30),
    };

    state.buyer.quotations = [newQ, ...(state.buyer.quotations || [])];
    persist();
    listeners.forEach((l) => l());
    return newQ;
  },

  updateBuyerQuotationStatus: (id, status, supplier_notes = "") => {
    state.buyer.quotations = (state.buyer.quotations || []).map((q) =>
      q.id === id ? { ...q, status, supplier_notes: supplier_notes ?? q.supplier_notes } : q
    );
    persist();
    listeners.forEach((l) => l());
    return state.buyer.quotations.find((q) => q.id === id);
  },

  // Buyer purchase orders
  getBuyerPurchaseOrders: () => state.buyer.purchaseOrders,

  upsertBuyerPurchaseOrder: (payload) => {
    const orders = state.buyer.purchaseOrders || [];
    const nextNum = 1043 + orders.length;
    const id = payload.id || `PO-${nextNum}`;

    const quantity = Number(payload.quantity || 0);
    const unit_price = Number(payload.unit_price || 0);

    const newPO = {
      id,
      supplier_id: Number(payload.supplier_id),
      supplier_name: payload.supplier_name || "",
      product: payload.product || "",
      quantity,
      unit_price,
      total: quantity * unit_price,
      status: payload.status || "Pending",
      order_date: new Date().toISOString().split("T")[0],
      expected_delivery: payload.expected_delivery || "",
      notes: payload.notes || "",
      delivery_address: payload.delivery_address || "",
      payment_terms: payload.payment_terms || "Net 30",
      is_reorder: Boolean(payload.is_reorder),
      reorder_of: payload.reorder_of || "",
    };

    state.buyer.purchaseOrders = [newPO, ...orders];
    persist();
    listeners.forEach((l) => l());
    return newPO;
  },

  updateBuyerPurchaseOrderStatus: (id, status) => {
    state.buyer.purchaseOrders = (state.buyer.purchaseOrders || []).map((p) =>
      p.id === id ? { ...p, status } : p
    );
    persist();
    listeners.forEach((l) => l());
    return state.buyer.purchaseOrders.find((p) => p.id === id);
  },

  // Buyer reorder history
  getBuyerReorderHistory: () => state.buyer.reorderHistory,

  createBuyerReorderEntry: (payload) => {
    const nextId = Math.max(0, ...(state.buyer.reorderHistory || []).map((r) => Number(r.id) || 0)) + 1;
    const qty = Number(payload.quantity || 0);
    const unitPrice = Number(payload.unit_price || 0);
    const todayIso = new Date().toISOString().split("T")[0];

    const newReorder = {
      id: nextId,
      product_id: Number(payload.product_id),
      product_name: payload.product_name || "",
      supplier_id: Number(payload.supplier_id),
      supplier_name: payload.supplier_name || "",
      quantity: qty,
      unit_price: unitPrice,
      total_amount: qty * unitPrice,
      status: payload.status || "Pending",
      last_order_date: payload.last_order_date || todayIso,
      notes: payload.notes || "",
      consumption_per_day: Number(payload.consumption_per_day || 0),
      days_in_stock: Number(payload.days_in_stock || 0),
      price_trend: Number(payload.price_trend || 0),
      reorder_point: Number(payload.reorder_point || 0),
      lead_time_days: Number(payload.lead_time_days || 0),
    };

    state.buyer.reorderHistory = [newReorder, ...(state.buyer.reorderHistory || [])];
    persist();
    listeners.forEach((l) => l());
    return newReorder;
  },

  bulkCreateBuyerReorders: (items) => {
    if (!Array.isArray(items) || items.length === 0) return [];

    const created = [];
    for (const it of items) created.push(actions.createBuyerReorderEntry(it));
    return created;
  },

  // Suppliers/products/inventory
  getSuppliers: () => state.suppliers,
  getInventoryProducts: () => state.inventory.products,

  // Inventory CRUD used by Inventory.js
  upsertInventoryProduct: (payload, editId = null) => {
    const warehouse = state.warehouse.warehouses.find((w) => String(w.id) === String(payload.warehouse_id));
    const bin = state.warehouse.bins.find((b) => String(b.id) === String(payload.bin_id));
    const supplier = state.suppliers.find((s) => String(s.id) === String(payload.supplier_id));

    const nextId = editId ?? (Math.max(0, ...(state.inventory.products || []).map((p) => Number(p.id) || 0)) + 1);

    const existing = (state.inventory.products || []).find((p) => p.id === nextId);
    const newEntry = {
      id: nextId,
      name: payload.name,
      type: payload.type,
      uom: payload.uom,
      barcode: payload.barcode,
      price: Number(payload.price),
      supplier_name: supplier?.name || "",
      stock: Number(payload.stock),
      warehouse_id: Number(payload.warehouse_id),
      warehouse_name: warehouse?.name || "Unassigned",
      bin_id: Number(payload.bin_id),
      locations: bin ? `${bin.rack_code}/${bin.bin_code}` : "Floor",
      weight_kg: Number(payload.weight_kg ?? 0),
    };

    state.inventory.products = existing
      ? state.inventory.products.map((p) => (p.id === nextId ? { ...p, ...newEntry } : p))
      : [newEntry, ...(state.inventory.products || [])];

    persist();
    listeners.forEach((l) => l());
    return newEntry;
  },

  deleteInventoryProduct: (id) => {
    state.inventory.products = (state.inventory.products || []).filter((p) => String(p.id) !== String(id));
    persist();
    listeners.forEach((l) => l());
    return true;
  },

  // Warehouse endpoints
  getWarehouses: () => state.warehouse.warehouses,
  getBins: () => state.warehouse.bins,
  getPurchasesSuppliers: () => state.suppliers,

  // tokens passthrough
  setTokensFromLocalStorage: () => {
    try {
      state.auth.erp_token = localStorage.getItem("erp_token") || null;
      const u = localStorage.getItem("erp_user");
      state.auth.erp_user = u ? JSON.parse(u) : null;
      persist();
    } catch {}
  },
};
