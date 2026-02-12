'use client';

import { useState } from 'react';
import { formatPesosRealtime, pesosToNumber } from '@/lib/api/utils/utils';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  MagnifyingGlassCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import AlertModal from '@/components/dashboard/modals/alertModal';
import useInvoices from '@/lib/api/hooks/useInvoices';
import CommentsManager from '@/components/dashboard/comments/commentsManager';
import { addComment } from '@/lib/api/customers';

export default function Invoices() {
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState(null);
  const [customerDocument, setCustomerDocument] = useState(null);
  const [orderNumberFromApi, setOrderNumberFromApi] = useState(null);

  const [error, setError] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '', url: '' });
  const [openInfo, setOpenInfo] = useState(false);

  const { getInvoiceByOrderNumber, updateInvoiceByOrderNumber } = useInvoices();

  const [form, setForm] = useState({
    invoiceNumber: '',
    date: '',
    value: '',
    chassisNumber: '',
    engineNumber: '',
  });
  const [comment, setComment] = useState('');

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('El número de orden o documento son obligatorios');
      return;
    }

    try {
      const { data } = await getInvoiceByOrderNumber(orderNumber);

      setCustomerName(data.customerName ?? '');
      setCustomerDocument(data.document ?? '');
      setOrderNumberFromApi(data.orderNumber ?? orderNumber);

      if (!data.customerName) {
        setError('Número de orden sin información');
        setOpenInfo(true);
        setForm({
          invoiceNumber: '',
          date: '',
          value: '',
          chassisNumber: '',
          engineNumber: '',
        });
        return;
      }

      setError('');
      setOpenInfo(false);

      setForm({
        invoiceNumber: data.invoiceNumber ?? '',
        date: data.date ? data.date.split('T')[0] : '',
        value: data.value ?? '',
        chassisNumber: data.chassisNumber ?? '',
        engineNumber: data.engineNumber ?? '',
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
    if (
      !form.invoiceNumber ||
      !form.date ||
      !form.value ||
      !form.chassisNumber ||
      !form.engineNumber
    ) {
      setAlert({
        type: 'error',
        message: 'Todos los campos son obligatorios',
      });
      return;
    }

    try {
      const { data } = await updateInvoiceByOrderNumber(
        orderNumberFromApi,
        form
      );

      if (!data) {
        setAlert({
          type: 'error',
          message: 'No se pudo registrar la factura',
        });
        return;
      }

      if (comment.trim()) {
        await addComment(data.customerId || data.id, comment.trim());
      }

      setAlert({
        type: 'success',
        message: 'Factura registrada correctamente',
      });

      clearResults();
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'warning',
        message: `${err || 'Error al registrar la factura'}`,
      });
    }
  };

  const clearResults = () => {
    setOrderNumber('');
    setCustomerName(null);
    setCustomerDocument(null);
    setOrderNumberFromApi(null);
    setForm({
      invoiceNumber: '',
      date: '',
      value: '',
      chassisNumber: '',
      engineNumber: '',
    });
    setComment('');
    setError('');
    setOpenInfo(false);
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
        Realizar Facturación
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
          <div className="bg-blue-100 text-orange-600 p-3 rounded-2xl">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Información del Cliente
            </p>
            <p className="text-sm text-gray-500">
              Datos asociados a la facturación
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

      <InvoiceForm form={form} setForm={setForm} />

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
          Guardar Factura
        </button>
      </div>
    </div>
  );
}

function InvoiceForm({ form, setForm }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-lg font-semibold text-gray-800 mb-4">
          Información de la Factura
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Número de factura
            </label>
            <input
              value={form.invoiceNumber}
              onChange={(e) =>
                setForm({ ...form, invoiceNumber: e.target.value })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="FAC-0001"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Valor
            </label>
            <input
              value={formatPesosRealtime(form.value)}
              onChange={(e) =>
                setForm({
                  ...form,
                  value: pesosToNumber(e.target.value),
                })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="$ 0"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Número de chasis
            </label>
            <input
              value={form.chassisNumber}
              onChange={(e) =>
                setForm({ ...form, chassisNumber: e.target.value })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="Ej: CHS123456"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Número de motor
            </label>
            <input
              value={form.engineNumber}
              onChange={(e) =>
                setForm({ ...form, engineNumber: e.target.value })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="Ej: ENG987654"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
