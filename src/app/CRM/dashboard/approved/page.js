'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import Table from '@/components/dashboard/tables/table';
import useApproved from '@/lib/api/hooks/useApproved';
import ViewModal from '../../viewModal';
import usePermissions from '@/hooks/usePermissions';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Approved() {
  const [selectedApproved, setSelectedApproved] = useState(null);
  const [approved, setApproved] = useState([]);
  const { usuario } = useAuth();

  const { getApproveds, loading, error } = useApproved();
  const { canExportApproved } = usePermissions();

  const fetchData = useCallback(async () => {
    try {
      const { data } = await getApproveds();
      setApproved(data || []);
    } catch (err) {
      console.error(err);
    }
  }, [getApproveds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = async () => {
    try {
      //await exportDeliveredCustomers();
    } catch (err) {
      alert(err.message || 'Error exportando clientes');
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Clientes Aprobados
        </h1>

        {canExportApproved && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Exportar Excel
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading && (
          <p className="text-gray-500 text-sm p-4">
            Cargando clientes Aprobados...
          </p>
        )}
        {error && <p className="text-red-500 text-sm p-4">{error}</p>}

        <Table
          info={approved}
          view="approved"
          setSelected={setSelectedApproved}
          rol={usuario?.role}
          fetchData={fetchData}
          loading={loading}
          error={error}
        />

        {selectedApproved && (
          <ViewModal
            data={selectedApproved}
            type="approved"
            onClose={() => setSelectedApproved(null)}
          />
        )}
      </div>
    </div>
  );
}
