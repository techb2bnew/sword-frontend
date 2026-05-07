import axios from "axios";
import { actions, getMockState, subscribe, resetMockState } from "./mockStore";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// Helper to simulate axios response shape
const ok = (data) => ({ data });

const toPath = (url) => {
  // url may be absolute (API_BASE + route) or relative
  if (typeof url !== "string") return "";
  if (url.startsWith(API_BASE)) return url.slice(API_BASE.length);
  // also handle http://localhost:5001/api prefix variations
  return url.replace(API_BASE, "");
};

const matchJson = (path, regex) => {
  const m = path.match(regex);
  return m || null;
};

// Core mock handler
export async function mockRequest(method, url, bodyOrConfig, maybeConfig) {
  const path = toPath(url);
  const body = method.toLowerCase() === "get" || method.toLowerCase() === "delete" ? undefined : (bodyOrConfig || {});
  const config = (method.toLowerCase() === "get" || method.toLowerCase() === "delete") ? bodyOrConfig : (maybeConfig || bodyOrConfig || {});

  // AUTH
  if (path === "/auth/login" && method.toLowerCase() === "post") {
    // Accept any credentials
    const token = "mock-jwt-token";
    const user = {
      id: 1,
      username: "Demo User",
      role: "buyer",
      email: body?.email || "demo@example.com",
    };
    localStorage.setItem("erp_token", token);
    localStorage.setItem("erp_user", JSON.stringify(user));

    return ok({ token });
  }

  // For app code that stores localStorage token under different key (BuyerQuotations uses `token` key)
  if (path === "/auth/login" && method.toLowerCase() === "post") {
    return ok({ token: "mock-token" });
  }

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

  if (path === "/warehouse/bins" && method.toLowerCase() === "get") {
    return ok(getMockState().warehouse.bins);
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

