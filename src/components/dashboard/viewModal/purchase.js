import React from 'react';
import { formatPesosRealtime } from '@/lib/api/utils/utils';

export default function Purchase({
  purchase,
  outstandingBalance,
  creditBalance,
}) {
  return (
    <details className="group border rounded-xl p-4 border-gray-200">
      <summary className="cursor-pointer font-semibold text-gray-800 text-lg flex justify-between items-center">
        Datos de Compra
        <span className="text-gray-400 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>

      {purchase ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-gray-600">
          <div>
            <p className="font-semibold">Marca</p>
            <p>{purchase.brand}</p>
          </div>
          <div>
            <p className="font-semibold">Referencia</p>
            <p>{purchase.reference}</p>
          </div>
          <div>
            <p className="font-semibold">Color Principal</p>
            <p>{purchase.mainColor}</p>
          </div>
          <div>
            <p className="font-semibold">Color Opcional</p>
            <p>{purchase.optionalColor || 'No aplica'}</p>
          </div>
          <div>
            <p className="font-semibold">Valor Comercial</p>
            <p>{formatPesosRealtime(purchase.commercialValue)}</p>
          </div>
          <div>
            <p className="font-semibold">Valor Trámite</p>
            <p>{formatPesosRealtime(purchase.processValue)}</p>
          </div>
          <div>
            <p className="font-semibold">Total</p>
            <p className="font-bold">
              {formatPesosRealtime(purchase.totalValue)}
            </p>
          </div>
          <div>
            <p className="font-semibold">Saldo Pendiente</p>
            <p className="font-bold">
              {formatPesosRealtime(outstandingBalance)}
            </p>
          </div>
          <div>
            <p className="font-semibold">Saldo a Favor</p>
            <p className="font-bold">{formatPesosRealtime(creditBalance)}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-3">No disponible</p>
      )}
    </details>
  );
}
