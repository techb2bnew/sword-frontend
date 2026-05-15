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
    { id: 1, name: "Agro Fresh Pvt Ltd", company_name: "Agro Fresh Pvt Ltd", contact: "Ramesh Sharma", contact_person: "Ramesh Sharma", email: "ramesh@agrofresh.in", phone: "+91-9821001001", address: "Plot 12, MIDC Hadapsar, Pune", rating: 4.5 },
    { id: 2, name: "Krishna Spices & Co", company_name: "Krishna Spices & Co", contact: "Sunil Verma", contact_person: "Sunil Verma", email: "sunil@krishnaspices.in", phone: "+91-9821002002", address: "45 Spice Market Lane, Nagpur", rating: 4.2 },
    { id: 3, name: "National Packaging Solutions", company_name: "National Packaging Solutions", contact: "Priya Mehta", contact_person: "Priya Mehta", email: "priya@natpack.in", phone: "+91-9821003003", address: "78 Industrial Area, Thane", rating: 3.8 },
    { id: 4, name: "Bulk Trading Enterprises", company_name: "Bulk Trading Enterprises", contact: "Anil Gupta", contact_person: "Anil Gupta", email: "anil@bulktrading.in", phone: "+91-9821004004", address: "101 APMC Yard, Navi Mumbai", rating: 4.0 },
    { id: 5, name: "Global Imports Ltd", company_name: "Global Imports Ltd", contact: "Sara Khan", contact_person: "Sara Khan", email: "sara@globalimports.in", phone: "+91-9821005005", address: "22 Export Zone, Nhava Sheva", rating: 3.9 },
  ];

  // Customers (used by admin CustomerManagement + CustomerOrders)
  const customers = [
    { id: 1, customer_name: "Rajesh Mehta", company_name: "Metro Retail Store", email: "rajesh@metroretail.in", phone: "+91-9900110011", address_line_1: "12 MG Road", address_line_2: "", country: "India", state: "Maharashtra", city: "Pune", pincode: "411001", latitude: 18.5204, longitude: 73.8567, delivery_priority: "normal", status: "active" },
    { id: 2, customer_name: "Anita Sharma", company_name: "City Supermarket", email: "anita@citysupermarket.in", phone: "+91-9900220022", address_line_1: "56 Andheri West", address_line_2: "", country: "India", state: "Maharashtra", city: "Mumbai", pincode: "400058", latitude: 19.1365, longitude: 72.8296, delivery_priority: "urgent", status: "active" },
    { id: 3, customer_name: "Vijay Patil", company_name: "FreshMart Kothrud", email: "vijay@freshmart.in", phone: "+91-9900330033", address_line_1: "Paud Road, Kothrud", address_line_2: "", country: "India", state: "Maharashtra", city: "Pune", pincode: "411038", latitude: 18.5074, longitude: 73.8077, delivery_priority: "scheduled", status: "active" },
    { id: 4, customer_name: "Sunita Rao", company_name: "Regional Distribution Hub", email: "sunita@rdh.in", phone: "+91-9900440044", address_line_1: "NH48 Logistics Park", address_line_2: "Gate 3", country: "India", state: "Maharashtra", city: "Nashik", pincode: "422001", latitude: 19.9975, longitude: 73.7898, delivery_priority: "normal", status: "active" },
    { id: 5, customer_name: "Deepak Joshi", company_name: "Quick Shop Stores", email: "deepak@quickshop.in", phone: "+91-9900550055", address_line_1: "Plot 7, Wagle Estate", address_line_2: "", country: "India", state: "Maharashtra", city: "Thane", pincode: "400604", latitude: 19.1663, longitude: 72.9976, delivery_priority: "urgent", status: "inactive" },
  ];

  // Customer Orders (admin Logistics & Order Management)
  const customerOrders = [
    { id: 1, order_number: "ORD-2026-001", customer_id: 1, customer_name: "Rajesh Mehta", company_name: "Metro Retail Store", required_delivery_date: isoDate(getDate(-5)), delivery_address: "12 MG Road, Pune", delivery_city: "Pune", delivery_state: "MH", delivery_country: "IN", delivery_latitude: 18.5204, delivery_longitude: 73.8567, delivery_priority: "normal", status: "delivered", selected_warehouse_name: "Warehouse A", warehouse_distance_km: 11.8, driver_name: "Rajesh Kumar", vehicle_type: "Truck", vehicle_plate: "MH-12-AB-1234", delivery_sequence: 1, items: [{ product_id: 1001, product_name: "Wheat Flour (Atta)", quantity: 200, weight_kg: 200 }] },
    { id: 2, order_number: "ORD-2026-002", customer_id: 2, customer_name: "Anita Sharma", company_name: "City Supermarket", required_delivery_date: isoDate(getDate(-3)), delivery_address: "56 Andheri West, Mumbai", delivery_city: "Mumbai", delivery_state: "MH", delivery_country: "IN", delivery_latitude: 19.1365, delivery_longitude: 72.8296, delivery_priority: "urgent", status: "dispatched", selected_warehouse_name: "Warehouse B", warehouse_distance_km: 16.3, driver_name: "Rajesh Kumar", vehicle_type: "Truck", vehicle_plate: "MH-12-AB-1234", delivery_sequence: 2, items: [{ product_id: 2001, product_name: "Red Chilli Powder", quantity: 50, weight_kg: 50 }] },
    { id: 3, order_number: "ORD-2026-003", customer_id: 3, customer_name: "Vijay Patil", company_name: "FreshMart Kothrud", required_delivery_date: isoDate(getDate(-1)), delivery_address: "Paud Road, Kothrud, Pune", delivery_city: "Pune", delivery_state: "MH", delivery_country: "IN", delivery_latitude: 18.5074, delivery_longitude: 73.8077, delivery_priority: "scheduled", status: "approved", selected_warehouse_name: "Warehouse A", warehouse_distance_km: 7.6, driver_name: "Suresh Patil", vehicle_type: "Van", vehicle_plate: "MH-14-XY-9876", delivery_sequence: null, items: [{ product_id: 1101, product_name: "Rice (Basmati)", quantity: 100, weight_kg: 100 }] },
    { id: 4, order_number: "ORD-2026-004", customer_id: 4, customer_name: "Sunita Rao", company_name: "Regional Distribution Hub", required_delivery_date: isoDate(getDate(2)), delivery_address: "NH48 Logistics Park, Nashik", delivery_city: "Nashik", delivery_state: "MH", delivery_country: "IN", delivery_latitude: 19.9975, delivery_longitude: 73.7898, delivery_priority: "normal", status: "pending", selected_warehouse_name: null, warehouse_distance_km: null, driver_name: null, vehicle_type: null, vehicle_plate: null, delivery_sequence: null, items: [{ product_id: 2101, product_name: "Turmeric Powder", quantity: 80, weight_kg: 80 }] },
    { id: 5, order_number: "ORD-2026-005", customer_id: 5, customer_name: "Deepak Joshi", company_name: "Quick Shop Stores", required_delivery_date: isoDate(getDate(4)), delivery_address: "Plot 7, Wagle Estate, Thane", delivery_city: "Thane", delivery_state: "MH", delivery_country: "IN", delivery_latitude: 19.1663, delivery_longitude: 72.9976, delivery_priority: "urgent", status: "pending", selected_warehouse_name: null, warehouse_distance_km: null, driver_name: null, vehicle_type: null, vehicle_plate: null, delivery_sequence: null, items: [{ product_id: 3001, product_name: "BOPP Bags (25kg)", quantity: 500, weight_kg: 500 }] },
  ];

  // Transport: Vehicles & Shipments
  const transportVehicles = [
    { id: 1, vehicle_number: "MH-12-AB-1234", vehicle_type: "Truck", capacity_kg: 5000, capacity_volume: 50, driver_name: "Rajesh Kumar", driver_phone: "+91-9811001100", assigned_warehouse_id: 1, warehouse_name: "Warehouse A", current_latitude: 18.5089, current_longitude: 73.9259, status: "assigned" },
    { id: 2, vehicle_number: "MH-14-XY-9876", vehicle_type: "Van", capacity_kg: 2000, capacity_volume: 20, driver_name: "Suresh Patil", driver_phone: "+91-9811002200", assigned_warehouse_id: 2, warehouse_name: "Warehouse B", current_latitude: 19.2295, current_longitude: 72.8532, status: "available" },
    { id: 3, vehicle_number: "MH-09-CD-5566", vehicle_type: "Tempo", capacity_kg: 1000, capacity_volume: 10, driver_name: "Arun Singh", driver_phone: "+91-9811003300", assigned_warehouse_id: 1, warehouse_name: "Warehouse A", current_latitude: 18.5089, current_longitude: 73.9259, status: "maintenance" },
    { id: 4, vehicle_number: "GJ-01-EF-7788", vehicle_type: "Lorry", capacity_kg: 10000, capacity_volume: 100, driver_name: "Vikram Desai", driver_phone: "+91-9811004400", assigned_warehouse_id: null, warehouse_name: null, current_latitude: 23.0225, current_longitude: 72.5714, status: "available" },
  ];

  const transportShipments = [
    { id: 1, vehicle_id: 1, vehicle_number: "MH-12-AB-1234", driver_name: "Rajesh Kumar", driver_phone: "+91-9811001100", origin_id: 1, origin_name: "Warehouse A", origin_lat: 18.5089, origin_lng: 73.9259, dest_name: "Metro Retail Store, MG Road, Pune", dest_lat: 18.5204, dest_lng: 73.8567, distance_km: 11.8, customer_order_id: 1, order_number: "ORD-2026-001", status: "Delivered", dispatched_at: isoDate(getDate(6)), delivered_at: isoDate(getDate(5)) },
    { id: 2, vehicle_id: 1, vehicle_number: "MH-12-AB-1234", driver_name: "Rajesh Kumar", driver_phone: "+91-9811001100", origin_id: 2, origin_name: "Warehouse B", origin_lat: 19.2295, origin_lng: 72.8532, dest_name: "City Supermarket, Andheri West, Mumbai", dest_lat: 19.1365, dest_lng: 72.8296, distance_km: 16.3, customer_order_id: 2, order_number: "ORD-2026-002", status: "Pending", dispatched_at: isoDate(getDate(1)), delivered_at: null },
    { id: 3, vehicle_id: 2, vehicle_number: "MH-14-XY-9876", driver_name: "Suresh Patil", driver_phone: "+91-9811002200", origin_id: 1, origin_name: "Warehouse A", origin_lat: 18.5089, origin_lng: 73.9259, dest_name: "FreshMart, Kothrud, Pune", dest_lat: 18.5074, dest_lng: 73.8077, distance_km: 7.6, customer_order_id: 3, order_number: "ORD-2026-003", status: "Pending", dispatched_at: isoDate(getDate(0)), delivered_at: null },
  ];

  // Purchases: Admin POs, Quotations, PO Items
  const purchaseOrders = [
    { id: "PO-1", supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd", order_date: isoDate(getDate(45)), expected_delivery: isoDate(getDate(35)), total_amount: 75600, status: "Received", item_count: 2 },
    { id: "PO-2", supplier_id: 5, supplier_name: "Global Imports Ltd", order_date: isoDate(getDate(30)), expected_delivery: isoDate(getDate(15)), total_amount: 28500, status: "Sent", item_count: 3 },
    { id: "PO-3", supplier_id: 3, supplier_name: "National Packaging Solutions", order_date: isoDate(getDate(20)), expected_delivery: isoDate(getDate(8)), total_amount: 90000, status: "Received", item_count: 2 },
    { id: "PO-4", supplier_id: 2, supplier_name: "Krishna Spices & Co", order_date: isoDate(getDate(10)), expected_delivery: isoDate(getDate(-2)), total_amount: 42000, status: "Sent", item_count: 2 },
    { id: "PO-5", supplier_id: 4, supplier_name: "Bulk Trading Enterprises", order_date: isoDate(getDate(5)), expected_delivery: isoDate(getDate(-10)), total_amount: 32100, status: "Draft", item_count: 1 },
  ];

  const purchaseOrderItems = {
    "PO-1": [
      { id: 101, purchase_order_id: "PO-1", product_id: 101, product_name: "Wheat Flour (Atta)", quantity: 1200, unit_price: 44, uom: "kg" },
      { id: 102, purchase_order_id: "PO-1", product_id: 102, product_name: "Rice (Basmati)", quantity: 400, unit_price: 98, uom: "kg" },
    ],
    "PO-2": [
      { id: 201, purchase_order_id: "PO-2", product_id: 103, product_name: "Soybean Oil", quantity: 100, unit_price: 145, uom: "ltr" },
      { id: 202, purchase_order_id: "PO-2", product_id: 201, product_name: "Red Chilli Powder", quantity: 50, unit_price: 285, uom: "kg" },
      { id: 203, purchase_order_id: "PO-2", product_id: 202, product_name: "Turmeric Powder", quantity: 80, unit_price: 178, uom: "kg" },
    ],
    "PO-3": [
      { id: 301, purchase_order_id: "PO-3", product_id: 301, product_name: "BOPP Bags (25kg)", quantity: 5000, unit_price: 18, uom: "pcs" },
    ],
    "PO-4": [
      { id: 401, purchase_order_id: "PO-4", product_id: 201, product_name: "Red Chilli Powder", quantity: 100, unit_price: 280, uom: "kg" },
      { id: 402, purchase_order_id: "PO-4", product_id: 203, product_name: "Cumin Seeds", quantity: 50, unit_price: 420, uom: "kg" },
    ],
    "PO-5": [
      { id: 501, purchase_order_id: "PO-5", product_id: 102, product_name: "Rice (Basmati)", quantity: 300, unit_price: 107, uom: "kg" },
    ],
  };

  // Admin/Purchases Quotations (supplier side — different from buyer RFQs)
  const adminQuotations = [
    { id: 1, supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd", product_id: 101, product_name: "Wheat Flour (Atta)", quantity: 1200, unit_price: 44, total_amount: 52800, status: "Accepted", created_at: isoDate(getDate(30)), delivery_due_at: isoDate(getDate(20)), allocations: [{ warehouse_name: "Warehouse A", rack_code: "R-A1", bin_code: "B-101", quantity: 1200, barcode_id: "SKU-WHEAT-ATTA" }] },
    { id: 2, supplier_id: 2, supplier_name: "Krishna Spices & Co", product_id: 201, product_name: "Red Chilli Powder", quantity: 500, unit_price: 290, total_amount: 145000, status: "Pending", created_at: isoDate(getDate(10)), delivery_due_at: isoDate(getDate(-5)), allocations: [] },
    { id: 3, supplier_id: 3, supplier_name: "National Packaging Solutions", product_id: 301, product_name: "BOPP Bags (25kg)", quantity: 5000, unit_price: 19, total_amount: 95000, status: "Accepted", created_at: isoDate(getDate(18)), delivery_due_at: isoDate(getDate(8)), allocations: [{ warehouse_name: "Warehouse A", rack_code: "R-A1", bin_code: "B-101", quantity: 5000, barcode_id: "SKU-BOPP-25KG" }] },
    { id: 4, supplier_id: 5, supplier_name: "Global Imports Ltd", product_id: 102, product_name: "Rice (Basmati)", quantity: 800, unit_price: 98, total_amount: 78400, status: "Rejected", created_at: isoDate(getDate(25)), delivery_due_at: isoDate(getDate(15)), allocations: [] },
    { id: 5, supplier_id: 4, supplier_name: "Bulk Trading Enterprises", product_id: 103, product_name: "Soybean Oil", quantity: 200, unit_price: 148, total_amount: 29600, status: "Pending", created_at: isoDate(getDate(5)), delivery_due_at: isoDate(getDate(-2)), allocations: [] },
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

  // Geo-Presets for easy warehouse creation

  // Warehouse + bins (Inventory module uses these)
  const warehouses = [
    { id: 1, name: "Warehouse A", lat: 18.5089, lng: 73.9259 }, // Hadapsar Industrial Area, Pune
    { id: 2, name: "Warehouse B", lat: 19.2295, lng: 72.8532 }, // Kandivali, Mumbai
  ];

  const bins = [
    { id: 1, warehouse_id: 1, rack_code: "R-A1", bin_code: "B-101", status: "Available", barcode: "BIN-A1-101", capacity: 5000 },
    { id: 2, warehouse_id: 1, rack_code: "R-A1", bin_code: "B-102", status: "Available", barcode: "BIN-A1-102", capacity: 5000 },
    { id: 3, warehouse_id: 2, rack_code: "R-B1", bin_code: "B-201", status: "Available", barcode: "BIN-B1-201", capacity: 5000 },
    { id: 4, warehouse_id: 2, rack_code: "R-B2", bin_code: "B-202", status: "Available", barcode: "BIN-B2-202", capacity: 5000 },
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

  const salesOrders = [
    { id: "SO-1", customer_id: 1, customer_name: "Metro Retail Store", order_number: "SO-2026-001", created_at: getDate(60).toISOString(), total_amount: 8500, status: "delivered", delivery_date: isoDate(getDate(50)) },
    { id: "SO-2", customer_id: 2, customer_name: "City Supermarket", order_number: "SO-2026-002", created_at: getDate(50).toISOString(), total_amount: 12300, status: "delivered", delivery_date: isoDate(getDate(42)) },
  ];

  const ledgerEntries = [
    { id: 1000001, date: isoDate(getDate(50)), description: "Sales Revenue - SO-2026-001", type: "Credit", amount: 8500, status: "Completed", category: "Sales Revenue", source: "auto", reference: "SO-2026-001" },
    { id: 2000001, date: isoDate(getDate(45)), description: "Cost of Goods - PO#1", type: "Debit", amount: 15000, status: "Completed", category: "Cost of Goods", source: "auto", reference: "PO#1" },
  ];

  // ── Advanced Inventory seed data ──────────────────────────────────────────
  const advBatches = [
    { id: 1, product_id: 1001, product_name: "Wheat Flour (Atta)", batch_number: "BATCH-2026-001", lot_number: "LOT-WH-A01", warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 1, bin_location: "R-A1/B-101", quantity_received: 500, quantity_available: 420, quantity_consumed: 80, best_before_date: isoDate(getDate(-5)), manufacture_date: "2026-01-15", supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd", status: "active", created_at: "2026-01-20", notes: "Premium grade wheat flour" },
    { id: 2, product_id: 1001, product_name: "Wheat Flour (Atta)", batch_number: "BATCH-2026-002", lot_number: "LOT-WH-A02", warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 1, bin_location: "R-A1/B-101", quantity_received: 600, quantity_available: 580, quantity_consumed: 20, best_before_date: "2026-09-15", manufacture_date: "2026-03-15", supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd", status: "active", created_at: "2026-03-20", notes: "" },
    { id: 3, product_id: 1101, product_name: "Rice (Basmati)", batch_number: "BATCH-2026-003", lot_number: "LOT-RC-B01", warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 2, bin_location: "R-A1/B-102", quantity_received: 400, quantity_available: 310, quantity_consumed: 90, best_before_date: "2026-12-01", manufacture_date: "2026-02-01", supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd", status: "active", created_at: "2026-02-05", notes: "Aged basmati, premium" },
    { id: 4, product_id: 1102, product_name: "Rice (Basmati)", batch_number: "BATCH-2026-004", lot_number: "LOT-RC-B02", warehouse_id: 2, warehouse_name: "Warehouse B", bin_id: 4, bin_location: "R-B2/B-202", quantity_received: 200, quantity_available: 120, quantity_consumed: 80, best_before_date: isoDate(getDate(12)), manufacture_date: "2025-12-10", supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd", status: "active", created_at: "2025-12-15", notes: "" },
    { id: 5, product_id: 1201, product_name: "Soybean Oil", batch_number: "BATCH-2026-005", lot_number: "LOT-OIL-01", warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 1, bin_location: "R-A1/B-101", quantity_received: 100, quantity_available: 48, quantity_consumed: 52, best_before_date: isoDate(getDate(3)), manufacture_date: "2025-11-01", supplier_id: 1, supplier_name: "Agro Fresh Pvt Ltd", status: "active", created_at: "2025-11-05", notes: "Cold pressed" },
    { id: 6, product_id: 2001, product_name: "Red Chilli Powder", batch_number: "BATCH-2026-006", lot_number: "LOT-SP-C01", warehouse_id: 2, warehouse_name: "Warehouse B", bin_id: 3, bin_location: "R-B1/B-201", quantity_received: 250, quantity_available: 240, quantity_consumed: 10, best_before_date: "2027-04-30", manufacture_date: "2026-04-01", supplier_id: 2, supplier_name: "Krishna Spices & Co", status: "active", created_at: "2026-04-05", notes: "Fine grind, Grade A" },
    { id: 7, product_id: 2101, product_name: "Turmeric Powder", batch_number: "BATCH-2026-007", lot_number: "LOT-SP-T01", warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 2, bin_location: "R-A1/B-102", quantity_received: 150, quantity_available: 80, quantity_consumed: 70, best_before_date: isoDate(getDate(25)), manufacture_date: "2025-10-01", supplier_id: 2, supplier_name: "Krishna Spices & Co", status: "active", created_at: "2025-10-05", notes: "" },
    { id: 8, product_id: 3001, product_name: "BOPP Bags (25kg)", batch_number: "BATCH-2026-008", lot_number: "LOT-PK-B01", warehouse_id: 1, warehouse_name: "Warehouse A", bin_id: 1, bin_location: "R-A1/B-101", quantity_received: 3000, quantity_available: 950, quantity_consumed: 2050, best_before_date: null, manufacture_date: "2026-01-10", supplier_id: 3, supplier_name: "National Packaging Solutions", status: "active", created_at: "2026-01-15", notes: "50 micron thickness" },
    { id: 9, product_id: 2201, product_name: "Cumin Seeds", batch_number: "BATCH-2026-009", lot_number: "LOT-SP-CU1", warehouse_id: 2, warehouse_name: "Warehouse B", bin_id: 4, bin_location: "R-B2/B-202", quantity_received: 200, quantity_available: 0, quantity_consumed: 200, best_before_date: isoDate(getDate(-30)), manufacture_date: "2025-06-01", supplier_id: 2, supplier_name: "Krishna Spices & Co", status: "depleted", created_at: "2025-06-05", notes: "Fully consumed" },
    { id: 10, product_id: 3101, product_name: "Corrugated Boxes", batch_number: "BATCH-2026-010", lot_number: "LOT-PK-CB1", warehouse_id: 2, warehouse_name: "Warehouse B", bin_id: 3, bin_location: "R-B1/B-201", quantity_received: 1000, quantity_available: 140, quantity_consumed: 860, best_before_date: null, manufacture_date: "2026-02-15", supplier_id: 3, supplier_name: "National Packaging Solutions", status: "active", created_at: "2026-02-20", notes: "" },
  ];

  const advCycleCounts = [
    { id: 1, cycle_code: "CC-2026-001", warehouse_id: 1, warehouse_name: "Warehouse A", cycle_type: "full", zone_name: "", planned_date: isoDate(getDate(2)), started_at: isoDate(getDate(2)), completed_at: isoDate(getDate(1)), status: "completed", items_counted: 5, items_total: 5, variance_count: 1, notes: "Annual full count" },
    { id: 2, cycle_code: "CC-2026-002", warehouse_id: 2, warehouse_name: "Warehouse B", cycle_type: "zone", zone_name: "Zone B1 - Spices", planned_date: isoDate(getDate(0)), started_at: isoDate(getDate(0)), completed_at: null, status: "in_progress", items_counted: 2, items_total: 4, variance_count: 0, notes: "Zone B1 spot check" },
    { id: 3, cycle_code: "CC-2026-003", warehouse_id: 1, warehouse_name: "Warehouse A", cycle_type: "partial", zone_name: "", planned_date: isoDate(getDate(-3)), started_at: null, completed_at: null, status: "planned", items_counted: 0, items_total: 3, variance_count: 0, notes: "Quarterly partial count - oils" },
    { id: 4, cycle_code: "CC-2026-004", warehouse_id: 2, warehouse_name: "Warehouse B", cycle_type: "full", zone_name: "", planned_date: isoDate(getDate(-7)), started_at: null, completed_at: null, status: "planned", items_counted: 0, items_total: 6, variance_count: 0, notes: "Scheduled full count WH-B" },
    { id: 5, cycle_code: "CC-2026-005", warehouse_id: 1, warehouse_name: "Warehouse A", cycle_type: "zone", zone_name: "Zone A1 - Grains", planned_date: isoDate(getDate(10)), started_at: isoDate(getDate(10)), completed_at: isoDate(getDate(9)), status: "completed", items_counted: 3, items_total: 3, variance_count: 2, notes: "Grains zone recount due to variance" },
  ];

  const advScanHistory = [
    { id: 1, barcode: "SKU-WHEAT-ATTA", product_name: "Wheat Flour (Atta)", scan_type: "inbound", warehouse_name: "Warehouse A", bin_location: "R-A1/B-101", quantity_scanned: 500, timestamp: getDate(1).toISOString(), valid: true, error_message: null, session_id: "SESS-001" },
    { id: 2, barcode: "SKU-RICE-BASM", product_name: "Rice (Basmati)", scan_type: "outbound", warehouse_name: "Warehouse A", bin_location: "R-A1/B-102", quantity_scanned: 50, timestamp: getDate(1).toISOString(), valid: true, error_message: null, session_id: "SESS-001" },
    { id: 3, barcode: "BIN-A1-101", product_name: null, scan_type: "cycle_count", warehouse_name: "Warehouse A", bin_location: "R-A1/B-101", quantity_scanned: 1, timestamp: getDate(2).toISOString(), valid: true, error_message: null, session_id: "SESS-002" },
    { id: 4, barcode: "INVALID-CODE", product_name: null, scan_type: "inbound", warehouse_name: "Warehouse B", bin_location: null, quantity_scanned: 0, timestamp: getDate(2).toISOString(), valid: false, error_message: "Barcode not found in system", session_id: "SESS-002" },
    { id: 5, barcode: "SKU-CHILLI-RED", product_name: "Red Chilli Powder", scan_type: "transfer", warehouse_name: "Warehouse B", bin_location: "R-B1/B-201", quantity_scanned: 100, timestamp: getDate(3).toISOString(), valid: true, error_message: null, session_id: "SESS-003" },
    { id: 6, barcode: "SKU-SOY-OIL", product_name: "Soybean Oil", scan_type: "adjustment", warehouse_name: "Warehouse A", bin_location: "R-A1/B-101", quantity_scanned: 5, timestamp: getDate(4).toISOString(), valid: true, error_message: null, session_id: "SESS-003" },
    { id: 7, barcode: "SKU-BOPP-25KG", product_name: "BOPP Bags (25kg)", scan_type: "outbound", warehouse_name: "Warehouse A", bin_location: "R-A1/B-101", quantity_scanned: 200, timestamp: getDate(5).toISOString(), valid: true, error_message: null, session_id: "SESS-004" },
    { id: 8, barcode: "SKU-TURMERIC", product_name: "Turmeric Powder", scan_type: "inbound", warehouse_name: "Warehouse A", bin_location: "R-A1/B-102", quantity_scanned: 150, timestamp: getDate(6).toISOString(), valid: true, error_message: null, session_id: "SESS-004" },
  ];

  const computeExpiryAlerts = () => {
    const alerts = [];
    let alertId = 1;
    for (const b of advBatches) {
      if (!b.best_before_date || b.status === "depleted") continue;
      const bbDate = new Date(b.best_before_date);
      const daysRemaining = Math.ceil((bbDate - today) / (1000 * 60 * 60 * 24));
      let alert_type = null;
      if (daysRemaining <= 0) alert_type = "expired";
      else if (daysRemaining <= 7) alert_type = "critical";
      else if (daysRemaining <= 30) alert_type = "warning";
      if (alert_type) {
        alerts.push({
          id: alertId++,
          batch_id: b.id,
          batch_number: b.batch_number,
          product_id: b.product_id,
          product_name: b.product_name,
          warehouse_name: b.warehouse_name,
          best_before_date: b.best_before_date,
          days_remaining: daysRemaining,
          alert_type,
          quantity_at_risk: b.quantity_available,
          acknowledged: false,
          acknowledged_at: null,
          action_taken: null,
        });
      }
    }
    return alerts;
  };

  const advExpiryAlerts = computeExpiryAlerts();

  return {
    meta: { seededAt: Date.now(), version: 1 },
    auth: {
      erp_token: null,
      erp_user: null,
      token: null,
    },
    suppliers,
    products,
    customers,
    customerOrders,
    transport: { vehicles: transportVehicles, shipments: transportShipments },
    purchases: { orders: purchaseOrders, orderItems: purchaseOrderItems, quotations: adminQuotations },
    warehouse: { 
      warehouses, 
      bins,
      rack_positions: {
        "R-A1": [0, 0, 0],
        "R-B1": [15, 0, 0],
        "R-B2": [15, 0, 10]
      }
    },
    inventory: { products: inventory },
    buyer: { quotations: buyerQuotations, purchaseOrders, reorderHistory },
    finance: { purchaseOrders, salesOrders, ledgerEntries },
    advancedInventory: {
      batches: advBatches,
      cycleCounts: advCycleCounts,
      scanHistory: advScanHistory,
      expiryAlerts: advExpiryAlerts,
    },
    dispatcher: {
      assignments: [
        {
          id: 1, shipment_id: "SHP-2026-001", driver_id: 10, driver_name: "Rajesh Kumar", vehicle_number: "MH-12-AB-1234",
          status: "assigned", assigned_at: isoDate(getDate(0)),
          warehouse_id: 1, warehouse_name: "Warehouse A", warehouse_lat: 18.5089, warehouse_lng: 73.9259,
          delivery_address: "Metro Retail Store, MG Road, Pune", delivery_lat: 18.5204, delivery_lng: 73.8567,
          route_details: "Warehouse A → Metro Retail Store", total_distance_km: 11.8,
          delivery_date: isoDate(getDate(-1)), estimated_time: "14:30 PM", navigation_url: "https://maps.google.com/?q=18.5204,73.8567",
          items: [
            { product_id: 1001, product_name: "Wheat Flour (Atta)", quantity: 200, unit: "kg", bin_id: 1, rack_code: "R-A1", bin_code: "B-101", bin_location: "R-A1/B-101", picked: false },
            { product_id: 1201, product_name: "Soybean Oil", quantity: 20, unit: "ltr", bin_id: 1, rack_code: "R-A1", bin_code: "B-101", bin_location: "R-A1/B-101", picked: false },
            { product_id: 1101, product_name: "Rice (Basmati)", quantity: 100, unit: "kg", bin_id: 2, rack_code: "R-A1", bin_code: "B-102", bin_location: "R-A1/B-102", picked: false },
          ],
        },
        {
          id: 2, shipment_id: "SHP-2026-002", driver_id: 10, driver_name: "Rajesh Kumar", vehicle_number: "MH-12-AB-1234",
          status: "picking", assigned_at: isoDate(getDate(1)),
          warehouse_id: 2, warehouse_name: "Warehouse B", warehouse_lat: 19.2295, warehouse_lng: 72.8532,
          delivery_address: "City Supermarket, Andheri West, Mumbai", delivery_lat: 19.1365, delivery_lng: 72.8296,
          route_details: "Warehouse B → City Supermarket", total_distance_km: 16.3,
          delivery_date: isoDate(getDate(-2)), estimated_time: "11:00 AM", navigation_url: "https://maps.google.com/?q=19.1365,72.8296",
          items: [
            { product_id: 2001, product_name: "Red Chilli Powder", quantity: 50, unit: "kg", bin_id: 3, rack_code: "R-B1", bin_code: "B-201", bin_location: "R-B1/B-201", picked: true },
            { product_id: 3101, product_name: "Corrugated Boxes", quantity: 200, unit: "pcs", bin_id: 3, rack_code: "R-B1", bin_code: "B-201", bin_location: "R-B1/B-201", picked: false },
            { product_id: 1102, product_name: "Rice (Basmati)", quantity: 60, unit: "kg", bin_id: 4, rack_code: "R-B2", bin_code: "B-202", bin_location: "R-B2/B-202", picked: false },
          ],
        },
        {
          id: 3, shipment_id: "SHP-2026-003", driver_id: 10, driver_name: "Rajesh Kumar", vehicle_number: "MH-12-AB-1234",
          status: "delivered", assigned_at: isoDate(getDate(5)),
          warehouse_id: 1, warehouse_name: "Warehouse A", warehouse_lat: 18.5089, warehouse_lng: 73.9259,
          delivery_address: "FreshMart, Kothrud, Pune", delivery_lat: 18.5074, delivery_lng: 73.8077,
          route_details: "Warehouse A → FreshMart", total_distance_km: 7.6,
          delivery_date: isoDate(getDate(5)), estimated_time: "10:15 AM", navigation_url: "https://maps.google.com/?q=18.5074,73.8077",
          items: [
            { product_id: 1001, product_name: "Wheat Flour (Atta)", quantity: 300, unit: "kg", bin_id: 1, rack_code: "R-A1", bin_code: "B-101", bin_location: "R-A1/B-101", picked: true },
            { product_id: 2101, product_name: "Turmeric Powder", quantity: 30, unit: "kg", bin_id: 2, rack_code: "R-A1", bin_code: "B-102", bin_location: "R-A1/B-102", picked: true },
          ],
        },
      ],
      notifications: [
        { id: 1, driver_id: 10, title: "New Assignment", message: "You have been assigned Shipment SHP-2026-001 at Warehouse A. 3 items to pick.", type: "assignment", related_id: 1, is_read: false, created_at: getDate(0).toISOString() },
        { id: 2, driver_id: 10, title: "Picking In Progress", message: "Shipment SHP-2026-002 at Warehouse B — 1 of 3 items picked.", type: "update", related_id: 2, is_read: false, created_at: getDate(1).toISOString() },
        { id: 3, driver_id: 10, title: "Delivery Completed", message: "Shipment SHP-2026-003 delivered to FreshMart, Kothrud, Pune.", type: "update", related_id: 3, is_read: true, created_at: getDate(5).toISOString() },
        { id: 4, driver_id: 10, title: "Reminder", message: "Delivery for SHP-2026-001 is due today. Please proceed to Warehouse A.", type: "reminder", related_id: 1, is_read: false, created_at: getDate(0).toISOString() },
      ],
    },
  };
};

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);

    if (!parsed?.suppliers || !parsed?.inventory?.products) return seedState();
    
    // Ensure warehouse data exists in migrated states
    if (!parsed.warehouse) parsed.warehouse = seedState().warehouse;
    if (!parsed.inventory) parsed.inventory = seedState().inventory;

    // Migration: Add barcodes to bins if missing
    if (parsed.warehouse.bins) {
      parsed.warehouse.bins = parsed.warehouse.bins.map(b => ({
        ...b,
        barcode: b.barcode || `BIN-${b.rack_code}-${b.bin_code}`,
        capacity: b.capacity || 5000
      }));
    }

    if (!parsed?.buyer?.reorderHistory) parsed.buyer = { ...(parsed.buyer || {}), reorderHistory: seedState().buyer.reorderHistory };

    // Migration: ensure advancedInventory exists
    if (!parsed.advancedInventory) parsed.advancedInventory = seedState().advancedInventory;

    // Migration: rename driver to dispatcher
    if (parsed.driver && !parsed.dispatcher) {
      parsed.dispatcher = parsed.driver;
      delete parsed.driver;
    }

    // Migration: ensure dispatcher data exists
    if (!parsed.dispatcher) parsed.dispatcher = seedState().dispatcher;

    // Migration: ensure new modules exist and have actual data (not empty stubs)
    const fresh = seedState();
    if (!parsed.customers || !Array.isArray(parsed.customers) || parsed.customers.length === 0)
      parsed.customers = fresh.customers;
    if (!parsed.customerOrders || !Array.isArray(parsed.customerOrders) || parsed.customerOrders.length === 0)
      parsed.customerOrders = fresh.customerOrders;
    if (!parsed.transport || !parsed.transport.vehicles || parsed.transport.vehicles.length === 0)
      parsed.transport = fresh.transport;
    if (!parsed.purchases || !parsed.purchases.orders || parsed.purchases.orders.length === 0)
      parsed.purchases = fresh.purchases;

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
  getCityPresets: () => state.warehouse.cityPresets || {
    "Pune, MH": { lat: 18.5204, lng: 73.8567 },
    "Mumbai, MH": { lat: 19.0760, lng: 72.8777 },
    "Delhi, NCR": { lat: 28.6139, lng: 77.2090 },
    "Bangalore, KA": { lat: 12.9716, lng: 77.5946 },
    "Hyderabad, TS": { lat: 17.3850, lng: 78.4867 },
    "Chennai, TN": { lat: 13.0827, lng: 80.2707 },
    "Kolkata, WB": { lat: 22.5726, lng: 88.3639 },
    "Ahmedabad, GJ": { lat: 23.0225, lng: 72.5714 }
  },
  createWarehouse: (payload) => {
    const newId = Math.max(0, ...(state.warehouse.warehouses || []).map(w => w.id)) + 1;
    let lat = Number(payload.lat);
    let lng = Number(payload.lng);

    // Lookup from preset if city is provided
    if (payload.city) {
      const presets = {
        "Pune, MH": { lat: 18.5204, lng: 73.8567 },
        "Mumbai, MH": { lat: 19.0760, lng: 72.8777 },
        "Delhi, NCR": { lat: 28.6139, lng: 77.2090 },
        "Bangalore, KA": { lat: 12.9716, lng: 77.5946 },
        "Hyderabad, TS": { lat: 17.3850, lng: 78.4867 },
        "Chennai, TN": { lat: 13.0827, lng: 80.2707 },
        "Kolkata, WB": { lat: 22.5726, lng: 88.3639 },
        "Ahmedabad, GJ": { lat: 23.0225, lng: 72.5714 }
      };
      if (presets[payload.city]) {
        lat = presets[payload.city].lat;
        lng = presets[payload.city].lng;
      }
    }

    const newWarehouse = {
      id: newId,
      name: payload.name || `Warehouse ${newId}`,
      lat: lat || 18.5204,
      lng: lng || 73.8567
    };
    state.warehouse.warehouses = [...(state.warehouse.warehouses || []), newWarehouse];
    persist();
    listeners.forEach((l) => l());
    return newWarehouse;
  },
  getBins: () => state.warehouse.bins,
  createRack: (payload) => {
    const warehouse_id = Number(payload.warehouse_id);
    const rack_code = payload.rack_code;
    const bin_count = Number(payload.bin_count || 4);
    
    const warehouse = state.warehouse.warehouses.find(w => w.id === warehouse_id);
    const baseLat = warehouse?.lat || 18.5089;
    const baseLng = warehouse?.lng || 73.9259;

    const newBins = [];
    const baseId = Math.max(0, ...(state.warehouse.bins || []).map(b => b.id)) + 1;
    
    // Logic for geolocation offset (approximate)

    for (let i = 1; i <= bin_count; i++) {
      // Default offset for new racks is [0, 0, 0] in 3D
      const binLat = baseLat; 
      const binLng = baseLng;

      newBins.push({
        id: baseId + i - 1,
        warehouse_id: warehouse_id,
        rack_code: rack_code,
        bin_code: `B-${String(i).padStart(2, '0')}`,
        status: "Available",
        lat: binLat,
        lng: binLng
      });
    }
    
    state.warehouse.bins = [...(state.warehouse.bins || []), ...newBins];
    
    // Initialize position and geo
    if (!state.warehouse.rack_positions) state.warehouse.rack_positions = {};
    state.warehouse.rack_positions[rack_code] = [0, 0, 0];

    persist();
    listeners.forEach((l) => l());
    return newBins;
  },
  updateRackPosition: (rackCode, position) => {
    if (!state.warehouse.rack_positions) state.warehouse.rack_positions = {};
    state.warehouse.rack_positions[rackCode] = position;

    // Also update the geo-coordinates of all bins in this rack
    const bins = state.warehouse.bins || [];
    const rackBins = bins.filter(b => b.rack_code === rackCode);
    if (rackBins.length > 0) {
      const warehouse = state.warehouse.warehouses.find(w => w.id === rackBins[0].warehouse_id);
      if (warehouse) {
        const latMeters = 111111;
        const lngMeters = 111111 * Math.cos(warehouse.lat * Math.PI / 180);
        
        state.warehouse.bins = bins.map(b => {
          if (b.rack_code === rackCode) {
            return {
              ...b,
              lat: (warehouse.lat - (position[2] / latMeters)).toFixed(7),
              lng: (warehouse.lng + (position[0] / lngMeters)).toFixed(7)
            };
          }
          return b;
        });
      }
    }

    persist();
    listeners.forEach((l) => l());
    return true;
  },
  lookupByBarcode: (barcode) => {
    if (!barcode) return null;
    const search = String(barcode).toUpperCase();
    
    // Search in bins (Rack lookup)
    const bin = (state.warehouse.bins || []).find(b => String(b.barcode).toUpperCase() === search);
    if (bin) {
      const warehouse = (state.warehouse.warehouses || []).find(w => w.id === bin.warehouse_id);
      const product = (state.inventory.products || []).find(p => p.bin_id === bin.id);
      return {
        type: "bin",
        id: bin.id,
        warehouse_id: bin.warehouse_id,
        warehouse_name: warehouse?.name,
        rack_code: bin.rack_code,
        bin_code: bin.bin_code,
        barcode: bin.barcode,
        product: product || null
      };
    }

    // Search in products (Item lookup)
    const product = (state.inventory.products || []).find(p => String(p.barcode).toUpperCase() === search);
    if (product) {
      const bin = (state.warehouse.bins || []).find(b => b.id === product.bin_id);
      const warehouse = (state.warehouse.warehouses || []).find(w => w.id === product.warehouse_id);
      return {
        type: "product",
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        stock: product.stock,
        warehouse_name: warehouse?.name,
        location: bin ? `${bin.rack_code}/${bin.bin_code}` : "Unassigned"
      };
    }

    return null;
  },
  getPurchasesSuppliers: () => state.suppliers,

  // ── Advanced Inventory actions ───────────────────────────────────────────
  getAdvBatches: () => state.advancedInventory?.batches || [],

  createAdvBatch: (payload) => {
    const batches = state.advancedInventory?.batches || [];
    const nextId = Math.max(0, ...batches.map((b) => b.id)) + 1;
    const warehouse = (state.warehouse.warehouses || []).find((w) => String(w.id) === String(payload.warehouse_id));
    const bin = (state.warehouse.bins || []).find((b) => String(b.id) === String(payload.bin_id));
    const supplier = (state.suppliers || []).find((s) => String(s.id) === String(payload.supplier_id));
    const product = (state.inventory.products || []).find((p) => String(p.id) === String(payload.product_id));
    const qty = Number(payload.quantity_received || 0);

    const newBatch = {
      id: nextId,
      product_id: Number(payload.product_id),
      product_name: product?.name || payload.product_name || "",
      batch_number: payload.batch_number || `BATCH-${Date.now()}`,
      lot_number: payload.lot_number || "",
      warehouse_id: Number(payload.warehouse_id),
      warehouse_name: warehouse?.name || "",
      bin_id: Number(payload.bin_id),
      bin_location: bin ? `${bin.rack_code}/${bin.bin_code}` : "",
      quantity_received: qty,
      quantity_available: qty,
      quantity_consumed: 0,
      best_before_date: payload.best_before_date || null,
      manufacture_date: payload.manufacture_date || "",
      supplier_id: Number(payload.supplier_id),
      supplier_name: supplier?.name || "",
      status: "active",
      created_at: new Date().toISOString().split("T")[0],
      notes: payload.notes || "",
    };

    if (!state.advancedInventory) state.advancedInventory = { batches: [], cycleCounts: [], scanHistory: [], expiryAlerts: [] };
    state.advancedInventory.batches = [newBatch, ...batches];
    persist();
    listeners.forEach((l) => l());
    return newBatch;
  },

  updateAdvBatchStatus: (id, status) => {
    if (!state.advancedInventory?.batches) return null;
    state.advancedInventory.batches = state.advancedInventory.batches.map((b) =>
      b.id === Number(id) ? { ...b, status } : b
    );
    persist();
    listeners.forEach((l) => l());
    return state.advancedInventory.batches.find((b) => b.id === Number(id));
  },

  getAdvCycleCounts: () => state.advancedInventory?.cycleCounts || [],

  createAdvCycleCount: (payload) => {
    const counts = state.advancedInventory?.cycleCounts || [];
    const nextId = Math.max(0, ...counts.map((c) => c.id)) + 1;
    const warehouse = (state.warehouse.warehouses || []).find((w) => String(w.id) === String(payload.warehouse_id));

    const newCC = {
      id: nextId,
      cycle_code: `CC-2026-${String(nextId).padStart(3, "0")}`,
      warehouse_id: Number(payload.warehouse_id),
      warehouse_name: warehouse?.name || "",
      cycle_type: payload.cycle_type || "partial",
      zone_name: payload.zone_name || "",
      planned_date: payload.planned_date || new Date().toISOString().split("T")[0],
      started_at: null,
      completed_at: null,
      status: "planned",
      items_counted: 0,
      items_total: Number(payload.items_total || 5),
      variance_count: 0,
      notes: payload.notes || "",
    };

    if (!state.advancedInventory) state.advancedInventory = { batches: [], cycleCounts: [], scanHistory: [], expiryAlerts: [] };
    state.advancedInventory.cycleCounts = [newCC, ...counts];
    persist();
    listeners.forEach((l) => l());
    return newCC;
  },

  startAdvCycleCount: (id) => {
    if (!state.advancedInventory?.cycleCounts) return null;
    state.advancedInventory.cycleCounts = state.advancedInventory.cycleCounts.map((c) =>
      c.id === Number(id) ? { ...c, status: "in_progress", started_at: new Date().toISOString().split("T")[0] } : c
    );
    persist();
    listeners.forEach((l) => l());
    return state.advancedInventory.cycleCounts.find((c) => c.id === Number(id));
  },

  completeAdvCycleCount: (id) => {
    if (!state.advancedInventory?.cycleCounts) return null;
    state.advancedInventory.cycleCounts = state.advancedInventory.cycleCounts.map((c) => {
      if (c.id !== Number(id)) return c;
      // Simulate variance on completion
      const variance = Math.floor(Math.random() * 3);
      return { ...c, status: "completed", completed_at: new Date().toISOString().split("T")[0], items_counted: c.items_total, variance_count: variance };
    });
    persist();
    listeners.forEach((l) => l());
    return state.advancedInventory.cycleCounts.find((c) => c.id === Number(id));
  },

  getAdvScanHistory: () => state.advancedInventory?.scanHistory || [],

  processAdvScan: (payload) => {
    const scans = state.advancedInventory?.scanHistory || [];
    const nextId = Math.max(0, ...scans.map((s) => s.id)) + 1;
    const lookup = actions.lookupByBarcode(payload.barcode);
    const warehouse = (state.warehouse.warehouses || []).find((w) => String(w.id) === String(payload.warehouse_id));

    const newScan = {
      id: nextId,
      barcode: payload.barcode || "",
      product_name: lookup?.name || lookup?.product?.name || null,
      scan_type: payload.scan_type || "inbound",
      warehouse_name: warehouse?.name || payload.warehouse_name || "",
      bin_location: lookup?.location || (lookup?.rack_code ? `${lookup.rack_code}/${lookup.bin_code}` : null),
      quantity_scanned: Number(payload.quantity_scanned || 1),
      timestamp: new Date().toISOString(),
      valid: !!lookup,
      error_message: lookup ? null : "Barcode not found in system",
      session_id: payload.session_id || `SESS-${Date.now()}`,
    };

    if (!state.advancedInventory) state.advancedInventory = { batches: [], cycleCounts: [], scanHistory: [], expiryAlerts: [] };
    state.advancedInventory.scanHistory = [newScan, ...scans];
    persist();
    listeners.forEach((l) => l());
    return newScan;
  },

  getAdvExpiryAlerts: () => state.advancedInventory?.expiryAlerts || [],

  acknowledgeAdvExpiryAlert: (id, actionTaken) => {
    if (!state.advancedInventory?.expiryAlerts) return null;
    state.advancedInventory.expiryAlerts = state.advancedInventory.expiryAlerts.map((a) =>
      a.id === Number(id)
        ? { ...a, acknowledged: true, acknowledged_at: new Date().toISOString(), action_taken: actionTaken || "reviewed" }
        : a
    );
    persist();
    listeners.forEach((l) => l());
    return state.advancedInventory.expiryAlerts.find((a) => a.id === Number(id));
  },

  // ── Dispatcher actions ────────────────────────────────────────────────────────
  getDispatcherAssignments: () => state.dispatcher?.assignments || [],

  getDispatcherNotifications: () => state.dispatcher?.notifications || [],

  markDispatcherNotificationRead: (id) => {
    if (!state.dispatcher?.notifications) return;
    state.dispatcher.notifications = state.dispatcher.notifications.map((n) =>
      n.id === Number(id) ? { ...n, is_read: true } : n
    );
    persist();
    listeners.forEach((l) => l());
  },

  markAllDispatcherNotificationsRead: () => {
    if (!state.dispatcher?.notifications) return;
    state.dispatcher.notifications = state.dispatcher.notifications.map((n) => ({ ...n, is_read: true }));
    persist();
    listeners.forEach((l) => l());
  },

  updateDispatcherAssignmentStatus: (id, status) => {
    if (!state.dispatcher?.assignments) return null;
    state.dispatcher.assignments = state.dispatcher.assignments.map((a) =>
      a.id === Number(id) ? { ...a, status } : a
    );
    persist();
    listeners.forEach((l) => l());
    return state.dispatcher.assignments.find((a) => a.id === Number(id));
  },

  markDispatcherItemPicked: (assignmentId, productId) => {
    if (!state.dispatcher?.assignments) return null;
    let pickedItem = null;
    state.dispatcher.assignments = state.dispatcher.assignments.map((a) => {
      if (a.id !== Number(assignmentId)) return a;
      const items = a.items.map((it) => {
        if (it.product_id === Number(productId)) {
          pickedItem = it;
          return { ...it, picked: true };
        }
        return it;
      });
      const allPicked = items.every((it) => it.picked);
      return { ...a, items, status: allPicked ? "in_transit" : "picking" };
    });

    // Create a notification for the picking update
    if (pickedItem) {
      const assignment = state.dispatcher.assignments.find(a => a.id === Number(assignmentId));
      const pickedCount = assignment.items.filter(it => it.picked).length;
      const totalCount = assignment.items.length;
      
      const newNotif = {
        id: Math.max(0, ...(state.dispatcher.notifications || []).map(n => n.id)) + 1,
        driver_id: 10, // Assuming fixed driver for prototype
        title: "Item Picked",
        message: `Picked ${pickedItem.product_name} for Shipment ${assignment.shipment_id}. (${pickedCount}/${totalCount})`,
        type: "update",
        related_id: assignment.id,
        is_read: false,
        created_at: new Date().toISOString()
      };
      state.dispatcher.notifications = [newNotif, ...(state.dispatcher.notifications || [])];
    }

    persist();
    listeners.forEach((l) => l());
    return state.dispatcher.assignments.find((a) => a.id === Number(assignmentId));
  },

  assignOrderToDispatcher: (payload) => {
    const nextId = Math.max(0, ...(state.dispatcher.assignments || []).map(a => a.id)) + 1;
    const newAssignment = {
      id: nextId,
      shipment_id: `SHP-2026-${String(nextId).padStart(3, "0")}`,
      driver_id: payload.driver_id || 10,
      driver_name: payload.driver_name || "Rajesh Kumar",
      vehicle_number: payload.vehicle_number || "MH-12-AB-1234",
      status: "assigned",
      assigned_at: new Date().toISOString(),
      warehouse_id: payload.warehouse_id,
      warehouse_name: payload.warehouse_name,
      warehouse_lat: payload.warehouse_lat,
      warehouse_lng: payload.warehouse_lng,
      delivery_address: payload.delivery_address,
      delivery_lat: payload.delivery_lat,
      delivery_lng: payload.delivery_lng,
      route_details: `${payload.warehouse_name} → ${payload.delivery_address}`,
      total_distance_km: payload.total_distance_km || 10,
      delivery_date: payload.delivery_date || new Date().toISOString().split("T")[0],
      estimated_time: payload.estimated_time || "12:00 PM",
      navigation_url: `https://maps.google.com/?q=${payload.delivery_lat},${payload.delivery_lng}`,
      items: payload.items.map(it => ({ ...it, picked: false }))
    };

    state.dispatcher.assignments = [newAssignment, ...(state.dispatcher.assignments || [])];
    
    // Create notification
    const newNotif = {
      id: Math.max(0, ...(state.dispatcher.notifications || []).map(n => n.id)) + 1,
      driver_id: newAssignment.driver_id,
      title: "New Order Assigned",
      message: `Shipment ${newAssignment.shipment_id} assigned. Delivery to ${newAssignment.delivery_address} on ${newAssignment.delivery_date} at ${newAssignment.estimated_time}.`,
      type: "assignment",
      related_id: newAssignment.id,
      is_read: false,
      created_at: new Date().toISOString()
    };
    state.dispatcher.notifications = [newNotif, ...(state.dispatcher.notifications || [])];

    persist();
    listeners.forEach((l) => l());
    return newAssignment;
  },

  assignDriverAfterScan: (shipmentId, driverDetails) => {
    if (!state.dispatcher?.assignments) return null;
    
    let targetAssignment = state.dispatcher.assignments.find(a => a.shipment_id === shipmentId || String(a.id) === String(shipmentId));
    
    if (!targetAssignment) return null;

    targetAssignment.driver_id = driverDetails.driver_id || 12;
    targetAssignment.driver_name = driverDetails.driver_name || "Suresh Patil";
    targetAssignment.vehicle_number = driverDetails.vehicle_number || "MH-14-XY-9876";
    targetAssignment.delivery_date = driverDetails.delivery_date || new Date().toISOString().split("T")[0];
    targetAssignment.estimated_time = driverDetails.estimated_time || "04:00 PM";
    targetAssignment.status = "assigned"; // Reset or update status if needed

    // Create notification for the driver
    const newNotif = {
      id: Math.max(0, ...(state.dispatcher.notifications || []).map(n => n.id)) + 1,
      driver_id: targetAssignment.driver_id,
      title: "🚛 New Route Assigned",
      message: `New shipment ${targetAssignment.shipment_id} assigned. Route: ${targetAssignment.route_details}. Delivery Date: ${targetAssignment.delivery_date}. Est. Time: ${targetAssignment.estimated_time}.`,
      type: "assignment",
      related_id: targetAssignment.id,
      is_read: false,
      created_at: new Date().toISOString(),
      details: {
        route: targetAssignment.route_details,
        navigation_url: targetAssignment.navigation_url,
        delivery_date: targetAssignment.delivery_date,
        estimated_time: targetAssignment.estimated_time
      }
    };

    state.dispatcher.notifications = [newNotif, ...(state.dispatcher.notifications || [])];
    
    persist();
    listeners.forEach((l) => l());
    return targetAssignment;
  },

  // tokens passthrough
  setTokensFromLocalStorage: () => {
    try {
      state.auth.erp_token = localStorage.getItem("erp_token") || null;
      const u = localStorage.getItem("erp_user");
      state.auth.erp_user = u ? JSON.parse(u) : null;
      persist();
    } catch {}
  },

  // ── CUSTOMERS ────────────────────────────────────────────────────────────
  getCustomers: () => state.customers || [],

  createCustomer: (payload) => {
    const nextId = Math.max(0, ...(state.customers || []).map(c => c.id)) + 1;
    const newC = {
      id: nextId,
      customer_name: payload.customer_name || "",
      company_name: payload.company_name || "",
      email: payload.email || "",
      phone: payload.phone || "",
      address_line_1: payload.address_line_1 || "",
      address_line_2: payload.address_line_2 || "",
      country: payload.country || "India",
      state: payload.state || "",
      city: payload.city || "",
      pincode: payload.pincode || "",
      delivery_priority: payload.delivery_priority || "normal",
      status: payload.status || "active",
      // Auto-assign approximate coords from city lookup (prototype)
      latitude: payload.latitude || 18.5204,
      longitude: payload.longitude || 73.8567,
    };
    state.customers = [newC, ...(state.customers || [])];
    persist(); listeners.forEach(l => l());
    return newC;
  },

  updateCustomer: (id, payload) => {
    state.customers = (state.customers || []).map(c =>
      c.id === Number(id) ? { ...c, ...payload } : c
    );
    persist(); listeners.forEach(l => l());
    return (state.customers || []).find(c => c.id === Number(id));
  },

  deleteCustomer: (id) => {
    state.customers = (state.customers || []).filter(c => c.id !== Number(id));
    persist(); listeners.forEach(l => l());
    return { success: true };
  },

  // ── CUSTOMER ORDERS ───────────────────────────────────────────────────────
  getCustomerOrders: () => state.customerOrders || [],

  createCustomerOrder: (payload) => {
    const nextId = Math.max(0, ...(state.customerOrders || []).map(o => o.id)) + 1;
    const customer = (state.customers || []).find(c => String(c.id) === String(payload.customer_id));
    const newOrder = {
      id: nextId,
      order_number: payload.order_number || `ORD-${Date.now()}`,
      customer_id: Number(payload.customer_id),
      customer_name: customer?.customer_name || payload.customer_name || "",
      company_name: customer?.company_name || "",
      required_delivery_date: payload.required_delivery_date || "",
      delivery_address: payload.delivery_address || "",
      delivery_city: payload.delivery_city || "",
      delivery_state: payload.delivery_state || "",
      delivery_country: payload.delivery_country || "",
      delivery_latitude: payload.delivery_latitude || customer?.latitude || 0,
      delivery_longitude: payload.delivery_longitude || customer?.longitude || 0,
      delivery_priority: payload.delivery_priority || "normal",
      status: "pending",
      selected_warehouse_name: null,
      warehouse_distance_km: null,
      driver_name: null,
      vehicle_type: null,
      vehicle_plate: null,
      delivery_sequence: null,
      items: payload.items || [],
    };
    state.customerOrders = [newOrder, ...(state.customerOrders || [])];
    persist(); listeners.forEach(l => l());
    return newOrder;
  },

  approveCustomerOrder: (id) => {
    // Simulate auto-logistics: assign nearest warehouse + vehicle
    const warehouses = state.warehouse?.warehouses || [];
    const vehicles = state.transport?.vehicles || [];
    const wh = warehouses[0] || { name: "Warehouse A", id: 1 };
    const vehicle = vehicles.find(v => v.status === "available") || vehicles[0];
    state.customerOrders = (state.customerOrders || []).map(o => {
      if (o.id !== Number(id)) return o;
      return {
        ...o,
        status: "approved",
        selected_warehouse_name: wh.name,
        warehouse_distance_km: (Math.random() * 20 + 5).toFixed(1),
        driver_name: vehicle?.driver_name || "Rajesh Kumar",
        vehicle_type: vehicle?.vehicle_type || "Truck",
        vehicle_plate: vehicle?.vehicle_number || "MH-12-AB-1234",
      };
    });
    persist(); listeners.forEach(l => l());
    const order = (state.customerOrders || []).find(o => o.id === Number(id));
    return { warehouse: order?.selected_warehouse_name, vehicle: order?.vehicle_plate };
  },

  reoptimizeCustomerOrder: (id) => {
    return actions.approveCustomerOrder(id);
  },

  // ── TRANSPORT ─────────────────────────────────────────────────────────────
  getTransportVehicles: () => state.transport?.vehicles || [],
  getTransportShipments: () => state.transport?.shipments || [],

  createTransportVehicle: (payload) => {
    const vehicles = state.transport?.vehicles || [];
    const nextId = Math.max(0, ...vehicles.map(v => v.id)) + 1;
    const wh = (state.warehouse?.warehouses || []).find(w => String(w.id) === String(payload.assigned_warehouse_id));
    const newV = {
      id: nextId,
      vehicle_number: payload.vehicle_number || "",
      vehicle_type: payload.vehicle_type || "Truck",
      capacity_kg: Number(payload.capacity_kg || 0),
      capacity_volume: Number(payload.capacity_volume || 0),
      driver_name: payload.driver_name || "",
      driver_phone: payload.driver_phone || "",
      assigned_warehouse_id: payload.assigned_warehouse_id ? Number(payload.assigned_warehouse_id) : null,
      warehouse_name: wh?.name || null,
      current_latitude: Number(payload.current_latitude || 0),
      current_longitude: Number(payload.current_longitude || 0),
      status: payload.status || "available",
    };
    if (!state.transport) state.transport = { vehicles: [], shipments: [] };
    state.transport.vehicles = [...vehicles, newV];
    persist(); listeners.forEach(l => l());
    return newV;
  },

  updateTransportVehicle: (id, payload) => {
    if (!state.transport) return null;
    const wh = (state.warehouse?.warehouses || []).find(w => String(w.id) === String(payload.assigned_warehouse_id));
    state.transport.vehicles = (state.transport.vehicles || []).map(v =>
      v.id === Number(id)
        ? { ...v, ...payload, warehouse_name: wh?.name ?? v.warehouse_name }
        : v
    );
    persist(); listeners.forEach(l => l());
    return (state.transport.vehicles || []).find(v => v.id === Number(id));
  },

  updateTransportShipmentStatus: (id, status) => {
    if (!state.transport) return null;
    state.transport.shipments = (state.transport.shipments || []).map(s =>
      s.id === Number(id)
        ? { ...s, status, delivered_at: status === "Delivered" ? new Date().toISOString().split("T")[0] : s.delivered_at }
        : s
    );
    persist(); listeners.forEach(l => l());
    return (state.transport.shipments || []).find(s => s.id === Number(id));
  },

  // ── PURCHASES (Admin) ─────────────────────────────────────────────────────
  getPurchaseOrders: () => state.purchases?.orders || [],
  getPurchaseOrderItems: (id) => (state.purchases?.orderItems || {})[String(id)] || [],
  getAdminQuotations: () => state.purchases?.quotations || [],

  createPurchaseOrder: (payload) => {
    if (!state.purchases) state.purchases = { orders: [], orderItems: {}, quotations: [] };
    const orders = state.purchases.orders || [];
    // Derive next numeric suffix from existing string IDs like "PO-5"
    const maxNum = orders.reduce((max, o) => {
      const n = parseInt(String(o.id).replace(/[^\d]/g, "")) || 0;
      return n > max ? n : max;
    }, 0);
    const newId = `PO-${maxNum + 1}`;
    const total = (payload.items || []).reduce((s, it) => s + (Number(it.quantity) * Number(it.unit_price)), 0);
    const newPO = {
      id: newId,
      supplier_id: Number(payload.supplier_id),
      supplier_name: (state.suppliers || []).find(s => String(s.id) === String(payload.supplier_id))?.name || payload.supplier_name || "",
      order_date: payload.order_date || new Date().toISOString().split("T")[0],
      expected_delivery: payload.expected_delivery || "",
      total_amount: total,
      status: "Draft",
      item_count: (payload.items || []).length,
    };
    state.purchases.orders = [newPO, ...orders];
    state.purchases.orderItems[newId] = (payload.items || []).map((it, i) => ({
      id: (maxNum + 1) * 100 + i,
      purchase_order_id: newId,
      product_id: Number(it.product_id),
      product_name: it.product_name || (state.products || []).find(p => String(p.id) === String(it.product_id))?.name || "",
      quantity: Number(it.quantity),
      unit_price: Number(it.unit_price),
      uom: it.uom || "units",
    }));
    persist(); listeners.forEach(l => l());
    return newPO;
  },

  updatePurchaseOrderStatus: (id, status) => {
    if (!state.purchases) return null;
    state.purchases.orders = (state.purchases.orders || []).map(o =>
      String(o.id) === String(id) ? { ...o, status } : o
    );
    persist(); listeners.forEach(l => l());
    return (state.purchases.orders || []).find(o => String(o.id) === String(id));
  },

  createAdminSupplier: (payload) => {
    const nextId = Math.max(0, ...(state.suppliers || []).map(s => s.id)) + 1;
    const newS = {
      id: nextId,
      name: payload.name || "",
      company_name: payload.name || "",
      contact: payload.contact_person || "",
      contact_person: payload.contact_person || "",
      email: payload.email || "",
      phone: payload.phone || "",
      address: payload.address || "",
      rating: 4.0,
    };
    state.suppliers = [...(state.suppliers || []), newS];
    persist(); listeners.forEach(l => l());
    return newS;
  },

  updateAdminSupplier: (id, payload) => {
    state.suppliers = (state.suppliers || []).map(s =>
      s.id === Number(id) ? { ...s, ...payload, name: payload.name || s.name, company_name: payload.name || s.company_name } : s
    );
    persist(); listeners.forEach(l => l());
    return (state.suppliers || []).find(s => s.id === Number(id));
  },

  deleteAdminSupplier: (id) => {
    state.suppliers = (state.suppliers || []).filter(s => s.id !== Number(id));
    persist(); listeners.forEach(l => l());
    return { success: true };
  },

  updateAdminQuotationStatus: (id, status) => {
    if (!state.purchases) return null;
    state.purchases.quotations = (state.purchases.quotations || []).map(q =>
      q.id === Number(id) ? { ...q, status } : q
    );
    persist(); listeners.forEach(l => l());
    return (state.purchases.quotations || []).find(q => q.id === Number(id));
  },

  // ── FINANCE LEDGER (manual add/update) ──────────────────────────────────
  addFinanceLedgerEntry: (payload) => {
    const entries = state.finance?.ledgerEntries || [];
    const nextId = Math.max(0, ...entries.map(e => e.id)) + 1;
    const newEntry = {
      id: nextId,
      date: payload.date || new Date().toISOString().split("T")[0],
      description: payload.description || "",
      type: payload.type || "Debit",
      amount: Number(payload.amount || 0),
      status: payload.status || "Completed",
      category: payload.category || "Other",
      source: "manual",
      reference: payload.reference_id || "",
    };
    if (!state.finance) state.finance = { purchaseOrders: [], salesOrders: [], ledgerEntries: [] };
    state.finance.ledgerEntries = [newEntry, ...entries];
    persist(); listeners.forEach(l => l());
    return newEntry;
  },

  markFinanceLedgerCompleted: (id) => {
    if (!state.finance) return null;
    state.finance.ledgerEntries = (state.finance.ledgerEntries || []).map(e =>
      e.id === Number(id) ? { ...e, status: "Completed" } : e
    );
    persist(); listeners.forEach(l => l());
    return (state.finance.ledgerEntries || []).find(e => e.id === Number(id));
  },

  getFinanceData: () => {
    return {
      purchaseOrders: state.purchases?.orders || state.finance?.purchaseOrders || [],
      salesOrders: state.customerOrders || state.finance?.salesOrders || [],
      ledgerEntries: state.finance?.ledgerEntries || []
    };
  },

  getReportsData: () => {
    return {
      monthlyTrend: [
        { month: "Jan", revenue: 185000, expenses: 92000, profit: 93000, invoices: 18, bills: 11 },
        { month: "Feb", revenue: 210000, expenses: 108000, profit: 102000, invoices: 21, bills: 13 },
        { month: "Mar", revenue: 175000, expenses: 88000, profit: 87000, invoices: 16, bills: 9 },
        { month: "Apr", revenue: 260000, expenses: 134000, profit: 126000, invoices: 26, bills: 15 },
        { month: "May", revenue: 312000, expenses: 158000, profit: 154000, invoices: 31, bills: 18 },
        { month: "Jun", revenue: 286000, expenses: 149000, profit: 137000, invoices: 28, bills: 17 },
      ],
      categories: [
        { name: "Salaries", amount: 325000 },
        { name: "Software", amount: 84000 },
        { name: "Marketing", amount: 128000 },
        { name: "Hosting", amount: 56000 },
        { name: "Office", amount: 36000 },
        { name: "Others", amount: 100000 },
      ],
      profitLoss: [
        { label: "Service Revenue", type: "income", amount: 1185000 },
        { label: "Product Revenue", type: "income", amount: 253000 },
        { label: "Salaries & Wages", type: "expense", amount: 325000 },
        { label: "Software Tools", type: "expense", amount: 84000 },
        { label: "Marketing Spend", type: "expense", amount: 128000 },
        { label: "Hosting & Infrastructure", type: "expense", amount: 56000 },
        { label: "Office & Operations", type: "expense", amount: 136000 },
      ]
    };
  }
};
