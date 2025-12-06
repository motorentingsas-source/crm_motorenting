'use client';
import React, { useState } from 'react';
import { addComment } from '@/lib/api/customers';
import AlertModal from '../../modals/alertModal';

export default function Decline({ data, onClose }) {
  const [observation, setObservation] = useState('');
  const [touched, setTouched] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '', url: '' });

  const handleAddComment = async () => {
    setTouched(true);
    if (!observation.trim()) return;
    try {
      await addComment(Number(data.id), observation.trim(), 'RECHAZADO');
      setObservation('');
      setAlert({
        type: 'success',
        message: 'Comentario agregado correctamente.',
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error al agregar comentario',
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Motivo del rechazo</h2>

      <textarea
        className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none transition 
          focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
          ${
            touched && !observation.trim()
              ? 'border-red-500'
              : 'border-gray-200'
          }
        `}
        rows={5}
        placeholder="Escribe aquí la observación..."
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        onBlur={() => setTouched(true)}
        required
      />

      {touched && !observation.trim() && (
        <p className="text-sm text-red-600">Este campo es obligatorio.</p>
      )}

      <button
        onClick={handleAddComment}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
      >
        Rechazar venta
      </button>

      <AlertModal
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' }, onClose())}
        url={alert.url}
      />
    </div>
  );
}
