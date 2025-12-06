import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Approve from './contentView/approve';
import Decline from './contentView/decline';

export default function ContentViewModal({ data, type, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full relative overflow-hidden ${
          type === 'advisor' ? 'max-w-4xl' : 'max-w-6xl'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 transition cursor-pointer"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {data.action === 'approve' && (
            <Approve data={data} onClose={onClose} />
          )}
          {data.action === 'decline' && (
            <Decline data={data} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
