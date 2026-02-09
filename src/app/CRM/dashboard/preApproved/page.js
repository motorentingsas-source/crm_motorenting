'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/authContext';
import Table from '@/components/dashboard/tables/table';
import Pagination from '@/components/dashboard/tables/segments/pagination';
import ViewModal from '../../viewModal';
import ContentViewModal from '@/components/dashboard/preApproved/contentViewModal';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import useApproved from '@/lib/api/hooks/useApproved';
import useColumnFilters from '@/components/dashboard/tables/hooks/useColumnFilters';
import { useDebounce } from '@/components/dashboard/tables/hooks/useDebounce';
import { useDragScroll } from '@/hooks/useDragScroll';

export default function PreApproved() {
  const { usuario } = useAuth();
  const { getPreApproveds, loading, error } = useApproved();

  const tableRef = useRef(null);
  const drag = useDragScroll();

  const [preApproved, setPreApproved] = useState([]);
  const [meta, setMeta] = useState(null);
  const [selectedPreApproved, setSelectedPreApproved] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { filters, handleFilterChange } = useColumnFilters({
    advisor: '',
    name: '',
    document: '',
    email: '',
    phone: '',
    city: '',
    saleState: '',
  });

  const debouncedFilters = useDebounce(filters, 200);

  const fetchData = useCallback(async () => {
    const res = await getPreApproveds({
      page,
      limit,
      ...debouncedFilters,
    });

    setPreApproved(res.data || []);
    setMeta(res.meta || null);
  }, [getPreApproveds, page, limit, debouncedFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [page]);

  return (
    <div className="w-full p-4">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Clientes Pre-Aprobados
      </h1>

      <div ref={tableRef} className="bg-white rounded-lg shadow relative">
        <LoadingOverlay show={loading} text="Cargando pre-aprobados..." />

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
              info={preApproved}
              view="preApproved"
              rol={usuario?.role}
              loading={loading}
              error={error}
              filters={filters}
              handleFilterChange={handleFilterChange}
              setSelected={setSelectedPreApproved}
              setSelectedState={setSelectedState}
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
          onClose={() => {
            setSelectedState(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
