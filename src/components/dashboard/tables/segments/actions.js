import usePermissions from '@/hooks/usePermissions';
import {
  EyeIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  PrinterIcon,
  ArchiveBoxIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';

export default function Actions({
  isLocked,
  isLockedSale,
  info,
  view,
  setSelected,
  setSelectedState,
  handleDelete,
  setShowModalChangeAdvisor,
  handlePrintOrder,
  setHandleStateChange,
  setSelectedStateTermination,
  setCommentTarget,
}) {
  const {
    canAssign,
    canEdit,
    canDelete,
    canDoEverything,
    canEditPreApproved,
    canPreApproved,
    canEditApproved,
    canDeleteApproved,
    canPrinterApproved,
    canScheduleMotoDelivery,
    canMoveArchivedCustomers,
    canChangeStatusMotorcyclesScheduled,
    canChangeCustomerTermination,
    canCommentApproved,
  } = usePermissions();

  const ActionButton = ({ onClick, disabled, color, icon: Icon, tooltip }) => (
    <div className="relative group flex items-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`cursor-pointer ${
          disabled ? 'text-gray-400 cursor-not-allowed' : color
        }`}
      >
        <Icon className="w-5 h-5" />
      </button>

      <span className="absolute -top-15 left-1/3 -translate-x-1/2 scale-0 group-hover:scale-100 transition bg-black text-white text-xs rounded px-2 py-1">
        {tooltip}
      </span>
    </div>
  );

  const ActionLink = ({ href, disabled, color, icon: Icon, tooltip }) => (
    <div className="relative group flex items-center">
      {disabled ? (
        <button disabled className="text-gray-400 cursor-not-allowed">
          <Icon className="w-5 h-5" />
        </button>
      ) : (
        <Link href={href} className={`${color}`}>
          <Icon className="w-5 h-5" />
        </Link>
      )}

      <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition bg-black text-white text-xs rounded px-2 py-1">
        {tooltip}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center space-x-3">
      {canAssign && view === 'customers' && (
        <ActionButton
          onClick={() => setShowModalChangeAdvisor(info)}
          disabled={isLocked || isLockedSale}
          color="text-blue-500 hover:text-blue-700"
          icon={ArrowPathIcon}
          tooltip="Cambiar de asesor"
        />
      )}

      {view !== 'creditManagement' &&
        view !== 'motoForDelivery' &&
        view !== 'motorcyclesScheduled' && (
          <ActionButton
            onClick={() => setSelected(info)}
            disabled={isLocked || isLockedSale}
            color="text-blue-500 hover:text-blue-700"
            icon={EyeIcon}
            tooltip="Ver detalles"
          />
        )}

      {view === 'approved' && canCommentApproved && (
        <ActionButton
          onClick={() => setCommentTarget(info)}
          disabled={isLocked || isLockedSale}
          color="text-orange-500 hover:text-orange-700"
          icon={ChatBubbleLeftRightIcon}
          tooltip="Agregar comentario"
        />
      )}

      {(view === 'approved' || view === 'delivered') && canPrinterApproved && (
        <ActionButton
          onClick={() => handlePrintOrder(info)}
          disabled={isLocked || isLockedSale}
          color="text-purple-500 hover:text-purple-700"
          icon={PrinterIcon}
          tooltip="Orden de entrega"
        />
      )}

      {view !== 'motorcyclesScheduled' &&
        ((view === 'customers' &&
          (info.saleState !== 'APROBADO' || canEditApproved)) ||
          (view === 'advisors' && canEdit) ||
          (view === 'delivered' && canDoEverything) ||
          (view === 'preApproved' && canEditPreApproved) ||
          (view === 'approved' && canEditApproved)) && (
          <ActionLink
            href={`/CRM/dashboard/${view}/edit/${info.id}`}
            disabled={isLocked || isLockedSale}
            color="text-green-500 hover:text-green-700"
            icon={PencilIcon}
            tooltip="Editar"
          />
        )}

      {view !== 'creditManagement' &&
        view !== 'motoForDelivery' &&
        view !== 'motorcyclesScheduled' &&
        ((canDelete && view !== 'preApproved') ||
          (view === 'approved' && canDeleteApproved)) && (
          <ActionButton
            onClick={() => handleDelete(info.id, info.name, view)}
            disabled={isLocked || isLockedSale}
            color="text-red-500 hover:text-red-700"
            icon={TrashIcon}
            tooltip="Eliminar"
          />
        )}

      {view === 'creditManagement' && (
        <>
          <button
            onClick={() => setSelectedState({ ...info, action: 'En Curso' })}
            disabled={isLocked || isLockedSale}
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 cursor-pointer whitespace-nowrap"
          >
            EN CURSO
          </button>
          <button
            onClick={() => setSelectedState({ ...info, action: 'Aprobar' })}
            disabled={isLocked || isLockedSale}
            className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
          >
            APROBAR
          </button>

          <button
            onClick={() => setSelectedState({ ...info, action: 'Rechazar' })}
            disabled={isLocked || isLockedSale}
            className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
          >
            RECHAZAR
          </button>
        </>
      )}

      {view === 'motoForDelivery' && (
        <button
          onClick={() => setSelectedState({ ...info, action: 'Aprobar' })}
          disabled={isLocked || isLockedSale}
          className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
        >
          APROBAR
        </button>
      )}

      {view === 'motorcyclesScheduled' &&
        canChangeStatusMotorcyclesScheduled && (
          <>
            <button
              onClick={() => setSelectedState({ ...info, action: 'Entregar' })}
              disabled={isLocked || isLockedSale}
              className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
            >
              ENTREGAR
            </button>
            <button
              onClick={() => setSelectedState({ ...info, action: 'Rechazar' })}
              disabled={isLocked || isLockedSale}
              className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
            >
              RECHAZAR
            </button>
          </>
        )}

      {view === 'customerWarehouse' && (
        <button
          onClick={() => setSelectedState({ ...info, action: 'Restaurar' })}
          disabled={isLocked || isLockedSale}
          className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 cursor-pointer whitespace-nowrap"
        >
          RESTAURAR CLIENTE
        </button>
      )}

      {view === 'preApproved' && canPreApproved && (
        <>
          <button
            onClick={() => setSelectedState({ ...info, action: 'approve' })}
            disabled={isLocked || isLockedSale}
            className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
          >
            APROBAR
          </button>

          <button
            onClick={() => setSelectedState({ ...info, action: 'decline' })}
            disabled={isLocked || isLockedSale}
            className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
          >
            RECHAZAR
          </button>
        </>
      )}

      {view === 'approved' &&
        info.creditManagementStatus === 'APROBADO' &&
        info.motoForDeliveryStatus === 'APROBADO' &&
        canScheduleMotoDelivery &&
        (() => {
          const latestSchedule =
            info.deliverySchedules?.[info.deliverySchedules.length - 1];

          const isRejected =
            latestSchedule?.deliveryScheduleStatus === 'RECHAZADO';

          const isScheduled =
            latestSchedule &&
            latestSchedule.deliveryScheduleStatus !== 'RECHAZADO';

          const buttonLabel = isRejected
            ? 'REAGENDAR'
            : isScheduled
              ? 'AGENDADO'
              : 'PARA AGENDAR';

          const buttonStyle = isScheduled
            ? 'bg-blue-700 cursor-not-allowed opacity-80'
            : isRejected
              ? 'bg-orange-600 hover:bg-orange-700 cursor-pointer'
              : 'bg-green-600 hover:bg-green-700 cursor-pointer';

          return (
            <button
              onClick={() => !isScheduled && setSelectedState(info)}
              disabled={isLocked || isLockedSale || isScheduled}
              className={`text-white text-xs px-3 py-1 rounded whitespace-nowrap ${buttonStyle}`}
            >
              {buttonLabel}
            </button>
          );
        })()}

      {view === 'approved' && canChangeCustomerTermination && (
        <button
          onClick={() => setSelectedStateTermination(info)}
          disabled={isLocked || isLockedSale}
          className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
        >
          FINALIZAR
        </button>
      )}

      {canMoveArchivedCustomers && view === 'customers' && (
        <ActionButton
          onClick={() => setHandleStateChange(info)}
          disabled={isLocked || isLockedSale}
          color="text-blue-500 hover:text-blue-700"
          icon={ArchiveBoxIcon}
          tooltip="Archivar cliente"
        />
      )}
    </div>
  );
}
