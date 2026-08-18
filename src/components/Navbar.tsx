"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Film, Music2, Users, Search, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, getToken, type CurrentUser } from "@/lib/api";

const links = [
  { href: "/cinema", label: "Cinema", icon: Film, accent: "text-marquee" },
  { href: "/music", label: "Music", icon: Music2, accent: "text-frequency" },
  { href: "/watchparty", label: "Watch Party", icon: Users, accent: "text-paper" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setChecked(true);
      return;
    }
    api
      .getMe()
      .then(setUser)
      .catch(() => api.logout())
      .finally(() => setChecked(true));
  }, []);

  function handleLogout() {
    api.logout();
    setUser(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-tight text-paper">
          Omni<span className="text-marquee">Stream</span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {links.map(({ href, label, icon: Icon, accent }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-white/5 text-paper" : "text-muted hover:text-paper"
                )}
              >
                <Icon size={16} className={active ? accent : undefined} />
                {label}
              </Link>
            );
          })}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname?.startsWith("/admin") ? "bg-white/5 text-paper" : "text-muted hover:text-paper"
              )}
            >
              <ShieldCheck size={16} className={pathname?.startsWith("/admin") ? "text-frequency" : undefined} />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button aria-label="Cari" className="rounded-md p-2 text-muted hover:bg-white/5 hover:text-paper">
            <Search size={18} />
          </button>
          {!checked ? null : user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                aria-label="Keluar"
                className="rounded-md border border-white/15 p-1.5 text-paper hover:border-white/30"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-paper hover:border-white/30"
            >
              Masuk
            </Link>
          )}
        </div>
      </nav>
      <div className="divider-strip divider-strip--marquee" />
    </header>
  );
}
