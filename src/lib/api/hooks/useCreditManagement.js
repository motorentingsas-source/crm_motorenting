'use client';
import { useCallback, useState } from 'react';
import {
  getAllCreditManagement,
  updateCreditStatus,
} from '../creditManagement/index';

export default function useCreditManagement() {
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

  const getAllCreditManagementFn = useCallback(
    (page, limit) => wrap(getAllCreditManagement, page, limit),
    [wrap]
  );

  const updateCreditStatusFn = useCallback(
    (id, status) => wrap(updateCreditStatus, id, status),
    [wrap]
  );

  return {
    getAllCreditManagement: getAllCreditManagementFn,
    updateCreditStatus: updateCreditStatusFn,
    loading,
    error,
  };
}
