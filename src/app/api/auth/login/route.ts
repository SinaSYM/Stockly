import { getDb } from "@/lib/db";
import { sameOrigin, startSession, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const row = getDb().prepare("SELECT id,name,email,password_hash FROM users WHERE email=?").get(email) as { id: string; name: string; email: string; password_hash: string } | undefined;
  if (!row || !verifyPassword(password, row.password_hash)) return Response.json({ error: "ایمیل یا رمز عبور درست نیست." }, { status: 401 });
  await startSession(row.id, request);
  return Response.json({ user: { id: row.id, name: row.name, email: row.email } });
}
