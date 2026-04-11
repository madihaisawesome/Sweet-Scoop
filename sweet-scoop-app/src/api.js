const DEFAULT_BASE_URL = "http://localhost:5000/api";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "") || DEFAULT_BASE_URL;

const LOGIN_PATHS = [
  process.env.REACT_APP_LOGIN_PATH,
  "/login",
  "/api/login",
  "/auth/login",
  "/users/login",
].filter(Boolean);

const FLAVOR_PATHS = [
  process.env.REACT_APP_FLAVORS_PATH,
  "/flavors",
  "/api/flavors",
  "/menu",
  "/api/menu",
  "/products",
].filter(Boolean);

const ORDER_PATHS = [
  process.env.REACT_APP_ORDER_PATH,
  "/orders",
  "/api/orders",
  "/order",
].filter(Boolean);

function buildUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseErrorMessage(response) {
  try {
    const payload = await response.json();
    return (
      payload?.message ||
      payload?.error ||
      payload?.detail ||
      "Login failed. Please try again."
    );
  } catch {
    return "Login failed. Please try again.";
  }
}

export async function loginUser(credentials) {
  let lastError = "Login failed. Please try again.";

  for (const path of LOGIN_PATHS) {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return response.json();
      }

      return null;
    }

    if (response.status !== 404) {
      lastError = await parseErrorMessage(response);
      break;
    }

    lastError = await parseErrorMessage(response);
  }

  throw new Error(lastError);
}

export async function fetchFlavors() {
  let lastError = "Unable to load flavors.";

  for (const path of FLAVOR_PATHS) {
    const response = await fetch(buildUrl(path));

    if (response.ok) {
      const payload = await response.json();

      if (Array.isArray(payload)) {
        return payload;
      }

      if (Array.isArray(payload?.flavors)) {
        return payload.flavors;
      }

      if (Array.isArray(payload?.items)) {
        return payload.items;
      }

      if (Array.isArray(payload?.products)) {
        return payload.products;
      }

      return [];
    }

    if (response.status !== 404) {
      lastError = await parseErrorMessage(response);
      break;
    }

    lastError = await parseErrorMessage(response);
  }

  throw new Error(lastError);
}

export async function submitOrder(order) {
  let lastError = "Unable to submit order.";

  for (const path of ORDER_PATHS) {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        return response.json();
      }

      return null;
    }

    if (response.status !== 404) {
      lastError = await parseErrorMessage(response);
      break;
    }

    lastError = await parseErrorMessage(response);
  }

  throw new Error(lastError);
}
