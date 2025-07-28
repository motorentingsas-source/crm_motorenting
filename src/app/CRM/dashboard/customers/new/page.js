'use client';

import BtnClean from '@/components/dashboard/buttons/clear';
import BtnSave from '@/components/dashboard/buttons/save';
import DepartaCiudad from '@/components/dashboard/select/depart_ciud';
import { useState } from 'react';

export default function newCostumer() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    departamento: '',
    ciudad: '',
    rol: '',
    estado: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'departamento' ? { ciudad: '' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del asesor:', formData);
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      correo: '',
      telefono: '',
      direccion: '',
      departamento: '',
      ciudad: '',
      rol: '',
      estado: '',
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Crear Cliente Nuevo
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">Selecciona un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Asesor">Asesor</option>
          </select>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">Selecciona un estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <DepartaCiudad formData={formData} setFormData={setFormData} />
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <BtnSave />
          <BtnClean handleReset={handleReset} />
        </div>
      </form>
    </div>
  );
}
