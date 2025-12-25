import React from 'react';
import {
  formatPesosRealtime,
  normalizeDateForInput,
} from '@/lib/api/utils/utils';

export default function Invoices({ invoices }) {
  return (
    <details className="group border rounded-xl p-4 border-gray-200">
      <summary className="cursor-pointer font-semibold text-gray-800 text-lg flex justify-between items-center">
        Datos de Facturación
        <span className="text-gray-400 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>

      {invoices?.length > 0 ? (
        <div className="space-y-4 mt-4">
          {invoices.map((invoice, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-gray-600"
            >
              <div>
                <p className="font-semibold">Número de Facturación</p>
                <p>{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Valor</p>
                <p>{formatPesosRealtime(invoice.value)}</p>
              </div>
              <div>
                <p className="font-semibold">Número de Chasis</p>
                <p>{invoice.chassisNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Número de Motor</p>
                <p>{invoice.engineNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Fecha</p>
                <p>{normalizeDateForInput(invoice.date)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-3">No hay facturas registradas</p>
      )}
    </details>
  );
}
