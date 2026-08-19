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
import CommentsManager from '../../comments/commentsManager';
import { addComment } from '@/lib/api/customers';
import TradeIns from './approve/tradeIns';
import OtherPurchases from './approve/otherPurchases';

export default function Approve({
  data,
  onClose,
  redirectTo = '/CRM/dashboard/approved',
}) {
  const [holders, setHolders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [tradeIns, setTradeIns] = useState([]);
  const [otherPurchases, setOtherPurchases] = useState([]);
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
  const [comment, setComment] = useState('');

  const { createApproved } = useApproved();

  // El expediente ya existe: se está actualizando, no aprobando por primera vez.
  const isUpdate = Boolean(data?.purchase || data?.holders?.length > 0);

  useEffect(() => {
    if (!data) return;
    setHolders([...(data.holders ?? [])]);
    setPayments([...(data.payments ?? [])]);
    setReceipts([...(data.receipts ?? [])]);
    setTradeIns([...(data.tradeIns ?? [])]);
    setOtherPurchases([...(data.otherPurchases ?? [])]);
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
    const tradeInsErrors = validateTradeIns();
    const otherPurchasesErrors = validateOtherPurchases();

    const allErrors = {
      ...purchaseErrors,
      ...holdersErrors,
      ...paymentsErrors,
      ...receiptsErrors,
      ...tradeInsErrors,
      ...otherPurchasesErrors,
    };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    const dataApproved = {
      saleState: 'APROBADO',
      holders,
      purchase,
      payments,
      tradeIns,
      otherPurchases,
      receipts,
      distributor,
    };

    try {
      await createApproved(Number(data.id), dataApproved);

      if (comment.trim()) {
        await addComment(Number(data.id), comment.trim());
      }

      setAlert({
        type: 'success',
        message: isUpdate
          ? 'Cliente actualizado correctamente.'
          : 'Cliente aprobado correctamente.',
        url: redirectTo,
      });

      setComment('');
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

  const removeHolder = (index) => {
    setHolders((prev) => prev.filter((_, i) => i !== index));
  };

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

  const removePayment = (index) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  };

  const addReceipt = () =>
    setReceipts([
      ...receipts,
      { receiptNumber: '', date: '', amount: '', isNew: true },
    ]);

  const removeReceipt = (index) => {
    setReceipts((prev) => prev.filter((_, i) => i !== index));
  };

  const addTradeIns = () =>
    setTradeIns([
      ...tradeIns,
      {
        plate: '',
        reference: '',
        brand: '',
        model: '',
        value: '',
        isNew: true,
      },
    ]);

  const removeTradeIn = (index) => {
    setTradeIns((prev) => prev.filter((_, i) => i !== index));
  };

  const addOtherPurchases = () =>
    setOtherPurchases([
      ...otherPurchases,
      {
        description: '',
        value: '',
        isNew: true,
      },
    ]);

  const removeOtherPurchases = (index) => {
    setOtherPurchases((prev) => prev.filter((_, i) => i !== index));
  };

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

  const validateTradeIns = () => {
    const e = {};
    tradeIns.forEach((t, i) => {
      if (!t.isNew) return;
      if (!t.plate) e[`tradeIns-${i}-plate`] = true;
      if (!t.reference) e[`tradeIns-${i}-reference`] = true;
      if (!t.brand) e[`tradeIns-${i}-brand`] = true;
      if (!t.model) e[`tradeIns-${i}-model`] = true;
      if (!t.value) e[`tradeIns-${i}-value`] = true;
    });
    return e;
  };

  const validateOtherPurchases = () => {
    const e = {};
    otherPurchases.forEach((t, i) => {
      if (!t.isNew) return;
      if (!t.description) e[`otherPurchases-${i}-description`] = true;
      if (!t.value) e[`otherPurchases-${i}-value`] = true;
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
        removeHolder={removeHolder}
        holders={holders}
        errors={errors}
        setHolders={setHolders}
      />
      <Purchase purchase={purchase} errors={errors} setPurchase={setPurchase} />
      <Payments
        addPayment={addPayment}
        removePayment={removePayment}
        payments={payments}
        errors={errors}
        setPayments={setPayments}
      />
      <CashReceipts
        addReceipt={addReceipt}
        removeReceipt={removeReceipt}
        removePayment={removePayment}
        receipts={receipts}
        errors={errors}
        setReceipts={setReceipts}
      />
      <TradeIns
        addTradeIns={addTradeIns}
        removeTradeIn={removeTradeIn}
        tradeIns={tradeIns}
        errors={errors}
        setTradeIns={setTradeIns}
      />
      <OtherPurchases
        addOtherPurchases={addOtherPurchases}
        removeOtherPurchases={removeOtherPurchases}
        otherPurchases={otherPurchases}
        errors={errors}
        setOtherPurchases={setOtherPurchases}
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

      <div className="pt-4 border-t border-gray-100">
        <CommentsManager
          value={comment}
          onChange={setComment}
          label="Observación (opcional)"
        />
      </div>

      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent bg-blue-600 text-white font-medium rounded-lg hover:bg-white hover:text-orange-600 hover:border-orange-600 transition-colors duration-200 cursor-pointer"
        >
          <CheckCircleIcon className="w-5 h-5" />
          {isUpdate ? 'Actualizar' : 'Guardar y Aprobar'}
        </button>
      </div>

      <AlertModal
        type={alert.type}
        message={alert.message}
        onClose={() =>
          setAlert({ type: '', message: '', url: '' }, onClose(true))
        }
        url={alert.url}
      />
    </div>
  );
}
