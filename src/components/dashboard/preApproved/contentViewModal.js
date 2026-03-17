import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Approve from './contentView/approve';
import Decline from './contentView/decline';
import CManagementObservation from './contentView/cManagementObservation';
import MScheduledImg from './contentView/mScheduledImg';
import ApprovedScheduled from './contentView/approvedScheduled';

export default function ContentViewModal({ view, data, type, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full relative overflow-hidden ${
          type === 'advisor' ? 'max-w-4xl' : 'max-w-6xl'
        }`}
      >
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 transition cursor-pointer"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {(view === 'creditManagement' || view === 'motoForDelivery') && (
            <CManagementObservation data={data} onClose={onClose} view={view} />
          )}
          {view === 'preApproved' && (
            <>
              {data.action === 'approve' && (
                <Approve data={data} onClose={onClose} />
              )}
              {data.action === 'decline' && (
                <Decline data={data} onClose={onClose} view={view} />
              )}
            </>
          )}
          {view === 'motorcyclesScheduled' && (
            <>
              {data.action === 'Entregar' && data.outstandingBalance === 0 && (
                <MScheduledImg data={data} onClose={onClose} />
              )}

              {data.action === 'Entregar' && data.outstandingBalance > 0 && (
                <div className="text-center py-10">
                  <h2 className="text-xl font-semibold text-red-600 mb-4">
                    No se puede realizar la entrega
                  </h2>

                  <p className="text-gray-600">
                    El cliente tiene un saldo pendiente de:
                  </p>

                  <p className="text-2xl font-bold text-red-600 mt-2">
                    ${data.outstandingBalance.toLocaleString('es-CO')}
                  </p>
                </div>
              )}

              {data.action === 'Rechazar' && (
                <Decline data={data} onClose={onClose} view={view} />
              )}
            </>
          )}
          {view === 'customerWarehouse' && (
            <>
              <CManagementObservation
                data={data}
                onClose={onClose}
                view={view}
              />
            </>
          )}
          {view === 'approved' && (
            <>
              <ApprovedScheduled data={data} onClose={onClose} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
