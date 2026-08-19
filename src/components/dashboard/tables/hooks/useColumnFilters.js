'use client';

import { useCallback, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Estado compartido de los filtros de una tabla: valores, paginación y
 * protección frente a respuestas que llegan fuera de orden.
 *
 * Reglas:
 *  - Al cambiar cualquier filtro se vuelve a la página 1. Si no, filtrar
 *    estando en la página 3 devolvía una tabla vacía.
 *  - Cambiar las filas por página también vuelve a la página 1.
 *  - `runLatest` descarta la respuesta de una petición que ha quedado obsoleta
 *    porque el usuario siguió escribiendo.
 */
export default function useColumnFilters(initial = {}, { delay = 300 } = {}) {
  const [filters, setFilters] = useState(initial);
  const [page, setPage] = useState(1);
  const [limit, setLimitValue] = useState(10);

  const debouncedFilters = useDebounce(filters, delay);

  const initialRef = useRef(initial);
  const requestRef = useRef(0);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPage(1);
  };

  const setLimit = useCallback((value) => {
    setLimitValue(Number(value) || 10);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialRef.current);
    setPage(1);
  }, []);

  /**
   * Ejecuta la petición y devuelve `undefined` si mientras tanto se lanzó otra
   * más reciente, para que una respuesta vieja no pise a la nueva en pantalla.
   */
  const runLatest = useCallback(async (request) => {
    const id = ++requestRef.current;
    const result = await request();

    return requestRef.current === id ? result : undefined;
  }, []);

  return {
    filters,
    setFilters,
    handleFilterChange,
    clearFilters,
    debouncedFilters,
    page,
    setPage,
    limit,
    setLimit,
    runLatest,
  };
}
