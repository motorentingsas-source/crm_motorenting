'use client';

import { useState } from 'react';
import { formatPesosRealtime, pesosToNumber } from '@/lib/api/utils/utils';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import AlertModal from '@/components/dashboard/modals/alertModal';
import useRegistrations from '@/lib/api/hooks/useRegistrations';

export default function Registrations() {
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState(null);
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

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('El número de orden es obligatorio');
      return;
    }

    try {
      const { data } = await getRegistrationByOrderNumber(orderNumber);
      if (!data.customerName) {
        setError('Número de orden sin información');
        setCustomerName(data.customerName ?? '');
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
      const { data } = await updateRegistrationByOrderNumber(orderNumber, form);

      if (!data) {
        setAlert({
          type: 'error',
          message: 'No se pudo registrar la matrícula',
        });
        return;
      }

      setAlert({
        type: 'success',
        message: 'Matricula realizada correctamente',
      });
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
        Realizar Matricula
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
          placeholder="Ej: MR0001"
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
          Guardar Matricula
        </button>
      </div>
    </div>
  );
}

function InvoiceForm({ form, setForm }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        placeholder="Placa"
        value={form.plate}
        onChange={(e) => setForm({ ...form, plate: e.target.value })}
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
        placeholder="Valor de SOAT"
        value={formatPesosRealtime(form.soatValue)}
        onChange={(e) =>
          setForm({ ...form, soatValue: pesosToNumber(e.target.value) })
        }
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
        focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />

      <input
        placeholder="Valor de matrícula"
        value={formatPesosRealtime(form.registerValue)}
        onChange={(e) =>
          setForm({ ...form, registerValue: pesosToNumber(e.target.value) })
        }
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
        focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );
}
