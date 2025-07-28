'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import ViewModal from '../../viewModal';
import Table from '@/components/dashboard/tables/table';
import Link from 'next/link';

export default function Advisors() {
  const [selectedAdvisors, setSelectedAdvisors] = useState(null);

  const advisors = [
    {
      id: 1,
      nombre: 'Laura Pérez',
      correo: 'laura.perez@empresa.com',
      telefono: '3101234567',
      direccion: 'Calle 123',
      ciudad: 'Bogotá',
      documento: '123456789',
    },
    {
      id: 2,
      nombre: 'Carlos Gómez',
      correo: 'carlos.gomez@empresa.com',
      telefono: '3129876543',
      direccion: 'Calle 123',
      ciudad: 'Bogotá',
      documento: '123456789',
    },
    {
      id: 3,
      nombre: 'Ana Torres',
      correo: 'ana.torres@empresa.com',
      telefono: '3006543210',
      direccion: 'Calle 123',
      ciudad: 'Bogotá',
      documento: '123456789',
    },
    {
      id: 4,
      nombre: 'Vanesa Manrique',
      correo: 'vane.manrrique@empresa.com',
      telefono: '3006543210',
      direccion: 'Calle 123',
      ciudad: 'Bogotá',
      documento: '123456789',
    },
    {
      id: 5,
      nombre: 'Gustavo Diaz',
      correo: 'gus.diaz@empresa.com',
      telefono: '3006543210',
      direccion: 'Calle 123',
      ciudad: 'Bogotá',
      documento: '123456789',
    },
  ];

  const handleAgregarAsesor = () => {
    console.log('Abrir formulario para agregar asesor');
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Listado de Asesores
        </h1>

        <Link
          href="/CRM/dashboard/advisors/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          <PlusIcon className="w-4 h-4" />
          Agregar asesor
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <Table
          info={advisors}
          view="advisors"
          setSelected={setSelectedAdvisors}
        />
        {selectedAdvisors && (
          <ViewModal
            customer={selectedAdvisors}
            onClose={() => setSelectedAdvisors(null)}
          />
        )}
      </div>
    </div>
  );
}
