import { business } from "../data/business";
import { PinIcon } from "./Icons";

export default function Location() {
  return (
    <section id="localizacao" className="bg-acai-950 py-20 text-white sm:py-28">
      <div className="container-page text-center">
        <h2 className="font-display text-3xl font-700 sm:text-4xl">
          Estamos em Redenção e Acarape!
        </h2>

        <div className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
          {business.cities.map((c) => (
            <div
              key={c.id}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-4"
            >
              <PinIcon className="h-5 w-5 text-sun-400" />
              <span className="font-display text-lg font-700">
                {c.name} - {c.state}
              </span>
            </div>
          ))}
        </div>

        <a href="#pedido" className="btn-primary mt-10 inline-flex">
          Quero pedir meu açaí
        </a>
      </div>
    </section>
  );
}
