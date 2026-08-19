'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/authContext';
import Table from '@/components/dashboard/tables/table';
import Pagination from '@/components/dashboard/tables/segments/pagination';
import ViewModal from '../../viewModal';
import ContentViewModal from '@/components/dashboard/preApproved/contentViewModal';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import useColumnFilters from '@/components/dashboard/tables/hooks/useColumnFilters';
import { useDragScroll } from '@/hooks/useDragScroll';
import useCustomers from '@/lib/api/hooks/useCustomers';
import ConfirmChangeWarehouseModal from '@/components/dashboard/modals/confirmChangeWarehouseModal';

export default function CustomerWarehouse() {
  const { usuario } = useAuth();
  const { getArchivedCustomers, loading, error } = useCustomers();

  const tableRef = useRef(null);
  const drag = useDragScroll();

  const [customerWarehouse, setCustomerWarehouse] = useState([]);
  const [meta, setMeta] = useState(null);
  const [selectedCustomerWarehouse, setSelectedCustomerWarehouse] =
    useState(null);
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
    advisor: '',
    name: '',
    document: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    saleState: '',
  });

  const fetchData = useCallback(async () => {
    const res = await runLatest(() =>
      getArchivedCustomers({
        page,
        limit,
        ...debouncedFilters,
      })
    );

    // Llegó una respuesta más reciente: se descarta esta.
    if (!res) return;

    setCustomerWarehouse(res.data || []);
    setMeta(res.meta || null);
  }, [getArchivedCustomers, runLatest, page, limit, debouncedFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [page]);

  return (
    <div className="w-full p-4">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Bodega de Clientes
      </h1>

      <div ref={tableRef} className="bg-white rounded-lg shadow relative">
        <LoadingOverlay show={loading} text="Cargando bodega de clientes..." />

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
              info={customerWarehouse}
              view="customerWarehouse"
              rol={usuario?.role}
              loading={loading}
              error={error}
              filters={filters}
              handleFilterChange={handleFilterChange}
              setSelected={setSelectedCustomerWarehouse}
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

      {selectedCustomerWarehouse && (
        <ViewModal
          data={selectedCustomerWarehouse}
          type="customerWarehouse"
          onClose={() => setSelectedCustomerWarehouse(null)}
        />
      )}

      {selectedState && (
        <ContentViewModal
          data={selectedState}
          view="customerWarehouse"
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
