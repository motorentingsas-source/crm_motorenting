'use client';

import { useState } from 'react';
import { formatPesosRealtime, pesosToNumber } from '@/lib/api/utils/utils';
import {
  MagnifyingGlassCircleIcon,
  CurrencyDollarIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import usePayments from '@/lib/api/hooks/usePayments';
import AlertModal from '@/components/dashboard/modals/alertModal';
import CommentsManager from '@/components/dashboard/comments/commentsManager';
import { addComment } from '@/lib/api/customers';

export default function Payments() {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [comment, setComment] = useState('');

  const [form, setForm] = useState({
    receiptNumber: '',
    date: '',
    amount: '',
  });

  const [alert, setAlert] = useState({ type: '', message: '', url: '' });

  const { getPaymentByOrderNumber, createPayment } = usePayments();

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('El número de orden o documento son obligatorios');
      return;
    }

    try {
      const { data } = await getPaymentByOrderNumber(searchValue);

      if (!data || !data.orderNumber) {
        setError('Cliente sin información financiera');
        setResults(null);
        return;
      }

      setError('');
      setResults(data);

      setForm({
        receiptNumber: '',
        date: '',
        amount: '',
      });
    } catch (err) {
      setError(err.message || 'Error al buscar');
      setResults(null);
    }
  };

  const handleSavePayment = async () => {
    if (!results) return;

    const { receiptNumber, date, amount } = form;

    if (!receiptNumber || !date || !amount) {
      setAlert({
        type: 'error',
        message: 'Todos los campos son obligatorios',
      });
      return;
    }

    try {
      const { data } = await createPayment(results.id, {
        receiptNumber,
        date,
        amount,
      });

      if (!data) {
        setAlert({
          type: 'error',
          message: 'No se pudo registrar el pago',
        });
        return;
      }

      if (comment.trim()) {
        await addComment(results.id, comment.trim());
      }

      setAlert({
        type: 'success',
        message: 'Pago registrado correctamente',
      });

      setComment('');
      setOpenModal(false);
      handleSearch();
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Error al registrar pago',
      });
    }
  };

  const clearResults = () => {
    setResults(null);
    setSearchValue('');
    setComment('');
    setForm({ receiptNumber: '', date: '', amount: '' });
    setError('');
    setOpenModal(false);
  };

  return (
    <div className="w-full p-4 space-y-6">
      <Header />

      <SearchOrder
        value={searchValue}
        setValue={setSearchValue}
        handleSearch={handleSearch}
        error={error}
      />

      {results && (
        <ResultsTable
          results={results}
          onPayClick={() => setOpenModal(true)}
          clearResults={clearResults}
        />
      )}

      {openModal && (
        <PaymentModal
          form={form}
          setForm={setForm}
          onClose={() => setOpenModal(false)}
          onSave={handleSavePayment}
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
        Realizar Pagos
      </h1>
    </div>
  );
}

function SearchOrder({ value, setValue, handleSearch, error }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
      <label className="block text-gray-700 font-semibold mb-2">
        Número de orden o Cédula del cliente
      </label>

      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ej: MR0001 o 1023456789"
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />

        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <MagnifyingGlassCircleIcon className="w-5 h-5" />
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

function ResultsTable({ results, onPayClick, clearResults }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
            <CurrencyDollarIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Información del Cliente
            </p>
            <p className="text-sm text-gray-500">Datos asociados</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-2xl">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Documento
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {results.document}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Nombre
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {results.customerName}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Número de Orden
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {results.orderNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-orange-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Saldo por pagar</p>
          <p className="text-xl font-bold text-orange-600">
            {formatPesosRealtime(results.outstandingBalance || 0)}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Saldo a favor</p>
          <p className="text-xl font-bold text-green-600">
            {formatPesosRealtime(results.creditBalance || 0)}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={clearResults}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl 
            border border-gray-200 text-gray-600 
            hover:bg-gray-50 hover:border-gray-300
            transition active:scale-95 shadow-sm cursor-pointer"
        >
          <TrashIcon className="w-5 h-5" />
          Limpiar resultados
        </button>

        {results.outstandingBalance > 0 && (
          <button
            onClick={onPayClick}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            Registrar Pago
          </button>
        )}
      </div>
    </div>
  );
}

function PaymentModal({ form, setForm, onClose, onSave, comment, setComment }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 p-8 animate-[fadeIn_.2s_ease-out]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Registrar Pago
              </h2>
              <p className="text-sm text-gray-500">
                Ingrese la información del recibo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Número de recibo
            </label>
            <input
              value={form.receiptNumber}
              onChange={(e) =>
                setForm({ ...form, receiptNumber: e.target.value })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="Ej: REC-0001"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Fecha del pago
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
              Valor del pago
            </label>
            <input
              value={form.amount ? formatPesosRealtime(form.amount) : ''}
              onChange={(e) =>
                setForm({ ...form, amount: pesosToNumber(e.target.value) })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="$ 0"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <CommentsManager
              value={comment}
              onChange={setComment}
              label="Observación (opcional)"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={onSave}
            className="px-6 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            Guardar Pago
          </button>
        </div>
      </div>
    </div>
  );
}
