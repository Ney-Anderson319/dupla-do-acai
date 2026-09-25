import { CartIcon, CloseIcon } from "./Icons";

export default function CartDrawer({
  open,
  onClose,
  items,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  totalPrice,
}) {
  return (
    <>
      {/* Fundo escurecido */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de pedido"
      >
        <div className="flex items-center justify-between border-b border-acai-100 px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-700 text-acai-900">
            <CartIcon className="h-5 w-5" /> Seu pedido
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-acai-700 hover:bg-acai-100"
            aria-label="Fechar carrinho"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="scroll-thin flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center font-body text-sm text-ink/60">
              Seu carrinho está vazio. Adicione um sabor no cardápio!
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl border border-acai-100 p-3 animate-popIn"
                >
                  <div className="flex-1">
                    <p className="font-display text-sm font-700 text-acai-900">
                      {product.name}
                    </p>
                    <p className="font-body text-xs text-ink/60">
                      {product.size} · R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDecrement(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-acai-100 font-700 text-acai-700 hover:bg-acai-300"
                        aria-label={`Diminuir quantidade de ${product.name}`}
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-body text-sm font-700">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncrement(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-acai-100 font-700 text-acai-700 hover:bg-acai-300"
                        aria-label={`Aumentar quantidade de ${product.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="font-display text-sm font-700 text-acai-700">
                      R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(product.id)}
                      className="font-body text-xs text-red-500 underline-offset-2 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-acai-100 px-5 py-4">
            <div className="flex items-center justify-between font-body text-sm text-ink/70">
              <span>Total</span>
              <span className="font-display text-xl font-800 text-acai-900">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <a
              href="#pedido"
              onClick={onClose}
              className="btn-primary mt-4 w-full"
            >
              Finalizar pedido
            </a>
            <button
              type="button"
              onClick={onClear}
              className="mt-2 w-full rounded-full py-2 font-body text-xs text-ink/60 hover:text-red-500"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
