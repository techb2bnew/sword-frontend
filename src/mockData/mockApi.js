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

    if (body?.email === "manager@sword.com") {
      role = "warehouse_manager";
      username = "Chief Warehouse Manager";
    }

    const user = {
      id: body?.email === "manager@sword.com" ? 99 : 1,
      username: username,
      role: role,
      email: body?.email || "demo@example.com",
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

  // Fallback: return empty arrays to keep frontend alive
  return ok([]);
}

// Install interceptor once
let installed = false;
export function installMockAxios() {
  if (installed) return;
  installed = true;

  axios.interceptors.request.use((req) => {
    // If prototype mock mode is enabled, short-circuit to mock.
    // We don't cancel here; we just mark. The adapter isn't swapped, so we use response intercept.
    req.__isMockPrototype = true;
    return req;
  });

  axios.interceptors.response.use(
    (res) => res,
    async (err) => {
      // If backend is down OR not running, use mock data.
      // Also handle requests we want to always mock.
      const useMock = true;
      if (!useMock) return Promise.reject(err);

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

