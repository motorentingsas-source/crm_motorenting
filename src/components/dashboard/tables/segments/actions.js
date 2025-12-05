import usePermissions from '@/hooks/usePermissions';
import {
  EyeIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
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

      <ActionButton
        onClick={() => setSelected(info)}
        disabled={isLocked || isLockedSale}
        color="text-blue-500 hover:text-blue-700"
        icon={EyeIcon}
        tooltip="Ver detalles"
      />

      {(view === 'customers' ||
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

      {((canDelete && view !== 'preApproved') ||
        (view === 'approved' && canDeleteApproved)) && (
        <ActionButton
          onClick={() => handleDelete(info.id, info.name, view)}
          disabled={isLocked || isLockedSale}
          color="text-red-500 hover:text-red-700"
          icon={TrashIcon}
          tooltip="Eliminar"
        />
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
    </div>
  );
}
