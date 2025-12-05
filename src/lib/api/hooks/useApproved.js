'use client';
import { useCallback, useState } from 'react';
import {
  getPreApproveds,
  getApproveds,
  getApprovedById,
  createApproved,
  updateApproved,
  deleteApproved,
  addComment,
} from '../approved/index';

export default function useApproved() {
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

  const getPreApprovedsFn = useCallback(() => wrap(getPreApproveds), [wrap]);
  const getApprovedsFn = useCallback(() => wrap(getApproveds), [wrap]);
  const getApprovedByIdFn = useCallback(
    (id) => wrap(getApprovedById, id),
    [wrap]
  );
  const createApprovedFn = useCallback(
    (dto) => wrap(createApproved, dto),
    [wrap]
  );
  const updateApprovedFn = useCallback(
    (id, dto) => wrap(updateApproved, id, dto),
    [wrap]
  );
  const deleteApprovedFn = useCallback(
    (id) => wrap(deleteApproved, id),
    [wrap]
  );
  const addCommentFn = useCallback(
    (id, desc) => wrap(addComment, id, desc),
    [wrap]
  );
  return {
    getPreApproveds: getPreApprovedsFn,
    getApproveds: getApprovedsFn,
    getApprovedById: getApprovedByIdFn,
    createApproved: createApprovedFn,
    updateApproved: updateApprovedFn,
    deleteApproved: deleteApprovedFn,
    addComment: addCommentFn,
    loading,
    error,
  };
}
