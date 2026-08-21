'use client';

import { useState } from 'react';
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import useCustomers from '@/lib/api/hooks/useCustomers';
import { formatDateTime } from '@/lib/api/utils/formatDateTime';

/**
 * Ventana para dejar un comentario en un cliente sin entrar a editarlo.
 *
 * La usan los roles que hacen seguimiento pero no modifican el expediente
 * (hoy, EJECUTIVO_FINANCIERO en Aprobados).
 *
 * El historial va plegado: al abrir solo se ve el cuadro de texto, sin scroll.
 * Al desplegarlo crece el cuerpo del modal, que es la única zona desplazable:
 * nunca hay dos barras de scroll a la vez.
 */
export default function AddCommentModal({ data, onClose }) {
  const [comment, setComment] = useState('');
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const { addComment } = useCustomers();

  if (!data) return null;

  const isEmpty = !comment.trim();
  const history = data.comments ?? [];

  const initial = (name) => (name ? name.charAt(0).toUpperCase() : '?');

  const avatarColor = (index) =>
    [
      'bg-orange-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
    ][index % 5];

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-orange-500 shrink-0" />
              <h2 className="text-base font-semibold text-gray-800">
                Agregar comentario
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-500 truncate">{data.name}</p>
          </div>

          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer shrink-0"
            aria-label="Cerrar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          <textarea
            autoFocus
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Escriba una observación..."
            className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm transition resize-none
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
              ${touched && isEmpty ? 'border-red-500' : 'border-gray-200'}`}
          />

          {touched && isEmpty && (
            <p className="mt-1 text-sm text-red-600">
              Escriba un comentario antes de guardar.
            </p>
          )}

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

          {history.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition cursor-pointer"
              >
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
                    showHistory ? 'rotate-180' : ''
                  }`}
                />
                Comentarios anteriores ({history.length})
              </button>

              {showHistory && (
                <ul className="mt-3 space-y-2">
                  {history.map((c, index) => {
                    const author = c.createdBy?.name || 'Usuario desconocido';

                    return (
                      <li
                        key={c.id ?? index}
                        className="flex items-start gap-2.5 rounded-lg bg-gray-50 px-3 py-2"
                      >
                        <span
                          className={`mt-0.5 w-7 h-7 shrink-0 rounded-full flex items-center justify-center
                            text-white text-xs font-bold ${avatarColor(index)}`}
                        >
                          {initial(author)}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-xs font-semibold text-gray-700 truncate">
                              {author}
                            </p>
                            <span className="text-[11px] text-gray-400 shrink-0">
                              {formatDateTime(c.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-snug">
                            {c.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
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
  );
}
