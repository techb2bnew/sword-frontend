// Mock Data for Finance Module - Consistent across all modules
const generateMockData = () => {
  const today = new Date();
  const getDate = (daysAgo) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  // Mock Purchase Orders
  const mockPurchaseOrders = [
    {
      id: 1,
      supplier_id: 1,
      supplier_name: "Fresh Farms Supplier",
      order_date: getDate(45).toISOString().split('T')[0],
      expected_delivery: getDate(35).toISOString().split('T')[0],
      total_amount: 15000,
      status: "Received",
      item_count: 4,
      items: [
        { product: "Organic Vegetables", qty: 500, price: 30 },
        { product: "Fresh Fruits", qty: 300, price: 50 }
      ]
    },
    {
      id: 2,
      supplier_id: 2,
      supplier_name: "Global Imports Ltd",
      order_date: getDate(30).toISOString().split('T')[0],
      expected_delivery: getDate(15).toISOString().split('T')[0],
      total_amount: 28500,
      status: "Sent",
      item_count: 6,
      items: []
    },
    {
      id: 3,
      supplier_id: 3,
      supplier_name: "Premium Supplies Co",
      order_date: getDate(20).toISOString().split('T')[0],
      expected_delivery: getDate(8).toISOString().split('T')[0],
      total_amount: 12300,
      status: "Received",
      item_count: 3,
      items: []
    },
    {
      id: 4,
      supplier_id: 1,
      supplier_name: "Fresh Farms Supplier",
      order_date: getDate(10).toISOString().split('T')[0],
      expected_delivery: getDate(2).toISOString().split('T')[0],
      total_amount: 18750,
      status: "Sent",
      item_count: 5,
      items: []
    },
    {
      id: 5,
      supplier_id: 4,
      supplier_name: "Bulk Trading Enterprises",
      order_date: getDate(5).toISOString().split('T')[0],
      expected_delivery: getDate(25).toISOString().split('T')[0],
      total_amount: 32100,
      status: "Draft",
      item_count: 8,
      items: []
    }
  ];

  // Mock Sales Orders
  const mockSalesOrders = [
    {
      id: 1,
      customer_id: 1,
      customer_name: "Metro Retail Store",
      order_number: "SO-2026-001",
      created_at: getDate(60).toISOString(),
      total_amount: 8500,
      status: "delivered",
      delivery_date: getDate(50).toISOString().split('T')[0],
      items: [{ product: "Packaged Foods", qty: 100, price: 85 }]
    },
    {
      id: 2,
      customer_id: 2,
      customer_name: "City Supermarket",
      order_number: "SO-2026-002",
      created_at: getDate(50).toISOString(),
      total_amount: 12300,
      status: "delivered",
      delivery_date: getDate(42).toISOString().split('T')[0],
      items: []
    },
    {
      id: 3,
      customer_id: 3,
      customer_name: "Express Mart",
      order_number: "SO-2026-003",
      created_at: getDate(35).toISOString(),
      total_amount: 6750,
      status: "delivered",
      delivery_date: getDate(28).toISOString().split('T')[0],
      items: []
    },
    {
      id: 4,
      customer_id: 4,
      customer_name: "Regional Distribution Hub",
      order_number: "SO-2026-004",
      created_at: getDate(25).toISOString(),
      total_amount: 15600,
      status: "dispatched",
      delivery_date: getDate(5).toISOString().split('T')[0],
      items: []
    },
    {
      id: 5,
      customer_id: 5,
      customer_name: "Quick Shop Stores",
      order_number: "SO-2026-005",
      created_at: getDate(15).toISOString(),
      total_amount: 9800,
      status: "dispatched",
      delivery_date: getDate(3).toISOString().split('T')[0],
      items: []
    },
    {
      id: 6,
      customer_id: 1,
      customer_name: "Metro Retail Store",
      order_number: "SO-2026-006",
      created_at: getDate(8).toISOString(),
      total_amount: 11200,
      status: "approved",
      delivery_date: getDate(10).toISOString().split('T')[0],
      items: []
    }
  ];

  // Mock Finance Ledger Entries
  const mockLedgerEntries = [
    // Sales Revenue (Auto-generated)
    {
      id: 1000001,
      date: getDate(50).toISOString().split('T')[0],
      description: "Sales Revenue - SO-2026-001",
      type: "Credit",
      amount: 8500,
      status: "Completed",
      category: "Sales Revenue",
      source: "auto",
      reference: "SO-2026-001"
    },
    {
      id: 1000002,
      date: getDate(42).toISOString().split('T')[0],
      description: "Sales Revenue - SO-2026-002",
      type: "Credit",
      amount: 12300,
      status: "Completed",
      category: "Sales Revenue",
      source: "auto",
      reference: "SO-2026-002"
    },
    {
      id: 1000003,
      date: getDate(28).toISOString().split('T')[0],
      description: "Sales Revenue - SO-2026-003",
      type: "Credit",
      amount: 6750,
      status: "Completed",
      category: "Sales Revenue",
      source: "auto",
      reference: "SO-2026-003"
    },
    // Purchase Costs (Auto-generated)
    {
      id: 2000001,
      date: getDate(45).toISOString().split('T')[0],
      description: "Cost of Goods - PO#1",
      type: "Debit",
      amount: 15000,
      status: "Completed",
      category: "Cost of Goods",
      source: "auto",
      reference: "PO#1"
    },
    {
      id: 2000002,
      date: getDate(20).toISOString().split('T')[0],
      description: "Cost of Goods - PO#3",
      type: "Debit",
      amount: 12300,
      status: "Completed",
      category: "Cost of Goods",
      source: "auto",
      reference: "PO#3"
    },
    // Transport Costs (Manual)
    {
      id: 3,
      date: getDate(55).toISOString().split('T')[0],
      description: "Fuel - Vehicle GY-01-2024",
      type: "Debit",
      amount: 2500,
      status: "Completed",
      category: "Transport Cost / Fuel",
      source: "manual"
    },
    {
      id: 4,
      date: getDate(48).toISOString().split('T')[0],
      description: "Toll Charges - Highway Route",
      type: "Debit",
      amount: 1200,
      status: "Completed",
      category: "Transport Cost / Fuel",
      source: "manual"
    },
    {
      id: 5,
      date: getDate(42).toISOString().split('T')[0],
      description: "Vehicle Maintenance - Oil Change",
      type: "Debit",
      amount: 800,
      status: "Completed",
      category: "Transport Cost / Fuel",
      source: "manual"
    },
    {
      id: 6,
      date: getDate(35).toISOString().split('T')[0],
      description: "Fuel - Vehicle GY-02-2024",
      type: "Debit",
      amount: 2200,
      status: "Completed",
      category: "Transport Cost / Fuel",
      source: "manual"
    },
    {
      id: 7,
      date: getDate(28).toISOString().split('T')[0],
      description: "Toll Charges - Border Crossing",
      type: "Debit",
      amount: 950,
      status: "Completed",
      category: "Transport Cost / Fuel",
      source: "manual"
    },
    // Warehouse Costs
    {
      id: 8,
      date: getDate(60).toISOString().split('T')[0],
      description: "Monthly Rent - Main Warehouse",
      type: "Debit",
      amount: 25000,
      status: "Completed",
      category: "Warehouse Rent",
      source: "manual"
    },
    {
      id: 9,
      date: getDate(30).toISOString().split('T')[0],
      description: "Monthly Rent - Main Warehouse",
      type: "Debit",
      amount: 25000,
      status: "Completed",
      category: "Warehouse Rent",
      source: "manual"
    },
    {
      id: 10,
      date: getDate(50).toISOString().split('T')[0],
      description: "Electricity Bill - Main Warehouse",
      type: "Debit",
      amount: 3500,
      status: "Completed",
      category: "Utilities",
      source: "manual"
    },
    {
      id: 11,
      date: getDate(40).toISOString().split('T')[0],
      description: "Water Bill - Main Warehouse",
      type: "Debit",
      amount: 1200,
      status: "Completed",
      category: "Utilities",
      source: "manual"
    },
    {
      id: 12,
      date: getDate(25).toISOString().split('T')[0],
      description: "Forklift Maintenance",
      type: "Debit",
      amount: 2800,
      status: "Completed",
      category: "Equipment Maintenance",
      source: "manual"
    },
    // Payroll
    {
      id: 13,
      date: getDate(60).toISOString().split('T')[0],
      description: "Salary - Rajesh Kumar",
      type: "Debit",
      amount: 25000,
      status: "Completed",
      category: "Driver Salary",
      source: "manual"
    },
    {
      id: 14,
      date: getDate(60).toISOString().split('T')[0],
      description: "Salary - Arun Singh",
      type: "Debit",
      amount: 22000,
      status: "Completed",
      category: "Driver Salary",
      source: "manual"
    },
    {
      id: 15,
      date: getDate(60).toISOString().split('T')[0],
      description: "Salary - Priya Sharma",
      type: "Debit",
      amount: 28000,
      status: "Completed",
      category: "Driver Salary",
      source: "manual"
    },
    {
      id: 16,
      date: getDate(60).toISOString().split('T')[0],
      description: "Salary - Vikram Patel",
      type: "Debit",
      amount: 24000,
      status: "Completed",
      category: "Driver Salary",
      source: "manual"
    },
    {
      id: 17,
      date: getDate(30).toISOString().split('T')[0],
      description: "Salary - Rajesh Kumar",
      type: "Debit",
      amount: 25000,
      status: "Completed",
      category: "Driver Salary",
      source: "manual"
    },
    {
      id: 18,
      date: getDate(30).toISOString().split('T')[0],
      description: "Salary - Arun Singh",
      type: "Debit",
      amount: 22000,
      status: "Completed",
      category: "Driver Salary",
      source: "manual"
    },
    {
      id: 19,
      date: getDate(30).toISOString().split('T')[0],
      description: "Salary - Priya Sharma",
      type: "Debit",
      amount: 28000,
      status: "Completed",
      category: "Driver Salary",
      source: "manual"
    },
    {
      id: 20,
      date: getDate(30).toISOString().split('T')[0],
      description: "Salary - Vikram Patel",
      type: "Debit",
      amount: 24000,
      status: "Completed",
      category: "Driver Salary",
      source: "manual"
    },
    // Other Expenses
    {
      id: 21,
      date: getDate(45).toISOString().split('T')[0],
      description: "Office Supplies",
      type: "Debit",
      amount: 1500,
      status: "Completed",
      category: "Other",
      source: "manual"
    },
    {
      id: 22,
      date: getDate(20).toISOString().split('T')[0],
      description: "Insurance Premium",
      type: "Debit",
      amount: 5000,
      status: "Completed",
      category: "Other",
      source: "manual"
    }
  ];

  return {
    purchaseOrders: mockPurchaseOrders,
    salesOrders: mockSalesOrders,
    ledgerEntries: mockLedgerEntries,
    getDate
  };
};

export default generateMockData;
