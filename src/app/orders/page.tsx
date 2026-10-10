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
