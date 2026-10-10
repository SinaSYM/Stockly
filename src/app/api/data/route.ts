import { getCurrentUser } from "@/lib/auth";
import { listOrders, listProducts } from "@/lib/repository";
export const runtime = "nodejs";
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
  return Response.json({ products: listProducts(user.id), orders: listOrders(user.id) }, { headers: { "Cache-Control": "no-store" } });
}
