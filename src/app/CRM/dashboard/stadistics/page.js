'use client';
import { useCallback, useEffect, useState } from 'react';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import useStates from '@/lib/api/hooks/useStates';
import useStatistics from '@/lib/api/hooks/useStatistics';
import useUsers from '@/lib/api/hooks/useUsers';
import { formatLocalDate, parseLocalDate } from '@/lib/api/utils/utils';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function Stadistics() {
  const [selectedAdvisors, setSelectedAdvisors] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [states, setStates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [status, setStatus] = useState('');

  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');

  const { getUsers } = useUsers();
  const { getStates } = useStates();
  const { getStatistics } = useStatistics();

  const fetchAdvisors = useCallback(async () => {
    try {
      const { data } = await getUsers({ all: true });
      setAdvisors(data);
    } catch (err) {
      console.error(err);
    }
  }, [getUsers]);

  const fetchStates = useCallback(async () => {
    try {
      const data = await getStates();
      setStates(data);
    } catch (err) {
      console.error(err);
    }
  }, [getStates]);

  useEffect(() => {
    fetchAdvisors();
    fetchStates();
  }, [fetchAdvisors, fetchStates]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (showCalendar && !e.target.closest('.calendar-wrapper')) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedAdvisors(advisors.map((a) => a.id));
    } else {
      setSelectedAdvisors([]);
    }
    setSelectAll(!selectAll);
  };

  const handleAdvisorSelect = (id) => {
    if (selectedAdvisors.includes(id)) {
      setSelectedAdvisors(selectedAdvisors.filter((a) => a !== id));
    } else {
      setSelectedAdvisors([...selectedAdvisors, id]);
    }
  };

  const validateForm = () => {
    if (selectedAdvisors.length === 0)
      return 'Debe seleccionar al menos un asesor.';
    if (!dateRange.start || !dateRange.end)
      return 'Debe seleccionar un rango de fechas completo.';
    if (!status) return 'Debe seleccionar un estado.';
    return '';
  };

  const handleGenerateChart = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setChartData([]);
      return;
    }

    setError('');

    try {
      const payload = {
        advisors: selectedAdvisors,
        status: Number(status),
        startDate: dateRange.start,
        endDate: dateRange.end,
      };
      const response = await getStatistics(payload);
      const formatted = response.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      }));

      setChartData(formatted);
    } catch (error) {
      console.error(error);
      setError('No se pudieron cargar las estadísticas.');
    }
  };

  const maxValue =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.quantity)) : 0;

  return (
    <div className="w-full p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Estadísticas
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Filtra por asesores, fecha y estado para visualizar los resultados.
        </p>
      </div>

      {error && (
        <div className="w-full p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-gray-200">
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700 text-sm">
            Asesores <span className="text-blue-600">(mínimo 1)</span>
          </label>

          <button
            onClick={handleSelectAll}
            className="text-xs mb-3 text-blue-600 hover:text-blue-700 underline"
          >
            {selectAll ? 'Deseleccionar todos' : 'Seleccionar todos'}
          </button>

          <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50/60 shadow-inner p-3 space-y-2">
            {advisors.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAdvisors.includes(a.id)}
                  onChange={() => handleAdvisorSelect(a.id)}
                  className="accent-blue-600 h-4 w-4"
                />
                <span className="text-gray-700">{a.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col relative">
          <label className="font-semibold mb-2 text-gray-700 text-sm">
            Rango de fechas
          </label>

          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="border border-gray-300 rounded-xl p-2.5 text-sm bg-white shadow-sm hover:bg-gray-100 transition"
          >
            {dateRange.start && dateRange.end
              ? `${dateRange.start} → ${dateRange.end}`
              : 'Seleccionar rango'}
          </button>

          {showCalendar && (
            <div className="absolute z-10 mt-2 shadow-xl border rounded-xl overflow-hidden calendar-wrapper cursor-pointer">
              <DateRange
                ranges={[
                  {
                    startDate: dateRange.start
                      ? parseLocalDate(dateRange.start)
                      : new Date(),
                    endDate: dateRange.end
                      ? parseLocalDate(dateRange.end)
                      : new Date(),

                    key: 'selection',
                  },
                ]}
                onChange={(r) => {
                  setDateRange({
                    start: formatLocalDate(r.selection.startDate),
                    end: formatLocalDate(r.selection.endDate),
                  });
                }}
                locale={es}
                moveRangeOnFirstSelection={false}
                rangeColors={['lab(69 40.1 74.35)']}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700 text-sm">
            Estado <span className="text-yellow-600">(obligatorio)</span>
          </label>

          <select
            className="border border-gray-300 rounded-xl p-2.5 text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Seleccione...</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerateChart}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
          >
            📊 Generar gráfica
          </button>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-red-600">
            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            Cantidad menor
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            Cantidad mayor
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="bg-white shadow-xl border border-gray-200 rounded-3xl p-6 h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Cantidad']} />
              <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.quantity === maxValue ? '#16a34a' : '#dc2626'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
