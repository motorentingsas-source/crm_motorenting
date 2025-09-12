'use client';

import { useState, useEffect } from 'react';
import apiFetch from './client';

export default function useApi(path, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(path, {
        method: 'GET',
        auth: options.auth !== false,
      });
      setData(res);
    } catch (err) {
      setError(err.message || 'Error al obtener datos');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    execute();
  }, [path]);

  return { data: data?.data || [], loading, error, execute };
}
