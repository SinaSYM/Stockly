# Stockly — complete text source

Generated dependency lockfile: package-lock.json. Original user-provided binary logo: public/stockly-logo.png.

## .gitignore

````
node_modules
.npm-cache
.data
.data-test
.next
out
*.tsbuildinfo
.env*.local

````

## README.md

````
# Stockly

داشبورد فارسی مدیریت کالا و سفارش برای فروشنده‌های مستقل.

رابط کاربری فارسی/انگلیسی است. انتخاب زبان از بالای همهٔ صفحه‌ها انجام می‌شود و جهت صفحه، فونت و قالب اعداد هم با آن تغییر می‌کند.
نمای موبایل نوار پایین رنگی دارد و نمای دسکتاپ از ریل کناری و منوی بالایی استفاده می‌کند. حالت روز و شب از بالای صفحه قابل تغییر است و انتخاب تم ذخیره می‌شود.

## اجرا

به Node.js نسخهٔ ۲۴ یا جدیدتر نیاز دارد.

```bash
npm install
npm run dev
```

برنامه در `http://localhost:3000` باز می‌شود. برای اجرای نسخهٔ تولیدی:

```bash
npm run build
npm run start
```

## داده‌ها و حساب‌ها

- اطلاعات در SQLite و در پوشهٔ `.data/stockly.sqlite` ذخیره می‌شود. برای پشتیبان‌گیری، از این فایل و فایل‌های همراه آن در همان پوشه نسخهٔ پشتیبان بگیرید.
- هر حساب فقط به کالاها و سفارش‌های خودش دسترسی دارد. رمز عبور به‌صورت هش scrypt ذخیره می‌شود و نشست با کوکی HttpOnly نگهداری می‌شود.
- داده‌های نسخهٔ قبلی که در `localStorage` همین مرورگر مانده‌اند، از بخش «تنظیمات» به یک حساب خالی قابل انتقال‌اند.
- از بخش «تنظیمات» می‌توان خروجی JSON کالاها و سفارش‌ها را برای نگهداری نسخهٔ پشتیبان دریافت کرد.
- اگر محل دیتابیس دیگری لازم است، متغیر محیطی `STOCKLY_DATA_DIR` را به یک پوشهٔ پایدار تنظیم کنید.
- SQLite روی یک سرور با دیسک پایدار مناسب است. برای استقرار بدون دیسک پایدار یا چند نمونهٔ هم‌زمان، باید دیتابیس را به PostgreSQL منتقل کرد.

## بررسی

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/smoke.ps1
```

این بررسی انتظار دارد برنامهٔ تولیدی آزمایشی در پورت ۳۰۰۱ و با `STOCKLY_DATA_DIR` جداگانه اجرا شده باشد.

````

## next-env.d.ts

````
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

````

## package.json

````
{"name":"stockly","version":"1.0.0","private":true,"engines":{"node":">=24.0.0"},"scripts":{"dev":"next dev","build":"next build","start":"next start"},"dependencies":{"next":"^15.5.0","react":"^19.1.0","react-dom":"^19.1.0","lucide-react":"^0.468.0"},"devDependencies":{"@types/node":"^22.0.0","@types/react":"^19.0.0","@types/react-dom":"^19.0.0","autoprefixer":"^10.4.20","postcss":"^8.4.49","tailwindcss":"^3.4.17","typescript":"^5.7.0"}}

````

## postcss.config.js

````
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };

````

## tailwind.config.ts

````
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)", surface: "rgb(var(--surface) / <alpha-value>)", ink: "rgb(var(--ink) / <alpha-value>)",
        "accent-coral": "#FF6841", "accent-mint": "#5DD7C4",
        "accent-yellow": "#FFD84D", "accent-blue": "#74C9F8",
        "accent-lilac": "#C7B8F5",
      },
      borderRadius: { card: "22px", pill: "9999px" },
      fontFamily: { sans: ["Estedad", "Nunito Sans", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;

````

## tsconfig.json

````
{"compilerOptions":{"target":"ES2017","lib":["dom","dom.iterable","esnext"],"allowJs":true,"skipLibCheck":true,"strict":true,"noEmit":true,"esModuleInterop":true,"module":"esnext","moduleResolution":"bundler","resolveJsonModule":true,"isolatedModules":true,"jsx":"preserve","incremental":true,"plugins":[{"name":"next"}],"paths":{"@/*":["./src/*"]}},"include":["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],"exclude":["node_modules"]}

````

## scripts/smoke.ps1

````
param([string]$Base = 'http://localhost:3001')
$ErrorActionPreference = 'Stop'
$headers = @{ Origin = $Base }
$email = 'test-' + [guid]::NewGuid().ToString('N') + '@example.test'
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
function PostJson([string]$path, [object]$body) {
  Write-Host "POST $path"
  $bytes = [System.Text.Encoding]::UTF8.GetBytes(($body | ConvertTo-Json -Depth 8))
  try { Invoke-RestMethod -Method Post -Uri "$Base$path" -Headers $headers -WebSession $session -ContentType 'application/json; charset=utf-8' -Body $bytes }
  catch { Write-Output "Failed: $path"; if ($_.Exception.Response) { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Output $reader.ReadToEnd() }; throw }
}
function GetData { Write-Host 'GET /api/data'; Invoke-RestMethod -Method Get -Uri "$Base/api/data" -WebSession $session }
function Assert([bool]$condition, [string]$message) { if (-not $condition) { throw $message } }

$register = PostJson '/api/auth/register' @{ name = 'تست استاکلی'; email = $email; password = 'test-password-123' }
Assert ($register.user.email -eq $email) 'Registration failed'
$product = (PostJson '/api/products' @{ name = 'کالای آزمایشی'; price = 120000; stock = 5; lowStockThreshold = 2; color = '#74C9F8' }).product
Assert ((GetData).products[0].stock -eq 5) 'Product was not stored'
$order = (PostJson '/api/orders' @{ customerName = 'مشتری آزمایشی'; customerPhone = '09123456789'; items = @(@{ productId = $product.id; qty = 2 }) }).order
Assert ((GetData).products[0].stock -eq 3) 'Order did not decrement stock'
$null = Invoke-RestMethod -Method Patch -Uri "$Base/api/orders/$($order.id)" -Headers $headers -WebSession $session -ContentType 'application/json' -Body '{"status":"paid"}'
Assert ((GetData).products[0].stock -eq 3) 'Paid status changed stock'
$null = Invoke-RestMethod -Method Patch -Uri "$Base/api/orders/$($order.id)" -Headers $headers -WebSession $session -ContentType 'application/json' -Body '{"status":"cancelled"}'
Assert ((GetData).products[0].stock -eq 5) 'Cancellation did not restore stock'
$failed = $false
try { $null = PostJson '/api/orders' @{ customerName = 'مشتری آزمایشی'; customerPhone = '09123456789'; items = @(@{ productId = $product.id; qty = 99 }) } }
catch { $failed = $true }
Assert $failed 'Insufficient stock order was accepted'
Assert ((GetData).products[0].stock -eq 5) 'Failed order changed stock'
$null = PostJson '/api/auth/logout' @{}
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$login = PostJson '/api/auth/login' @{ email = $email; password = 'test-password-123' }
Assert ($login.user.email -eq $email) 'Login failed'
Assert ((GetData).orders.Count -eq 1) 'Login did not restore account data'
$null = PostJson '/api/auth/logout' @{}
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$second = PostJson '/api/auth/register' @{ name = 'فروشندهٔ دوم'; email = ('second-' + [guid]::NewGuid().ToString('N') + '@example.test'); password = 'test-password-123' }
Assert ((GetData).products.Count -eq 0) 'Another user can see products'
Assert ((GetData).orders.Count -eq 0) 'Another user can see orders'
$import = PostJson '/api/import' @{ products = @(@{ id = 'old-product'; name = 'Old product'; price = 90000; stock = 4; lowStockThreshold = 1; color = '#9DBBE8' }); orders = @(@{ id = 'old-order'; customerName = 'Old customer'; customerPhone = '09123456789'; status = 'pending_payment'; createdAt = (Get-Date).ToUniversalTime().ToString('o'); items = @(@{ productId = 'old-product'; qty = 1; unitPrice = 90000 }) }) }
Assert ($import.products -eq 1 -and $import.orders -eq 1) 'Legacy import failed'
Assert ((GetData).products[0].stock -eq 4) 'Legacy import changed stock'
Write-Output 'PASS: register, login, product, order, stock, cancellation, insufficient stock, user isolation, legacy import'

````

## src/app/api/auth/login/route.ts

````
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

````

## src/app/api/auth/logout/route.ts

````
import { endSession, sameOrigin } from "@/lib/auth";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  await endSession();
  return Response.json({ ok: true });
}

````

## src/app/api/auth/me/route.ts

````
import { getCurrentUser } from "@/lib/auth";
export const runtime = "nodejs";
export async function GET() {
  const user = await getCurrentUser();
  return user ? Response.json({ user }, { headers: { "Cache-Control": "no-store" } }) : Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
}

````

## src/app/api/auth/register/route.ts

````
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

````

## src/app/api/data/route.ts

````
import { getCurrentUser } from "@/lib/auth";
import { listOrders, listProducts } from "@/lib/repository";
export const runtime = "nodejs";
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
  return Response.json({ products: listProducts(user.id), orders: listOrders(user.id) }, { headers: { "Cache-Control": "no-store" } });
}

````

## src/app/api/import/route.ts

````
import { randomUUID } from "node:crypto";
import { getCurrentUser, sameOrigin } from "@/lib/auth";
import { listOrders, listProducts, validateProduct } from "@/lib/repository";
import { transaction } from "@/lib/db";
import type { Order, OrderItem, OrderStatus, Product } from "@/lib/types";

export const runtime = "nodejs";
const statuses: OrderStatus[] = ["pending_payment", "paid", "shipped", "delivered", "cancelled"];
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "وارد حساب نشده‌اید." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "درخواست معتبر نیست." }, { status: 403 });
  if (listProducts(user.id).length || listOrders(user.id).length) return Response.json({ error: "انتقال فقط به حساب خالی امکان‌پذیر است." }, { status: 409 });
  const body = await request.json().catch(() => null);
  if (!Array.isArray(body?.products) || !Array.isArray(body?.orders) || body.products.length > 5000 || body.orders.length > 20000) return Response.json({ error: "داده‌های قبلی معتبر نیستند." }, { status: 400 });
  const products = body.products as Product[];
  const orders = body.orders as Order[];
  if (!products.every(p => typeof p?.id === "string" && validateProduct(p))) return Response.json({ error: "یکی از کالاهای قبلی معتبر نیست." }, { status: 400 });
  if (!orders.every(o => typeof o?.id === "string" && typeof o.customerName === "string" && typeof o.customerPhone === "string" && statuses.includes(o.status) && !Number.isNaN(Date.parse(o.createdAt)) && Array.isArray(o.items) && o.items.length > 0 && o.items.every(i => typeof i.productId === "string" && Number.isSafeInteger(i.qty) && i.qty > 0 && Number.isSafeInteger(i.unitPrice) && i.unitPrice >= 0))) return Response.json({ error: "یکی از سفارش‌های قبلی معتبر نیست." }, { status: 400 });
  try {
    transaction(db => {
      const idMap = new Map<string, string>();
      for (const p of products) {
        const id = randomUUID(); idMap.set(p.id, id);
        db.prepare("INSERT INTO products(id,user_id,name,price,stock,threshold,color,created_at) VALUES(?,?,?,?,?,?,?,?)")
          .run(id, user.id, p.name.trim(), p.price, p.stock, p.lowStockThreshold, p.color, new Date().toISOString());
      }
      for (const o of orders) {
        const items: OrderItem[] = o.items.map(i => ({ productId: idMap.get(i.productId) ?? i.productId, productName: products.find(p => p.id === i.productId)?.name ?? "کالای حذف‌شده", qty: i.qty, unitPrice: i.unitPrice }));
        db.prepare("INSERT INTO orders(id,user_id,customer_name,customer_phone,items_json,status,created_at) VALUES(?,?,?,?,?,?,?)")
          .run(randomUUID(), user.id, o.customerName.trim(), o.customerPhone, JSON.stringify(items), o.status, o.createdAt);
      }
    });
    return Response.json({ products: products.length, orders: orders.length });
  } catch { return Response.json({ error: "انتقال اطلاعات انجام نشد. دوباره تلاش کنید." }, { status: 500 }); }
}

````

## src/app/api/orders/[id]/route.ts

````
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

````

## src/app/api/orders/route.ts

````
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

````

## src/app/api/products/[id]/route.ts

````
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

````

## src/app/api/products/route.ts

````
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

````

## src/app/globals.css

````
@import url('https://fonts.googleapis.com/css2?family=Estedad:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; --background: 255 249 242; --surface: 255 255 255; --ink: 17 17 17; --page-accent: #c4e8f8; }
html[data-theme="dark"] { color-scheme: dark; --background: 19 23 28; --surface: 31 37 44; --ink: 246 245 239; --page-accent: #152934; }
* { box-sizing: border-box; }
html { background: rgb(var(--background)); }
body { margin: 0; color: rgb(var(--ink)); font-family: Estedad, sans-serif; }
html[lang="en"] body { font-family: "Nunito Sans", sans-serif; }
button, input, select { font: inherit; }
button { cursor: pointer; }
input:focus, select:focus { outline: 2px solid rgb(var(--ink)); outline-offset: 2px; }
.card-border { border: 1.5px solid rgb(var(--ink) / .16); }
.card-border-soft { border: 1px solid rgb(var(--ink) / .14); }
.icon-tile { border: 1.5px solid rgb(var(--ink) / .2); }
.sheet-backdrop { background: rgba(17,17,17,.35); }
.logo-mark { background-color: #9DBBE8; background-image: url('/stockly-logo.png'); background-size: 273% 273%; background-position: 50% 39%; background-repeat: no-repeat; border-radius: 29%; overflow: hidden; }
.app-layout { min-height: 100dvh; }
.app-content { width: min(100%, 1220px); margin-inline: auto; padding: 24px 20px 120px; }
.app-content main { animation: page-in .42s cubic-bezier(.22,1,.36,1) both; }
.app-content :is(.rounded-card, .card-border) { transition: transform .32s cubic-bezier(.22,1,.36,1), box-shadow .32s ease, background-color .32s ease; }
.app-content :is(.rounded-card, .card-border):hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgb(0 0 0 / .07); }
.app-content button, .app-nav a, .top-navigation a { transition: transform .22s ease, background-color .3s ease, color .3s ease, opacity .3s ease; }
.app-content button:active, .app-nav a:active { transform: scale(.96); }
.app-nav a:hover .nav-icon { transform: translateY(-2px); }
.nav-icon { transition: transform .24s cubic-bezier(.22,1,.36,1), background-color .3s ease; }
@keyframes page-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.scrollbar-none { scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }
@media (min-width: 768px) {
  .app-layout { display: flex; flex-direction: row; gap: 16px; max-width: 1600px; margin-inline: auto; padding: 0 16px; background: var(--page-accent); }
  .app-content { padding: 36px 36px 56px; min-width: 0; background: rgb(var(--background)); border-radius: 30px; }
  .app-nav { box-shadow: 0 8px 28px rgb(0 0 0 / .06); }
}
@media (min-width: 1200px) { .app-content { padding-inline: 56px; } }
html[data-theme="dark"] .bg-white { background-color: rgb(var(--surface)); }
html[data-theme="dark"] .bg-ink.text-white, html[data-theme="dark"] .bg-ink .text-white { color: rgb(var(--background)); }
html[data-theme="dark"] .bg-ink { color: rgb(var(--background)); }
html[data-theme="dark"] .app-nav { color: rgb(var(--ink)); }
html[data-theme="dark"] input, html[data-theme="dark"] select, html[data-theme="dark"] textarea { background-color: rgb(var(--surface)); color: rgb(var(--ink)); }
html[data-theme="dark"] .top-navigation .bg-ink { color: rgb(var(--background)); }
html[data-theme="dark"] .top-navigation a:not([aria-current="page"]) { color: #d6dce0; }
html[data-theme="dark"] .app-nav a:not([aria-current="page"]) span:first-child { color: #d6dce0; }
html[data-theme="dark"] :is(.bg-accent-coral, .bg-accent-blue, .bg-accent-yellow, .bg-accent-mint, .bg-accent-lilac) { --ink: 17 17 17; color: #111; }
html[data-theme="dark"] :is(.bg-accent-coral, .bg-accent-blue, .bg-accent-yellow, .bg-accent-mint, .bg-accent-lilac) .bg-ink { color: #fff; }
@media (max-width: 767px) {
  .app-nav { background: #fff; color: #111; box-shadow: 0 12px 36px rgb(0 0 0 / .14); }
  .app-nav a span:last-child, .app-nav a .text-white\/70 { color: #111; }
  .app-nav a span:first-child { color: #111; }
  .app-nav a:nth-of-type(1) span:first-child { background: #9DBBE8; }
  .app-nav a:nth-of-type(2) span:first-child { background: #8FD3C1; }
  .app-nav a:nth-of-type(3) span:first-child { background: #F6D66B; }
  .app-nav a:nth-of-type(4) span:first-child { background: #C7B8F5; }
  html[data-theme="dark"] .app-nav { background: rgb(var(--surface)); color: rgb(var(--ink)); border-color: rgb(var(--ink) / .15); }
  html[data-theme="dark"] .app-nav a span:last-child, html[data-theme="dark"] .app-nav a .text-white\/70 { color: rgb(var(--ink)); }
  html[data-theme="dark"] .app-nav a span:first-child { color: #111; }
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } .app-content main { animation: none; } }

````

## src/app/layout.tsx

````
import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "استاکلی | مدیریت فروش و موجودی", description: "داشبورد سادهٔ سفارش‌ها و موجودی برای فروشنده‌های مستقل" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = (await cookies()).get("stockly_lang")?.value === "en" ? "en" : "fa";
  const theme = (await cookies()).get("stockly_theme")?.value === "dark" ? "dark" : "light";
  return <html lang={lang} dir={lang === "fa" ? "rtl" : "ltr"} data-theme={theme}><body><AppShell initialLang={lang} initialTheme={theme}>{children}</AppShell></body></html>;
}

````

## src/app/login/page.tsx

````
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound, PackageCheck, ShoppingBag } from "lucide-react";
import { api } from "@/lib/client";
import { LanguageSwitch, LogoMark } from "@/components/ui";
import { localizedError, useLocale } from "@/lib/i18n";

export default function LoginPage() {
  const { lang, tr } = useLocale();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    if (mode === "register" && !name.trim()) return setError(tr("نام خود را وارد کنید.", "Enter your name."));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError(tr("ایمیل معتبر وارد کنید.", "Enter a valid email address."));
    if (mode === "register" && password.length < 10) return setError(tr("رمز عبور باید دست‌کم ۱۰ نویسه باشد.", "Password must have at least 10 characters."));
    setBusy(true);
    try { await api(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify({ name, email, password }) }); router.replace("/"); router.refresh(); }
    catch (e) { setError(localizedError(e, lang, "Could not continue. Check your details and try again.")); }
    finally { setBusy(false); }
  };
  return <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-8 md:px-8"><div className="absolute -start-24 -top-24 h-80 w-80 rounded-full border-[45px] border-accent-yellow/35" /><div className="absolute -bottom-32 -end-20 h-96 w-96 rounded-full border-[55px] border-accent-blue/30" /><div className="relative grid w-full max-w-[1000px] overflow-hidden rounded-[30px] border-2 border-ink bg-white lg:grid-cols-[.9fr_1.1fr]"><div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden border-e-2 border-ink bg-accent-coral p-8 lg:flex"><div className="flex items-center gap-3"><LogoMark size={54} /><span className="text-3xl font-black" dir="ltr">Stockly</span></div><div className="relative z-10"><span className="rounded-pill border border-ink bg-white px-4 py-2 text-xs font-extrabold">{tr("همه‌چیز مرتب", "ALL IN ONE PLACE")}</span><h1 className="mt-7 text-5xl font-black leading-[1.4]">{tr("سفارش‌ها،", "Orders,")}<br />{tr("موجودی،", "stock,")}<br />{tr("خیال راحت.", "peace of mind.")}</h1><p className="mt-5 max-w-sm text-sm leading-8 text-ink/75">{tr("فروشگاه کوچکت را با کارت‌های ساده و رنگی مدیریت کن.", "Run your small store with simple, colorful tools.")}</p></div><div className="relative z-10 grid grid-cols-2 gap-3"><div className="rounded-card border-2 border-ink bg-accent-yellow p-4"><PackageCheck className="mb-5" size={28} /><span className="block text-sm font-black">{tr("موجودی دقیق", "Clear stock")}</span></div><div className="rounded-card border-2 border-ink bg-accent-blue p-4"><ShoppingBag className="mb-5" size={28} /><span className="block text-sm font-black">{tr("سفارش منظم", "Easy orders")}</span></div></div><div className="absolute -end-28 -top-28 h-80 w-80 rounded-full border-[55px] border-white/15" /></div><div className="p-5 sm:p-8 lg:p-12"><div className="mb-8 flex items-center justify-between"><div className="flex items-center gap-2 lg:hidden"><LogoMark size={43} /><span className="text-xl font-black" dir="ltr">Stockly</span></div><span className="hidden text-xs font-black tracking-wide lg:block" dir="ltr">STOCKLY / ACCOUNT</span><LanguageSwitch /></div><div className="mb-7"><span className="inline-block rounded-pill border border-ink bg-accent-yellow px-3 py-1 text-xs font-black">{tr("خوش اومدی 👋", "HELLO 👋")}</span><h2 className="mt-4 text-[30px] font-black leading-tight sm:text-[36px]">{mode === "register" ? tr("فروشگاهت از اینجا شروع می‌شه.", "Your store starts here.") : tr("دوباره خوش اومدی!", "Welcome back!")}</h2><p className="mt-2 text-sm text-ink/60">{mode === "register" ? tr("حسابت رو بساز و شروع کن.", "Create an account to get started.") : tr("برای ادامه وارد حسابت شو.", "Sign in to continue.")}</p></div><div className="mb-6 flex rounded-pill border-[1.5px] border-ink bg-background p-1 text-xs font-extrabold"><button onClick={() => { setMode("register"); setError(""); }} className={`flex-1 rounded-pill py-2 ${mode === "register" ? "bg-ink text-white" : ""}`}>{tr("ساخت حساب", "Create account")}</button><button onClick={() => { setMode("login"); setError(""); }} className={`flex-1 rounded-pill py-2 ${mode === "login" ? "bg-ink text-white" : ""}`}>{tr("ورود", "Sign in")}</button></div><form onSubmit={submit} className="space-y-4">{mode === "register" && <label className="block text-sm font-extrabold">{tr("نام شما", "Your name")}<div className="relative mt-2"><UserRound className="absolute start-4 top-1/2 -translate-y-1/2 text-ink/50" size={18} /><input autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder={tr("نام شما", "Your name")} className="w-full rounded-2xl border-[1.5px] border-ink bg-white py-3.5 pe-4 ps-12 font-normal" /></div></label>}<label className="block text-sm font-extrabold">{tr("ایمیل", "Email")}<div className="relative mt-2"><Mail className="absolute start-4 top-1/2 -translate-y-1/2 text-ink/50" size={18} /><input type="email" autoComplete="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border-[1.5px] border-ink bg-white py-3.5 pe-4 ps-12 text-left font-normal" /></div></label><label className="block text-sm font-extrabold">{tr("رمز عبور", "Password")}<div className="relative mt-2"><LockKeyhole className="absolute start-4 top-1/2 -translate-y-1/2 text-ink/50" size={18} /><input type={show ? "text" : "password"} autoComplete={mode === "register" ? "new-password" : "current-password"} dir="ltr" value={password} onChange={e => setPassword(e.target.value)} placeholder={tr("حداقل ۱۰ نویسه", "At least 10 characters")} className="w-full rounded-2xl border-[1.5px] border-ink bg-white py-3.5 pe-12 ps-12 text-left font-normal" /><button type="button" onClick={() => setShow(!show)} aria-label={show ? tr("پنهان کردن رمز", "Hide password") : tr("نمایش رمز", "Show password")} className="absolute end-4 top-1/2 -translate-y-1/2 text-ink/50">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{error && <p role="alert" className="rounded-2xl border border-ink bg-accent-coral/25 p-3 text-sm font-bold">{error}</p>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-pill border-[1.5px] border-ink bg-ink py-3.5 font-black text-white disabled:opacity-50">{busy ? tr("لطفاً صبر کن...", "Please wait...") : mode === "register" ? tr("ساخت حساب", "Create account") : tr("ورود به حساب", "Sign in")}<ArrowRight size={18} className="rtl:rotate-180" /></button></form><p className="mt-6 text-center text-xs leading-6 text-ink/50">{tr("اطلاعات فروشگاهت فقط در حساب خودت نمایش داده می‌شود.", "Your store data is visible only in your account.")}</p></div></div></main>;
}

````

## src/app/orders/page.tsx

````
"use client";
import { useState } from "react";
import { ClipboardList, Plus, X, Search } from "lucide-react";
import { BrandHeader, ListRow, StatusPill, statusMeta } from "@/components/ui";
import { api, useStocklyData } from "@/lib/client";
import { dateFa, money as formatMoney, numberFa, orderTotal } from "@/lib/format";
import { localizedError, useLocale } from "@/lib/i18n";
import type { Order, OrderStatus } from "@/lib/types";

const filters: { value: OrderStatus | "all"; fa: string; en: string }[] = [{ value: "all", fa: "همه", en: "All" }, { value: "pending_payment", fa: "در انتظار", en: "Pending" }, { value: "paid", fa: "پرداخت‌شده", en: "Paid" }, { value: "shipped", fa: "ارسال‌شده", en: "Shipped" }, { value: "delivered", fa: "تحویل‌شده", en: "Delivered" }, { value: "cancelled", fa: "لغوشده", en: "Cancelled" }];
const toLatin = (s: string) => s.replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).trim();

export default function OrdersPage() {
  const { lang, tr } = useLocale();
  const money = (n: number) => formatMoney(n, lang);
  const num = (n: number) => numberFa(n, lang);
  const date = (s: string) => dateFa(s, lang);
  const { orders, products, loading, error: loadError, refresh } = useStocklyData();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [qty, setQty] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const visible = [...orders].filter(o => (filter === "all" || o.status === filter) && (o.customerName.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) || o.customerPhone.includes(toLatin(query)))).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const startAdd = () => { setCustomerName(""); setCustomerPhone(""); setQty({}); setError(""); setOpen(true); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!customerName.trim()) return setError(tr("نام مشتری را وارد کنید.", "Enter the customer name."));
    const phone = toLatin(customerPhone).replace(/[\s-]/g, "");
    if (!/^09\d{9}$/.test(phone)) return setError(tr("شمارهٔ موبایل معتبر وارد کنید؛ مثل ۰۹۱۲۳۴۵۶۷۸۹.", "Enter a valid Iranian mobile number, e.g. 09123456789."));
    const items: { productId: string; qty: number }[] = [];
    for (const p of products) {
      const raw = toLatin(qty[p.id] ?? "");
      if (!raw) continue;
      const count = Number(raw);
      if (!Number.isSafeInteger(count) || count < 0) return setError(tr(`تعداد «${p.name}» باید عدد صحیح باشد.`, `Quantity for “${p.name}” must be a whole number.`));
      if (count > p.stock) return setError(tr(`موجودی «${p.name}» کافی نیست.`, `Not enough stock for “${p.name}”.`));
      if (count > 0) items.push({ productId: p.id, qty: count });
    }
    if (!items.length) return setError(tr("دست‌کم یک کالا با تعداد بیشتر از صفر انتخاب کنید.", "Select at least one product with a quantity above zero."));
    setBusy(true); setError("");
    try { await api("/api/orders", { method: "POST", body: JSON.stringify({ customerName: customerName.trim(), customerPhone: phone, items }) }); setOpen(false); await refresh(); }
    catch (e) { setError(localizedError(e, lang, "Could not create the order. Check stock and try again.")); }
    finally { setBusy(false); }
  };
  const updateStatus = async (status: OrderStatus) => {
    if (!selected) return;
    setBusy(true); setError("");
    try { await api(`/api/orders/${selected.id}`, { method: "PATCH", body: JSON.stringify({ status }) }); setSelected(null); await refresh(); }
    catch (e) { setError(localizedError(e, lang, "Could not update the order status.")); }
    finally { setBusy(false); }
  };
  return <main>
    <BrandHeader title="سفارش‌ها" titleEn="Orders" />
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-ink/55">{tr("از ثبت تا تحویل", "From order to delivery")}</p><h1 className="mt-1 text-3xl font-black md:text-[42px]">{tr("سفارش‌های من", "My orders")}</h1></div><button onClick={startAdd} className="flex items-center gap-2 rounded-full border-[1.5px] border-ink bg-ink p-3 text-white md:px-5 md:py-3" aria-label={tr("ثبت سفارش", "Add order")}><Plus size={22} /><span className="hidden text-sm font-bold md:inline">{tr("سفارش جدید", "New order")}</span></button></div>
    <div className="mb-5 rounded-card border-[1.5px] border-ink bg-accent-blue p-5 md:p-7"><p className="text-xs font-bold text-ink/70">{tr("کل سفارش‌ها", "Total orders")}</p><p className="mt-2 text-3xl font-black md:text-4xl">{num(orders.length)} <span className="text-sm font-medium">{tr("سفارش", "orders")}</span></p></div>
    <div className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-none md:mx-0 md:px-0">{filters.map(f => <button key={f.value} onClick={() => setFilter(f.value)} aria-pressed={filter === f.value} className={`shrink-0 rounded-pill border-[1.5px] border-ink px-4 py-2 text-xs font-extrabold ${filter === f.value ? "bg-ink text-white" : "bg-white"}`}>{tr(f.fa, f.en)}</button>)}</div>
    <label className="relative mb-4 block"><Search size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-ink/50" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={tr("نام یا شمارهٔ مشتری...", "Customer name or phone...")} className="w-full rounded-pill border-[1.5px] border-ink bg-white py-3 pe-4 ps-11 text-sm" /></label>
    {loadError && <p role="alert" className="mb-4 rounded-2xl bg-accent-coral/20 p-3 text-sm">{localizedError(new Error(loadError), lang, "Could not load orders.")}</p>}
    <section className="card-border rounded-card bg-surface p-2 md:p-4">{loading ? <p className="p-8 text-center text-sm text-ink/50">{tr("در حال دریافت سفارش‌ها...", "Loading orders...")}</p> : visible.length ? visible.map((o, i) => <div key={o.id} className={i ? "border-t border-black/15" : ""}><ListRow icon={ClipboardList} title={o.customerName} subtitle={`${date(o.createdAt)} · ${num(o.items.reduce((n, item) => n + item.qty, 0))} ${tr("کالا", "items")}`} value={money(orderTotal(o.items))} tone={i % 2 ? "bg-accent-yellow" : "bg-accent-blue"} badge={<StatusPill status={o.status} />} onClick={() => { setSelected(o); setError(""); }} /></div>) : <div className="px-4 py-12 text-center"><ClipboardList className="mx-auto mb-3 text-ink/30" size={32} /><p className="font-extrabold">{tr("سفارشی پیدا نشد", "No orders found")}</p><p className="mt-1 text-xs text-ink/55">{filter === "all" && !query ? tr("اولین سفارش را اضافه کن.", "Add your first order.") : tr("فیلتر یا جست‌وجو را تغییر بده.", "Try a different filter or search.")}</p></div>}</section>
    {open && <div className="fixed inset-0 z-50 flex items-end justify-center sheet-backdrop md:items-center" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}><div role="dialog" aria-modal="true" aria-label={tr("ثبت سفارش جدید", "New order")} className="max-h-[92dvh] w-full max-w-[560px] overflow-y-auto rounded-t-[28px] border-[1.5px] border-ink bg-background p-5 pb-[max(24px,env(safe-area-inset-bottom))] md:rounded-card md:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black">{tr("سفارش جدید", "New order")}</h2><button onClick={() => setOpen(false)} aria-label={tr("بستن", "Close")} className="rounded-full border border-ink bg-white p-2"><X size={20} /></button></div><form onSubmit={submit} className="space-y-4"><label className="block text-sm font-bold">{tr("نام مشتری", "Customer name")}<input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder={tr("نام و نام خانوادگی", "Full name")} className="mt-2 w-full rounded-2xl border-[1.5px] border-ink bg-white px-4 py-3 text-sm font-normal" /></label><label className="block text-sm font-bold">{tr("شمارهٔ موبایل", "Mobile number")}<input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} inputMode="tel" placeholder={tr("۰۹۱۲۳۴۵۶۷۸۹", "09123456789")} className="mt-2 w-full rounded-2xl border-[1.5px] border-ink bg-white px-4 py-3 text-sm font-normal" /></label><div><p className="mb-2 text-sm font-bold">{tr("کالاها و تعداد", "Products and quantities")}</p>{products.length ? <div className="space-y-2">{products.map(p => <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-ink bg-white p-3"><span className="h-9 w-9 shrink-0 rounded-xl border border-ink" style={{ backgroundColor: p.color }} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{p.name}</p><p className="text-xs text-ink/60">{tr("موجودی", "Stock")} {num(p.stock)} · {money(p.price)}</p></div><input value={qty[p.id] ?? ""} onChange={e => setQty({ ...qty, [p.id]: e.target.value })} inputMode="numeric" aria-label={`${tr("تعداد", "Quantity")} ${p.name}`} placeholder={tr("۰", "0")} className="w-14 rounded-xl border border-ink p-2 text-center text-sm" /></div>)}</div> : <p className="rounded-2xl bg-white p-4 text-sm text-ink/60">{tr("اول از بخش کالاها، کالایی اضافه کن.", "Add a product first from the Products page.")}</p>}</div>{error && <p role="alert" className="rounded-xl bg-accent-coral/20 p-3 text-sm font-bold">{error}</p>}<button type="submit" disabled={!products.length || busy} className="w-full rounded-pill bg-ink py-3 font-extrabold text-white disabled:opacity-40">{busy ? tr("در حال ثبت...", "Saving...") : tr("ثبت سفارش", "Create order")}</button></form></div></div>}
    {selected && <div className="fixed inset-0 z-50 flex items-end justify-center sheet-backdrop md:items-center" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}><div role="dialog" aria-modal="true" aria-label={tr("جزئیات سفارش", "Order details")} className="max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[28px] border-[1.5px] border-ink bg-background p-5 pb-[max(24px,env(safe-area-inset-bottom))] md:rounded-card md:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black">{tr("جزئیات سفارش", "Order details")}</h2><button onClick={() => setSelected(null)} aria-label={tr("بستن", "Close")} className="rounded-full border border-ink bg-white p-2"><X size={20} /></button></div><div className="rounded-card border border-ink bg-white p-4"><p className="font-bold">{selected.customerName}</p><p className="mt-1 text-sm text-ink/50" dir="ltr">{selected.customerPhone}</p><div className="my-4 border-t border-black/20" />{selected.items.map((item, i) => <div key={i} className="flex justify-between py-1 text-sm"><span>{item.productName ?? products.find(p => p.id === item.productId)?.name ?? tr("کالای حذف‌شده", "Deleted product")} × {num(item.qty)}</span><strong>{money(item.qty * item.unitPrice)}</strong></div>)}<div className="mt-4 flex justify-between border-t border-black/20 pt-4 font-black"><span>{tr("جمع کل", "Total")}</span><span>{money(orderTotal(selected.items))}</span></div></div><p className="mb-2 mt-5 text-sm font-bold">{tr("وضعیت سفارش", "Order status")}</p><div className="grid grid-cols-2 gap-2">{(Object.keys(statusMeta) as OrderStatus[]).map(status => <button key={status} onClick={() => void updateStatus(status)} disabled={busy || selected.status === "cancelled" || selected.status === status} className={`rounded-pill border border-ink px-3 py-3 text-xs font-bold disabled:opacity-45 ${statusMeta[status].color}`}>{tr(statusMeta[status].label, statusMeta[status].en)}</button>)}</div>{error && <p role="alert" className="mt-4 rounded-xl bg-accent-coral/20 p-3 text-sm font-bold">{error}</p>}</div></div>}
  </main>;
}

````

## src/app/page.tsx

````
"use client";
import Link from "next/link";
import { useState } from "react";
import { BrandHeader, HeroCard, StatTile, BarChart, ListRow, StatusPill, ClipboardList, CircleDollarSign, TriangleAlert, ChevronLeft } from "@/components/ui";
import { useStocklyData } from "@/lib/client";
import { dateFa, money as formatMoney, numberFa, orderTotal } from "@/lib/format";
import { localizedError, useLocale } from "@/lib/i18n";

export default function Dashboard() {
  const { lang, tr } = useLocale();
  const money = (value: number) => formatMoney(value, lang);
  const { products, orders, loading, error, refresh } = useStocklyData();
  const [period, setPeriod] = useState<"week" | "month">("week");
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const days = Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - i)).getTime());
  const salesOrders = orders.filter(o => o.status !== "cancelled" && o.status !== "pending_payment");
  const periodStart = period === "week" ? days[0] : new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  const sales = salesOrders.filter(o => Date.parse(o.createdAt) >= periodStart).reduce((n, o) => n + orderTotal(o.items), 0);
  const chart = days.map((day, i) => salesOrders.filter(o => { const t = Date.parse(o.createdAt); return t >= day && t < (days[i + 1] ?? startOfToday + 86400000); }).reduce((n, o) => n + orderTotal(o.items), 0));
  const latest = [...orders].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 3);
  const dateLabel = new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { weekday: "long", day: "numeric", month: "long" }).format(today);
  return <main><BrandHeader title="داشبورد" titleEn="Dashboard" subtitle={dateLabel} /><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-ink/55">{tr("سلام، خوش اومدی 👋", "Hello, welcome back 👋")}</p><h1 className="mt-1 text-[30px] font-black leading-tight md:text-[42px]">{tr("امروز فروشگاهت", "How is your store")}<br className="md:hidden" /> {tr("چه خبر است؟", "doing today?")}</h1></div><Link href="/orders" className="hidden items-center gap-2 rounded-pill border-[1.5px] border-ink bg-ink px-5 py-3 text-sm font-extrabold text-white md:flex">{tr("سفارش جدید", "New order")} <span className="text-xl leading-none">＋</span></Link></div>{error && <div role="alert" className="mb-4 flex items-center justify-between rounded-2xl bg-accent-coral/20 p-3 text-sm"><span>{localizedError(new Error(error), lang, "Could not load data.")}</span><button onClick={() => void refresh()} className="font-bold underline">{tr("تلاش دوباره", "Retry")}</button></div>}{loading ? <div className="rounded-card bg-white p-10 text-center text-sm text-ink/50">{tr("در حال دریافت اطلاعات...", "Loading data...")}</div> : <><div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(310px,.7fr)]"><HeroCard stockValue={products.reduce((n, p) => n + p.price * p.stock, 0)} sales={sales} period={period} onPeriodChange={setPeriod} /><div className="grid grid-cols-3 gap-2 xl:grid-cols-1 xl:gap-3"><StatTile icon={ClipboardList} label="سفارش امروز" labelEn="Orders today" value={orders.filter(o => Date.parse(o.createdAt) >= startOfToday).length} tone="bg-accent-blue" /><StatTile icon={CircleDollarSign} label="منتظر پرداخت" labelEn="Pending payment" value={orders.filter(o => o.status === "pending_payment").length} tone="bg-accent-yellow" /><StatTile icon={TriangleAlert} label="موجودی کم" labelEn="Low stock" value={products.filter(p => p.stock <= p.lowStockThreshold).length} tone="bg-accent-mint" /></div></div><div className="mt-5 grid gap-6 lg:grid-cols-2"><BarChart values={chart} /><section><div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-bold text-ink/50">{tr("فعالیت اخیر", "Recent activity")}</p><h2 className="text-xl font-black">{tr("آخرین سفارش‌ها", "Latest orders")}</h2></div><Link href="/orders" className="flex items-center text-xs font-extrabold">{tr("همه سفارش‌ها", "All orders")} <ChevronLeft size={16} /></Link></div><div className="card-border rounded-card bg-surface p-2">{latest.length ? latest.map((o, i) => <div key={o.id} className={i ? "border-t border-black/15" : ""}><ListRow icon={ClipboardList} title={o.customerName} subtitle={dateFa(o.createdAt, lang)} value={money(orderTotal(o.items))} tone={i % 2 ? "bg-accent-lilac" : "bg-accent-blue"} badge={<StatusPill status={o.status} />} /></div>) : <div className="px-4 py-9 text-center"><p className="font-extrabold">{tr("هنوز سفارشی ثبت نشده", "No orders yet")}</p><p className="mt-1 text-xs text-ink/55">{tr("اولین سفارش را از بخش سفارش‌ها اضافه کن.", "Add your first order to get started.")}</p><Link href="/orders" className="mt-4 inline-flex rounded-pill bg-ink px-4 py-2 text-xs font-bold text-white">{tr("ثبت سفارش", "Add order")}</Link></div>}</div></section></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><section className="card-border rounded-card bg-surface p-5 md:p-7"><p className="text-xs font-bold text-ink/50">{tr("اقدام پیشنهادی", "Recommended action")}</p><h2 className="mt-1 text-xl font-black">{tr("کالاهای رو به اتمام", "Low-stock products")}</h2><div className="mt-4 space-y-2">{products.filter(p => p.stock <= p.lowStockThreshold).slice(0, 3).map(p => <div key={p.id} className="flex items-center justify-between rounded-2xl bg-accent-coral/15 px-4 py-3"><span className="truncate font-bold">{p.name}</span><span className="shrink-0 text-xs font-black">{numberFa(p.stock, lang)} {tr("باقی‌مانده", "left")}</span></div>)}{!products.some(p => p.stock <= p.lowStockThreshold) && <p className="rounded-2xl bg-accent-mint/25 p-4 text-sm">{tr("موجودی همهٔ کالاها خوب است.", "All products have healthy stock.")}</p>}</div><Link href="/products" className="mt-4 inline-flex text-sm font-extrabold underline">{tr("مدیریت کالاها", "Manage products")}</Link></section><section className="card-border rounded-card bg-surface p-5 md:p-7"><p className="text-xs font-bold text-ink/50">{tr("نمای فروش", "Sales snapshot")}</p><h2 className="mt-1 text-xl font-black">{tr("میانگین هر سفارش", "Average order value")}</h2><p className="mt-6 break-words text-3xl font-black">{money(salesOrders.length ? salesOrders.reduce((sum, o) => sum + orderTotal(o.items), 0) / salesOrders.length : 0)}</p><p className="mt-2 text-sm text-ink/60">{tr("بر اساس سفارش‌های پرداخت‌شده، ارسال‌شده و تحویل‌شده", "Based on paid, shipped and delivered orders")}</p></section></div></>}</main>;
}

````

## src/app/products/page.tsx

````
"use client";
import { useState } from "react";
import { Package, Plus, Trash2, X, Search } from "lucide-react";
import { BrandHeader, ListRow } from "@/components/ui";
import { api, useStocklyData } from "@/lib/client";
import { money as formatMoney, numberFa } from "@/lib/format";
import { localizedError, useLocale } from "@/lib/i18n";
import type { Product } from "@/lib/types";

const colors = ["#74C9F8", "#5DD7C4", "#FFD84D", "#C7B8F5", "#FF6841"];
type Form = { name: string; price: string; stock: string; lowStockThreshold: string; color: string };
const empty: Form = { name: "", price: "", stock: "", lowStockThreshold: "3", color: colors[0] };
const latinDigits = (s: string) => s.replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[٬,]/g, "").trim();

export default function ProductsPage() {
  const { lang, tr } = useLocale();
  const money = (n: number) => formatMoney(n, lang);
  const num = (n: number) => numberFa(n, lang);
  const { products, loading, error: loadError, refresh } = useStocklyData();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const visible = products.filter(p => p.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const startAdd = () => { setEditing(null); setForm(empty); setError(""); setOpen(true); };
  const startEdit = (p: Product) => { setEditing(p.id); setForm({ name: p.name, price: String(p.price), stock: String(p.stock), lowStockThreshold: String(p.lowStockThreshold), color: colors.includes(p.color) ? p.color : colors[0] }); setError(""); setOpen(true); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const price = Number(latinDigits(form.price)); const stock = Number(latinDigits(form.stock)); const lowStockThreshold = Number(latinDigits(form.lowStockThreshold));
    if (!form.name.trim()) return setError(tr("نام کالا را وارد کنید.", "Enter a product name."));
    if (!form.price.trim() || !Number.isSafeInteger(price) || price < 0) return setError(tr("قیمت معتبر وارد کنید.", "Enter a valid price."));
    if (!form.stock.trim() || !Number.isSafeInteger(stock) || stock < 0) return setError(tr("موجودی باید عدد صحیح و صفر یا بیشتر باشد.", "Stock must be a whole number of zero or more."));
    if (!form.lowStockThreshold.trim() || !Number.isSafeInteger(lowStockThreshold) || lowStockThreshold < 0) return setError(tr("حد هشدار باید عدد صحیح و صفر یا بیشتر باشد.", "Low stock threshold must be a whole number of zero or more."));
    setBusy(true); setError("");
    try { await api(editing ? `/api/products/${editing}` : "/api/products", { method: editing ? "PUT" : "POST", body: JSON.stringify({ name: form.name.trim(), price, stock, lowStockThreshold, color: form.color }) }); setOpen(false); await refresh(); }
    catch (e) { setError(localizedError(e, lang, "Could not save the product.")); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!editing || !window.confirm(tr("این کالا حذف شود؟ سفارش‌های قبلی حفظ می‌شوند.", "Delete this product? Past orders will remain."))) return;
    setBusy(true); setError("");
    try { await api(`/api/products/${editing}`, { method: "DELETE" }); setOpen(false); await refresh(); }
    catch (e) { setError(localizedError(e, lang, "Could not delete the product. Cancel related orders first.")); }
    finally { setBusy(false); }
  };
  return <main>
    <BrandHeader title="کالاها" titleEn="Products" />
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-ink/55">{tr("همه چیز زیر نظر توست", "Everything in one place")}</p><h1 className="mt-1 text-3xl font-black md:text-[42px]">{tr("کالاهای من", "My products")}</h1></div><button onClick={startAdd} className="flex items-center gap-2 rounded-full border-[1.5px] border-ink bg-ink p-3 text-white md:px-5 md:py-3" aria-label={tr("افزودن کالا", "Add product")}><Plus size={22} /><span className="hidden text-sm font-bold md:inline">{tr("کالای جدید", "New product")}</span></button></div>
    <div className="mb-5 grid gap-3 sm:grid-cols-2"><div className="rounded-card border-[1.5px] border-ink bg-accent-yellow p-5"><p className="text-xs font-bold text-ink/70">{tr("تعداد کالاها", "Total products")}</p><p className="mt-2 text-3xl font-black">{num(products.length)} <span className="text-sm font-medium">{tr("کالا", "products")}</span></p></div><div className="rounded-card border-[1.5px] border-ink bg-accent-mint p-5"><p className="text-xs font-bold text-ink/70">{tr("نیازمند شارژ", "Needs restocking")}</p><p className="mt-2 text-3xl font-black">{num(products.filter(p => p.stock <= p.lowStockThreshold).length)} <span className="text-sm font-medium">{tr("کالا", "products")}</span></p></div></div>
    <label className="relative mb-4 block"><Search size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-ink/50" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={tr("جست‌وجوی کالا...", "Search products...")} className="w-full rounded-pill border-[1.5px] border-ink bg-white py-3 pe-4 ps-11 text-sm" /></label>
    {loadError && <p role="alert" className="mb-4 rounded-2xl bg-accent-coral/20 p-3 text-sm">{localizedError(new Error(loadError), lang, "Could not load products.")}</p>}
    <section className="card-border rounded-card bg-surface p-2 md:p-4">{loading ? <p className="p-8 text-center text-sm text-ink/50">{tr("در حال دریافت کالاها...", "Loading products...")}</p> : visible.length ? visible.map((p, i) => <div key={p.id} className={i ? "border-t border-black/15" : ""}><ListRow icon={Package} title={p.name} subtitle={`${tr("موجودی", "Stock")}: ${num(p.stock)} ${tr("عدد", "units")}`} value={money(p.price)} tone="" iconColor={p.color} badge={p.stock <= p.lowStockThreshold ? <span className="rounded-pill border border-ink bg-accent-coral px-2 py-0.5 text-[10px] font-bold">{tr("موجودی کم", "Low stock")}</span> : undefined} onClick={() => startEdit(p)} /></div>) : <div className="px-4 py-12 text-center"><Package className="mx-auto mb-3 text-ink/30" size={32} /><p className="font-extrabold">{query ? tr("کالایی پیدا نشد", "No products found") : tr("هنوز کالایی ثبت نشده", "No products yet")}</p><p className="mt-1 text-xs text-ink/55">{query ? tr("عبارت جست‌وجو را تغییر بده.", "Try another search.") : tr("با دکمهٔ بالا اولین کالا را اضافه کن.", "Use the button above to add your first product.")}</p></div>}</section>
    {open && <div className="fixed inset-0 z-50 flex items-end justify-center sheet-backdrop md:items-center" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}><div role="dialog" aria-modal="true" aria-label={editing ? tr("ویرایش کالا", "Edit product") : tr("افزودن کالا", "Add product")} className="max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[28px] border-[1.5px] border-ink bg-background p-5 pb-[max(24px,env(safe-area-inset-bottom))] md:rounded-card md:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black">{editing ? tr("ویرایش کالا", "Edit product") : tr("کالای جدید", "New product")}</h2><button onClick={() => setOpen(false)} aria-label={tr("بستن", "Close")} className="rounded-full border border-ink bg-white p-2"><X size={20} /></button></div><form onSubmit={submit} className="space-y-4"><Field label={tr("نام کالا", "Product name")} value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder={tr("مثلاً شال نخی", "e.g. Cotton scarf")} /><Field label={tr("قیمت (تومان)", "Price (toman)")} value={form.price} onChange={v => setForm({ ...form, price: v })} inputMode="numeric" placeholder={tr("۰", "0")} /><div className="grid grid-cols-2 gap-3"><Field label={tr("موجودی", "Stock")} value={form.stock} onChange={v => setForm({ ...form, stock: v })} inputMode="numeric" placeholder={tr("۰", "0")} /><Field label={tr("هشدار موجودی کم", "Low stock alert")} value={form.lowStockThreshold} onChange={v => setForm({ ...form, lowStockThreshold: v })} inputMode="numeric" placeholder={tr("۳", "3")} /></div><div><p className="mb-2 text-sm font-bold">{tr("رنگ کالا", "Product color")}</p><div className="flex gap-3">{colors.map(color => <button type="button" key={color} onClick={() => setForm({ ...form, color })} aria-label={`${tr("انتخاب رنگ", "Choose color")} ${color}`} aria-pressed={form.color === color} className={`h-9 w-9 rounded-full border border-ink ${form.color === color ? "ring-2 ring-ink ring-offset-2" : ""}`} style={{ backgroundColor: color }} />)}</div></div>{error && <p role="alert" className="rounded-xl bg-accent-coral/20 p-3 text-sm font-bold">{error}</p>}<button disabled={busy} type="submit" className="w-full rounded-pill bg-ink py-3 font-extrabold text-white disabled:opacity-50">{busy ? tr("در حال ذخیره...", "Saving...") : editing ? tr("ذخیره تغییرات", "Save changes") : tr("افزودن کالا", "Add product")}</button>{editing && <button disabled={busy} type="button" onClick={remove} className="flex w-full items-center justify-center gap-2 rounded-pill py-2 text-sm font-bold text-red-700"><Trash2 size={17} />{tr("حذف کالا", "Delete product")}</button>}</form></div></div>}
  </main>;
}
function Field({ label, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; inputMode?: "numeric" }) { return <label className="block text-sm font-bold">{label}<input value={value} onChange={e => onChange(e.target.value)} inputMode={inputMode} placeholder={placeholder} className="mt-2 w-full rounded-2xl border-[1.5px] border-ink bg-white px-4 py-3 text-sm font-normal" /></label>; }

````

## src/app/settings/page.tsx

````
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Database, Download, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { BrandHeader, LogoMark, ThemeSwitch } from "@/components/ui";
import { api } from "@/lib/client";
import { loadOrders, loadProducts } from "@/lib/storage";
import { localizedError, useLocale } from "@/lib/i18n";
import { numberFa } from "@/lib/format";

type User = { id: string; name: string; email: string };
export default function SettingsPage() {
  const { lang, tr } = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [legacy, setLegacy] = useState({ products: 0, orders: 0 });
  const [imported, setImported] = useState(false);
  const [exporting, setExporting] = useState(false);
  useEffect(() => { api<{ user: User }>("/api/auth/me").then(data => setUser(data.user)).catch(() => setError(tr("اطلاعات حساب دریافت نشد.", "Could not load account details."))); setLegacy({ products: loadProducts().length, orders: loadOrders().length }); }, [tr]);
  const logout = async () => { try { await api("/api/auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); } catch { setError(tr("خروج انجام نشد. دوباره تلاش کنید.", "Could not sign out. Try again.")); } };
  const importOld = async () => { setError(""); try { await api("/api/import", { method: "POST", body: JSON.stringify({ products: loadProducts(), orders: loadOrders() }) }); setImported(true); } catch (e) { setError(localizedError(e, lang, "Could not import old data. Make sure this account is empty.")); } };
  const downloadBackup = async () => { setExporting(true); setError(""); try { const data = await api<{ products: unknown[]; orders: unknown[] }>("/api/data"); const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...data }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `stockly-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); } catch (e) { setError(localizedError(e, lang, "Could not export your data.")); } finally { setExporting(false); } };
  return <main><BrandHeader title="تنظیمات" titleEn="Settings" /><div className="mb-6"><p className="text-sm text-ink/55">{tr("فضای شخصی تو", "Your workspace")}</p><h1 className="mt-1 text-3xl font-black md:text-[42px]">{tr("تنظیمات", "Settings")}</h1></div><div className="grid gap-4 lg:grid-cols-2"><section className="card-border rounded-card bg-surface p-5 md:p-7"><div className="mb-5 flex items-center gap-4"><LogoMark size={64} /><div><p className="text-lg font-black">{user?.name ?? tr("حساب من", "My account")}</p><p className="text-xs text-ink/55" dir="ltr">{user?.email ?? ""}</p></div></div><div className="border-t border-black/20 pt-4"><div className="flex items-center gap-3 text-sm font-bold"><span className="icon-tile rounded-xl bg-accent-blue p-2"><UserRound size={18} /></span>{tr("حساب شخصی استاکلی", "Personal Stockly account")}</div></div></section><section className="rounded-card border-[1.5px] border-ink bg-accent-mint p-5 md:p-7"><span className="icon-tile flex h-11 w-11 items-center justify-center rounded-full bg-white/70"><ShieldCheck size={22} /></span><h2 className="mt-5 text-lg font-black">{tr("اطلاعاتت محفوظ است", "Your data stays private")}</h2><p className="mt-2 text-sm leading-7 text-ink/70">{tr("کالاها و سفارش‌ها در دیتابیس این برنامه ذخیره می‌شوند و فقط با حساب خودت به آن‌ها دسترسی داری.", "Products and orders are stored in this app's database and are accessible only through your account.")}</p></section></div><section className="card-border mt-4 rounded-card bg-white p-5 md:p-7"><div className="flex items-start gap-3"><span className="icon-tile rounded-xl bg-accent-yellow p-2"><Database size={19} /></span><div><h2 className="font-black">{tr("دربارهٔ داده‌ها", "About your data")}</h2><p className="mt-1 text-sm leading-7 text-ink/60">{tr("دیتابیس روی دستگاهی است که سرور استاکلی روی آن اجرا می‌شود. برای استفاده روی چند دستگاه یا انتشار عمومی، سرور و دیتابیس پایدار لازم است.", "The database lives on the device running the Stockly server. Multi-device or public hosting needs a persistent server and database.")}</p></div></div></section><section className="card-border mt-4 flex flex-wrap items-center justify-between gap-4 rounded-card bg-surface p-5 md:p-7"><div><h2 className="font-black">{tr("ظاهر و پشتیبان‌گیری", "Appearance and backup")}</h2><p className="mt-1 text-sm text-ink/60">{tr("حالت نمایش را تغییر بده یا یک نسخه از اطلاعاتت ذخیره کن.", "Choose a theme or save a copy of your data.")}</p></div><div className="flex items-center gap-2"><ThemeSwitch /><button disabled={exporting} onClick={() => void downloadBackup()} className="flex items-center gap-2 rounded-pill bg-ink px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><Download size={16} />{tr("دریافت پشتیبان", "Download backup")}</button></div></section>{legacy.products + legacy.orders > 0 && !imported && <section className="mt-4 rounded-card border-[1.5px] border-ink bg-accent-lilac p-5 md:p-7"><h2 className="font-black">{tr("اطلاعات نسخهٔ قبلی پیدا شد", "Old data found")}</h2><p className="mt-1 text-sm leading-7">{lang === "fa" ? `${numberFa(legacy.products, lang)} کالا و ${numberFa(legacy.orders, lang)} سفارش در حافظهٔ این مرورگر وجود دارد. می‌توانی آن‌ها را به حساب خالی خودت منتقل کنی.` : `${legacy.products} products and ${legacy.orders} orders are saved in this browser. You can import them into an empty account.`}</p><button onClick={() => void importOld()} className="mt-4 rounded-pill bg-ink px-5 py-2.5 text-sm font-bold text-white">{tr("انتقال اطلاعات قبلی", "Import old data")}</button></section>}{imported && <p role="status" className="mt-4 rounded-2xl bg-accent-mint p-3 text-sm font-bold">{tr("اطلاعات قبلی منتقل شد.", "Old data imported.")}</p>}{error && <p role="alert" className="mt-4 rounded-xl bg-accent-coral/20 p-3 text-sm font-bold">{error}</p>}<button onClick={() => void logout()} className="mt-5 flex items-center gap-2 rounded-pill border-[1.5px] border-ink bg-white px-5 py-3 text-sm font-bold"><LogOut size={18} />{tr("خروج از حساب", "Sign out")}</button></main>;
}

````

## src/components/app-shell.tsx

````
"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BottomNav } from "./ui";
import { api } from "@/lib/client";
import { LocaleProvider, type Language, type Theme } from "@/lib/i18n";

export function AppShell({ children, initialLang, initialTheme }: { children: React.ReactNode; initialLang: Language; initialTheme: Theme }) {
  return <LocaleProvider initialLang={initialLang} initialTheme={initialTheme}><AppShellContent>{children}</AppShellContent></LocaleProvider>;
}
function AppShellContent({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const login = path === "/login";
  useEffect(() => {
    let active = true;
    setReady(false);
    api<{ user: unknown }>("/api/auth/me").then(() => { if (active) { if (login) router.replace("/"); else setReady(true); } }).catch(() => { if (active) { if (login) setReady(true); else router.replace("/login"); } });
    return () => { active = false; };
  }, [login, router]);
  if (!ready) return <div className="flex min-h-dvh items-center justify-center bg-background"><div className="h-10 w-10 animate-spin rounded-full border-4 border-ink/10 border-t-ink" aria-label="در حال بارگذاری" /></div>;
  if (login) return <>{children}</>;
  return <div className="app-layout"><BottomNav /><div className="app-content">{children}</div></div>;
}

````

## src/components/ui.tsx

````
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowUpLeft, Box, ChartNoAxesColumn, ChevronLeft, CircleDollarSign, ClipboardList, Home, Moon, Package, Settings, ShoppingBag, Sun, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import { money, numberFa } from "@/lib/format";
import { useLocale } from "@/lib/i18n";

export const statusMeta: Record<OrderStatus, { label: string; en: string; color: string }> = {
  pending_payment: { label: "در انتظار پرداخت", en: "Pending payment", color: "bg-accent-yellow" },
  paid: { label: "پرداخت‌شده", en: "Paid", color: "bg-accent-blue" },
  shipped: { label: "ارسال‌شده", en: "Shipped", color: "bg-accent-lilac" },
  delivered: { label: "تحویل‌شده", en: "Delivered", color: "bg-accent-mint" },
  cancelled: { label: "لغوشده", en: "Cancelled", color: "bg-gray-200" },
};
export function LogoMark({ size = 42 }: { size?: number }) { const { tr } = useLocale(); return <span className="logo-mark inline-block shrink-0 rounded-2xl icon-tile" style={{ width: size, height: size }} role="img" aria-label={tr("نشان استاکلی", "Stockly logo")} />; }
export function LanguageSwitch() { const { lang, setLang } = useLocale(); return <div className="inline-flex rounded-pill border-[1.5px] border-ink bg-white p-1 text-xs font-extrabold" aria-label="Language"><button onClick={() => setLang("fa")} aria-pressed={lang === "fa"} className={`rounded-pill px-2.5 py-1 ${lang === "fa" ? "bg-ink text-white" : ""}`}>فا</button><button onClick={() => setLang("en")} aria-pressed={lang === "en"} className={`rounded-pill px-2.5 py-1 ${lang === "en" ? "bg-ink text-white" : ""}`}>EN</button></div>; }
export function ThemeSwitch() { const { theme, setTheme, tr } = useLocale(); const dark = theme === "dark"; return <button type="button" onClick={() => setTheme(dark ? "light" : "dark")} aria-label={tr(dark ? "فعال‌کردن حالت روز" : "فعال‌کردن حالت شب", dark ? "Switch to light mode" : "Switch to dark mode")} aria-pressed={dark} className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-surface transition hover:-translate-y-0.5">{dark ? <Sun size={19} /> : <Moon size={19} />}</button>; }
export function StatusPill({ status }: { status: OrderStatus }) { const { tr } = useLocale(); const meta = statusMeta[status]; return <span className={`inline-flex whitespace-nowrap rounded-pill border border-ink px-3 py-1 text-[11px] font-bold ${meta.color}`}>{tr(meta.label, meta.en)}</span>; }
export function BrandHeader({ title, titleEn, subtitle }: { title: string; titleEn: string; subtitle?: string }) { const { tr } = useLocale(); const path = usePathname(); return <header className="mb-7 flex items-center justify-between gap-3 md:mb-10"><div className="flex items-center gap-3 lg:hidden"><LogoMark /><div><strong className="block text-lg font-black leading-tight" dir="ltr">Stockly</strong>{subtitle && <span className="text-[11px] text-ink/55">{subtitle}</span>}</div></div><div className="hidden lg:block"><span className="text-sm font-bold text-ink/55">{tr("فضای کاری", "Workspace")} / {tr(title, titleEn)}</span>{subtitle && <p className="mt-1 text-sm text-ink/45">{subtitle}</p>}</div><nav aria-label={tr("بخش‌های برنامه", "App sections")} className="top-navigation hidden items-center gap-1 rounded-pill border border-ink/10 bg-surface p-1 lg:flex">{nav.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined} className={`rounded-pill px-3 py-2 text-xs font-extrabold transition ${path === item.href ? "bg-ink text-white" : "hover:bg-ink/5"}`}>{tr(item.fa, item.en)}</Link>)}</nav><div className="flex items-center gap-2"><ThemeSwitch /><LanguageSwitch /></div></header>; }
export function HeroCard({ stockValue, sales, period, onPeriodChange }: { stockValue: number; sales: number; period: "week" | "month"; onPeriodChange: (value: "week" | "month") => void }) { const { lang, tr } = useLocale(); return <section className="relative flex min-h-[286px] flex-col justify-between overflow-hidden rounded-card border-[1.5px] border-ink bg-accent-coral p-6 md:min-h-[340px] md:p-8"><div className="absolute -left-20 -top-24 h-64 w-64 rounded-full border-[42px] border-white/15" /><div className="relative flex items-start justify-between"><span className="rounded-pill border border-ink bg-white/85 px-4 py-2 text-xs font-extrabold">{tr("نمای کلی فروشگاه", "Store overview")}</span><span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink bg-ink text-white"><ArrowUpLeft size={19} /></span></div><div className="relative mt-9 md:mt-0"><p className="text-sm font-bold">{tr("ارزش کل موجودی", "Total stock value")}</p><p className="mt-1 break-words text-[clamp(30px,4vw,52px)] font-black leading-tight tracking-tight">{money(stockValue, lang)}</p></div><div className="relative mt-8 flex items-end justify-between gap-2 border-t border-ink/30 pt-5 md:mt-0"><div><p className="text-xs font-bold text-ink/70">{tr("فروش", "Sales")} {period === "week" ? tr("این هفته", "this week") : tr("این ماه", "this month")}</p><p className="mt-1 text-xl font-black md:text-2xl">{money(sales, lang)}</p></div><div className="flex rounded-pill border border-ink bg-white/20 p-1 text-xs font-extrabold" aria-label={tr("بازهٔ فروش", "Sales period")}><button onClick={() => onPeriodChange("week")} aria-pressed={period === "week"} className={`rounded-pill px-3 py-1.5 ${period === "week" ? "bg-ink text-white" : ""}`}>{tr("هفته", "Week")}</button><button onClick={() => onPeriodChange("month")} aria-pressed={period === "month"} className={`rounded-pill px-3 py-1.5 ${period === "month" ? "bg-ink text-white" : ""}`}>{tr("ماه", "Month")}</button></div></div></section>; }
export function StatTile({ icon: Icon, label, labelEn, value, tone }: { icon: LucideIcon; label: string; labelEn: string; value: number; tone: string }) { const { lang, tr } = useLocale(); return <div className={`min-w-0 rounded-card border-[1.5px] border-ink p-4 md:p-5 ${tone}`}><span className="icon-tile flex h-10 w-10 items-center justify-center rounded-full bg-white/80"><Icon size={19} strokeWidth={2.5} /></span><p className="mt-5 text-[11px] font-bold text-ink/75 md:text-sm">{tr(label, labelEn)}</p><p className="mt-1 text-2xl font-black md:text-3xl">{numberFa(value, lang)}</p></div>; }
export function BarChart({ values }: { values: number[] }) { const { lang, tr } = useLocale(); const max = Math.max(...values, 1); const names = lang === "fa" ? ["ش", "ی", "د", "س", "چ", "پ", "ج"] : ["S", "S", "M", "T", "W", "T", "F"]; return <section className="card-border rounded-card bg-surface p-5 md:p-7"><div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-bold text-ink/50">{tr("هفت روز اخیر", "Last seven days")}</p><h2 className="mt-1 text-xl font-black">{tr("فروش روزانه", "Daily sales")}</h2></div><span className="icon-tile flex h-10 w-10 items-center justify-center rounded-full bg-accent-blue"><ChartNoAxesColumn size={20} /></span></div><div className="flex h-[180px] items-end justify-between gap-2 md:h-[210px]" role="img" aria-label={`${tr("فروش هفت روز اخیر", "Sales over the last seven days")}: ${values.map(v => numberFa(v, lang)).join(", ")}`}>{values.map((value, index) => <div key={index} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="max-w-full truncate text-[10px] font-extrabold" title={money(value, lang)}>{numberFa(value, lang)}</span><div className={`w-full max-w-10 rounded-t-lg border-[1.5px] border-ink ${value === max && value > 0 ? "bg-accent-coral" : "bg-ink"}`} style={{ height: `${Math.max(value ? 16 : 4, value / max * 130)}px` }} /><span className="pt-1 text-xs font-bold text-ink/65">{names[index]}</span></div>)}</div></section>; }
export function ListRow({ icon: Icon = Package, title, subtitle, value, tone = "bg-accent-blue", iconColor, badge, onClick }: { icon?: LucideIcon; title: string; subtitle: string; value: string; tone?: string; iconColor?: string; badge?: React.ReactNode; onClick?: () => void }) { const content = <><span className={`icon-tile flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`} style={iconColor ? { backgroundColor: iconColor } : undefined}><Icon size={20} strokeWidth={2.3} /></span><span className="min-w-0 flex-1 text-start"><span className="block truncate text-sm font-extrabold">{title}</span><span className="mt-0.5 block truncate text-xs text-ink/60">{subtitle}</span></span><span className="flex shrink-0 flex-col items-end gap-1 text-end"><span className="text-xs font-black md:text-sm">{value}</span>{badge}</span></>; return onClick ? <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl p-2 text-start transition hover:bg-black/[.035]">{content}</button> : <div className="flex items-center gap-3 rounded-2xl p-2">{content}</div>; }
const nav = [{ href: "/", fa: "خانه", en: "Home", icon: Home }, { href: "/products", fa: "کالاها", en: "Products", icon: Box }, { href: "/orders", fa: "سفارش‌ها", en: "Orders", icon: ShoppingBag }, { href: "/settings", fa: "تنظیمات", en: "Settings", icon: Settings }];
export function BottomNav() { const path = usePathname(); const { tr } = useLocale(); return <nav aria-label={tr("ناوبری اصلی", "Main navigation")} className="app-nav fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[min(calc(100%-32px),430px)] -translate-x-1/2 items-center justify-around rounded-pill border border-ink/10 bg-ink px-2 py-2 text-white md:sticky md:left-auto md:top-4 md:h-[calc(100dvh-32px)] md:w-[76px] md:shrink-0 md:translate-x-0 md:flex-col md:justify-start md:rounded-[30px] md:bg-surface md:px-2 md:py-3 md:text-ink"><div className="mb-7 hidden md:block"><LogoMark size={52} /></div>{nav.map(({ href, fa, en, icon: Icon }) => { const active = path === href; return <Link key={href} href={href} aria-current={active ? "page" : undefined} aria-label={tr(fa, en)} title={tr(fa, en)} className="group flex min-w-16 flex-col items-center gap-0.5 text-[10px] md:mb-2 md:min-w-0"><span className={`nav-icon flex h-10 w-10 items-center justify-center rounded-full transition md:h-11 md:w-11 ${active ? "bg-white text-ink md:bg-ink md:text-white" : "text-white/80 md:text-ink/55 md:group-hover:bg-ink/5 md:group-hover:text-ink"}`}><Icon size={20} strokeWidth={active ? 2.8 : 2.2} /></span><span className={`${active ? "font-extrabold" : "text-white/70"} md:hidden`}>{tr(fa, en)}</span></Link>; })}<span className="mt-auto hidden text-[10px] font-black tracking-widest text-ink/40 [writing-mode:vertical-rl] md:block" dir="ltr">STOCKLY</span></nav>; }
export { ClipboardList, CircleDollarSign, TriangleAlert, ChevronLeft, ArrowLeft };

````

## src/lib/auth.ts

````
import "server-only";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";

const COOKIE = "stockly_session";
const DAYS = 30;
export type CurrentUser = { id: string; name: string; email: string };

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const actual = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch { return false; }
}
const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = getDb().prepare(`SELECT users.id, users.name, users.email FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?`).get(tokenHash(token), new Date().toISOString()) as CurrentUser | undefined;
  return row ?? null;
}
export async function startSession(userId: string, request: Request): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + DAYS * 86400000).toISOString();
  getDb().prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").run(tokenHash(token), userId, expiresAt);
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: new URL(request.url).protocol === "https:", path: "/", maxAge: DAYS * 86400 });
}
export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(token));
  jar.delete(COOKIE);
}
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(request.url).origin;
}

````

## src/lib/client.ts

````
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

````

## src/lib/db.ts

````
import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const globalDb = globalThis as typeof globalThis & { stocklyDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (globalDb.stocklyDb) return globalDb.stocklyDb;
  const directory = process.env.STOCKLY_DATA_DIR || join(process.cwd(), ".data");
  mkdirSync(directory, { recursive: true });
  const db = new DatabaseSync(join(directory, "stockly.sqlite"), { timeout: 5000 });
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL, price INTEGER NOT NULL CHECK(price >= 0),
      stock INTEGER NOT NULL CHECK(stock >= 0), threshold INTEGER NOT NULL CHECK(threshold >= 0),
      color TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS products_user_idx ON products(user_id);
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL,
      items_json TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders(user_id, created_at DESC);
  `);
  globalDb.stocklyDb = db;
  return db;
}

export function transaction<T>(work: (db: DatabaseSync) => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try { const result = work(db); db.exec("COMMIT"); return result; }
  catch (error) { db.exec("ROLLBACK"); throw error; }
}

````

## src/lib/format.ts

````
import type { Language } from "./i18n";
export const numberFa = (value: number, lang: Language = "fa") => new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(value);
export const money = (value: number, lang: Language = "fa") => lang === "fa" ? `${numberFa(value, lang)} تومان` : `${numberFa(value, lang)} toman`;
export const dateFa = (value: string | Date, lang: Language = "fa") => new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { day: "numeric", month: "long" }).format(new Date(value));
export const orderTotal = (items: { qty: number; unitPrice: number }[]) => items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

````

## src/lib/i18n.tsx

````
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "fa" | "en";
export type Theme = "light" | "dark";
type LocaleContextValue = { lang: Language; setLang: (lang: Language) => void; theme: Theme; setTheme: (theme: Theme) => void; tr: (fa: string, en: string) => string };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ initialLang, initialTheme, children }: { initialLang: Language; initialTheme: Theme; children: React.ReactNode }) {
  const [lang, updateLang] = useState<Language>(initialLang);
  const [theme, updateTheme] = useState<Theme>(initialTheme);
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === "fa" ? "rtl" : "ltr"; document.title = lang === "fa" ? "استاکلی | مدیریت فروش و موجودی" : "Stockly | Orders and inventory"; }, [lang]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const value = useMemo<LocaleContextValue>(() => ({
    lang,
    theme,
    setTheme(next) { updateTheme(next); document.cookie = `stockly_theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`; },
    setLang(next) {
      updateLang(next);
      document.cookie = `stockly_lang=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    },
    tr: (fa, en) => lang === "fa" ? fa : en,
  }), [lang, theme]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LocaleProvider is missing");
  return context;
}
export function localizedError(error: unknown, lang: Language, englishFallback = "Something went wrong. Please try again."): string {
  return lang === "fa" && error instanceof Error ? error.message : englishFallback;
}

````

## src/lib/repository.ts

````
import "server-only";
import { randomUUID } from "node:crypto";
import { getDb, transaction } from "./db";
import type { Order, OrderItem, OrderStatus, Product } from "./types";

type ProductRow = { id: string; name: string; price: number; stock: number; threshold: number; color: string };
type OrderRow = { id: string; customer_name: string; customer_phone: string; items_json: string; status: OrderStatus; created_at: string };
const statuses: OrderStatus[] = ["pending_payment", "paid", "shipped", "delivered", "cancelled"];
const colors = ["#74C9F8", "#5DD7C4", "#FFD84D", "#C7B8F5", "#FF6841", "#9DBBE8", "#8FD3C1", "#F6D66B", "#EE7A5A"];

const productFromRow = (row: ProductRow): Product => ({ id: row.id, name: row.name, price: row.price, stock: row.stock, lowStockThreshold: row.threshold, color: row.color });
const orderFromRow = (row: OrderRow): Order => ({ id: row.id, customerName: row.customer_name, customerPhone: row.customer_phone, items: JSON.parse(row.items_json) as OrderItem[], status: row.status, createdAt: row.created_at });
export function listProducts(userId: string): Product[] {
  return (getDb().prepare("SELECT id,name,price,stock,threshold,color FROM products WHERE user_id = ? ORDER BY created_at DESC").all(userId) as ProductRow[]).map(productFromRow);
}
export function listOrders(userId: string): Order[] {
  return (getDb().prepare("SELECT id,customer_name,customer_phone,items_json,status,created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(userId) as OrderRow[]).map(orderFromRow);
}
export function validateProduct(input: unknown): Omit<Product, "id"> | null {
  if (!input || typeof input !== "object") return null;
  const p = input as Product;
  if (typeof p.name !== "string" || !p.name.trim() || p.name.trim().length > 100 ||
    !Number.isSafeInteger(p.price) || p.price < 0 || !Number.isSafeInteger(p.stock) || p.stock < 0 ||
    !Number.isSafeInteger(p.lowStockThreshold) || p.lowStockThreshold < 0 || !colors.includes(p.color)) return null;
  return { name: p.name.trim(), price: p.price, stock: p.stock, lowStockThreshold: p.lowStockThreshold, color: p.color };
}
export function insertProduct(userId: string, input: Omit<Product, "id">): Product {
  const product = { id: randomUUID(), ...input };
  getDb().prepare("INSERT INTO products(id,user_id,name,price,stock,threshold,color,created_at) VALUES(?,?,?,?,?,?,?,?)")
    .run(product.id, userId, product.name, product.price, product.stock, product.lowStockThreshold, product.color, new Date().toISOString());
  return product;
}
export function updateProduct(userId: string, id: string, input: Omit<Product, "id">): Product | null {
  const result = getDb().prepare("UPDATE products SET name=?,price=?,stock=?,threshold=?,color=? WHERE id=? AND user_id=?")
    .run(input.name, input.price, input.stock, input.lowStockThreshold, input.color, id, userId);
  return result.changes ? { id, ...input } : null;
}
export function deleteProduct(userId: string, id: string): boolean | string {
  if (listOrders(userId).some(o => o.status !== "cancelled" && o.items.some(i => i.productId === id))) return "برای حذف این کالا ابتدا سفارش‌های مرتبط را لغو کنید.";
  return !!getDb().prepare("DELETE FROM products WHERE id=? AND user_id=?").run(id, userId).changes;
}
export function insertOrder(userId: string, input: unknown): Order | string {
  if (!input || typeof input !== "object") return "اطلاعات سفارش معتبر نیست.";
  const o = input as { customerName?: unknown; customerPhone?: unknown; items?: unknown };
  const phone = typeof o.customerPhone === "string" ? o.customerPhone.replace(/[\s-]/g, "") : "";
  if (typeof o.customerName !== "string" || !o.customerName.trim() || o.customerName.trim().length > 100) return "نام مشتری را درست وارد کنید.";
  const customerName = o.customerName.trim();
  if (!/^09\d{9}$/.test(phone)) return "شمارهٔ موبایل معتبر وارد کنید.";
  if (!Array.isArray(o.items) || !o.items.length || o.items.length > 100) return "دست‌کم یک کالا انتخاب کنید.";
  const requested = new Map<string, number>();
  for (const raw of o.items) {
    if (!raw || typeof raw.productId !== "string" || !Number.isSafeInteger(raw.qty) || raw.qty <= 0) return "تعداد کالاها معتبر نیست.";
    requested.set(raw.productId, (requested.get(raw.productId) ?? 0) + raw.qty);
  }
  try {
    return transaction(db => {
      const items: OrderItem[] = [];
      for (const [id, qty] of requested) {
        const product = db.prepare("SELECT id,name,price,stock FROM products WHERE id=? AND user_id=?").get(id, userId) as (ProductRow & { name: string }) | undefined;
        if (!product || product.stock < qty) throw new Error(`موجودی «${product?.name ?? "کالا"}» کافی نیست.`);
        db.prepare("UPDATE products SET stock=stock-? WHERE id=? AND user_id=?").run(qty, id, userId);
        items.push({ productId: id, productName: product.name, qty, unitPrice: product.price });
      }
      const order: Order = { id: randomUUID(), customerName, customerPhone: phone, items, status: "pending_payment", createdAt: new Date().toISOString() };
      db.prepare("INSERT INTO orders(id,user_id,customer_name,customer_phone,items_json,status,created_at) VALUES(?,?,?,?,?,?,?)")
        .run(order.id, userId, order.customerName, order.customerPhone, JSON.stringify(items), order.status, order.createdAt);
      return order;
    });
  } catch (error) { return error instanceof Error ? error.message : "ثبت سفارش انجام نشد."; }
}
export function setOrderStatus(userId: string, id: string, status: unknown): Order | string {
  if (!statuses.includes(status as OrderStatus)) return "وضعیت انتخاب‌شده معتبر نیست.";
  try {
    return transaction(db => {
      const row = db.prepare("SELECT id,customer_name,customer_phone,items_json,status,created_at FROM orders WHERE id=? AND user_id=?").get(id, userId) as OrderRow | undefined;
      if (!row) throw new Error("سفارش پیدا نشد.");
      if (row.status === "cancelled" && status !== "cancelled") throw new Error("سفارش لغوشده را دوباره ثبت کنید.");
      if (row.status !== "cancelled" && status === "cancelled") {
        const items = JSON.parse(row.items_json) as OrderItem[];
        for (const item of items) db.prepare("UPDATE products SET stock=stock+? WHERE id=? AND user_id=?").run(item.qty, item.productId, userId);
      }
      db.prepare("UPDATE orders SET status=? WHERE id=? AND user_id=?").run(status as string, id, userId);
      return orderFromRow({ ...row, status: status as OrderStatus });
    });
  } catch (error) { return error instanceof Error ? error.message : "تغییر وضعیت انجام نشد."; }
}

````

## src/lib/storage.ts

````
import type { Order, OrderStatus, Product } from "./types";

const PRODUCT_KEY = "stockly.products.v1";
const ORDER_KEY = "stockly.orders.v1";
export const DATA_EVENT = "stockly:data-changed";
const statuses: OrderStatus[] = ["pending_payment", "paid", "shipped", "delivered", "cancelled"];

const validProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== "object") return false;
  const p = value as Product;
  return typeof p.id === "string" && typeof p.name === "string" && typeof p.color === "string" &&
    Number.isFinite(p.price) && p.price >= 0 && Number.isInteger(p.stock) && p.stock >= 0 &&
    Number.isInteger(p.lowStockThreshold) && p.lowStockThreshold >= 0;
};
const validOrder = (value: unknown): value is Order => {
  if (!value || typeof value !== "object") return false;
  const o = value as Order;
  return typeof o.id === "string" && typeof o.customerName === "string" && typeof o.customerPhone === "string" &&
    statuses.includes(o.status) && typeof o.createdAt === "string" && !Number.isNaN(Date.parse(o.createdAt)) &&
    Array.isArray(o.items) && o.items.length > 0 && o.items.every(i => typeof i.productId === "string" && Number.isInteger(i.qty) && i.qty > 0 && Number.isFinite(i.unitPrice) && i.unitPrice >= 0);
};
function load<T>(key: string, guard: (v: unknown) => v is T): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(guard) ? parsed : [];
  } catch { return []; }
}
function save<T>(key: string, data: T[]): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event(DATA_EVENT));
    return true;
  } catch { return false; }
}
export const loadProducts = () => load(PRODUCT_KEY, validProduct);
export const loadOrders = () => load(ORDER_KEY, validOrder);
export const saveProducts = (products: Product[]) => save(PRODUCT_KEY, products);
export const saveOrders = (orders: Order[]) => save(ORDER_KEY, orders);

export function createOrder(order: Order): string | null {
  const products = loadProducts();
  const requested = new Map<string, number>();
  for (const item of order.items) requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.qty);
  for (const [id, qty] of requested) {
    const product = products.find(p => p.id === id);
    if (!product || product.stock < qty) return "موجودی یکی از کالاها کافی نیست.";
  }
  const updated = products.map(p => ({ ...p, stock: p.stock - (requested.get(p.id) ?? 0) }));
  if (!saveProducts(updated)) return "ذخیرهٔ موجودی انجام نشد. دوباره تلاش کنید.";
  if (!saveOrders([order, ...loadOrders()])) {
    saveProducts(products);
    return "ذخیرهٔ سفارش انجام نشد. دوباره تلاش کنید.";
  }
  return null;
}

export function changeOrderStatus(id: string, status: OrderStatus): string | null {
  const orders = loadOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return "سفارش پیدا نشد.";
  if (order.status === status) return null;
  if (order.status === "cancelled" && status !== "cancelled") return "سفارش لغوشده را دوباره ثبت کنید.";
  if (status === "cancelled") {
    const products = loadProducts();
    const updated = products.map(p => ({ ...p, stock: p.stock + order.items.filter(i => i.productId === p.id).reduce((n, i) => n + i.qty, 0) }));
    if (!saveProducts(updated)) return "بازگرداندن موجودی انجام نشد.";
    if (!saveOrders(orders.map(o => o.id === id ? { ...o, status } : o))) {
      saveProducts(products);
      return "تغییر وضعیت انجام نشد. دوباره تلاش کنید.";
    }
    return null;
  }
  return saveOrders(orders.map(o => o.id === id ? { ...o, status } : o)) ? null : "تغییر وضعیت انجام نشد. دوباره تلاش کنید.";
}

````

## src/lib/types.ts

````
export type Product = { id: string; name: string; price: number; stock: number; lowStockThreshold: number; color: string };
export type OrderStatus = "pending_payment" | "paid" | "shipped" | "delivered" | "cancelled";
export type OrderItem = { productId: string; productName?: string; qty: number; unitPrice: number };
export type Order = { id: string; customerName: string; customerPhone: string; items: OrderItem[]; status: OrderStatus; createdAt: string };

````
