import { DISTRIBUTORS_LIST } from './distributors';
import { FINANCIALS_LIST } from './financials';
import { formatEnumText } from '../utils/utils';

/** Convierte una lista de valores de enum en opciones legibles para un <select>. */
export const toOptions = (values) =>
  values.map((value) => ({ value, label: formatEnumText(value) }));

export const SALE_STATE_OPTIONS = [
  { value: 'PENDIENTE_POR_APROBAR', label: 'Pendiente por aprobar' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'RECHAZADO', label: 'Rechazado' },
  { value: 'NA', label: 'No aplica' },
];

export const TERMINATION_STATUS_OPTIONS = [
  { value: 'NA', label: 'No aplica' },
  { value: 'CLAUSULA', label: 'Cláusula' },
  { value: 'DESISTE', label: 'Desiste' },
];

/** Estados de gestión de crédito visibles en Aprobados (allí sí aparece APROBADO). */
export const CREDIT_MANAGEMENT_OPTIONS = [
  { value: 'NA', label: 'No aplica' },
  { value: 'EN_CURSO', label: 'En curso' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'RECHAZADO', label: 'Rechazado' },
];

/** La vista de Gestión de Crédito excluye los aprobados: no se ofrecen. */
export const CREDIT_MANAGEMENT_PENDING_OPTIONS = [
  { value: 'NA', label: 'No aplica' },
  { value: 'EN_CURSO', label: 'En curso' },
  { value: 'RECHAZADO', label: 'Rechazado' },
];

export const MOTO_FOR_DELIVERY_OPTIONS = [
  { value: 'NA', label: 'No aplica' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'RECHAZADO', label: 'Rechazado' },
];

/** Motos para Entrega excluye los aprobados. */
export const MOTO_FOR_DELIVERY_PENDING_OPTIONS = [
  { value: 'NA', label: 'No aplica' },
  { value: 'RECHAZADO', label: 'Rechazado' },
];

export const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'COORDINADOR', label: 'Coordinador' },
  { value: 'ASESOR', label: 'Asesor' },
  { value: 'AUXILIAR', label: 'Auxiliar' },
  { value: 'EJECUTIVO_FINANCIERO', label: 'Ejecutivo Financiero' },
  { value: 'COORDINADOR_DE_ENTREGA', label: 'Coordinador de Entrega' },
];

export const DISTRIBUTOR_OPTIONS = toOptions(DISTRIBUTORS_LIST);

export const FINANCIAL_ENTITY_OPTIONS = toOptions(FINANCIALS_LIST);
