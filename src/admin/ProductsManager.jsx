import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, firebaseEnabled } from "../firebase";
import {
  createProduct,
  deleteProduct,
  toggleProductActive,
  updateProduct,
} from "../services/products";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  size: "500 ml",
  image: "",
  cost: "",
  active: true,
};

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(firebaseEnabled);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!firebaseEnabled) return;
    const q = query(collection(db, "products"), orderBy("name"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Não foi possível carregar os produtos.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  if (!firebaseEnabled) {
    return (
      <Notice>
        Configure o Firebase para gerenciar o cardápio por aqui. Até lá, o
        site público continua usando o cardápio fixo em{" "}
        <code>src/data/products.js</code>.
      </Notice>
    );
  }

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      size: product.size || "500 ml",
      image: product.image || "",
      cost: product.cost ?? "",
      active: product.active !== false,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === "") {
      setError("Nome e preço são obrigatórios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Não foi possível salvar o produto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este produto definitivamente?")) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error(err);
      alert("Não foi possível excluir o produto.");
    }
  };

  const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecione uma imagem válida para o produto.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setError("");
    };
    reader.onerror = () => {
      setError("Não foi possível carregar a imagem selecionada.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-700 text-acai-900">Produtos</h1>
      <p className="mt-1 font-body text-sm text-ink/60">
        Produtos criados aqui aparecem automaticamente no cardápio público.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-card sm:grid-cols-2"
      >
        <TextField
          label="Nome"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        />
        <TextField
          label="Tamanho"
          value={form.size}
          onChange={(v) => setForm((f) => ({ ...f, size: v }))}
        />
        <TextField
          label="Preço de venda (R$)"
          type="number"
          value={form.price}
          onChange={(v) => setForm((f) => ({ ...f, price: v }))}
        />
        <TextField
          label="Custo do produto (R$) — opcional"
          type="number"
          value={form.cost}
          onChange={(v) => setForm((f) => ({ ...f, cost: v }))}
        />
        <div className="sm:col-span-2">
          <label className="font-body text-sm font-700 text-acai-900">
            Foto do produto
          </label>
          <input
            type="file"
            accept="image/*"
            className="input-field mt-1.5"
            onChange={(e) => handleImageFile(e.target.files?.[0])}
          />
          <p className="mt-1 font-body text-xs text-ink/60">
            Você pode enviar a foto diretamente aqui. Se preferir, também pode colar uma URL em campo abaixo.
          </p>
        </div>

        <TextField
          label="URL da imagem — opcional"
          value={form.image}
          onChange={(v) => setForm((f) => ({ ...f, image: v }))}
        />
        <label className="flex items-center gap-2 self-end pb-2 font-body text-sm font-700 text-acai-900">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
          />
          Ativo no cardápio público
        </label>
        <div className="sm:col-span-2">
          <label className="font-body text-sm font-700 text-acai-900">Descrição</label>
          <textarea
            className="input-field mt-1.5"
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        {form.image && (
          <div className="sm:col-span-2">
            <p className="font-body text-sm font-700 text-acai-900">Pré-visualização</p>
            <img
              src={form.image}
              alt="Pré-visualização do produto"
              className="mt-2 h-28 w-28 rounded-xl object-cover shadow-card"
            />
          </div>
        )}

        {error && (
          <p role="alert" className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar produto"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border-2 border-acai-200 px-6 py-3.5 font-display text-sm font-700 text-acai-700"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="font-body text-sm text-ink/60">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p className="font-body text-sm text-ink/60">Nenhum produto cadastrado ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-sm font-700 text-acai-900">
                    {p.name}{" "}
                    {p.active === false && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-700 text-red-600">
                        inativo
                      </span>
                    )}
                  </p>
                  <p className="font-body text-xs text-ink/60">
                    {p.size} · R$ {Number(p.price).toFixed(2).replace(".", ",")}
                    {p.cost != null ? ` · custo R$ ${Number(p.cost).toFixed(2).replace(".", ",")}` : " · custo não informado"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="rounded-full bg-acai-100 px-4 py-2 font-body text-xs font-700 text-acai-700"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleProductActive(p.id, p.active === false)}
                    className="rounded-full bg-sun-500 px-4 py-2 font-body text-xs font-700 text-acai-950"
                  >
                    {p.active === false ? "Ativar" : "Desativar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="rounded-full bg-red-50 px-4 py-2 font-body text-xs font-700 text-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="font-body text-sm font-700 text-acai-900">{label}</label>
      <input
        type={type}
        className="input-field mt-1.5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Notice({ children }) {
  return (
    <div className="rounded-2xl bg-acai-100 p-5 font-body text-sm text-acai-900">
      {children}
    </div>
  );
}
