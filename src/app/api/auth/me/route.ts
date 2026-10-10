import { getCurrentUser } from "@/lib/auth";
export const runtime = "nodejs";
export async function GET() {
  const user = await getCurrentUser();
  return user ? Response.json({ user }, { headers: { "Cache-Control": "no-store" } }) : Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
}
