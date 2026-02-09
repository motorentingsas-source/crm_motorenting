'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/authContext';
import Table from '@/components/dashboard/tables/table';
import Pagination from '@/components/dashboard/tables/segments/pagination';
import ViewModal from '../../viewModal';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import useApproved from '@/lib/api/hooks/useApproved';
import usePermissions from '@/hooks/usePermissions';
import useColumnFilters from '@/components/dashboard/tables/hooks/useColumnFilters';
import { useDebounce } from '@/components/dashboard/tables/hooks/useDebounce';
import { useDragScroll } from '@/hooks/useDragScroll';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Approved() {
  const { usuario } = useAuth();
  const { getApproveds, exportAllCustomersApproved, loading, error } =
    useApproved();
  const { canExportApproved } = usePermissions();

  const tableRef = useRef(null);
  const drag = useDragScroll();

  const [approved, setApproved] = useState([]);
  const [meta, setMeta] = useState(null);
  const [selectedApproved, setSelectedApproved] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { filters, handleFilterChange } = useColumnFilters({
    orderNumber: '',
    advisor: '',
    name: '',
    document: '',
    email: '',
    phone: '',
    city: '',
  });

  const debouncedFilters = useDebounce(filters, 200);

  const fetchData = useCallback(async () => {
    const res = await getApproveds({
      page,
      limit,
      ...debouncedFilters,
    });

    setApproved(res.data || []);
    setMeta(res.meta || null);
  }, [getApproveds, page, limit, debouncedFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [page]);

  const handleExport = async () => {
    try {
      await exportAllCustomersApproved();
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

      <div ref={tableRef} className="bg-white rounded-lg shadow relative">
        <LoadingOverlay show={loading} text="Cargando clientes aprobados..." />

        <div
          ref={drag.ref}
          onMouseDown={drag.onMouseDown}
          onMouseUp={drag.onMouseUp}
          onMouseLeave={drag.onMouseLeave}
          onMouseMove={drag.onMouseMove}
          className="relative overflow-x-auto scroll-dark cursor-grab"
        >
          <div className="w-full">
            <Table
              info={approved}
              view="approved"
              rol={usuario?.role}
              loading={loading}
              error={error}
              filters={filters}
              handleFilterChange={handleFilterChange}
              setSelected={setSelectedApproved}
              fetchData={fetchData}
            />
          </div>
        </div>

        {meta && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
          />
        )}
      </div>

      {selectedApproved && (
        <ViewModal
          data={selectedApproved}
          type="approved"
          onClose={() => setSelectedApproved(null)}
        />
      )}
    </div>
  );
}
