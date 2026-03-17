'use client';
import { useCallback, useState } from 'react';
import {
  getAllMotoForDelivery,
  updateMotoForDeliveryStatus,
  getMotorcyclesScheduled,
  createEvidenceMotorcyclesScheduled,
  updateDeliveryStatus,
} from '../motoForDelivery/index';

export default function useMotoForDelivery() {
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

  const getAllMotoForDeliveryFn = useCallback(
    (page, limit) => wrap(getAllMotoForDelivery, page, limit),
    [wrap]
  );

  const updateMotoForDeliveryStatusFn = useCallback(
    (id, status) => wrap(updateMotoForDeliveryStatus, id, status),
    [wrap]
  );

  const getMotorcyclesScheduledFn = useCallback(
    (page, limit) => wrap(getMotorcyclesScheduled, page, limit),
    [wrap]
  );

  const createEvidenceMotorcyclesScheduledFn = useCallback(
    (scheduleId, { deliveredAt, photoOne, photoTwo }) =>
      wrap(createEvidenceMotorcyclesScheduled, scheduleId, {
        deliveredAt,
        photoOne,
        photoTwo,
      }),
    [wrap]
  );

  const updateDeliveryStatusFn = useCallback(
    (id, status) => wrap(updateDeliveryStatus, id, status),
    [wrap]
  );

  return {
    getAllMotoForDelivery: getAllMotoForDeliveryFn,
    updateMotoForDeliveryStatus: updateMotoForDeliveryStatusFn,
    getMotorcyclesScheduled: getMotorcyclesScheduledFn,
    createEvidenceMotorcyclesScheduled: createEvidenceMotorcyclesScheduledFn,
    updateDeliveryStatus: updateDeliveryStatusFn,
    loading,
    error,
  };
}
