import {
  formatPesosRealtime,
  normalizeDateForInput,
} from '@/lib/api/utils/utils';
import React from 'react';

export default function Receipts({ receipts }) {
  return (
    <details className="group border rounded-xl p-4 border-gray-200">
      <summary className="cursor-pointer font-semibold text-gray-800 text-lg flex justify-between items-center">
        Recibos de Caja
        <span className="text-gray-400 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>

      {receipts?.length > 0 ? (
        <div className="space-y-4 mt-4">
          {receipts.map((r, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl">
              <p>
                <strong>Número de Recibo:</strong> {r.receiptNumber}
              </p>
              <p>
                <strong>Fecha:</strong> {normalizeDateForInput(r.date)}
              </p>
              <p>
                <strong>Monto:</strong> {formatPesosRealtime(r.amount)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-3">No hay recibos registrados</p>
      )}
    </details>
  );
}
