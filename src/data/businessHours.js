/**
 * Estrutura padrão de horário de funcionamento.
 *
 * ATENÇÃO: os horários abaixo são APENAS um exemplo de estrutura,
 * usados como fallback enquanto o administrador não configurar o
 * horário real em /admin/horarios (ou enquanto o Firebase não estiver
 * conectado). NÃO representam o horário real da Dupla Do Açaí.
 *
 * Assim que o Firebase estiver configurado, o valor real deve ser
 * definido pelo administrador em "Configurações da loja" — o site
 * público passa a consultar o documento `settings/businessHours` do
 * Firestore automaticamente.
 */
export const defaultBusinessHours = {
  monday: { open: false, start: "18:00", end: "23:00" },
  tuesday: { open: false, start: "18:00", end: "23:00" },
  wednesday: { open: false, start: "18:00", end: "23:00" },
  thursday: { open: false, start: "18:00", end: "23:00" },
  friday: { open: false, start: "18:00", end: "23:00" },
  saturday: { open: false, start: "18:00", end: "23:00" },
  sunday: { open: false, start: "18:00", end: "23:00" },
};

export const weekDays = [
  { key: "monday", label: "Segunda-feira" },
  { key: "tuesday", label: "Terça-feira" },
  { key: "wednesday", label: "Quarta-feira" },
  { key: "thursday", label: "Quinta-feira" },
  { key: "friday", label: "Sexta-feira" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];
