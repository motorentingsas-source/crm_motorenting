import React from 'react';
import {
  formatPesosRealtime,
  normalizeDateForInput,
} from '@/lib/api/utils/utils';
import usePermissions from '@/hooks/usePermissions';

export default function Registrations({ registration }) {
  const { canViewRegistrationValues } = usePermissions();
  return (
    <details className="group border rounded-xl p-4 border-gray-200">
      <summary className="cursor-pointer font-semibold text-gray-800 text-lg flex justify-between items-center">
        Datos de Matrícula
        <span className="text-gray-400 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>

      {registration?.length > 0 ? (
        <div className="space-y-4 mt-4">
          {registration.map((register, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-gray-600"
            >
              <div>
                <p className="font-semibold">Placa</p>
                <p>{register.plate}</p>
              </div>
              {canViewRegistrationValues && (
                <>
                  <div>
                    <p className="font-semibold">Valor de SOAT</p>
                    <p>{formatPesosRealtime(register.soatValue)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Valor de Matrícula</p>
                    <p>{formatPesosRealtime(register.registerValue)}</p>
                  </div>
                </>
              )}
              <div>
                <p className="font-semibold">Fecha de Matrícula</p>
                <p>{normalizeDateForInput(register.date)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-3">No hay matrículas registradas</p>
      )}
    </details>
  );
}
