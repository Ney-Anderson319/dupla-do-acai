/**
 * Utilitários de data/hora no fuso oficial de Brasília (America/Sao_Paulo).
 *
 * IMPORTANTE: nunca usar `new Date().getHours()` ou similar diretamente,
 * pois isso usa o fuso horário do dispositivo do cliente. Todas as
 * funções aqui derivam o horário de Brasília usando Intl.DateTimeFormat
 * com timeZone explícito, então funcionam corretamente mesmo se o
 * cliente estiver em outro fuso ou com o relógio do aparelho errado
 * quanto ao fuso (o relógio em si ainda precisa estar correto, mas o
 * FUSO usado para interpretar esse instante é sempre o de Brasília).
 */

export const TIME_ZONE = "America/Sao_Paulo";

const WEEKDAY_TO_KEY = {
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
  Sunday: "sunday",
};

function partsFor(date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const map = {};
  formatter.formatToParts(date).forEach((p) => {
    map[p.type] = p.value;
  });
  return map;
}

/**
 * Retorna o momento atual já decomposto no horário de Brasília.
 */
export function getBrasiliaNow(date = new Date()) {
  const p = partsFor(date);
  const hour = Number(p.hour === "24" ? "0" : p.hour);
  const minute = Number(p.minute);
  return {
    dayKey: WEEKDAY_TO_KEY[p.weekday],
    hour,
    minute,
    totalMinutes: hour * 60 + minute,
    dateStr: `${p.day}/${p.month}/${p.year}`,
    timeStr: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    isoDate: `${p.year}-${p.month}-${p.day}`,
  };
}

/**
 * Formata um Date/timestamp qualquer no horário de Brasília, para exibir
 * no painel administrativo (nunca no horário local do navegador do admin).
 */
export function formatBrasilia(date) {
  if (!date) return "";
  const p = partsFor(date instanceof Date ? date : date.toDate());
  return `${p.day}/${p.month}/${p.year} às ${p.hour}:${p.minute}`;
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

const DAY_LABELS = {
  monday: "segunda",
  tuesday: "terça",
  wednesday: "quarta",
  thursday: "quinta",
  friday: "sexta",
  saturday: "sábado",
  sunday: "domingo",
};

function formatOpenMessage(nextOpening) {
  if (!nextOpening) return "Pedidos encerrados no momento.";
  const { dayKey, time } = nextOpening;
  const dayLabel = DAY_LABELS[dayKey] || dayKey;
  return `Pedidos Fechados - Voltaremos ${dayLabel} às ${time}`;
}

function getNextOpening(businessHours, currentDayKey) {
  const orderedDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const startIndex = orderedDays.indexOf(currentDayKey);

  for (let offset = 0; offset < orderedDays.length; offset += 1) {
    const dayKey = orderedDays[(startIndex + offset) % orderedDays.length];
    const schedule = businessHours[dayKey];

    if (!schedule || !schedule.open || !schedule.start) continue;

    const now = getBrasiliaNow();
    const isToday = dayKey === currentDayKey;
    const startMinutes = toMinutes(schedule.start);

    if (isToday && now.totalMinutes >= startMinutes) {
      continue;
    }

    return { dayKey, time: schedule.start };
  }

  return null;
}

/**
 * Calcula se a loja está aberta agora, considerando o horário de
 * funcionamento configurado (por dia da semana) e o instante atual em
 * Brasília. Suporta horários que passam da meia-noite (ex: 18:00–00:30).
 */
export function getStoreStatus(businessHours) {
  const now = getBrasiliaNow();

  if (!businessHours) {
    return {
      isOpen: false,
      message: "Horário de funcionamento não configurado.",
      now,
    };
  }

  const today = businessHours[now.dayKey];

  if (!today || !today.open || !today.start || !today.end) {
    const nextOpening = getNextOpening(businessHours, now.dayKey);
    return {
      isOpen: false,
      message: formatOpenMessage(nextOpening),
      nextOpening,
      now,
    };
  }

  const start = toMinutes(today.start);
  const end = toMinutes(today.end);

  let isOpen;
  if (end > start) {
    isOpen = now.totalMinutes >= start && now.totalMinutes < end;
  } else {
    // horário atravessa a meia-noite (ex: 18:00 às 00:30)
    isOpen = now.totalMinutes >= start || now.totalMinutes < end;
  }

  if (isOpen) {
    return {
      isOpen: true,
      message: `Pedidos abertos até ${today.end}`,
      closingTime: today.end,
      nextOpening: { dayKey: now.dayKey, time: today.start },
      now,
    };
  }

  const nextOpening = getNextOpening(businessHours, now.dayKey) || { dayKey: now.dayKey, time: today.start };

  return {
    isOpen: false,
    message: formatOpenMessage(nextOpening),
    closingTime: today.end,
    nextOpening,
    now,
  };
}
