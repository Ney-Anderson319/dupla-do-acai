import { business } from "../data/business";

   function normalize(str) {
  try {
    return (str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  } catch {
    // Alguns navegadores/WebViews antigos (comuns em Android mais
    // desatualizados) não têm String.prototype.normalize — sem essa
    // proteção, isso derrubava a comparação de cidade mesmo quando a
    // localização já tinha sido obtida com sucesso.
    return (str || "").toLowerCase().trim();
  }
}

/**
 * Verifica se um nome de cidade (vindo do reverse geocoding) corresponde
 * a alguma das cidades atendidas. Retorna o objeto da cidade encontrada
 * ou `null`. Nunca bloqueia o pedido — é só um alerta informativo.
 */
export function matchServiceCity(cityName) {
  if (!cityName) return null;
  const target = normalize(cityName);
  return business.cities.find((c) => normalize(c.name) === target) || null;
}

/** Link gratuito (sem API/chave) para visualizar um ponto no mapa. */
export function buildViewLocationUrl(latitude, longitude) {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`;
}

/** Link gratuito para abrir rota até o ponto (usa o app de mapas do celular do admin). */
export function buildRouteUrl(latitude, longitude) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
