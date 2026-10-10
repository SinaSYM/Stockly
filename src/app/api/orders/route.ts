import { getCurrentUser, sameOrigin } from "@/lib/auth";
import { insertOrder } from "@/lib/repository";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  const result = insertOrder(user.id, await request.json().catch(() => null));
  return typeof result === "string" ? Response.json({ error: result }, { status: 400 }) : Response.json({ order: result }, { status: 201 });
}
