'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import ViewModal from '../../viewModal';
import Table from '@/components/dashboard/tables/table';
import Pagination from '@/components/dashboard/tables/segments/pagination';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import RoleGuard from '@/auth/roleGuard';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import MessageEditorModal from '@/components/dashboard/modals/messageEditorModal';
import { Roles } from '@/config/roles';
import useUsers from '@/lib/api/hooks/useUsers';
import useColumnFilters from '@/components/dashboard/tables/hooks/useColumnFilters';
import { useDebounce } from '@/components/dashboard/tables/hooks/useDebounce';
import { useDragScroll } from '@/hooks/useDragScroll';

export default function Advisors() {
  const { usuario } = useAuth();
  const { getUsers, loading, error } = useUsers();
  const drag = useDragScroll();
  const tableRef = useRef(null);

  const [advisors, setAdvisors] = useState([]);
  const [meta, setMeta] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const { filters, handleFilterChange } = useColumnFilters({
    role: '',
    name: '',
    document: '',
    email: '',
    phone: '',
    city: '',
  });

  const debouncedFilters = useDebounce(filters, 200);

  const fetchAdvisors = useCallback(async () => {
    try {
      const res = await getUsers({
        page,
        limit,
        ...debouncedFilters,
      });

      setAdvisors(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error(err);
    }
  }, [getUsers, page, limit, debouncedFilters]);

  useEffect(() => {
    fetchAdvisors();
  }, [fetchAdvisors]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  useEffect(() => {
    if (!tableRef.current) return;

    tableRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [page]);

  return (
    <RoleGuard allowedRoles={Object.values(Roles)}>
      <div className="w-full p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Listado de Asesores
          </h1>

          <div className="flex gap-2">
            <Link
              href="/CRM/dashboard/advisors/new"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <PlusIcon className="w-4 h-4" />
              Agregar asesor
            </Link>

            <button
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer"
            >
              Contenedor mensaje
            </button>
          </div>
        </div>

        <div ref={tableRef} className="bg-white rounded-lg shadow relative">
          <LoadingOverlay show={loading} text="Cargando asesores..." />

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
                info={advisors}
                view="advisors"
                rol={usuario?.role}
                loading={loading}
                error={error}
                filters={filters}
                handleFilterChange={handleFilterChange}
                setSelected={setSelectedAdvisor}
                fetchData={fetchAdvisors}
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

        {selectedAdvisor && (
          <ViewModal
            data={selectedAdvisor}
            type="advisor"
            onClose={() => setSelectedAdvisor(null)}
          />
        )}
      </div>

      {showEditor && (
        <MessageEditorModal onClose={() => setShowEditor(false)} />
      )}
    </RoleGuard>
  );
}
