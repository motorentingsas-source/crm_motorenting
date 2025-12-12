import { formatPesosRealtime, pesosToNumber } from '@/lib/api/utils/utils';
import React from 'react';

export default function Purchase({ purchase, errors, setPurchase }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Datos de la compra</h2>

      <div className="border border-gray-200 p-4 rounded grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Marca"
          value={purchase.brand}
          onChange={(e) => setPurchase({ ...purchase, brand: e.target.value })}
          className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
            errors.brand ? 'border-red-500' : 'border-gray-200'
          }`}
        />

        <input
          placeholder="Referencia"
          value={purchase.reference}
          onChange={(e) =>
            setPurchase({ ...purchase, reference: e.target.value })
          }
          className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
            errors.reference ? 'border-red-500' : 'border-gray-200'
          }`}
        />

        <input
          placeholder="Color principal"
          value={purchase.mainColor}
          onChange={(e) =>
            setPurchase({ ...purchase, mainColor: e.target.value })
          }
          className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
            errors.mainColor ? 'border-red-500' : 'border-gray-200'
          }`}
        />

        <input
          placeholder="Color opcional"
          value={purchase.optionalColor}
          onChange={(e) =>
            setPurchase({ ...purchase, optionalColor: e.target.value })
          }
          className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
            errors.optionalColor ? 'border-red-500' : 'border-gray-200'
          }`}
        />

        <input
          placeholder="Valor comercial"
          value={formatPesosRealtime(purchase.commercialValue)}
          onChange={(e) =>
            setPurchase({
              ...purchase,
              commercialValue: pesosToNumber(e.target.value),
            })
          }
          className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
            errors.commercialValue ? 'border-red-500' : 'border-gray-200'
          }`}
        />

        <input
          placeholder="Valor trámites"
          value={formatPesosRealtime(purchase.processValue)}
          onChange={(e) =>
            setPurchase({
              ...purchase,
              processValue: pesosToNumber(e.target.value),
            })
          }
          className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
            errors.processValue ? 'border-red-500' : 'border-gray-200'
          }`}
        />

        <input
          placeholder="Total compra"
          value={formatPesosRealtime(purchase.totalValue)}
          readOnly
          className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-2 text-sm shadow-sm cursor-not-allowed"
        />
      </div>
    </section>
  );
}
