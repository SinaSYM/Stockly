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
