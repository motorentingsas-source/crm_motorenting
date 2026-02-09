import { CheckIcon } from '@heroicons/react/24/outline';
import Actions from './actions';
import ConfirmDeleteModal from './confirmDeleteModal';
import { formatDateTime } from '@/lib/api/utils/formatDateTime';
import usePermissions from '@/hooks/usePermissions';
import { formatEnumText, normalizePhoneCO } from '@/lib/api/utils/utils';
import PhoneContentData from './contentData/phone';

export default function ContentData({
  paginatedData,
  getCustomerLockState,
  getCustomerLockStateSale,
  rol,
  view,
  setSelected,
  setSelectedState,
  toggleCheckbox,
  selectedIds,
  handleDeleteClick,
  showDeleteModal,
  setShowDeleteModal,
  deleteTarget,
  confirmDelete,
  deleting,
  setShowModalChangeAdvisor,
  handlePrintOrder,
}) {
  const { canAssign, canViewAll } = usePermissions();

  return (
    <>
      {paginatedData.map((info, index) => {
        const isLocked = getCustomerLockState(index, info);
        const isLockedSale = getCustomerLockStateSale(view, info);

        return (
          <tr
            key={info.id}
            className={`border-b 
            ${
              isLocked
                ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50'
            }
            ${
              isLockedSale
                ? 'bg-red-200 opacity-50 hover:bg-red-200 cursor-not-allowed'
                : 'hover:bg-gray-50'
            }
            `}
          >
            {canAssign && view === 'customers' && (
              <td className="px-4 py-3 text-center">
                {info.advisor ? (
                  <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                ) : (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(info.id)}
                    onChange={() => toggleCheckbox(info)}
                    className="w-4 h-4 cursor-pointer"
                  />
                )}
              </td>
            )}

            {(view === 'approved' || view === 'delivered') && (
              <td className="px-4 py-3">{info.orderNumber || 'MR----'}</td>
            )}

            {canViewAll &&
              (view === 'customers' ||
                view === 'delivered' ||
                view === 'preApproved' ||
                view === 'approved') && (
                <td className="px-4 py-3">
                  {info.advisor?.name || 'Sin Asignar'}
                </td>
              )}

            {canViewAll && view === 'advisors' && (
              <td className="px-4 py-3">{info.role}</td>
            )}

            <td className="px-4 py-3">{info.name}</td>
            <td className="px-4 py-3">{info.document || '---'}</td>

            {view === 'delivered' && (
              <>
                <td className="px-4 py-3">
                  {info.deliveryDate
                    ? formatDateTime(info.deliveryDate)
                    : '---'}
                </td>
                <td className="px-4 py-3">{info.plateNumber || '---'}</td>
              </>
            )}

            <td className="px-4 py-3">{info.email}</td>

            {view != 'advisors' ? (
              <PhoneContentData info={info} />
            ) : (
              <td className="px-4 py-3">
                {normalizePhoneCO(info.phone) || '---'}
              </td>
            )}

            <td className="px-4 py-3">{info.city || '---'}</td>

            {view === 'customers' && (
              <td className="px-4 py-3">{info.state?.name}</td>
            )}

            {(view === 'customers' || view === 'preApproved') && (
              <td className="px-4 py-3">
                {formatEnumText(info.saleState, 'uppercase') ||
                  'PENDIENTE POR APROBAR'}
              </td>
            )}

            <td className="px-4 py-3 text-center">
              <Actions
                isLocked={isLocked}
                isLockedSale={isLockedSale}
                rol={rol}
                info={info}
                view={view}
                setSelected={setSelected}
                setSelectedState={setSelectedState}
                handleDelete={() =>
                  handleDeleteClick(
                    info.id,
                    info.name,
                    view === 'customers' || view === 'delivered'
                      ? 'cliente'
                      : 'asesor'
                  )
                }
                setShowModalChangeAdvisor={setShowModalChangeAdvisor}
                handlePrintOrder={handlePrintOrder}
              />

              {showDeleteModal && (
                <ConfirmDeleteModal
                  show={showDeleteModal}
                  setShow={setShowDeleteModal}
                  type={deleteTarget?.type}
                  name={deleteTarget?.name}
                  onConfirm={() => confirmDelete(view, deleteTarget?.id)}
                  loading={deleting}
                />
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
}
