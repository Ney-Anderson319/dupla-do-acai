import { BottleIcon, LeafIcon } from "./Icons";

function SparkIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
    </svg>
  );
}

function ChatIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 5h16v11H8l-4 4V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const items = [
  {
    icon: BottleIcon,
    title: "Açaí Artesanal",
    text: "Preparado com cuidado e atenção em cada pedido.",
  },
  {
    icon: LeafIcon,
    title: "Ingredientes Naturais",
    text: "Ingredientes selecionados para oferecer muito sabor.",
  },
  {
    icon: SparkIcon,
    title: "500 ml de Sabor",
    text: "Uma garrafa generosa para aproveitar seu açaí.",
  },
  {
    icon: ChatIcon,
    title: "Pedido Fácil",
    text: "Escolha seu sabor e finalize seu pedido pelo WhatsApp.",
  },
];

export default function Differentials() {
  return (
    <section>
      
    </section>
  );
}
