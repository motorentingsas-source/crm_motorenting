'use client';

import { useState, useEffect, useCallback } from 'react';

import Thead from './segments/thead';
import InputFilters from './segments/InputsFilters';
import ModalAdvisor from './segments/modalAdvisor';
import ChangeAdvisorModal from '../modals/changeAdvisorModal';
import AlertModal from '../modals/alertModal';
import AssignAdvisor from './segments/assignAdvisor';
import ContentData from './segments/contentData';

import useCustomers from '@/lib/api/hooks/useCustomers';
import useUsers from '@/lib/api/hooks/useUsers';
import usePermissions from '@/hooks/usePermissions';
import useApproved from '@/lib/api/hooks/useApproved';
import { Roles } from '@/config/roles';

const Table = ({
  info = [],
  view,
  rol,
  setSelected,
  setSelectedState,
  fetchData,
  filters,
  handleFilterChange,
  loading,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalChangeAdvisor, setShowModalChangeAdvisor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '', url: '' });
  const [advisors, setAdvisors] = useState([]);

  const { getUsers, deleteUser } = useUsers();
  const { assignMultipleCustomers, assignAdvisor } = useCustomers();
  const { deleteCustomer, loading: deleting } = useCustomers();
  const { downloadDeliveryOrder } = useApproved();

  const { canAssign } = usePermissions();

  const fetchAdvisors = useCallback(async () => {
    try {
      const { data } = await getUsers({ all: true });
      setAdvisors(data);
    } catch (err) {
      console.error(err);
    }
  }, [getUsers]);

  useEffect(() => {
    canAssign && fetchAdvisors();
  }, [fetchAdvisors, canAssign]);

  const handleDeleteClick = (id, name, type) => {
    setDeleteTarget({ id, name, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async (type, id) => {
    try {
      if (type === 'customers' || type === 'delivered') {
        await deleteCustomer(id);
      } else {
        await deleteUser(id);
      }

      setShowDeleteModal(false);
      setDeleteTarget(null);

      setAlert({
        type: 'success',
        message: 'Se eliminó correctamente.',
      });

      await fetchData();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error al eliminar cliente',
      });
    }
  };

  const toggleCheckbox = (info) => {
    setSelectedIds((prev) =>
      prev.includes(info.id)
        ? prev.filter((id) => id !== info.id)
        : [...prev, info.id]
    );
  };

  const handleAssignMultiple = async () => {
    if (!selectedAdvisor || selectedIds.length === 0) return;

    try {
      await assignMultipleCustomers(selectedIds, selectedAdvisor);

      setAlert({
        type: 'success',
        message: `Se asignaron ${selectedIds.length} clientes al asesor.`,
      });

      setSelectedIds([]);
      setSelectedAdvisor('');
      setShowModal(false);

      await fetchData();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error al asignar clientes',
      });
    }
  };

  const getCustomerLockState = (index, customer) => {
    if (rol !== 'ASESOR' || view !== 'customers') return false;
    if (customer.state?.name !== 'Sin Contactar') return false;
    if (customer.comments?.length > 0) return false;

    for (let i = 0; i < index; i++) {
      const prevCustomer = info[i];
      const isPrevSinContactar = prevCustomer.state?.name === 'Sin Contactar';
      const hasPrevComment = prevCustomer.comments?.length > 0;

      if (isPrevSinContactar && !hasPrevComment) {
        return true;
      }
    }

    return false;
  };

  const getCustomerLockStateSale = (view, customer) => {
    return (
      customer?.saleState === 'PENDIENTE_POR_APROBAR' &&
      view === 'customers' &&
      rol === Roles.ASESOR
    );
  };

  const handleAssignAdvisor = async (customerId, newAdvisorId) => {
    try {
      await assignAdvisor(Number(customerId), Number(newAdvisorId));

      setAlert({
        type: 'success',
        message: 'Cliente reasignado correctamente.',
      });

      await fetchData();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error al reasignar asesor',
      });
    } finally {
      setShowModalChangeAdvisor(null);
    }
  };

  const handlePrintOrder = async (customerId, nameCustomer) => {
    try {
      await downloadDeliveryOrder(customerId, nameCustomer);
    } catch (err) {
      setAlert({
        type: 'warning',
        message: err?.message || 'Error al generar la orden de entrega',
      });
    }
  };

  return (
    <>
      <AssignAdvisor
        view={view}
        selectedIds={selectedIds}
        setShowModal={setShowModal}
      />

      <table className="w-full text-sm text-left text-gray-700">
        <Thead rol={rol} view={view} />

        <tbody>
          <InputFilters
            rol={rol}
            view={view}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />

          <ContentData
            paginatedData={info}
            getCustomerLockState={getCustomerLockState}
            getCustomerLockStateSale={getCustomerLockStateSale}
            rol={rol}
            view={view}
            setSelected={setSelected}
            setSelectedState={setSelectedState}
            toggleCheckbox={toggleCheckbox}
            selectedIds={selectedIds}
            handleDeleteClick={handleDeleteClick}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            deleteTarget={deleteTarget}
            confirmDelete={confirmDelete}
            deleting={deleting}
            setShowModalChangeAdvisor={setShowModalChangeAdvisor}
            handlePrintOrder={handlePrintOrder}
            loading={loading}
          />
        </tbody>
      </table>

      {showModal && (
        <ModalAdvisor
          selectedAdvisor={selectedAdvisor}
          setShowModal={setShowModal}
          setSelectedAdvisor={setSelectedAdvisor}
          handleAssignMultiple={handleAssignMultiple}
          advisors={advisors}
        />
      )}

      {showModalChangeAdvisor && (
        <ChangeAdvisorModal
          isOpen
          onClose={() => setShowModalChangeAdvisor(null)}
          onSave={(newAdvisorId) =>
            handleAssignAdvisor(showModalChangeAdvisor.id, newAdvisorId)
          }
          currentAdvisor={showModalChangeAdvisor.advisor?.name || 'Sin asignar'}
          advisors={advisors}
        />
      )}

      <AlertModal
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '', url: '' })}
        url={alert.url}
      />
    </>
  );
};

export default Table;
