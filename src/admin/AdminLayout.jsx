import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LogoMark from "../components/LogoMark";
import { MenuIcon, CloseIcon } from "../components/Icons";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/produtos", label: "Produtos" },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/relatorios", label: "Relatório mensal" },
  { to: "/admin/horarios", label: "Horários" },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-acai-100/30">
      <header className="bg-acai-950 text-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-acai-700/90 shadow-soft lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
            <LogoMark className="h-9 w-auto" />
            <span className="hidden font-display text-sm font-700 sm:inline">
              Painel administrativo
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              className="rounded-full bg-sun-500 px-3 py-2 font-display text-xs font-700 text-acai-950 transition-transform hover:bg-sun-400 active:scale-95"
            >
              Voltar ao site
            </a>
            <span className="hidden font-body text-xs text-white/60 sm:inline">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-white/10 px-4 py-2 font-body text-sm font-700 hover:bg-white/20"
            >
              Sair
            </button>
          </div>
        </div>

        <nav
          className={`flex-col gap-1 border-t border-white/10 bg-acai-950 px-4 pb-3 pt-2 lg:flex lg:flex-row lg:gap-6 lg:border-none lg:bg-transparent lg:px-6 lg:pb-0 lg:pt-0 ${
            open ? "flex" : "hidden"
          }`}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 font-body text-sm font-700 transition-colors lg:rounded-none lg:border-b-2 lg:px-1 lg:py-4 ${
                  isActive
                    ? "bg-white/10 text-sun-300 lg:border-sun-400 lg:bg-transparent"
                    : "text-white/80 hover:bg-white/5 lg:border-transparent"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
