const DEFAULT_BASE_URL = "http://localhost:5000";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "") || DEFAULT_BASE_URL;

const SIGNUP_PATHS = [process.env.REACT_APP_SIGNUP_PATH, "/signup", "/api/signup"].filter(Boolean);
const LOGIN_PATHS = [process.env.REACT_APP_LOGIN_PATH, "/login", "/api/login"].filter(Boolean);
const REVIEWS_PATHS = [process.env.REACT_APP_REVIEWS_PATH, "/reviews", "/api/reviews"].filter(Boolean);
const FLAVORS_PATHS = [process.env.REACT_APP_FLAVORS_PATH, "/flavors", "/api/flavors"].filter(Boolean);
const CART_PATHS = [process.env.REACT_APP_CART_PATH, "/cart", "/api/cart"].filter(Boolean);
const ORDERS_PATHS = [process.env.REACT_APP_ORDERS_PATH, "/orders", "/api/orders"].filter(Boolean);

function buildUrl(path, queryParams) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseResponsePayload(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getPayloadMessage(payload, fallback) {
  return payload?.message || payload?.error || payload?.detail || fallback;
}

async function requestAcrossPaths(paths, method, body, queryParams, fallbackMessage) {
  let lastError = fallbackMessage;

  for (const path of paths) {
    const response = await fetch(buildUrl(path, queryParams), {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await parseResponsePayload(response);

    if (response.ok) {
      return payload;
    }

    lastError = getPayloadMessage(payload, fallbackMessage);

    if (response.status !== 404) {
      break;
    }
  }

  throw new Error(lastError);
}

export async function signupUser(credentials) {
  return requestAcrossPaths(SIGNUP_PATHS, "POST", credentials, null, "Registration failed.");
}

export async function loginUser(credentials) {
  return requestAcrossPaths(LOGIN_PATHS, "POST", credentials, null, "Login failed. Please try again.");
}

export async function fetchReviews() {
  const payload = await requestAcrossPaths(REVIEWS_PATHS, "GET", null, null, "Unable to load reviews.");
  return Array.isArray(payload?.reviews) ? payload.reviews : Array.isArray(payload) ? payload : [];
}

export async function fetchFlavors() {
  const payload = await requestAcrossPaths(FLAVORS_PATHS, "GET", null, null, "Unable to load flavors.");
  return Array.isArray(payload?.flavors) ? payload.flavors : Array.isArray(payload) ? payload : [];
}

export async function fetchCart(userId) {
  const payload = await requestAcrossPaths(
    CART_PATHS,
    "GET",
    null,
    { userId },
    "Unable to load cart."
  );
  return Array.isArray(payload?.cart) ? payload.cart : [];
}

export async function addToCart(userId, flavorId) {
  const payload = await requestAcrossPaths(
    CART_PATHS,
    "POST",
    { userId, flavorId },
    null,
    "Unable to add flavor to cart."
  );
  return Array.isArray(payload?.cart) ? payload.cart : [];
}

export async function updateCartQuantity(userId, flavorId, quantity) {
  const payload = await requestAcrossPaths(
    CART_PATHS,
    "PUT",
    { userId, flavorId, quantity },
    null,
    "Unable to update cart."
  );
  return Array.isArray(payload?.cart) ? payload.cart : [];
}

export async function removeCartItem(userId, flavorId) {
  const payload = await requestAcrossPaths(
    CART_PATHS,
    "DELETE",
    { userId, flavorId },
    null,
    "Unable to remove item from cart."
  );
  return Array.isArray(payload?.cart) ? payload.cart : [];
}

export async function placeOrder(userId) {
  return requestAcrossPaths(ORDERS_PATHS, "POST", { userId }, null, "Unable to place order.");
}

export async function fetchOrderHistory(userId) {
  const payload = await requestAcrossPaths(
    ORDERS_PATHS,
    "GET",
    null,
    { userId },
    "Unable to load order history."
  );
  return Array.isArray(payload?.orders) ? payload.orders : [];
}
