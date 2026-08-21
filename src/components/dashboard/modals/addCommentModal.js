'use client';

import { useState } from 'react';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import useCustomers from '@/lib/api/hooks/useCustomers';
import CommentsHistory from '../comments/CommentsHistory';

/**
 * Ventana para dejar un comentario en un cliente sin entrar a editarlo.
 *
 * La usan los roles que pueden hacer seguimiento pero no modificar el
 * expediente (hoy, EJECUTIVO_FINANCIERO en Aprobados).
 */
export default function AddCommentModal({ data, onClose }) {
  const [comment, setComment] = useState('');
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { addComment } = useCustomers();

  if (!data) return null;

  const isEmpty = !comment.trim();

  const handleSave = async () => {
    setTouched(true);
    if (isEmpty || saving) return;

    setSaving(true);
    setError('');

    try {
      await addComment(Number(data.id), comment.trim());
      onClose(true);
    } catch (err) {
      setError(err.message || 'No se pudo guardar el comentario.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative">
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          aria-label="Cerrar"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Agregar comentario
            </h2>
          </div>

          <p className="text-sm text-gray-500 mb-4">{data.name}</p>

          <textarea
            autoFocus
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Escriba una observación..."
            className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm transition
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
              ${touched && isEmpty ? 'border-red-500' : 'border-gray-200'}`}
          />

          {touched && isEmpty && (
            <p className="mt-1 text-sm text-red-600">
              Escriba un comentario antes de guardar.
            </p>
          )}

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

          <div className="max-h-64 overflow-y-auto">
            <CommentsHistory formData={data} />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm text-white bg-orange-500 hover:bg-orange-600
                disabled:bg-gray-300 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {saving ? 'Guardando...' : 'Guardar comentario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
