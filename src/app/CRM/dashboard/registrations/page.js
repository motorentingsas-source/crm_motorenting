'use client';

import { useState } from 'react';
import { formatPesosRealtime, pesosToNumber } from '@/lib/api/utils/utils';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';

export default function Registrations() {
  const [orderNumber, setOrderNumber] = useState('');
  const [results, setResults] = useState(null);

  const [form, setForm] = useState({
    plate: '',
    soatValue: '',
    registerValue: '',
    registerDate: '',
  });

  const handleSearch = () => {
    setResults({
      name: 'Juan Guillermo Pérez Manrique',
    });
  };

  const handleSave = () => {
    console.log('MATRÍCULA:', form);
    setResults(null);
    setOrderNumber('');
    setForm({
      plate: '',
      soatValue: '',
      registerValue: '',
      registerDate: '',
    });
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Realizar Matrícula
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
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
            focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Cliente:</p>
            <p className="text-gray-900 text-lg font-medium">{results.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Placa"
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm 
            shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <input
              placeholder="Valor SOAT"
              value={formatPesosRealtime(form.soatValue)}
              onChange={(e) =>
                setForm({
                  ...form,
                  soatValue: pesosToNumber(e.target.value),
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm 
            shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <input
              placeholder="Valor Matrícula"
              value={formatPesosRealtime(form.registerValue)}
              onChange={(e) =>
                setForm({
                  ...form,
                  registerValue: pesosToNumber(e.target.value),
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm 
            shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <input
              type="date"
              value={form.registerDate}
              onChange={(e) =>
                setForm({ ...form, registerDate: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm 
            shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setResults(null);
                setOrderNumber('');
                setForm({
                  plate: '',
                  soatValue: '',
                  registerValue: '',
                  registerDate: '',
                });
              }}
              className="px-5 py-2 bg-orange-500 hover:bg-white border hover:border-orange-500 
              hover:text-orange-500 text-gray-100 font-semibold rounded-xl shadow-sm 
              hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Limpiar resultados
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-500 hover:bg-white border hover:border-blue-500 
              hover:text-blue-500 text-gray-100 font-semibold rounded-xl shadow-sm 
              hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer ml-2"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
