'use client';

import { useState } from 'react';
import { formatPesosRealtime, pesosToNumber } from '@/lib/api/utils/utils';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import AlertModal from '@/components/dashboard/modals/alertModal';
import useInvoices from '@/lib/api/hooks/useInvoices';

export default function Invoices() {
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState(null);
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

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('El número de orden es obligatorio');
      return;
    }

    try {
      const { data } = await getInvoiceByOrderNumber(orderNumber);
      if (!data.customerName) {
        setError('Número de orden sin información');
        setCustomerName(data.customerName ?? '');
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
      setCustomerName(data.customerName ?? '');

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
      const { data } = await updateInvoiceByOrderNumber(orderNumber, form);

      if (!data) {
        setAlert({
          type: 'error',
          message: 'No se pudo registrar la factura',
        });
        return;
      }

      setAlert({
        type: 'success',
        message: 'Factura registrada correctamente',
      });
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'warning',
        message: `${err || 'Error al registrar la factura'} `,
      });
    }
  };

  const clearResults = () => {
    setOrderNumber('');
    setCustomerName(null);
    setForm({
      invoiceNumber: '',
      date: '',
      value: '',
      chassisNumber: '',
      engineNumber: '',
    });
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
          form={form}
          setForm={setForm}
          handleSave={handleSave}
          clearResults={clearResults}
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
        Número de Orden
      </label>

      <div className="flex gap-3">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Ej: MRS0001"
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
  form,
  setForm,
  handleSave,
  clearResults,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 space-y-6">
      <div>
        <p className="text-gray-700 font-semibold">Cliente:</p>
        <p className="text-gray-900 text-lg font-medium">{customerName}</p>
      </div>

      <InvoiceForm form={form} setForm={setForm} />

      <div className="flex justify-end">
        <button
          onClick={clearResults}
          className="px-5 py-2 bg-orange-500 hover:bg-white border hover:border-orange-500 
          hover:text-orange-500 text-gray-100 font-semibold rounded-xl shadow-sm 
          transition active:scale-95 cursor-pointer"
        >
          Limpiar resultados
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2 ml-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md 
          transition active:scale-95 cursor-pointer"
        >
          Guardar Factura
        </button>
      </div>
    </div>
  );
}

function InvoiceForm({ form, setForm }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        placeholder="Número"
        value={form.invoiceNumber}
        onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
        focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
        focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />

      <input
        placeholder="Valor"
        value={formatPesosRealtime(form.value)}
        onChange={(e) =>
          setForm({ ...form, value: pesosToNumber(e.target.value) })
        }
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
        focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />

      <input
        placeholder="Número de chasis"
        value={form.chassisNumber}
        onChange={(e) => setForm({ ...form, chassisNumber: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
        focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />

      <input
        placeholder="Número de motor"
        value={form.engineNumber}
        onChange={(e) => setForm({ ...form, engineNumber: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
        focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );
}
