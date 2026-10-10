import { randomUUID } from "node:crypto";
import { getCurrentUser, sameOrigin } from "@/lib/auth";
import { listOrders, listProducts, validateProduct } from "@/lib/repository";
import { transaction } from "@/lib/db";
import type { Order, OrderItem, OrderStatus, Product } from "@/lib/types";

export const runtime = "nodejs";
const statuses: OrderStatus[] = ["pending_payment", "paid", "shipped", "delivered", "cancelled"];
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  if (listProducts(user.id).length || listOrders(user.id).length) return Response.json({ error: "انتقال فقط به حساب خالی امکان‌پذیر است." }, { status: 409 });
  const body = await request.json().catch(() => null);
  if (!Array.isArray(body?.products) || !Array.isArray(body?.orders) || body.products.length > 5000 || body.orders.length > 20000) return Response.json({ error: "داده‌های قبلی معتبر نیستند." }, { status: 400 });
  const products = body.products as Product[];
  const orders = body.orders as Order[];
  if (!products.every(p => typeof p?.id === "string" && validateProduct(p))) return Response.json({ error: "یکی از کالاهای قبلی معتبر نیست." }, { status: 400 });
  if (!orders.every(o => typeof o?.id === "string" && typeof o.customerName === "string" && typeof o.customerPhone === "string" && statuses.includes(o.status) && !Number.isNaN(Date.parse(o.createdAt)) && Array.isArray(o.items) && o.items.length > 0 && o.items.every(i => typeof i.productId === "string" && Number.isSafeInteger(i.qty) && i.qty > 0 && Number.isSafeInteger(i.unitPrice) && i.unitPrice >= 0))) return Response.json({ error: "یکی از سفارش‌های قبلی معتبر نیست." }, { status: 400 });
  try {
    transaction(db => {
      const idMap = new Map<string, string>();
      for (const p of products) {
        const id = randomUUID(); idMap.set(p.id, id);
        db.prepare("INSERT INTO products(id,user_id,name,price,stock,threshold,color,created_at) VALUES(?,?,?,?,?,?,?,?)")
          .run(id, user.id, p.name.trim(), p.price, p.stock, p.lowStockThreshold, p.color, new Date().toISOString());
      }
      for (const o of orders) {
        const items: OrderItem[] = o.items.map(i => ({ productId: idMap.get(i.productId) ?? i.productId, productName: products.find(p => p.id === i.productId)?.name ?? "کالای حذف‌شده", qty: i.qty, unitPrice: i.unitPrice }));
        db.prepare("INSERT INTO orders(id,user_id,customer_name,customer_phone,items_json,status,created_at) VALUES(?,?,?,?,?,?,?)")
          .run(randomUUID(), user.id, o.customerName.trim(), o.customerPhone, JSON.stringify(items), o.status, o.createdAt);
      }
    });
    return Response.json({ products: products.length, orders: orders.length });
  } catch { return Response.json({ error: "انتقال اطلاعات انجام نشد. دوباره تلاش کنید." }, { status: 500 }); }
}
