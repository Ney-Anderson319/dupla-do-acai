import { useState } from "react";
import { getCurrentPosition } from "../utils/geolocation";
import { reverseGeocode } from "../services/geocoding";
import { matchServiceCity } from "../utils/location";

/**
 * Botão "Usar minha localização" + fluxo de confirmação.
 *
 * A localização SÓ é solicitada quando o cliente clica no botão — nunca
 * automaticamente. Se o cliente não quiser usar (ou não conseguir), o
 * formulário manual abaixo continua funcionando normalmente, sem
 * nenhuma etapa obrigatória de localização.
 */
export default function LocationAssist({ onApply }) {
  const [status, setStatus] = useState("idle"); // idle | locating | found | error
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { street, neighborhood, city, state, latitude, longitude }
  const [outsideArea, setOutsideArea] = useState(false);

  const handleUseLocation = async () => {
    setStatus("locating");
    setError("");
    setOutsideArea(false);

    try {
      const { latitude, longitude } = await getCurrentPosition();

      let address = null;
      try {
        address = await reverseGeocode(latitude, longitude);
      } catch (geoErr) {
        console.warn("Geocodificação reversa falhou, mantendo fallback manual:", geoErr);
        setResult({
          street: "",
          neighborhood: "",
          city: "",
          state: "",
          latitude,
          longitude,
          matchedCity: null,
        });
        setStatus("found");
        setError(
          "Localização obtida. Como o endereço não foi identificado automaticamente, você pode preencher manualmente os campos abaixo."
        );
        return;
      }

      const matchedCity = matchServiceCity(address.city);
      setOutsideArea(Boolean(address.city) && !matchedCity);

      setResult({ ...address, latitude, longitude, matchedCity });
      setStatus("found");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(err?.message || "Não foi possível obter sua localização.");
    }
  };

  const handleConfirm = () => {
    onApply(result);
    setStatus("idle");
  };

  const handleEdit = () => {
    // Preenche os campos para o cliente ajustar manualmente, sem perder
    // as coordenadas já obtidas.
    onApply(result);
    setStatus("idle");
  };

  return (
    <div className="rounded-2xl border border-dashed border-acai-300 bg-acai-100/30 p-4">
      {status !== "found" && (
        <button
          type="button"
          onClick={handleUseLocation}
          disabled={status === "locating"}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-acai-600 px-5 py-3 font-display text-sm font-700 text-white disabled:opacity-60"
        >
          📍 {status === "locating" ? "Localizando..." : "Usar minha localização"}
        </button>
      )}

      <p className="mt-2 text-center font-body text-xs text-ink/60">
        Ou, se preferir, informe seu endereço manualmente nos campos abaixo.
      </p>

      {status === "error" && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-600">
          {error}
        </p>
      )}

      {status === "found" && result && (
        <div className="mt-3 rounded-xl bg-white p-4">
          <p className="font-display text-sm font-700 text-acai-900">📍 Localização encontrada</p>
          <p className="mt-1 font-body text-sm text-ink/70">
            Endereço aproximado:{" "}
            {[result.street, result.neighborhood, result.city && `${result.city} - ${result.state}`]
              .filter(Boolean)
              .join(", ") || "não foi possível detalhar o endereço"}
          </p>

          {outsideArea && (
            <p className="mt-2 rounded-lg bg-sun-300/40 px-3 py-2 font-body text-xs text-acai-900">
              Identificamos que seu endereço pode estar fora da nossa área de
              entrega. Confira seu endereço ou entre em contato conosco.
            </p>
          )}

          <p className="mt-2 font-body text-sm font-700 text-acai-900">Essa localização está correta?</p>
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={handleConfirm} className="btn-primary flex-1 !py-2.5 text-sm">
              Sim, continuar
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="flex-1 rounded-full border-2 border-acai-300 px-4 py-2.5 font-display text-sm font-700 text-acai-700"
            >
              Editar endereço
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
