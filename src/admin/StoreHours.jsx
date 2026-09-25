import { useEffect, useState } from "react";
import { weekDays } from "../data/businessHours";
import { useBusinessHours } from "../hooks/useBusinessHours";
import { saveBusinessHours } from "../services/settings";
import { firebaseEnabled } from "../firebase";

export default function StoreHours() {
  const { hours: liveHours, loading } = useBusinessHours();
  const [hours, setHours] = useState(liveHours);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Sincroniza com o Firestore assim que carregar, sem sobrescrever
  // edições que o admin já tenha começado a fazer.
  useEffect(() => {
    if (!dirty && !loading) {
      setHours(liveHours);
    }
  }, [liveHours, loading, dirty]);

  const updateDay = (day, patch) => {
    setDirty(true);
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await saveBusinessHours(hours);
      setDirty(false);
      setMessage("Horário salvo! O site público já reflete essa alteração.");
    } catch (err) {
      console.error(err);
      setMessage("Não foi possível salvar o horário. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (!firebaseEnabled) {
    return (
      <Notice>
        Configure o Firebase para definir o horário de funcionamento e
        liberar/bloquear pedidos automaticamente.
      </Notice>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-700 text-acai-900">
        Horário de funcionamento
      </h1>
      <p className="mt-1 font-body text-sm text-ink/60">
        Fora desse horário, o site continua visível mas o botão de finalizar
        pedido fica bloqueado.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {weekDays.map(({ key, label }) => {
          const day = hours[key] || { open: false, start: "18:00", end: "23:00" };
          return (
            <div
              key={key}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-card"
            >
              <label className="flex w-40 items-center gap-2 font-body text-sm font-700 text-acai-900">
                <input
                  type="checkbox"
                  checked={day.open}
                  onChange={(e) => updateDay(key, { open: e.target.checked })}
                />
                {label}
              </label>

              <div className="flex items-center gap-2">
                <span className="font-body text-xs text-ink/60">Abre</span>
                <input
                  type="time"
                  value={day.start}
                  disabled={!day.open}
                  onChange={(e) => updateDay(key, { start: e.target.value })}
                  className="input-field w-auto"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-xs text-ink/60">Fecha</span>
                <input
                  type="time"
                  value={day.end}
                  disabled={!day.open}
                  onChange={(e) => updateDay(key, { end: e.target.value })}
                  className="input-field w-auto"
                />
              </div>
            </div>
          );
        })}
      </div>

      {message && (
        <p className="mt-4 rounded-xl bg-acai-100 px-4 py-3 font-body text-sm text-acai-900">
          {message}
        </p>
      )}

      <button type="button" onClick={handleSave} disabled={saving} className="btn-primary mt-6">
        {saving ? "Salvando..." : "Salvar horário"}
      </button>
    </div>
  );
}

function Notice({ children }) {
  return (
    <div className="rounded-2xl bg-acai-100 p-5 font-body text-sm text-acai-900">{children}</div>
  );
}
