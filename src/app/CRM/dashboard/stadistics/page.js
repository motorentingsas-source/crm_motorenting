'use client';

import { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import { es } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

import {
  ChartBarIcon,
  CalendarDaysIcon,
  UsersIcon,
  FunnelIcon,
  CheckCircleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

import useStatistics from '@/lib/api/hooks/useStatistics';
import useUsers from '@/lib/api/hooks/useUsers';
import useStates from '@/lib/api/hooks/useStates';
import { formatLocalDate, parseLocalDate } from '@/lib/api/utils/utils';

const COLORS = [
  '#1E40AF',
  '#1D4ED8',
  '#2563EB',
  '#3B82F6',
  '#60A5FA',
  '#065F46',
  '#047857',
  '#059669',
  '#10B981',
  '#34D399',
  '#7C2D12',
  '#9A3412',
  '#C2410C',
  '#EA580C',
  '#F97316',
  '#581C87',
  '#6B21A8',
  '#7E22CE',
  '#9333EA',
  '#A855F7',
  '#7F1D1D',
  '#991B1B',
  '#B91C1C',
  '#DC2626',
  '#EF4444',
  '#0F172A',
  '#1E293B',
  '#334155',
  '#475569',
  '#64748B',
  '#14532D',
  '#166534',
  '#15803D',
  '#16A34A',
  '#22C55E',
];

export default function Stadistics() {
  const calendarRef = useRef(null);

  const [advisors, setAdvisors] = useState([]);
  const [states, setStates] = useState([]);

  const [selectedAdvisors, setSelectedAdvisors] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showCalendar, setShowCalendar] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [statesMeta, setStatesMeta] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [error, setError] = useState('');

  const { getStatistics } = useStatistics();
  const { getUsers } = useUsers();
  const { getStates } = useStates();

  useEffect(() => {
    getUsers({ all: true }).then((r) => setAdvisors(r.data));
    getStates().then((r) => setStates(r));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAdvisor = (id) => {
    setSelectedAdvisors((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleState = (id) => {
    setSelectedStatuses((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllAdvisors = () => {
    if (selectedAdvisors.length === advisors.length) {
      setSelectedAdvisors([]);
    } else {
      setSelectedAdvisors(advisors.map((a) => a.id));
    }
  };

  const handleSelectAllStates = () => {
    if (selectedStatuses.length === states.length) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses(states.map((s) => s.id));
    }
  };

  const handleGenerateChart = async () => {
    if (
      !selectedAdvisors.length ||
      !selectedStatuses.length ||
      !dateRange.start ||
      !dateRange.end
    ) {
      setError('Debe completar todos los filtros.');
      return;
    }

    setError('');

    const payload = {
      advisors: selectedAdvisors,
      statuses: selectedStatuses,
      startDate: dateRange.start,
      endDate: dateRange.end,
    };

    const response = await getStatistics(payload);

    setTotalGeneral(response.total);
    setStatesMeta(response.statesMeta);
    setChartData(response.data);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="bg-orange-100 p-4 rounded-2xl">
          <ChartBarIcon className="w-7 h-7 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Estadísticas de Gestión
          </h1>
          <p className="text-gray-500 text-sm">
            Comparativo por asesor y estado
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-300 p-8 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <UsersIcon className="w-4 h-4 text-blue-500" />
              Asesores
            </label>
            <button
              onClick={handleSelectAllAdvisors}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Squares2X2Icon className="w-4 h-4" />
              {selectedAdvisors.length === advisors.length
                ? 'Deseleccionar'
                : 'Seleccionar todos'}
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {advisors.map((a) => (
              <button
                key={a.id}
                onClick={() => toggleAdvisor(a.id)}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-xl border text-sm transition cursor-pointer
                  ${
                    selectedAdvisors.includes(a.id)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                {a.name}
                {selectedAdvisors.includes(a.id) && (
                  <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div ref={calendarRef}>
          <label className="flex items-center gap-2 text-sm font-semibold mb-3">
            <CalendarDaysIcon className="w-4 h-4 text-green-500" />
            Rango de fechas
          </label>

          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            {dateRange.start && dateRange.end
              ? `${dateRange.start} → ${dateRange.end}`
              : 'Seleccionar rango'}
          </button>

          {showCalendar && (
            <div className="absolute z-50 mt-2 shadow-2xl border rounded-2xl bg-white">
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
                onChange={(r) =>
                  setDateRange({
                    start: formatLocalDate(r.selection.startDate),
                    end: formatLocalDate(r.selection.endDate),
                  })
                }
                locale={es}
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <FunnelIcon className="w-4 h-4 text-purple-500" />
              Estados
            </label>
            <button
              onClick={handleSelectAllStates}
              className="text-xs text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Squares2X2Icon className="w-4 h-4" />
              {selectedStatuses.length === states.length
                ? 'Deseleccionar'
                : 'Seleccionar todos'}
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {states.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleState(s.id)}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-xl border text-sm transition cursor-pointer
                  ${
                    selectedStatuses.includes(s.id)
                      ? 'bg-purple-50 border-purple-500 text-purple-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                {s.name}
                {selectedStatuses.includes(s.id) && (
                  <CheckCircleIcon className="w-4 h-4 text-purple-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerateChart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg transition cursor-pointer"
          >
            Generar Reporte
          </button>
        </div>
      </div>

      {chartData.length > 0 && (
        <>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-lg font-semibold">Total General</h2>
            <p className="text-3xl font-bold">{totalGeneral}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-300 p-6">
            <div className="relative">
              <ResponsiveContainer
                width="100%"
                height={Math.max(500, chartData.length * 60)}
              >
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    horizontal={true}
                    vertical={false}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={200}
                    tick={({ x, y, payload }) => {
                      const advisor = chartData.find(
                        (a) => a.name === payload.value
                      );

                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text
                            x={0}
                            y={0}
                            dy={4}
                            textAnchor="end"
                            fill="#111827"
                            fontSize={13}
                            fontWeight="600"
                          >
                            {payload.value}
                          </text>

                          <text
                            x={0}
                            y={0}
                            dy={20}
                            textAnchor="end"
                            fill="#9CA3AF"
                            fontSize={11}
                          >
                            Total: {advisor?.total ?? 0}
                          </text>
                        </g>
                      );
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;

                      return (
                        <div className="bg-white shadow-2xl border rounded-xl p-3 text-xs min-w-[180px]">
                          <p className="font-semibold text-gray-800 mb-2">
                            {label}
                          </p>

                          <div className="space-y-1">
                            {payload.map((entry, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center gap-4"
                              >
                                <span className="flex items-center gap-2 text-gray-600">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  {entry.name}
                                </span>

                                <span className="font-semibold text-gray-800">
                                  {entry.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }}
                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    wrapperStyle={{ zIndex: 9999 }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={40}
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingTop: '20px',
                    }}
                  />

                  {statesMeta.map((state, index) => (
                    <Bar
                      key={state.id}
                      dataKey={`states.${state.id}`}
                      name={state.name}
                      fill={COLORS[index % COLORS.length]}
                      radius={[0, 8, 8, 0]}
                      animationDuration={450}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
