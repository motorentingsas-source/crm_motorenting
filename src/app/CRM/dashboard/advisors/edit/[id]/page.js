'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import BtnReturn from '@/components/dashboard/buttons/return';
import BtnSave from '@/components/dashboard/buttons/save';

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

export default function EditAdvisor() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const advisorSuccefull = advisors.find((c) => c.id === parseInt(id));
      if (advisorSuccefull) {
        setAdvisor(advisorSuccefull);
      } else {
        alert('Asesor no encontrado');
        router.push('/CRM/dashboard/advisors');
      }
    }
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdvisor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('Datos actualizados:', advisor);

    setTimeout(() => {
      setLoading(false);
      alert('Asesor actualizado correctamente');
      router.push('/CRM/dashboard/advisors');
    }, 1000);
  };

  if (!advisor) return <p className="text-center mt-10">Cargando asesor...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Editar Asesor
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ['nombre', 'Nombre'],
          ['correo', 'Correo', 'email'],
          ['telefono', 'Teléfono'],
          ['direccion', 'Dirección'],
          ['ciudad', 'Ciudad'],
          ['documento', 'Documento'],
        ].map(([name, label, type = 'text']) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={advisor[name] || ''}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required={name === 'nombre' || name === 'correo'}
            />
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <BtnReturn route={'/CRM/dashboard/advisors'} />
          <BtnSave />
        </div>
      </form>
    </div>
  );
}
