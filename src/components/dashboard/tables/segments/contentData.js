import { CheckIcon } from '@heroicons/react/24/outline';
import Actions from './actions';
import ConfirmDeleteModal from './confirmDeleteModal';
import { formatDateTime } from '@/lib/api/utils/formatDateTime';

export default function ContentData({
  paginatedData,
  getCustomerLockState,
  rol,
  view,
  setSelected,
  toggleCheckbox,
  selectedIds,
  handleDeleteClick,
  showDeleteModal,
  setShowDeleteModal,
  deleteTarget,
  confirmDelete,
  deleting,
  setShowModalChangeAdvisor,
}) {
  return (
    <>
      {paginatedData.map((info, index) => {
        const isLocked = getCustomerLockState(index, info);
        return (
          <tr
            key={info.id}
            className={`border-b ${
              isLocked
                ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50'
            }`}
          >
            {rol === 'ADMIN' && view === 'customers' && (
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
            {rol === 'ADMIN' && view === 'customers' && (
              <td className="px-4 py-3">
                {info.advisor?.name || 'Sin Asignar'}
              </td>
            )}

            <td className="px-4 py-3">{info.name}</td>

            {view === 'delivered' && (
              <>
                <td className="px-4 py-3">
                  {info.advisor?.name || 'Sin Asignar'}
                </td>
                <td className="px-4 py-3">
                  {info.deliveryDate
                    ? formatDateTime(info.deliveryDate)
                    : '---'}
                </td>
                <td className="px-4 py-3">{info.plateNumber || '---'}</td>
              </>
            )}

            <td className="px-4 py-3">{info.email}</td>
            <td className="px-4 py-3">{info.phone}</td>

            {view === 'customers' && (
              <td className="px-4 py-3">{info.state?.name}</td>
            )}

            <td className="px-4 py-3 text-center">
              <Actions
                isLocked={isLocked}
                rol={rol}
                info={info}
                view={view}
                setSelected={setSelected}
                handleDelete={() =>
                  handleDeleteClick(
                    info.id,
                    info.name,
                    view === 'customers' ? 'cliente' : 'cliente entregado'
                  )
                }
                setShowModalChangeAdvisor={(e) => setShowModalChangeAdvisor(e)}
              />

              {showDeleteModal && (
                <ConfirmDeleteModal
                  show={showDeleteModal}
                  setShow={setShowDeleteModal}
                  type={deleteTarget?.type}
                  name={deleteTarget?.name}
                  onConfirm={confirmDelete}
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
