/**
 * Wrapper sobre a API nativa `navigator.geolocation`.
 *
 * Nunca é chamado automaticamente — só deve ser invocado a partir de uma
 * ação explícita do cliente (clique no botão "Usar minha localização").
 *
 * Faz até 2 tentativas:
 * 1) Alta precisão (GPS), com timeout curto — ideal quando o sinal de
 *    GPS é bom.
 * 2) Se a primeira falhar por demora ou indisponibilidade (não por
 *    permissão negada), tenta de novo com precisão menor (rede/Wi-Fi),
 *    timeout mais longo e aceitando uma localização em cache recente.
 *    Isso resolve aparelhos com GPS mais lento ou sinal fraco, que antes
 *    simplesmente falhavam na primeira tentativa sem nenhuma alternativa.
 */
function requestPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => reject(err),
      options
    );
  });
}

function toFriendlyError(err) {
  let message = "Não foi possível obter sua localização.";
  if (err?.code === err?.PERMISSION_DENIED) {
    message = "Você não permitiu o acesso à localização.";
  } else if (err?.code === err?.POSITION_UNAVAILABLE) {
    message = "Localização indisponível no momento.";
  } else if (err?.code === err?.TIMEOUT) {
    message = "Tempo esgotado ao tentar obter sua localização.";
  }
  return { code: err?.code ?? "unknown", message };
}

export async function getCurrentPosition() {
  if (!("geolocation" in navigator)) {
    throw { code: "unsupported", message: "Seu navegador não suporta localização automática." };
  }

  try {
    // Tentativa 1: alta precisão (GPS), com tolerância mínima de 1:30.
    return await requestPosition({ enableHighAccuracy: true, timeout: 90000, maximumAge: 0 });
  } catch (firstErr) {
    // Se o cliente negou a permissão, não adianta tentar de novo.
    if (firstErr?.code === firstErr?.PERMISSION_DENIED) {
      throw toFriendlyError(firstErr);
    }

    try {
      // Tentativa 2: precisão por rede/Wi‑Fi, com tolerância máxima de 2:00.
      return await requestPosition({ enableHighAccuracy: false, timeout: 120000, maximumAge: 120000 });
    } catch (secondErr) {
      throw toFriendlyError(secondErr);
    }
  }
}