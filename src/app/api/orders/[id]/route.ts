import { getCurrentUser, sameOrigin } from "@/lib/auth";
import { setOrderStatus } from "@/lib/repository";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const result = setOrderStatus(user.id, (await context.params).id, body?.status);
  return typeof result === "string" ? Response.json({ error: result }, { status: 400 }) : Response.json({ order: result });
}
