/**
 * Geocodificação reversa gratuita via Nominatim (OpenStreetMap).
 *
 * Só é chamado uma vez, sob demanda, depois que o cliente clica em
 * "Usar minha localização" — nunca em loop, nunca automaticamente.
 */
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const REQUEST_TIMEOUT_MS = 60000;

export async function reverseGeocode(latitude, longitude) {
  const url = `${NOMINATIM_URL}?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=pt-BR`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } catch (err) {
    // Antes, uma conexão móvel instável podia deixar essa chamada
    // "pendurada" pra sempre, sem nunca cair no aviso de erro. Agora,
    // depois de 8s sem resposta, cai no fallback manual normalmente.
    if (err.name === "AbortError") {
      throw new Error("O serviço de localização demorou demais para responder.");
    }
    throw new Error("Não foi possível conectar ao serviço de localização.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    // Um 403/429 aqui costuma ser o limite de uso do Nominatim (comum
    // quando várias pessoas da mesma operadora saem pela mesma internet/IP).
    // Não tem como evitar 100% sendo um serviço gratuito, mas cai direto
    // no preenchimento manual, sem travar o pedido.
    throw new Error(`Serviço de geocodificação indisponível (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (!data || data.error) {
    throw new Error("Endereço não encontrado para essa localização.");
  }

  const addr = data.address || {};
  return {
    street: addr.road || addr.pedestrian || "",
    neighborhood: addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || "",
    city: addr.city || addr.town || addr.village || addr.municipality || "",
    state: addr.state || "",
    displayName: data.display_name || "",
  };
}