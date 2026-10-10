"use client";
import { useCallback, useEffect, useState } from "react";
import type { Order, Product } from "./types";

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try { response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...options?.headers }, cache: "no-store" }); }
  catch { throw new Error("ارتباط با سرور برقرار نشد. دوباره تلاش کنید."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "درخواست انجام نشد.");
  return body as T;
}
export function useStocklyData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try { const data = await api<{ products: Product[]; orders: Order[] }>("/api/data"); setProducts(data.products); setOrders(data.orders); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "دریافت اطلاعات انجام نشد."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return { products, orders, loading, error, refresh };
}
