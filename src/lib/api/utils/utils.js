export function toFullISO(input) {
  if (!input) return null;

  if (typeof input === 'string' && input.includes('/')) {
    const [d, m, y] = input.split('/').map((p) => p.trim());
    const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    const dt = new Date(iso);
    return isNaN(dt.getTime()) ? null : dt.toISOString();
  }

  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function normalizeDateForInput(input) {
  if (!input) return '';

  const d = new Date(input);
  if (isNaN(d.getTime())) return '';

  return d.toISOString().split('T')[0];
}

export function formatPesosRealtime(value) {
  if (value === null || value === undefined) return '';

  const str = String(value);

  const clean = str.replace(/[^\d]/g, '');

  if (clean === '') return '';

  const number = parseInt(clean, 10);

  if (isNaN(number)) return '';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(number);
}

export function pesosToNumber(value) {
  if (!value) return 0;

  const str = String(value);
  const clean = str.replace(/[^\d]/g, '');
  return parseInt(clean || '0', 10);
}

export function formatEnumText(value, mode = 'capitalize') {
  if (!value) return '';

  const words = value.split('_');

  switch (mode) {
    case 'uppercase':
      return words.join(' ').toUpperCase();

    case 'lowercase':
      return words.join(' ').toLowerCase();

    case 'capitalize':
    default:
      return words
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
  }
}
