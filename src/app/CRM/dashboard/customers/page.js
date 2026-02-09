'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/authContext';
import useCustomers from '@/lib/api/hooks/useCustomers';
import Table from '@/components/dashboard/tables/table';
import Pagination from '@/components/dashboard/tables/segments/pagination';
import Header from '@/components/dashboard/customers/header';
import AlertModal from '@/components/dashboard/modals/alertModal';
import ViewModal from '../../viewModal';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import useColumnFilters from '@/components/dashboard/tables/hooks/useColumnFilters';
import { useDebounce } from '@/components/dashboard/tables/hooks/useDebounce';
import { useDragScroll } from '@/hooks/useDragScroll';

export default function Customers() {
  const { usuario } = useAuth();
  const { getCustomers, importCustomers, loading, error } = useCustomers();
  const tableRef = useRef(null);
  const drag = useDragScroll();

  const [customers, setCustomers] = useState([]);
  const [meta, setMeta] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [archivo, setArchivo] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [alert, setAlert] = useState({
    type: '',
    message: '',
    url: '',
  });

  const { filters, handleFilterChange } = useColumnFilters({
    advisor: '',
    name: '',
    document: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    saleState: '',
  });

  const debouncedFilters = useDebounce(filters, 200);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await getCustomers({
        page,
        limit,
        ...debouncedFilters,
      });

      setCustomers(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error(err);
    }
  }, [getCustomers, page, limit, debouncedFilters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleFileChange = (e) => {
    setArchivo(e.target.files?.[0] || null);
  };

  const handleRemoveFile = () => {
    setArchivo(null);
  };

  const handleUpload = async () => {
    if (!archivo) return;

    try {
      await importCustomers(archivo);
      setArchivo(null);

      setAlert({
        type: 'success',
        message: 'Importación de clientes creada correctamente.',
      });
      await fetchCustomers();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error al subir archivo',
      });
    }
  };

  useEffect(() => {
    if (!tableRef.current) return;

    tableRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [page]);

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Listado de Clientes
        </h1>

        <Header
          usuario={usuario}
          archivo={archivo}
          handleFileChange={handleFileChange}
          handleRemoveFile={handleRemoveFile}
          handleUpload={handleUpload}
        />
      </div>
      <div ref={tableRef} className="bg-white rounded-lg shadow relative">
        <LoadingOverlay show={loading} text="Cargando clientes..." />

        <div
          ref={drag.ref}
          onMouseDown={drag.onMouseDown}
          onMouseLeave={drag.onMouseLeave}
          onMouseUp={drag.onMouseUp}
          onMouseMove={drag.onMouseMove}
          className="relative overflow-x-auto scroll-dark cursor-grab"
        >
          <div className="w-full">
            <Table
              info={customers}
              view="customers"
              rol={usuario?.role}
              loading={loading}
              error={error}
              filters={filters}
              handleFilterChange={handleFilterChange}
              setSelected={setSelectedCustomer}
              fetchData={fetchCustomers}
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
      {selectedCustomer && (
        <ViewModal
          data={selectedCustomer}
          type="customer"
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      <AlertModal
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '', url: '' })}
        url={alert.url}
      />
    </div>
  );
}
