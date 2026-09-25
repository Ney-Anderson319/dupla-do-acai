import { useEffect, useState } from "react";
import { business } from "../data/business";
import { CartIcon, CloseIcon, MenuIcon } from "./Icons";
import LogoMark from "./LogoMark";

const links = [
  { href: "#cardapio", label: "Cardápio" },
  { href: "#como-funciona", label: "Como pedir" },
  { href: "#localizacao", label: "Onde entregamos" },
];

export default function Header({ totalItems, onOpenCart }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? "bg-acai-950/95 shadow-soft backdrop-blur" : "bg-transparent"
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between sm:h-20">
          <a href="#topo" className="flex items-center gap-2.5" aria-label="Dupla Do Açaí - início">
            <LogoMark className="h-12 w-auto sm:h-14" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-sm font-700 text-white/90 transition-colors hover:text-sun-400"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#pedido"
              className="hidden rounded-full bg-sun-500 px-5 py-2.5 font-display text-sm font-700 text-acai-950 transition-transform hover:bg-sun-400 active:scale-95 sm:inline-flex"
            >
              Pedir agora
            </a>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label={`Abrir carrinho, ${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
            >
              <CartIcon className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-leaf-500 text-[11px] font-800 text-white">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white lg:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 top-16 sm:top-20 z-30 bg-acai-950 transition-all duration-300 lg:hidden ${
          open ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0"
        }`}
      >
        <nav className="container-page flex flex-col gap-1 py-6" aria-label="Navegação mobile">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-4 font-display text-lg font-600 text-white transition-colors hover:bg-white/10"
            >
              {l.label}
            </a>
          ))}
          <a href="#pedido" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
            Pedir agora
          </a>
          
          <a 
          href="https://www.instagram.com/_ney_anderson/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 px-4 py-2 text-center font-body text-sm text-white/70"
          >
            © {new Date().getFullYear()} Ney Anderson Souza Gonçalves.
          </a>
        
          <a
            href={business.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-4 py-2 text-center font-body text-sm text-white/70"
          >
            {business.instagram.handle} no Instagram
          </a>
        </nav>
      </div>
    </>
  );
}