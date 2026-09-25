const steps = [
  {
    number: "1",
    title: "Escolha seu sabor",
    text: "Navegue pelo cardápio e veja todas as opções disponíveis.",
  },
  {
    number: "2",
    title: "Monte seu pedido",
    text: "Adicione as garrafas que quiser e ajuste as quantidades no carrinho.",
  },
  {
    number: "3",
    title: "Informe seus dados",
    text: "Preencha endereço e cidade de entrega: Redenção ou Acarape.",
  },
  {
    number: "4",
    title: "Finalize pelo WhatsApp",
    text: "Envie o pedido pronto direto para a Edna ou para a Patrícia.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <h2 className="section-heading">Como pedir?</h2>

        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <li
              key={step.number}
              className="relative rounded-3xl border border-acai-100 bg-acai-100/40 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-acai-600 font-display text-lg font-800 text-white">
                {step.number}
              </span>
              <h3 className="mt-4 font-display text-lg font-700 text-acai-900">
                {step.title}
              </h3>
              <p className="mt-1.5 font-body text-sm text-ink/70">{step.text}</p>

              {idx < steps.length - 1 && (
                <span
                  className="absolute -right-3 top-9 hidden text-2xl text-acai-300 sm:block lg:right-[-14px]"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
