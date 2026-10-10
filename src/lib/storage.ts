import type { Order, OrderStatus, Product } from "./types";

const PRODUCT_KEY = "stockly.products.v1";
const ORDER_KEY = "stockly.orders.v1";
export const DATA_EVENT = "stockly:data-changed";
const statuses: OrderStatus[] = ["pending_payment", "paid", "shipped", "delivered", "cancelled"];

const validProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== "object") return false;
  const p = value as Product;
  return typeof p.id === "string" && typeof p.name === "string" && typeof p.color === "string" &&
    Number.isFinite(p.price) && p.price >= 0 && Number.isInteger(p.stock) && p.stock >= 0 &&
    Number.isInteger(p.lowStockThreshold) && p.lowStockThreshold >= 0;
};
const validOrder = (value: unknown): value is Order => {
  if (!value || typeof value !== "object") return false;
  const o = value as Order;
  return typeof o.id === "string" && typeof o.customerName === "string" && typeof o.customerPhone === "string" &&
    statuses.includes(o.status) && typeof o.createdAt === "string" && !Number.isNaN(Date.parse(o.createdAt)) &&
    Array.isArray(o.items) && o.items.length > 0 && o.items.every(i => typeof i.productId === "string" && Number.isInteger(i.qty) && i.qty > 0 && Number.isFinite(i.unitPrice) && i.unitPrice >= 0);
};
function load<T>(key: string, guard: (v: unknown) => v is T): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(guard) ? parsed : [];
  } catch { return []; }
}
function save<T>(key: string, data: T[]): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event(DATA_EVENT));
    return true;
  } catch { return false; }
}
export const loadProducts = () => load(PRODUCT_KEY, validProduct);
export const loadOrders = () => load(ORDER_KEY, validOrder);
export const saveProducts = (products: Product[]) => save(PRODUCT_KEY, products);
export const saveOrders = (orders: Order[]) => save(ORDER_KEY, orders);

export function createOrder(order: Order): string | null {
  const products = loadProducts();
  const requested = new Map<string, number>();
  for (const item of order.items) requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.qty);
  for (const [id, qty] of requested) {
    const product = products.find(p => p.id === id);
    if (!product || product.stock < qty) return "موجودی یکی از کالاها کافی نیست.";
  }
  const updated = products.map(p => ({ ...p, stock: p.stock - (requested.get(p.id) ?? 0) }));
  if (!saveProducts(updated)) return "ذخیرهٔ موجودی انجام نشد. دوباره تلاش کنید.";
  if (!saveOrders([order, ...loadOrders()])) {
    saveProducts(products);
    return "ذخیرهٔ سفارش انجام نشد. دوباره تلاش کنید.";
  }
  return null;
}

export function changeOrderStatus(id: string, status: OrderStatus): string | null {
  const orders = loadOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return "سفارش پیدا نشد.";
  if (order.status === status) return null;
  if (order.status === "cancelled" && status !== "cancelled") return "سفارش لغوشده را دوباره ثبت کنید.";
  if (status === "cancelled") {
    const products = loadProducts();
    const updated = products.map(p => ({ ...p, stock: p.stock + order.items.filter(i => i.productId === p.id).reduce((n, i) => n + i.qty, 0) }));
    if (!saveProducts(updated)) return "بازگرداندن موجودی انجام نشد.";
    if (!saveOrders(orders.map(o => o.id === id ? { ...o, status } : o))) {
      saveProducts(products);
      return "تغییر وضعیت انجام نشد. دوباره تلاش کنید.";
    }
    return null;
  }
  return saveOrders(orders.map(o => o.id === id ? { ...o, status } : o)) ? null : "تغییر وضعیت انجام نشد. دوباره تلاش کنید.";
}
