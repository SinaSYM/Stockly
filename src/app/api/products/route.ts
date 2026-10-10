import { getCurrentUser, sameOrigin } from "@/lib/auth";
import { insertProduct, validateProduct } from "@/lib/repository";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  const input = validateProduct(await request.json().catch(() => null));
  if (!input) return Response.json({ error: "اطلاعات کالا معتبر نیست." }, { status: 400 });
  return Response.json({ product: insertProduct(user.id, input) }, { status: 201 });
}
