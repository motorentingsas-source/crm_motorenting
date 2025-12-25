import {
  formatEnumText,
  formatPesosRealtime,
  normalizeDateForInput,
} from '@/lib/api/utils/utils';
import React from 'react';

export default function Payments({ payments }) {
  return (
    <details className="group border rounded-xl p-4 border-gray-200">
      <summary className="cursor-pointer font-semibold text-gray-800 text-lg flex justify-between items-center">
        Pagos
        <span className="text-gray-400 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>

      {payments?.length > 0 ? (
        <div className="space-y-4 mt-4">
          {payments.map((p, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl">
              <p>
                <strong>Entidad:</strong>{' '}
                {formatEnumText(p.financialEntity, 'uppercase')}
              </p>
              <p>
                <strong>Total Pagado: </strong>
                {formatPesosRealtime(p.totalPayment)}
              </p>
              <p>
                <strong>Aval:</strong> {formatPesosRealtime(p.aval)}
              </p>
              <p>
                <strong>Neto para Compra: </strong>
                {formatPesosRealtime(p.netForPurchase)}
              </p>
              <p>
                <strong>Fecha Aprobación:</strong>{' '}
                {normalizeDateForInput(p.approvalDate)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-3">No hay pagos registrados</p>
      )}
    </details>
  );
}
