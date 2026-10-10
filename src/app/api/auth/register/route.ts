import { randomUUID } from "node:crypto";
import { startSession, hashPassword, sameOrigin } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!name || name.length > 80) return Response.json({ error: "نام خود را وارد کنید." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return Response.json({ error: "ایمیل معتبر وارد کنید." }, { status: 400 });
  if (password.length < 10 || password.length > 128) return Response.json({ error: "رمز عبور باید بین ۱۰ تا ۱۲۸ نویسه باشد." }, { status: 400 });
  const db = getDb();
  if (db.prepare("SELECT id FROM users WHERE email=?").get(email)) return Response.json({ error: "این ایمیل قبلاً ثبت شده است." }, { status: 409 });
  const id = randomUUID();
  try { db.prepare("INSERT INTO users(id,name,email,password_hash,created_at) VALUES(?,?,?,?,?)").run(id, name, email, hashPassword(password), new Date().toISOString()); }
  catch { return Response.json({ error: "ساخت حساب انجام نشد. دوباره تلاش کنید." }, { status: 500 }); }
  await startSession(id, request);
  return Response.json({ user: { id, name, email } }, { status: 201 });
}
