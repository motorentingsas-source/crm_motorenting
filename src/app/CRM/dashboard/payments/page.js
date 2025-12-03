'use client';

import { useState } from 'react';
import { formatPesosRealtime, pesosToNumber } from '@/lib/api/utils/utils';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';

export default function Payments() {
  const [orderNumber, setOrderNumber] = useState('');
  const [results, setResults] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [receipt, setReceipt] = useState({
    number: '',
    date: '',
    value: '',
  });

  const handleSearch = () => {
    setResults({
      name: 'Juan Pérez',
      balance: 350000,
    });
  };

  const handlePayClick = () => setOpenModal(true);

  const handleSave = () => {
    console.log('PAGOS:', receipt);
    setOpenModal(false);
    setReceipt({ number: '', date: '', value: '' });
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Realizar Pagos
        </h1>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Número de Orden
        </label>

        <div className="flex gap-3">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Ej: MRS0001"
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />

          <button
            onClick={handleSearch}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md 
             hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer 
             flex items-center gap-2"
          >
            <MagnifyingGlassCircleIcon className="w-5 h-5" />
            Buscar
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 text-sm border-b">
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Saldo por pagar</th>
                <th className="pb-3">Acción</th>
              </tr>
            </thead>

            <tbody>
              <tr className="text-gray-800 border-b">
                <td className="py-4">{results.name}</td>
                <td className="py-4 font-semibold">
                  {formatPesosRealtime(results.balance)}
                </td>
                <td className="py-4">
                  {results.balance > 0 ? (
                    <button
                      onClick={handlePayClick}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl 
             shadow-md hover:shadow-lg transition-all duration-300 
             active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <CurrencyDollarIcon className="w-5 h-5" />
                      Pagar
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium">✔ Pagado</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setResults(null);
                setOrderNumber('');
                setOpenModal(false);
                setReceipt({ number: '', date: '', value: '' });
              }}
              className="px-5 py-2 bg-orange-500 hover:bg-white border hover:border-orange-500 hover:text-orange-500 text-gray-100 font-semibold 
               rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
               active:scale-95 cursor-pointer"
            >
              Limpiar resultados
            </button>
          </div>
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative border border-gray-200">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Registrar Pago
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                placeholder="Número recibo de caja"
                value={receipt.number}
                onChange={(e) =>
                  setReceipt({ ...receipt, number: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />

              <input
                type="date"
                value={receipt.date}
                onChange={(e) =>
                  setReceipt({ ...receipt, date: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />

              <input
                placeholder="Valor"
                value={formatPesosRealtime(receipt.value)}
                onChange={(e) =>
                  setReceipt({
                    ...receipt,
                    value: pesosToNumber(e.target.value),
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
             py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
             active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <CurrencyDollarIcon className="w-5 h-5" />
              Realizar Pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
