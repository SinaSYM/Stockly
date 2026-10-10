import type { Language } from "./i18n";
export const numberFa = (value: number, lang: Language = "fa") => new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(value);
export const money = (value: number, lang: Language = "fa") => lang === "fa" ? `${numberFa(value, lang)} تومان` : `${numberFa(value, lang)} toman`;
export const dateFa = (value: string | Date, lang: Language = "fa") => new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { day: "numeric", month: "long" }).format(new Date(value));
export const orderTotal = (items: { qty: number; unitPrice: number }[]) => items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
