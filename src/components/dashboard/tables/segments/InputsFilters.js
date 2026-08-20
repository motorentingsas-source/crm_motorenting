import usePermissions from '@/hooks/usePermissions';
import SearchFilter from './inputSearch/searchFilter';
import { Roles } from '@/config/roles';
import {
  UNASSIGNED_ADVISOR,
  SALE_STATE_OPTIONS,
  TERMINATION_STATUS_OPTIONS,
  CREDIT_MANAGEMENT_OPTIONS,
  CREDIT_MANAGEMENT_PENDING_OPTIONS,
  MOTO_FOR_DELIVERY_OPTIONS,
  ROLE_OPTIONS,
  DISTRIBUTOR_OPTIONS,
  FINANCIAL_ENTITY_OPTIONS,
} from '@/lib/api/listData/filterOptions';

const INPUT_CLASS =
  'w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white';

/**
 * Fila de filtros de la tabla.
 *
 * IMPORTANTE: el orden y el número de celdas de esta fila tiene que coincidir
 * exactamente con el de `thead.js` para cada vista. Las entradas con
 * `spacer: true` son columnas que no se pueden filtrar y solo mantienen la
 * alineación.
 */
export default function InputFilters({
  rol,
  view,
  filters,
  advisors = [],
  handleFilterChange,
}) {
  const { canViewAll, canAssign } = usePermissions();

  // En Clientes el asesor se elige de una lista, para poder pedir
  // explícitamente los que aún no tienen asesor asignado.
  //
  // Los roles que no pueden consultar el listado de usuarios (AUXILIAR,
  // EJECUTIVO_FINANCIERO, COORDINADOR_DE_ENTREGA) se quedan con la caja de
  // texto de siempre; ahí también funciona escribir "sin asignar".
  const advisorIsSelect = view === 'customers' && advisors.length > 0;

  const advisorOptions = [
    { value: UNASSIGNED_ADVISOR, label: 'Sin asignar' },
    ...advisors.map((a) => ({ value: a.name, label: a.name })),
  ];

  const allFilters = [
    {
      key: 'orderNumber',
      name: 'orderNumber',
      title: 'Numero de Orden',
      show:
        view === 'approved' ||
        view === 'delivered' ||
        view === 'creditManagement' ||
        view === 'motoForDelivery' ||
        view === 'motorcyclesScheduled',
    },
    {
      key: 'advisor',
      name: 'advisor',
      title: 'Asesor',
      ...(advisorIsSelect
        ? { type: 'select', options: advisorOptions }
        : {}),
      show:
        ((canViewAll && view === 'customers') ||
          view === 'delivered' ||
          view === 'preApproved' ||
          view === 'approved' ||
          view === 'creditManagement' ||
          view === 'motoForDelivery' ||
          view === 'motorcyclesScheduled' ||
          view === 'customerWarehouse') &&
        rol !== Roles.ASESOR,
    },
    {
      key: 'role',
      name: 'role',
      title: 'Rol',
      show: view === 'advisors' && canViewAll,
      type: 'select',
      options: ROLE_OPTIONS,
    },
    { key: 'name', name: 'name', title: 'Nombre', show: true },
    {
      key: 'document',
      name: 'document',
      title: 'Documento',
      show: view !== 'motorcyclesScheduled',
    },
    {
      key: 'deliveryDate',
      name: 'deliveryDate',
      title: 'Fecha de Entrega',
      show: view === 'delivered',
      type: 'date',
    },
    {
      key: 'plate-delivered',
      name: 'plate',
      title: 'Placa',
      show: view === 'delivered',
    },
    {
      key: 'email',
      name: 'email',
      title: 'Correo',
      show:
        view !== 'creditManagement' &&
        view !== 'motoForDelivery' &&
        view !== 'motorcyclesScheduled' &&
        view !== 'approved',
    },
    { key: 'phone', name: 'phone', title: 'Teléfono', show: true },
    {
      key: 'city',
      name: 'city',
      title: 'Ciudad',
      show:
        view !== 'creditManagement' &&
        view !== 'motoForDelivery' &&
        view !== 'motorcyclesScheduled' &&
        view !== 'approved',
    },
    {
      key: 'distributor',
      name: 'distributor',
      title: 'Distribuidor',
      show:
        view === 'creditManagement' ||
        view === 'motoForDelivery' ||
        view === 'motorcyclesScheduled' ||
        view === 'approved',
      type: 'select',
      options: DISTRIBUTOR_OPTIONS,
    },
    {
      key: 'financialEntity',
      name: 'financialEntity',
      title: 'Financiera',
      show:
        view === 'creditManagement' ||
        view === 'motoForDelivery' ||
        view === 'approved',
      type: 'select',
      options: FINANCIAL_ENTITY_OPTIONS,
    },
    {
      key: 'creditManagementStatus',
      name: 'creditManagementStatus',
      title: 'Estado de Gestión de Crédito',
      show: view === 'creditManagement',
      type: 'select',
      options: CREDIT_MANAGEMENT_PENDING_OPTIONS,
    },
    {
      key: 'reference',
      name: 'reference',
      title: 'Referencia',
      show: view === 'motoForDelivery' || view === 'motorcyclesScheduled',
    },
    {
      key: 'approvalDate',
      name: 'approvalDate',
      title: 'Fecha de Aprobación',
      show: view === 'approved',
      type: 'date',
    },
    {
      key: 'creditManagement',
      name: 'creditManagement',
      title: 'Gestión de crédito',
      show: view === 'approved',
      type: 'select',
      options: CREDIT_MANAGEMENT_OPTIONS,
    },
    {
      key: 'motoForDelivery',
      name: 'motoForDelivery',
      title: 'Moto para Entrega',
      show: view === 'approved',
      type: 'select',
      options: MOTO_FOR_DELIVERY_OPTIONS,
    },
    // Aprobados: "Fecha para Entregar" y "Estado de Entregar" salen del
    // agendamiento y no se filtran; las celdas mantienen la alineación.
    { key: 'approved-spacer-1', show: view === 'approved', spacer: true },
    { key: 'approved-spacer-2', show: view === 'approved', spacer: true },
    {
      key: 'plate-scheduled',
      name: 'plate',
      title: 'Placa',
      show: view === 'motorcyclesScheduled',
    },
    {
      key: 'scheduledDate',
      name: 'scheduledDate',
      title: 'Fecha Agendada',
      show: view === 'motorcyclesScheduled',
      type: 'date',
    },
    {
      key: 'scheduledTime',
      name: 'scheduledTime',
      title: 'Hora Entrega',
      show: view === 'motorcyclesScheduled',
      type: 'time',
    },
    {
      key: 'address',
      name: 'address',
      title: 'Direccion Entrega',
      show: view === 'motorcyclesScheduled',
    },
    {
      key: 'state',
      name: 'state',
      title: 'Estado',
      show: view === 'customers' || view === 'customerWarehouse',
    },
    {
      key: 'saleState',
      name: 'saleState',
      title: 'Estado Venta',
      show:
        view === 'customers' ||
        view === 'preApproved' ||
        view === 'customerWarehouse',
      type: 'select',
      options: SALE_STATE_OPTIONS,
    },
    {
      key: 'terminationStatus',
      name: 'terminationStatus',
      title: 'Finalizado',
      show: view === 'delivered',
      type: 'select',
      options: TERMINATION_STATUS_OPTIONS,
    },
  ];

  return (
    <tr>
      {canAssign && view === 'customers' && <th></th>}

      {allFilters
        .filter((f) => f.show)
        .map(({ key, name, title, spacer, type = 'text', options = [] }) =>
          spacer ? (
            <th key={key} className="px-4 py-2"></th>
          ) : (
            <th key={key} className="px-4 py-2">
              <SearchFilter
                name={name}
                title={title}
                type={type}
                options={options}
                value={filters[name] || ''}
                className={INPUT_CLASS}
                handleFilterChange={handleFilterChange}
              />
            </th>
          )
        )}

      <th></th>
    </tr>
  );
}
