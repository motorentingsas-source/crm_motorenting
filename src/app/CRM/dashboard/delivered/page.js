'use client';

import { useEffect, useState, useCallback } from 'react';
import ViewModal from '../../viewModal';
import Table from '@/components/dashboard/tables/table';
import { useAuth } from '@/context/authContext';
import useCustomers from '@/lib/api/hooks/useCustomers';

export default function Delivered() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const { usuario } = useAuth();

  const { getDeliveredCustomers, loading, error } = useCustomers();

  const fetchData = useCallback(async () => {
    try {
      const { data } = await getDeliveredCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Listado de Clientes Entregados
        </h1>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading && (
          <p className="text-gray-500 text-sm p-4">
            Cargando clientes entregados...
          </p>
        )}
        {error && <p className="text-red-500 text-sm p-4">{error}</p>}

        <Table
          info={customers}
          view="delivered"
          setSelected={setSelectedCustomer}
          rol={usuario?.role}
          fetchData={fetchData}
          loading={loading}
          error={error}
        />

        {selectedCustomer && (
          <ViewModal
            data={selectedCustomer}
            type="delivered"
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </div>
  );
}
