import { Roles } from '@/config/roles';
import usePermissions from '@/hooks/usePermissions';

export default function Thead({ rol, view }) {
  const { canViewAll, canAssign, canChangeStatusMotorcyclesScheduled } =
    usePermissions();

  return (
    <thead className="bg-gray-100 border-b border-gray-200">
      <tr>
        {view === 'advisors' && canViewAll && (
          <th className="px-4 py-3">Rol</th>
        )}

        {(view === 'approved' ||
          view === 'delivered' ||
          view === 'creditManagement' ||
          view === 'motoForDelivery' ||
          view === 'motorcyclesScheduled') && (
          <th className="px-4 py-3">Numero de Orden</th>
        )}

        {view === 'customers' && canAssign && (
          <th className="px-4 py-3 text-center">Asignar</th>
        )}

        {view === 'customers' && canViewAll && (
          <th className="px-4 py-3">Asesor</th>
        )}

        {(view === 'delivered' ||
          view === 'preApproved' ||
          view === 'approved' ||
          view === 'creditManagement' ||
          view === 'motoForDelivery' ||
          view === 'motorcyclesScheduled' ||
          view === 'customerWarehouse') &&
          rol !== Roles.ASESOR && <th className="px-4 py-3">Asesor</th>}

        <th className="px-4 py-3">Nombre</th>

        {view !== 'motorcyclesScheduled' && (
          <th className="px-4 py-3">Documento</th>
        )}

        {view === 'delivered' && (
          <>
            <th className="px-4 py-3">Fecha Entrega</th>
            <th className="px-4 py-3">Placa</th>
          </>
        )}

        {(view === 'creditManagement' ||
          view === 'motoForDelivery' ||
          view === 'motorcyclesScheduled' ||
          view === 'approved') && (
          <>
            <th className="px-4 py-3">Teléfono</th>
            <th className="px-4 py-3">Distribuidor</th>
          </>
        )}

        {(view === 'creditManagement' ||
          view === 'motoForDelivery' ||
          view === 'approved') && (
          <>
            <th className="px-4 py-3">Financiera</th>
          </>
        )}

        {view === 'creditManagement' && <th className="px-4 py-3">Estado</th>}

        {view !== 'creditManagement' &&
          view !== 'motoForDelivery' &&
          view !== 'motorcyclesScheduled' &&
          view !== 'approved' && (
            <>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Ciudad</th>
            </>
          )}

        {view === 'approved' && (
          <>
            <th className="px-4 py-3">Fecha Aprobación</th>
            <th className="px-4 py-3">Gestión de crédito</th>
            <th className="px-4 py-3">Moto para Entrega</th>
            <th className="px-4 py-3">Fecha para Entregar</th>
            <th className="px-4 py-3">Estado de Entregar</th>
          </>
        )}

        {(view === 'motoForDelivery' || view === 'motorcyclesScheduled') && (
          <th className="px-4 py-3">Referencia</th>
        )}

        {view === 'motorcyclesScheduled' && (
          <>
            <th className="px-4 py-3">Placa</th>
            <th className="px-4 py-3">Fecha Agendada</th>
            <th className="px-4 py-3">Hora Entrega</th>
            <th className="px-4 py-3">Dirección Entrega</th>
          </>
        )}

        {(view === 'customers' || view === 'preApproved') && (
          <th className="px-4 py-3">Estado Actual</th>
        )}

        {view === 'customerWarehouse' && (
          <>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Ultimo Estado Venta</th>
          </>
        )}

        {view === 'customers' && <th className="px-4 py-3">Estado Venta</th>}

        {view === 'delivered' && (
          <>
            <th className="px-4 py-3">Finalizado</th>
          </>
        )}

        {canChangeStatusMotorcyclesScheduled ? (
          <th className="px-4 py-3 text-center">Acciones</th>
        ) : (
          <th className="px-4 py-3 text-center"></th>
        )}
      </tr>
    </thead>
  );
}
