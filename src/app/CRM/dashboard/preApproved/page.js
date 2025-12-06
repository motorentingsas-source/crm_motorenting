'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import Table from '@/components/dashboard/tables/table';
import useApproved from '@/lib/api/hooks/useApproved';
import ViewModal from '../../viewModal';
import ContentViewModal from '@/components/dashboard/preApproved/contentViewModal';

export default function Pre_approved() {
  const [selectedPreApproved, setSelectedPreApproved] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [preApproved, setPreApproved] = useState([]);
  const { usuario } = useAuth();

  const { getPreApproveds, loading, error } = useApproved();

  const fetchData = useCallback(async () => {
    try {
      const { data } = await getPreApproveds();
      setPreApproved(data || []);
    } catch (err) {
      console.error(err);
    }
  }, [getPreApproveds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectedState = () => {
    fetchData();
    setSelectedState(null);
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Clientes Pre-Aprobados
        </h1>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading && (
          <p className="text-gray-500 text-sm p-4">
            Cargando clientes Pre-Aprobados...
          </p>
        )}
        {error && <p className="text-red-500 text-sm p-4">{error}</p>}

        <Table
          info={preApproved}
          view="preApproved"
          setSelected={setSelectedPreApproved}
          setSelectedState={setSelectedState}
          rol={usuario?.role}
          fetchData={fetchData}
          loading={loading}
          error={error}
        />

        {selectedPreApproved && (
          <ViewModal
            data={selectedPreApproved}
            type="preApproved"
            onClose={() => setSelectedPreApproved(null)}
          />
        )}

        {selectedState && (
          <ContentViewModal
            data={selectedState}
            onClose={() => handleSelectedState()}
          />
        )}
      </div>
    </div>
  );
}
