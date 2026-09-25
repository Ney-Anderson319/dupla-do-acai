import { business } from "../data/business";
import { InstagramIcon, WhatsAppIcon } from "./Icons";
import LogoMark from "./LogoMark";

export default function Footer() {
  const handleAdminLinkClick = (event) => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      event.preventDefault();
      window.location.assign("/admin");
    }
  };

  return (
    <footer className="bg-acai-950 py-12 text-white/80">
      <div className="container-page grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <LogoMark className="h-14 w-auto" />
          <p className="mt-2 font-body text-sm">{business.slogan}</p>
        </div>

        <div>
          <p className="font-display text-sm font-700 text-sun-300">Atendimento</p>
          <ul className="mt-2 flex flex-col gap-1 font-body text-sm">
            {business.cities.map((c) => (
              <li key={c.id}>
                {c.name} - {c.state}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-700 text-sun-300">WhatsApp</p>
          <ul className="mt-2 flex flex-col gap-1 font-body text-sm">
            <li>
              <a
                href={`https://wa.me/${business.whatsapp.edna.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4" /> Edna: {business.whatsapp.edna.displayPhone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${business.whatsapp.patricia.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4" /> Patrícia: {business.whatsapp.patricia.displayPhone}
              </a>
            </li>
          </ul>
          <a
            href={business.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 font-body text-sm hover:text-white"
          >
            <InstagramIcon className="h-4 w-4" /> {business.instagram.handle}
          </a>
        </div>

        <div>
          <p className="font-display text-sm font-700 text-sun-300">Links</p>
          <ul className="mt-2 flex flex-col gap-1 font-body text-sm">
            <li>
              <a href="#topo" className="hover:text-white">
                Início
              </a>
            </li>
            <li>
              <a href="#cardapio" className="hover:text-white">
                Cardápio
              </a>
            </li>
            <li>
              <a href="#como-funciona" className="hover:text-white">
                Como pedir
              </a>
            </li>
            <li>
              <a href="#pedido" className="hover:text-white">
                Contato
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="container-page mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-6 font-body text-xs text-white/50">
        <span>
          <a href="https://www.instagram.com/_ney_anderson/" target="_blank" rel="noopener noreferrer">
            © {new Date().getFullYear()} Ney Anderson Souza Gonçalves.
          </a>
        </span>
        {/*
          Link discreto para o painel administrativo. Necessário porque,
          com o app instalado (modo PWA/standalone), não existe barra de
          endereço para digitar "/admin" manualmente. O acesso continua
          protegido por login — este link só facilita chegar até a tela
          de login.
        */}
        <a
          href="/admin"
          onClick={handleAdminLinkClick}
          className="inline-flex items-center rounded-full bg-sun-500 px-4 py-2 font-display text-xs font-700 text-acai-950 shadow-soft transition-transform hover:bg-sun-400 active:scale-95"
        >
          Painel administrativo
        </a>
      </p>
    </footer>
  );
}
