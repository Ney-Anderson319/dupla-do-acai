import { LeafIcon } from "./Icons";
import StoreStatusBadge from "./StoreStatusBadge";

const highlights = [
  { label: "500 ml", detail: "por garrafa" },
  { label: "Artesanal", detail: "feito com cuidado" },
  { label: "Área de Entrega", detail: "Redenção e Acarape" },
];

export default function Hero({ enforced, status }) {
  return (
    <section
      id="topo"
      className="relative overflow-hidden bg-gradient-to-b from-acai-950 via-acai-800 to-acai-600 pb-20 pt-28 text-white sm:pb-28 sm:pt-36"
    >
      {/* Folhas decorativas flutuantes, sutis, não literais */}
      <LeafIcon className="absolute -left-4 top-24 h-16 w-16 text-leaf-500/30 animate-floatSlow" />
      <LeafIcon className="absolute right-2 top-40 hidden h-24 w-24 rotate-45 text-leaf-500/20 sm:block animate-floatSlow" />
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-blob bg-sun-500/20 blur-2xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <StoreStatusBadge enforced={enforced} status={status} className="mb-4" />
          <p className="font-body text-sm font-700 uppercase tracking-wide text-sun-300">
            Açaí na garrafa
          </p>
          <h1 className="mt-3 font-display text-4xl font-800 leading-[1.05] sm:text-5xl md:text-6xl">
            Dupla Do Açaí
          </h1>
          <p className="mt-4 max-w-md font-display text-xl font-600 text-sun-300 sm:text-2xl">
            Sabor e energia para o seu dia!
          </p>
          <p className="mt-4 max-w-md font-body text-base text-white/85 sm:text-lg">
            Açaí artesanal na garrafa, preparado com carinho para deixar seu
            dia ainda mais gostoso.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#pedido" className="btn-primary">
              Pedir agora
            </a>
            <a href="#cardapio" className="btn-secondary">
              Ver cardápio
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-2xl bg-white/10 px-3 py-3 text-center backdrop-blur-sm"
              >
                <dt className="font-display text-sm font-700 text-sun-300 sm:text-base">
                  {h.label}
                </dt>
                <dd className="mt-0.5 font-body text-xs text-white/75">{h.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Ilustração da garrafa de açaí, feita em SVG (sem foto real disponível) */}
        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md" aria-hidden="true">
          <div className="absolute inset-0 rounded-blob bg-gradient-to-br from-sun-500/30 to-leaf-500/20 blur-3xl" />

          <span className="absolute -left-2 top-6 z-10 -rotate-6 rounded-md bg-sun-500 px-3 py-1.5 font-display text-sm font-800 text-acai-950 shadow-card sm:text-base">
            Peça já!
          </span>
          <svg viewBox="0 0 320 420" className="relative w-full drop-shadow-2xl">
            <defs>
              <linearGradient id="acaiFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A2BA3" />
                <stop offset="100%" stopColor="#3A0F52" />
              </linearGradient>
            </defs>
            {/* corpo da garrafa */}
            <path
              d="M110 60h100v40c0 12 5 23 14 31 18 17 28 40 28 65v170c0 20-16 36-36 36H104c-20 0-36-16-36-36V196c0-25 10-48 28-65 9-8 14-19 14-31V60Z"
              fill="url(#acaiFill)"
            />
            {/* gotejamento cremoso, como na identidade original */}
            <path
              d="M148 150c4 20-6 30-2 50s14 24 10 44-8 26-4 46"
              stroke="#FFFBF3"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M180 150c-4 24 8 32 4 54s-12 24-8 46 6 24 2 40"
              stroke="#FFFBF3"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            {/* tampa */}
            <rect x="120" y="30" width="80" height="30" rx="8" fill="#2F7A34" />
            <rect x="120" y="30" width="80" height="10" rx="4" fill="#4C9A4A" />
            {/* rótulo */}
            <rect x="88" y="230" width="144" height="110" rx="20" fill="#FFFBF3" />
            <text
              x="160"
              y="278"
              textAnchor="middle"
              fontFamily="Baloo 2, sans-serif"
              fontWeight="700"
              fontSize="22"
              fill="#3A0F52"
            >
              Dupla do
            </text>
            <text
              x="160"
              y="306"
              textAnchor="middle"
              fontFamily="Baloo 2, sans-serif"
              fontWeight="700"
              fontSize="26"
              fill="#7A2BA3"
            >
              Açaí
            </text>
            <text
              x="160"
              y="328"
              textAnchor="middle"
              fontFamily="Nunito Sans, sans-serif"
              fontWeight="700"
              fontSize="13"
              fill="#4C9A4A"
            >
            </text>
            {/* folhas decorativas */}
            <path
              d="M256 96c22-6 40 4 46 22-22 6-40-4-46-22Z"
              fill="#4C9A4A"
            />
            <path d="M64 100c-22-6-40 4-46 22 22 6 40-4 46-22Z" fill="#8FC98D" />

            {/* cacho de açaí decorativo */}
            <g transform="translate(40,340)">
              <circle cx="0" cy="10" r="14" fill="#3A0F52" />
              <circle cx="18" cy="0" r="14" fill="#5E1D80" />
              <circle cx="22" cy="24" r="13" fill="#3A0F52" />
              <circle cx="4" cy="34" r="12" fill="#5E1D80" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
