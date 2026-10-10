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
