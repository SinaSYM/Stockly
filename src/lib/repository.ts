import "server-only";
import { randomUUID } from "node:crypto";
import { getDb, transaction } from "./db";
import type { Order, OrderItem, OrderStatus, Product } from "./types";

type ProductRow = { id: string; name: string; price: number; stock: number; threshold: number; color: string };
type OrderRow = { id: string; customer_name: string; customer_phone: string; items_json: string; status: OrderStatus; created_at: string };
const statuses: OrderStatus[] = ["pending_payment", "paid", "shipped", "delivered", "cancelled"];
const colors = ["#74C9F8", "#5DD7C4", "#FFD84D", "#C7B8F5", "#FF6841", "#9DBBE8", "#8FD3C1", "#F6D66B", "#EE7A5A"];

const productFromRow = (row: ProductRow): Product => ({ id: row.id, name: row.name, price: row.price, stock: row.stock, lowStockThreshold: row.threshold, color: row.color });
const orderFromRow = (row: OrderRow): Order => ({ id: row.id, customerName: row.customer_name, customerPhone: row.customer_phone, items: JSON.parse(row.items_json) as OrderItem[], status: row.status, createdAt: row.created_at });
export function listProducts(userId: string): Product[] {
  return (getDb().prepare("SELECT id,name,price,stock,threshold,color FROM products WHERE user_id = ? ORDER BY created_at DESC").all(userId) as ProductRow[]).map(productFromRow);
}
export function listOrders(userId: string): Order[] {
  return (getDb().prepare("SELECT id,customer_name,customer_phone,items_json,status,created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(userId) as OrderRow[]).map(orderFromRow);
}
export function validateProduct(input: unknown): Omit<Product, "id"> | null {
  if (!input || typeof input !== "object") return null;
  const p = input as Product;
  if (typeof p.name !== "string" || !p.name.trim() || p.name.trim().length > 100 ||
    !Number.isSafeInteger(p.price) || p.price < 0 || !Number.isSafeInteger(p.stock) || p.stock < 0 ||
    !Number.isSafeInteger(p.lowStockThreshold) || p.lowStockThreshold < 0 || !colors.includes(p.color)) return null;
  return { name: p.name.trim(), price: p.price, stock: p.stock, lowStockThreshold: p.lowStockThreshold, color: p.color };
}
export function insertProduct(userId: string, input: Omit<Product, "id">): Product {
  const product = { id: randomUUID(), ...input };
  getDb().prepare("INSERT INTO products(id,user_id,name,price,stock,threshold,color,created_at) VALUES(?,?,?,?,?,?,?,?)")
    .run(product.id, userId, product.name, product.price, product.stock, product.lowStockThreshold, product.color, new Date().toISOString());
  return product;
}
export function updateProduct(userId: string, id: string, input: Omit<Product, "id">): Product | null {
  const result = getDb().prepare("UPDATE products SET name=?,price=?,stock=?,threshold=?,color=? WHERE id=? AND user_id=?")
    .run(input.name, input.price, input.stock, input.lowStockThreshold, input.color, id, userId);
  return result.changes ? { id, ...input } : null;
}
export function deleteProduct(userId: string, id: string): boolean | string {
  if (listOrders(userId).some(o => o.status !== "cancelled" && o.items.some(i => i.productId === id))) return "برای حذف این کالا ابتدا سفارش‌های مرتبط را لغو کنید.";
  return !!getDb().prepare("DELETE FROM products WHERE id=? AND user_id=?").run(id, userId).changes;
}
export function insertOrder(userId: string, input: unknown): Order | string {
  if (!input || typeof input !== "object") return "اطلاعات سفارش معتبر نیست.";
  const o = input as { customerName?: unknown; customerPhone?: unknown; items?: unknown };
  const phone = typeof o.customerPhone === "string" ? o.customerPhone.replace(/[\s-]/g, "") : "";
  if (typeof o.customerName !== "string" || !o.customerName.trim() || o.customerName.trim().length > 100) return "نام مشتری را درست وارد کنید.";
  const customerName = o.customerName.trim();
  if (!/^09\d{9}$/.test(phone)) return "شمارهٔ موبایل معتبر وارد کنید.";
  if (!Array.isArray(o.items) || !o.items.length || o.items.length > 100) return "دست‌کم یک کالا انتخاب کنید.";
  const requested = new Map<string, number>();
  for (const raw of o.items) {
    if (!raw || typeof raw.productId !== "string" || !Number.isSafeInteger(raw.qty) || raw.qty <= 0) return "تعداد کالاها معتبر نیست.";
    requested.set(raw.productId, (requested.get(raw.productId) ?? 0) + raw.qty);
  }
  try {
    return transaction(db => {
      const items: OrderItem[] = [];
      for (const [id, qty] of requested) {
        const product = db.prepare("SELECT id,name,price,stock FROM products WHERE id=? AND user_id=?").get(id, userId) as (ProductRow & { name: string }) | undefined;
        if (!product || product.stock < qty) throw new Error(`موجودی «${product?.name ?? "کالا"}» کافی نیست.`);
        db.prepare("UPDATE products SET stock=stock-? WHERE id=? AND user_id=?").run(qty, id, userId);
        items.push({ productId: id, productName: product.name, qty, unitPrice: product.price });
      }
      const order: Order = { id: randomUUID(), customerName, customerPhone: phone, items, status: "pending_payment", createdAt: new Date().toISOString() };
      db.prepare("INSERT INTO orders(id,user_id,customer_name,customer_phone,items_json,status,created_at) VALUES(?,?,?,?,?,?,?)")
        .run(order.id, userId, order.customerName, order.customerPhone, JSON.stringify(items), order.status, order.createdAt);
      return order;
    });
  } catch (error) { return error instanceof Error ? error.message : "ثبت سفارش انجام نشد."; }
}
export function setOrderStatus(userId: string, id: string, status: unknown): Order | string {
  if (!statuses.includes(status as OrderStatus)) return "وضعیت انتخاب‌شده معتبر نیست.";
  try {
    return transaction(db => {
      const row = db.prepare("SELECT id,customer_name,customer_phone,items_json,status,created_at FROM orders WHERE id=? AND user_id=?").get(id, userId) as OrderRow | undefined;
      if (!row) throw new Error("سفارش پیدا نشد.");
      if (row.status === "cancelled" && status !== "cancelled") throw new Error("سفارش لغوشده را دوباره ثبت کنید.");
      if (row.status !== "cancelled" && status === "cancelled") {
        const items = JSON.parse(row.items_json) as OrderItem[];
        for (const item of items) db.prepare("UPDATE products SET stock=stock+? WHERE id=? AND user_id=?").run(item.qty, item.productId, userId);
      }
      db.prepare("UPDATE orders SET status=? WHERE id=? AND user_id=?").run(status as string, id, userId);
      return orderFromRow({ ...row, status: status as OrderStatus });
    });
  } catch (error) { return error instanceof Error ? error.message : "تغییر وضعیت انجام نشد."; }
}
