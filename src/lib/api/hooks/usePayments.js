'use client';
import { useCallback, useState } from 'react';
import { getPaymentByOrderNumber, createPayment } from '../payments/index';

export default function usePayments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wrap = useCallback(async (fn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      return await fn(...args);
    } catch (err) {
      setError(err.message || 'Error en operación');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentByOrderNumberFn = useCallback(
    (value) => wrap(getPaymentByOrderNumber, value),
    [wrap]
  );

  const createPaymentFn = useCallback(
    (orderNumber, dto) => wrap(createPayment, orderNumber, dto),
    [wrap]
  );

  return {
    getPaymentByOrderNumber: getPaymentByOrderNumberFn,
    createPayment: createPaymentFn,
    loading,
    error,
  };
}
