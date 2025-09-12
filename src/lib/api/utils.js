export function normalizeDateToISO(input) {
  if (!input) return null;

  // Acepta dd/mm/yyyy o yyyy-mm-dd o formato Date-like
  if (input.includes('/')) {
    const parts = input.split('/').map((p) => p.trim());
    if (parts.length === 3) {
      const [d, m, y] = parts;
      const iso = `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(
        2,
        '0'
      )}`;
      const dt = new Date(iso);
      if (!isNaN(dt.getTime())) return dt.toISOString();
    }
    throw new Error('Formato de fecha inválido. Usa dd/mm/yyyy o ISO string');
  }

  const d = new Date(input);
  if (isNaN(d.getTime())) throw new Error('Fecha inválida');
  return d.toISOString();
}
