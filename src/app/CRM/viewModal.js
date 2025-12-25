'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import CommentsHistory from '@/components/dashboard/comments/CommentsHistory';
import { normalizeDateForInput, formatEnumText } from '@/lib/api/utils/utils';
import Holders from '@/components/dashboard/viewModal/holders';
import Payments from '@/components/dashboard/viewModal/payments';
import Receipts from '@/components/dashboard/viewModal/receipts';
import Purchase from '@/components/dashboard/viewModal/purchase';
import Invoices from '@/components/dashboard/viewModal/Invoices';
import Registrations from '@/components/dashboard/viewModal/Registrations';

export default function ViewModal({ data, type, onClose }) {
  if (!data) return null;

  const isDelivered = type === 'delivered';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full relative overflow-hidden 
          ${type === 'advisor' ? 'max-w-4xl' : 'max-w-5xl'}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition cursor-pointer"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        <div className="bg-gradient-to-r from-orange-500 to-gray-900 text-white px-6 py-5 rounded-t-2xl">
          <h2 className="text-2xl font-bold">
            {isDelivered
              ? 'Detalles de Cliente Entregado'
              : `Detalles del ${type === 'advisor' ? 'Asesor' : 'Cliente'}`}
          </h2>

          <p className="text-sm opacity-80">
            {isDelivered
              ? 'Información final de la entrega'
              : 'Información completa y estado'}
          </p>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          <details open className="group border rounded-xl p-4 border-gray-200">
            <summary className="cursor-pointer font-semibold text-gray-800 text-lg flex justify-between items-center">
              Información General
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-gray-600">
              <div>
                <p className="font-semibold">Nombre</p>
                <p>{data.name}</p>
              </div>
              <div>
                <p className="font-semibold">Correo</p>
                <p>{data.email || 'No disponible'}</p>
              </div>
              <div>
                <p className="font-semibold">Teléfono</p>
                <p>{data.phone || 'No disponible'}</p>
              </div>
              <div>
                <p className="font-semibold">Ciudad</p>
                <p>{data.city || 'No disponible'}</p>
              </div>
              <div>
                <p className="font-semibold">Departamento</p>
                <p>{data.department || 'No disponible'}</p>
              </div>
              <div>
                <p className="font-semibold">Dirección</p>
                <p>{data.address || 'No disponible'}</p>
              </div>
              <div>
                <p className="font-semibold">Fecha de Nacimiento</p>
                <p>{normalizeDateForInput(data.birthdate)}</p>
              </div>
              {type !== 'advisor' && (
                <div>
                  <p className="font-semibold">Procedencia</p>
                  <p>{formatEnumText(data.origin, 'uppercase')}</p>
                </div>
              )}
              <div>
                <p className="font-semibold">Documento</p>
                <p>{data.document}</p>
              </div>

              <div>
                <p className="font-semibold">Estado</p>
                <span
                  className={`inline-block px-3 py-1 mt-1 rounded-full text-sm font-medium ${
                    data.state?.name === 'Sin Contactar' ||
                    data.status === 'INACTIVE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {data?.state?.name || data?.status}
                </span>
              </div>
              {type === 'advisor' && (
                <div>
                  <p className="font-semibold">Rol</p>
                  <p>{data.role}</p>
                </div>
              )}
              <div>
                <p className="font-semibold">Registro</p>
                <p>{normalizeDateForInput(data.createdAt)}</p>
              </div>
              {type !== 'advisor' && (
                <div>
                  <p className="font-semibold">Fecha de Venta</p>
                  <p>{normalizeDateForInput(data.saleDate)}</p>
                </div>
              )}
            </div>
          </details>

          {type !== 'advisor' && (
            <details className="group border rounded-xl p-4 border-gray-200">
              <summary className="cursor-pointer font-semibold text-gray-800 text-lg flex justify-between items-center">
                Estado de Venta y Entrega
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-600">
                <div>
                  <p className="font-semibold">Asesor asignado</p>
                  <p>{data.advisor?.name || 'Sin asignar'}</p>
                </div>
                <div>
                  <p className="font-semibold">Estado de Venta</p>
                  <p>
                    {formatEnumText(data.saleState, 'uppercase') ||
                      'No disponible'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Estado de Entrega</p>
                  <p>
                    {formatEnumText(data.deliveryState, 'uppercase') ||
                      'No disponible'}
                  </p>
                </div>

                {isDelivered && (
                  <>
                    <div>
                      <p className="font-semibold">Fecha de Entrega</p>
                      <p>{normalizeDateForInput(data.deliveryDate)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Placa</p>
                      <p>{data.plateNumber || 'No aplica'}</p>
                    </div>
                  </>
                )}
              </div>
            </details>
          )}

          {data?.purchase && (
            <Purchase
              purchase={data?.purchase}
              outstandingBalance={data?.outstandingBalance}
              creditBalance={data?.creditBalance}
            />
          )}

          {data?.holders && <Holders holders={data?.holders} />}

          {data?.payments && <Payments payments={data?.payments} />}

          {data?.receipts && <Receipts receipts={data?.receipts} />}

          {data?.invoices && <Invoices invoices={data?.invoices} />}

          {data?.registration && (
            <Registrations registration={data?.registration} />
          )}

          {type !== 'advisor' && (
            <details className="group border rounded-xl p-4 border-gray-200">
              <summary className="cursor-pointer font-semibold text-gray-800 text-lg flex justify-between items-center">
                Historial de Comentarios
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="mt-4">
                <CommentsHistory formData={data} />
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
