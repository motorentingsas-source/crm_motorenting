'use client';

import { useState } from 'react';
import { formatPesosRealtime, pesosToNumber } from '@/lib/api/utils/utils';
import {
  CheckCircleIcon,
  IdentificationIcon,
  MagnifyingGlassCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import AlertModal from '@/components/dashboard/modals/alertModal';
import useRegistrations from '@/lib/api/hooks/useRegistrations';
import CommentsManager from '@/components/dashboard/comments/commentsManager';
import { addComment } from '@/lib/api/customers';

export default function Registrations() {
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState(null);
  const [customerDocument, setCustomerDocument] = useState(null);
  const [orderNumberFromApi, setOrderNumberFromApi] = useState(null);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '', url: '' });
  const [openInfo, setOpenInfo] = useState(false);

  const { getRegistrationByOrderNumber, updateRegistrationByOrderNumber } =
    useRegistrations();

  const [form, setForm] = useState({
    plate: '',
    date: '',
    soatValue: '',
    registerValue: '',
  });
  const [comment, setComment] = useState('');

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('El número de orden o documento son obligatorios');
      return;
    }

    try {
      const { data } = await getRegistrationByOrderNumber(orderNumber);
      setCustomerName(data.customerName ?? '');
      setCustomerDocument(data.document ?? '');
      setOrderNumberFromApi(data.orderNumber ?? orderNumber);

      if (!data.customerName) {
        setError('Número de orden sin información');
        setOpenInfo(true);
        setForm({
          plate: '',
          date: '',
          soatValue: '',
          registerValue: '',
        });
        return;
      }

      setError('');
      setCustomerName(data.customerName ?? '');

      setForm({
        plate: data.plate ?? '',
        date: data.date ? data.date.split('T')[0] : '',
        soatValue: data.soatValue ?? '',
        registerValue: data.registerValue ?? '',
      });
    } catch (err) {
      setError(err.message || 'Error al buscar la orden');
      setOpenInfo(false);
      setCustomerName(null);
      setCustomerDocument(null);
      setOrderNumberFromApi(null);
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!form.plate || !form.date || !form.soatValue || !form.registerValue) {
      setAlert({
        type: 'error',
        message: 'Todos los campos son obligatorios',
      });
      return;
    }

    try {
      const { data } = await updateRegistrationByOrderNumber(
        orderNumberFromApi,
        form
      );

      if (!data) {
        setAlert({
          type: 'error',
          message: 'No se pudo registrar la matrícula',
        });
        return;
      }

      if (comment.trim()) {
        await addComment(data.customerId || data.id, comment.trim());
      }

      setAlert({
        type: 'success',
        message: 'Matrícula registrada correctamente',
      });
      clearResults();
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'warning',
        message: `${err || 'Error al registrar la matrícula'} `,
      });
    }
  };

  const clearResults = () => {
    setOrderNumber('');
    setCustomerName(null);
    setForm({
      plate: '',
      date: '',
      soatValue: '',
      registerValue: '',
    });
    setComment('');
    setError('');
  };

  return (
    <div className="w-full p-4 space-y-6">
      <Header />

      <SearchOrder
        orderNumber={orderNumber}
        setOrderNumber={setOrderNumber}
        handleSearch={handleSearch}
        error={error}
      />

      {(customerName || openInfo) && (
        <ResultsTable
          customerName={customerName}
          document={customerDocument}
          orderNumber={orderNumberFromApi}
          form={form}
          setForm={setForm}
          handleSave={handleSave}
          clearResults={clearResults}
          comment={comment}
          setComment={setComment}
        />
      )}

      <AlertModal
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '', url: '' })}
      />
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
        Realizar Matricula
      </h1>
    </div>
  );
}

function SearchOrder({ orderNumber, setOrderNumber, handleSearch, error }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
      <label className="block text-gray-700 font-semibold mb-2">
        Número de orden o Cédula del cliente
      </label>

      <div className="flex gap-3">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Ej: MR0001 o 1023456789"
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm 
          shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />

        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md 
          flex items-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <MagnifyingGlassCircleIcon className="w-5 h-5" />
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

function ResultsTable({
  customerName,
  document,
  orderNumber,
  form,
  setForm,
  handleSave,
  clearResults,
  comment,
  setComment,
}) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
            <IdentificationIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Información del Cliente
            </p>
            <p className="text-sm text-gray-500">
              Datos asociados a la matrícula
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-2xl">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Documento
            </p>
            <p className="text-sm font-semibold text-gray-800">{document}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Nombre
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {customerName}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Número de Orden
            </p>
            <p className="text-sm font-semibold text-gray-800">{orderNumber}</p>
          </div>
        </div>
      </div>

      <RegistrationForm form={form} setForm={setForm} />

      <div className="pt-6 border-t border-gray-100">
        <CommentsManager
          value={comment}
          onChange={setComment}
          label="Observación (opcional)"
        />
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
        <button
          onClick={clearResults}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl 
            border border-gray-200 text-gray-600 
            hover:bg-gray-50 hover:border-gray-300
            transition active:scale-95 shadow-sm cursor-pointer"
        >
          <TrashIcon className="w-5 h-5" />
          Limpiar
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl 
          bg-orange-600 hover:bg-orange-700 
          text-white font-medium shadow-md 
          transition active:scale-95 cursor-pointer"
        >
          <CheckCircleIcon className="w-5 h-5" />
          Guardar Matrícula
        </button>
      </div>
    </div>
  );
}

function RegistrationForm({ form, setForm }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-lg font-semibold text-gray-800 mb-4">
          Datos de Matrícula
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Placa
            </label>
            <input
              value={form.plate}
              onChange={(e) =>
                setForm({ ...form, plate: e.target.value.toUpperCase() })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="ABC123"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Fecha de matrícula
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold text-gray-800 mb-4">Valores</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Valor de SOAT
            </label>
            <input
              value={formatPesosRealtime(form.soatValue)}
              onChange={(e) =>
                setForm({
                  ...form,
                  soatValue: pesosToNumber(e.target.value),
                })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="$ 0"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Valor de matrícula
            </label>
            <input
              value={formatPesosRealtime(form.registerValue)}
              onChange={(e) =>
                setForm({
                  ...form,
                  registerValue: pesosToNumber(e.target.value),
                })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="$ 0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
