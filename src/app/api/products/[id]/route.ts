import { getCurrentUser, sameOrigin } from "@/lib/auth";
import { deleteProduct, updateProduct, validateProduct } from "@/lib/repository";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  const input = validateProduct(await request.json().catch(() => null));
  if (!input) return Response.json({ error: "اطلاعات کالا معتبر نیست." }, { status: 400 });
  const product = updateProduct(user.id, (await context.params).id, input);
  return product ? Response.json({ product }) : Response.json({ error: "کالا پیدا نشد." }, { status: 404 });
}
export async function DELETE(request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  const result = deleteProduct(user.id, (await context.params).id);
  return typeof result === "string" ? Response.json({ error: result }, { status: 409 }) : result ? Response.json({ ok: true }) : Response.json({ error: "کالا پیدا نشد." }, { status: 404 });
}
