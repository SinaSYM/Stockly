import { endSession, sameOrigin } from "@/lib/auth";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  await endSession();
  return Response.json({ ok: true });
}
