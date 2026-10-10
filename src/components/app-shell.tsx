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
