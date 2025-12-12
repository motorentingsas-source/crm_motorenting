'use client';

import React, { useState, useEffect } from 'react';
import Holders from './approve/holders';
import Purchase from './approve/purchase';
import CashReceipts from './approve/cashReceipts';
import Payments from './approve/payments';
import Distributor from './approve/distributor';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import useApproved from '@/lib/api/hooks/useApproved';
import AlertModal from '../../modals/alertModal';

export default function Approve({ data }) {
  const [holders, setHolders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [purchase, setPurchase] = useState({
    brand: '',
    reference: '',
    mainColor: '',
    optionalColor: '',
    commercialValue: 0,
    processValue: 0,
    totalValue: 0,
  });
  const [distributor, setDistributor] = useState('');
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '', url: '' });

  const { createApproved } = useApproved();

  useEffect(() => {
    if (!data) return;

    setHolders(data.holders ?? []);
    setPayments(data.payments ?? []);
    setReceipts(data.receipts ?? []);
    setDistributor(data.distributor ?? '');

    if (data.purchase) {
      setPurchase({
        brand: data.purchase.brand || '',
        reference: data.purchase.reference || '',
        mainColor: data.purchase.mainColor || '',
        optionalColor: data.purchase.optionalColor || '',
        commercialValue: data.purchase.commercialValue || 0,
        processValue: data.purchase.processValue || 0,
        totalValue:
          Number(data.purchase.commercialValue || 0) +
          Number(data.purchase.processValue || 0),
      });
    }
  }, [data]);

  useEffect(() => {
    const totalValue =
      Number(purchase.commercialValue || 0) +
      Number(purchase.processValue || 0);
    setPurchase((prev) => ({ ...prev, totalValue }));
  }, [purchase.commercialValue, purchase.processValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const purchaseErrors = validatePurchase();
    const holdersErrors = validateHolders();
    const paymentsErrors = validatePayments();
    const receiptsErrors = validateReceipts();

    const allErrors = {
      ...purchaseErrors,
      ...holdersErrors,
      ...paymentsErrors,
      ...receiptsErrors,
    };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    const dataApproved = {
      saleState: 'APROBADO',
      distributor,
      holders,
      purchase,
      payments,
      receipts,
    };

    try {
      await createApproved(Number(data.id), dataApproved);
      setAlert({
        type: 'success',
        message: 'Cliente aprobado correctamente.',
        url: `/CRM/dashboard/approved`,
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error al actualizar cliente',
      });
    }
  };

  const addHolder = () =>
    setHolders([
      ...holders,
      {
        fullName: '',
        document: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        financialEntity: '',
        isNew: true,
      },
    ]);

  const addPayment = () =>
    setPayments([
      ...payments,
      {
        financialEntity: '',
        totalPayment: '',
        aval: '',
        approvalDate: '',
        isNew: true,
      },
    ]);

  const addReceipt = () =>
    setReceipts([
      ...receipts,
      { receiptNumber: '', date: '', amount: '', isNew: true },
    ]);

  const validatePurchase = () => {
    const e = {};
    if (!purchase.brand) e.brand = true;
    if (!purchase.reference) e.reference = true;
    if (!purchase.mainColor) e.mainColor = true;
    if (!purchase.optionalColor) e.optionalColor = true;
    if (!purchase.commercialValue) e.commercialValue = true;
    if (!purchase.processValue) e.processValue = true;
    if (!distributor) e.distributor = true;
    return e;
  };

  const validateHolders = () => {
    const e = {};
    holders.forEach((h, i) => {
      if (!h.isNew) return;
      if (!h.fullName) e[`holder-${i}-fullName`] = true;
      if (!h.document) e[`holder-${i}-document`] = true;
      if (!h.email) e[`holder-${i}-email`] = true;
      if (!h.phone) e[`holder-${i}-phone`] = true;
      if (!h.address) e[`holder-${i}-address`] = true;
      if (!h.city) e[`holder-${i}-city`] = true;
      if (!h.financialEntity) e[`holder-${i}-financialEntity`] = true;
    });
    return e;
  };

  const validatePayments = () => {
    const e = {};
    payments.forEach((p, i) => {
      if (!p.isNew) return;
      if (!p.financialEntity) e[`payment-${i}-financialEntity`] = true;
      if (!p.totalPayment) e[`payment-${i}-totalPayment`] = true;
      if (!p.aval) e[`payment-${i}-aval`] = true;
      if (!p.approvalDate) e[`payment-${i}-approvalDate`] = true;
    });
    return e;
  };

  const validateReceipts = () => {
    const e = {};
    receipts.forEach((r, i) => {
      if (!r.isNew) return;
      if (!r.receiptNumber) e[`receipt-${i}-receiptNumber`] = true;
      if (!r.date) e[`receipt-${i}-date`] = true;
      if (!r.amount) e[`receipt-${i}-amount`] = true;
    });
    return e;
  };

  return (
    <div className="space-y-8 p-4">
      <Holders
        addHolder={addHolder}
        holders={holders}
        errors={errors}
        setHolders={setHolders}
      />
      <Purchase purchase={purchase} errors={errors} setPurchase={setPurchase} />
      <Payments
        addPayment={addPayment}
        errors={errors}
        payments={payments}
        setPayments={setPayments}
      />
      <CashReceipts
        addReceipt={addReceipt}
        errors={errors}
        receipts={receipts}
        setReceipts={setReceipts}
      />
      <Distributor
        distributor={distributor}
        errors={errors}
        setDistributor={setDistributor}
      />

      <section>
        {Object.keys(errors).length > 0 && (
          <p className="text-sm text-red-600">
            Hay campos obligatorios por llenar.
          </p>
        )}
      </section>

      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent bg-blue-600 text-white font-medium rounded-lg hover:bg-white hover:text-orange-600 hover:border-orange-600 transition-colors duration-200 cursor-pointer"
        >
          <CheckCircleIcon className="w-5 h-5" />
          {data && (data.purchase || data.holders?.length > 0)
            ? 'Actualizar'
            : 'Guardar y Aprobar'}
        </button>
      </div>

      <AlertModal
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
        url={alert.url}
      />
    </div>
  );
}
