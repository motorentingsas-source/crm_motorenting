import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

export function formatDateTime(date, pattern = "dd 'de' MMMM yyyy") {
  if (!date) return '---';

  try {
    const timeZone = 'America/Bogota';

    const zonedDate = toZonedTime(new Date(date), timeZone);

    return format(zonedDate, pattern, {
      locale: es,
    });
  } catch {
    return '---';
  }
}
