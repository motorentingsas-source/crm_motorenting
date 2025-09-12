'use client';

import { useState } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import useApi from '@/lib/api/useApi';
import { importCustomers } from '@/lib/api/customer';
import ViewModal from '../../viewModal';
import Table from '@/components/dashboard/tables/table';

export default function Customers() {
  const [archivo, setArchivo] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { usuario } = useAuth();

  const { data, loading, error, execute } = useApi('/customers');

  const handleFileChange = (e) => setArchivo(e.target.files?.[0] || null);
  const handleRemoveFile = () => setArchivo(null);

  const handleUpload = async () => {
    if (!archivo) return;
    try {
      await importCustomers(archivo);
      setArchivo(null);
      await execute();
    } catch (err) {
      alert(err.message || 'Error al subir archivo');
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Listado de Clientes
        </h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Link
            href="/CRM/dashboard/customers/new"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Agregar cliente</span>
          </Link>

          {usuario?.role === 'ADMIN' && (
            <>
              {!archivo ? (
                <label className="flex items-center gap-2 cursor-pointer bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition">
                  <DocumentArrowUpIcon className="w-4 h-4" />
                  Importar Excel
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center bg-green-100 border border-green-400 px-4 py-2 rounded-lg">
                  <span className="text-green-800 text-sm font-medium truncate max-w-[200px]">
                    {archivo.name}
                  </span>
                  <button
                    onClick={handleRemoveFile}
                    className="ml-2 text-red-500 hover:text-red-700"
                    title="Eliminar archivo"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleUpload}
                    className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Subir
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading && (
          <p className="text-gray-500 text-sm p-4">Cargando clientes...</p>
        )}
        {error && <p className="text-red-500 text-sm p-4">{error}</p>}

        <Table
          info={data || []}
          view="customers"
          setSelected={setSelectedCustomer}
          rol={usuario?.role}
        />

        {selectedCustomer && (
          <ViewModal
            data={selectedCustomer}
            type="customer"
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </div>
  );
}
