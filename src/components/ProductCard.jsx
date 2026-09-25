import { useState } from "react";
import { BottleIcon } from "./Icons";

export default function ProductCard({ product, onAdd }) {
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setJustAdded(true);
    window.clearTimeout(handleAdd._t);
    handleAdd._t = window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-transform duration-200 hover:-translate-y-1">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-acai-100">
        {!imgError ? (
          <img
            src={product.image}
            alt={`Garrafa de ${product.name}, 500 ml`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-acai-300 to-acai-500 text-white">
            <BottleIcon className="h-10 w-10" />
            <span className="font-body text-xs font-700 uppercase tracking-wide">
              Foto em breve
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-sun-500 px-3 py-1 font-display text-xs font-700 text-acai-950">
          {product.size}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-700 text-acai-900">{product.name}</h3>
        <p className="mt-1 flex-1 font-body text-sm text-ink/70">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-800 text-acai-700">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            className={`rounded-full px-4 py-2.5 font-display text-sm font-700 transition-all duration-150 active:scale-95 ${
              justAdded
                ? "bg-leaf-500 text-white"
                : "bg-acai-600 text-white hover:bg-acai-700"
            }`}
          >
            {justAdded ? "Adicionado ✓" : "Adicionar ao pedido"}
          </button>
        </div>
      </div>
    </article>
  );
}
