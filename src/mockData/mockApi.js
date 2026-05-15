import axios from "axios";
import { actions, getMockState, subscribe, resetMockState } from "./mockStore";

const API_BASE = "http://127.0.0.1:5001/api";


// Helper to simulate axios response shape
const ok = (data) => ({ data });

const toPath = (url) => {
  if (typeof url !== "string") return "";
  let path = url;
  if (url.startsWith(API_BASE)) {
    path = url.slice(API_BASE.length);
  } else if (url.includes("/api")) {
    path = url.split("/api")[1];
  }
  if (!path.startsWith("/")) path = "/" + path;
  return path;
};


const matchJson = (path, regex) => {
  const m = path.match(regex);
  return m || null;
};

// Core mock handler
export async function mockRequest(method, url, bodyOrConfig, maybeConfig) {
  const path = toPath(url);
  let body = method.toLowerCase() === "get" || method.toLowerCase() === "delete" ? undefined : (bodyOrConfig || {});
  
  // Axios often sends body as string in interceptors
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { /* ignore */ }
  }

  const config = maybeConfig || bodyOrConfig || {};


  // AUTH
  if (path === "/auth/login" && method.toLowerCase() === "post") {
    // Accept any credentials, but tailor role for specific demo emails
    const token = "mock-jwt-token";
    let role = "buyer"; // default
    let username = "Demo User";
    let userId = 1;

    // Map email addresses to roles for testing
    const email = body?.email || "demo@example.com";
    
    if (email === "supplier@sword.com") {
      role = "supplier";
      username = "Supplier Admin";
      userId = 2;
    } else if (email === "accountant@sword.com") {
      role = "accountant";
      username = "Chief Accountant";
      userId = 3;
    } else if (email === "admin@sword.com") {
      role = "admin";
      username = "System Administrator";
      userId = 4;
    } else if (email === "manager@sword.com") {
      role = "warehouse_manager";
      username = "Chief Warehouse Manager";
      userId = 99;
    } else if (email === "buyer@sword.com") {
      role = "buyer";
      username = "Buyer Manager";
      userId = 5;
    } else if (email === "driver@sword.com") {
      role = "driver";
      username = "David Smith";
      userId = 10;
    } else if (email === "dispatcher@sword.com") {
      role = "dispatcher";
      username = "Dispatcher Admin";
      userId = 11;
    }

    const user = {
      id: userId,
      username: username,
      role: role,
      email: email,
    };
    localStorage.setItem("erp_token", token);
    localStorage.setItem("erp_user", JSON.stringify(user));

    return ok({ token, user });
  }

  // WAREHOUSE / BINS
  // BUYER QUOTATIONS
  if (path === "/buyer-quotations" && method.toLowerCase() === "get") {
    return ok(actions.getBuyerQuotations());
  }

  if (path === "/buyer-quotations" && method.toLowerCase() === "post") {
    // payload comes as body
    const payload = body || {};
    // ensure token key exists for BuyerQuotations module
    if (!localStorage.getItem("token")) localStorage.setItem("token", localStorage.getItem("erp_token") || "mock-token");

    const created = actions.sendBuyerQuotation(payload);
    return ok(created);
  }

  // SUPPLIERS
  if (path === "/suppliers" && method.toLowerCase() === "get") {
    return ok(actions.getSuppliers());
  }

  // INVENTORY PRODUCTS
  if (path === "/inventory/products" && method.toLowerCase() === "get") {
    return ok(actions.getInventoryProducts());
  }

  if (path === "/inventory/products" && method.toLowerCase() === "post") {
    const payload = body || {};
    const created = actions.upsertInventoryProduct(payload);
    return ok(created);
  }

  const putInv = matchJson(path, /^\/inventory\/products\/(\d+)$/);
  if (putInv && method.toLowerCase() === "put") {
    const editId = Number(putInv[1]);
    const payload = body || {};
    const updated = actions.upsertInventoryProduct(payload, editId);
    return ok(updated);
  }

  const delInv = matchJson(path, /^\/inventory\/products\/(\d+)$/);
  if (delInv && method.toLowerCase() === "delete") {
    const id = Number(delInv[1]);
    actions.deleteInventoryProduct(id);
    return ok({ success: true });
  }

  // WAREHOUSE / BINS
  if (path === "/warehouse" && method.toLowerCase() === "get") {
    return ok(getMockState().warehouse.warehouses);
  }

  if (path === "/warehouse/city-presets" && method.toLowerCase() === "get") {
    return ok(actions.getCityPresets());
  }

  if (path === "/warehouse" && method.toLowerCase() === "post") {
    return ok(actions.createWarehouse(body));
  }

  if (path === "/warehouse/bins" && method.toLowerCase() === "get") {
    return ok(getMockState().warehouse.bins);
  }

  if (path === "/warehouse/bins/bulk" && method.toLowerCase() === "post") {
    return ok(actions.createRack(body));
  }

  if (path === "/warehouse/rack-positions" && method.toLowerCase() === "get") {
    return ok(getMockState().warehouse.rack_positions || {});
  }

  if (path === "/warehouse/rack-positions" && method.toLowerCase() === "post") {
    return ok(actions.updateRackPosition(body.rackCode, body.position));
  }

  if (path === "/inventory/lookup" && method.toLowerCase() === "get") {
    // lookup?barcode=XYZ
    const barcode = config.params?.barcode;
    return ok(actions.lookupByBarcode(barcode));
  }

  // Purchases suppliers (Inventory module needs this)
  if (path === "/purchases/suppliers" && method.toLowerCase() === "get") {
    return ok(actions.getPurchasesSuppliers());
  }

  // ── Advanced Inventory routes ────────────────────────────────────────────
  if (path === "/inventory/batches" && method.toLowerCase() === "get") {
    return ok(actions.getAdvBatches());
  }
  if (path === "/inventory/batches" && method.toLowerCase() === "post") {
    return ok(actions.createAdvBatch(body));
  }

  if (path === "/inventory/cycle-counts" && method.toLowerCase() === "get") {
    return ok(actions.getAdvCycleCounts());
  }
  if (path === "/inventory/cycle-counts" && method.toLowerCase() === "post") {
    return ok(actions.createAdvCycleCount(body));
  }

  const ccStart = matchJson(path, /^\/inventory\/cycle-counts\/(\d+)\/start$/);
  if (ccStart && method.toLowerCase() === "post") {
    return ok(actions.startAdvCycleCount(Number(ccStart[1])));
  }

  const ccComplete = matchJson(path, /^\/inventory\/cycle-counts\/(\d+)\/complete$/);
  if (ccComplete && method.toLowerCase() === "post") {
    return ok(actions.completeAdvCycleCount(Number(ccComplete[1])));
  }

  if (path === "/inventory/scans/process" && method.toLowerCase() === "post") {
    return ok(actions.processAdvScan(body));
  }

  if (path === "/inventory/alerts/expiry" && method.toLowerCase() === "get") {
    return ok(actions.getAdvExpiryAlerts());
  }

  const ackAlert = matchJson(path, /^\/inventory\/alerts\/expiry\/(\d+)\/acknowledge$/);
  if (ackAlert && method.toLowerCase() === "post") {
    return ok(actions.acknowledgeAdvExpiryAlert(Number(ackAlert[1]), body?.action_taken));
  }

  // ── Dispatcher routes ─────────────────────────────────────────────────────────
  if (path === "/dispatcher/assignments" && method.toLowerCase() === "get") {
    return ok(actions.getDispatcherAssignments());
  }
  if (path === "/dispatcher/notifications" && method.toLowerCase() === "get") {
    return ok(actions.getDispatcherNotifications());
  }

  const notiRead = matchJson(path, /^\/dispatcher\/notifications\/(\d+)\/read$/);
  if (notiRead && method.toLowerCase() === "put") {
    actions.markDispatcherNotificationRead(Number(notiRead[1]));
    return ok({ success: true });
  }

  if (path === "/dispatcher/notifications/read-all" && method.toLowerCase() === "put") {
    actions.markAllDispatcherNotificationsRead();
    return ok({ success: true });
  }

  const assignStatus = matchJson(path, /^\/dispatcher\/assignments\/(\d+)\/status$/);
  if (assignStatus && method.toLowerCase() === "put") {
    return ok(actions.updateDispatcherAssignmentStatus(Number(assignStatus[1]), body?.status));
  }

  const pickItem = matchJson(path, /^\/dispatcher\/assignments\/(\d+)\/pick\/(\d+)$/);
  if (pickItem && method.toLowerCase() === "put") {
    return ok(actions.markDispatcherItemPicked(Number(pickItem[1]), Number(pickItem[2])));
  }

  // ── CUSTOMERS ─────────────────────────────────────────────────────────────
  if (path === "/customers" && method.toLowerCase() === "get") {
    return ok(actions.getCustomers());
  }
  if (path === "/customers" && method.toLowerCase() === "post") {
    return ok(actions.createCustomer(body || {}));
  }
  const custId = matchJson(path, /^\/customers\/(\d+)$/);
  if (custId && method.toLowerCase() === "put") {
    return ok(actions.updateCustomer(Number(custId[1]), body || {}));
  }
  if (custId && method.toLowerCase() === "delete") {
    return ok(actions.deleteCustomer(Number(custId[1])));
  }

  // ── CUSTOMER ORDERS ───────────────────────────────────────────────────────
  if (path === "/customer-orders" && method.toLowerCase() === "get") {
    return ok(actions.getCustomerOrders());
  }
  if (path === "/customer-orders" && method.toLowerCase() === "post") {
    return ok(actions.createCustomerOrder(body || {}));
  }
  const coApprove = matchJson(path, /^\/customer-orders\/(\d+)$/);
  if (coApprove && method.toLowerCase() === "put") {
    const result = actions.approveCustomerOrder(Number(coApprove[1]));
    return ok(result);
  }
  const coReoptimize = matchJson(path, /^\/customer-orders\/(\d+)\/select-warehouse$/);
  if (coReoptimize && method.toLowerCase() === "post") {
    return ok(actions.reoptimizeCustomerOrder(Number(coReoptimize[1])));
  }

  // ── TRANSPORT ─────────────────────────────────────────────────────────────
  if (path === "/transport/vehicles" && method.toLowerCase() === "get") {
    return ok(actions.getTransportVehicles());
  }
  if (path === "/transport/vehicles" && method.toLowerCase() === "post") {
    return ok(actions.createTransportVehicle(body || {}));
  }
  const vehId = matchJson(path, /^\/transport\/vehicles\/(\d+)$/);
  if (vehId && method.toLowerCase() === "put") {
    return ok(actions.updateTransportVehicle(Number(vehId[1]), body || {}));
  }

  if (path === "/transport/shipments" && method.toLowerCase() === "get") {
    return ok(actions.getTransportShipments());
  }
  const shmStatus = matchJson(path, /^\/transport\/shipments\/(\d+)\/status$/);
  if (shmStatus && method.toLowerCase() === "put") {
    return ok(actions.updateTransportShipmentStatus(Number(shmStatus[1]), body?.status));
  }

  // ── PURCHASES (Admin) ─────────────────────────────────────────────────────
  if (path === "/purchases/orders" && method.toLowerCase() === "get") {
    return ok(actions.getPurchaseOrders());
  }
  if (path === "/purchases/orders" && method.toLowerCase() === "post") {
    return ok(actions.createPurchaseOrder(body || {}));
  }
  const poStatus = matchJson(path, /^\/purchases\/orders\/([\w-]+)\/status$/);
  if (poStatus && method.toLowerCase() === "put") {
    return ok(actions.updatePurchaseOrderStatus(poStatus[1], body?.status));
  }
  const poItems = matchJson(path, /^\/purchases\/orders\/([\w-]+)\/items$/);
  if (poItems && method.toLowerCase() === "get") {
    return ok(actions.getPurchaseOrderItems(poItems[1]));
  }

  // Suppliers CRUD (admin Purchases module)
  if (path === "/purchases/suppliers" && method.toLowerCase() === "post") {
    return ok(actions.createAdminSupplier(body || {}));
  }
  const suppId = matchJson(path, /^\/purchases\/suppliers\/(\d+)$/);
  if (suppId && method.toLowerCase() === "put") {
    return ok(actions.updateAdminSupplier(Number(suppId[1]), body || {}));
  }
  if (suppId && method.toLowerCase() === "delete") {
    return ok(actions.deleteAdminSupplier(Number(suppId[1])));
  }

  // Admin quotations
  if (path === "/quotations" && method.toLowerCase() === "get") {
    return ok(actions.getAdminQuotations());
  }
  const qtStatus = matchJson(path, /^\/quotations\/(\d+)\/status$/);
  if (qtStatus && method.toLowerCase() === "put") {
    return ok(actions.updateAdminQuotationStatus(Number(qtStatus[1]), body?.status));
  }

  // ── FINANCE ──────────────────────────────────────────────────────────────
  if (path === "/finance/data" && method.toLowerCase() === "get") {
    return ok(actions.getFinanceData());
  }
  if (path === "/finance/ledger" && method.toLowerCase() === "post") {
    return ok(actions.addFinanceLedgerEntry(body || {}));
  }
  const ledgerStatus = matchJson(path, /^\/finance\/ledger\/(\d+)\/status$/);
  if (ledgerStatus && method.toLowerCase() === "put") {
    return ok(actions.markFinanceLedgerCompleted(Number(ledgerStatus[1])));
  }

  // ── REPORTS ──────────────────────────────────────────────────────────────
  if (path === "/reports/data" && method.toLowerCase() === "get") {
    return ok(actions.getReportsData());
  }

  // ── NOTIFICATIONS (global) ────────────────────────────────────────────────
  if (path === "/notifications" && method.toLowerCase() === "get") {
    return ok(actions.getDispatcherNotifications());
  }

  // Fallback: return empty arrays to keep frontend alive
  return ok([]);
}

// Install interceptor once
let installed = false;
export function installMockAxios() {
  if (installed) return;
  installed = true;

  // Intercept ALL requests — resolve immediately from mock store
  // without even sending a network request.
  axios.interceptors.request.use(async (config) => {
    const method = (config.method || "get").toLowerCase();
    const url = config.url || "";
    const data = config.data;

    try {
      const response = await mockRequest(method, url, data, config);
      // Throw a special resolved signal so response interceptor can return it
      const cancelToken = new axios.CancelToken((cancel) => {
        cancel({ __mockResponse: response });
      });
      config.cancelToken = cancelToken;
    } catch (e) {
      // ignore — let request fall through
    }
    return config;
  });

  // Handle the cancelled (mocked) requests and real errors
  axios.interceptors.response.use(
    (res) => res,
    async (err) => {
      // If this was cancelled by our mock interceptor, return the mock response
      if (axios.isCancel(err) && err.message?.__mockResponse) {
        return Promise.resolve(err.message.__mockResponse);
      }

      // If backend is down OR returned an error, also use mock data
      try {
        const cfg = err.config || {};
        const method = (cfg.method || "get").toLowerCase();
        const url = cfg.url || "";
        const data = cfg.data;
        const response = await mockRequest(method, url, data, cfg);
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(err);
      }
    }
  );
}

export function resetPrototype() {
  resetMockState();
}

export function subscribeMockStore(fn) {
  return subscribe(fn);
}

