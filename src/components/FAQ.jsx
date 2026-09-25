import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { ChevronDownIcon } from "./Icons";

const staticFaqs = [
  {
    question: "Qual o tamanho das garrafas?",
    answer: "As garrafas disponíveis atualmente são de 500 ml.",
  },
  {
    question: "Qual o valor?",
    answer: "Os sabores do cardápio estão disponíveis por R$ 15,00.",
  },
  {
    question: "Onde vocês entregam?",
    answer: "Atendemos Redenção e Acarape, no Ceará.",
  },
  {
    question: "Como faço meu pedido?",
    answer: "Escolha seus produtos no site e finalize o pedido pelo WhatsApp.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const { products } = useProducts();

  const faqs = [
    ...staticFaqs,
    {
      question: "Quais sabores estão disponíveis?",
      answer: products.map((p) => p.name).join(", ") + ".",
    },
  ];

  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      
    </section>
  );
}
