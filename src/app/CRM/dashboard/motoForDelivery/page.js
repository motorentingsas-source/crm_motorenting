'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/authContext';
import Table from '@/components/dashboard/tables/table';
import Pagination from '@/components/dashboard/tables/segments/pagination';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import useColumnFilters from '@/components/dashboard/tables/hooks/useColumnFilters';
import { useDragScroll } from '@/hooks/useDragScroll';
import ContentViewModal from '@/components/dashboard/preApproved/contentViewModal';
import useMotoForDelivery from '@/lib/api/hooks/useMotoForDelivery';

export default function MotoForDelivery() {
  const { usuario } = useAuth();
  const { getAllMotoForDelivery, loading, error } = useMotoForDelivery();

  const tableRef = useRef(null);
  const drag = useDragScroll();

  const [motoForDelivery, setMotoForDelivery] = useState([]);
  const [meta, setMeta] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const {
    filters,
    handleFilterChange,
    debouncedFilters,
    page,
    setPage,
    limit,
    setLimit,
    runLatest,
  } = useColumnFilters({
    orderNumber: '',
    advisor: '',
    name: '',
    document: '',
    phone: '',
    distributor: '',
    financialEntity: '',
    reference: '',
  });

  const fetchData = useCallback(async () => {
    const res = await runLatest(() =>
      getAllMotoForDelivery({
        page,
        limit,
        ...debouncedFilters,
      })
    );

    // Llegó una respuesta más reciente: se descarta esta.
    if (!res) return;

    setMotoForDelivery(res.data || []);
    setMeta(res.meta || null);
  }, [getAllMotoForDelivery, runLatest, page, limit, debouncedFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [page]);

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Motos para Entrega
        </h1>
      </div>

      <div ref={tableRef} className="bg-white rounded-lg shadow relative">
        <LoadingOverlay show={loading} text="Cargando motos para entrega..." />

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
              info={motoForDelivery}
              view="motoForDelivery"
              rol={usuario?.role}
              loading={loading}
              error={error}
              filters={filters}
              handleFilterChange={handleFilterChange}
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

      {selectedState && (
        <ContentViewModal
          data={selectedState}
          view="motoForDelivery"
          onClose={(shouldReload) => {
            setSelectedState(null);
            if (shouldReload) {
              fetchData();
            }
          }}
        />
      )}
    </div>
  );
}
