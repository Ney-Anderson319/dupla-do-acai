import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function Menu({ onAdd }) {
  const { products } = useProducts();

  return (
    <section id="cardapio" className="bg-cream py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-xl">
          <span className="inline-block rotate-[-1.5deg] rounded-lg bg-berry-600 px-4 py-1.5 font-display text-sm font-700 uppercase tracking-wide text-white">
            Nosso Cardápio
          </span>
          <h2 className="mt-3 section-heading">Escolha seus sabores favoritos!</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}
