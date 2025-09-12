'use client';

import { useState } from 'react';
import AlertModal from '@/components/dashboard/modals/alertModal';
import BtnClean from '@/components/dashboard/buttons/clear';
import BtnReturn from '@/components/dashboard/buttons/return';
import BtnSave from '@/components/dashboard/buttons/save';
import DepartaCiudad from '@/components/dashboard/select/depart_ciud';
import { useAuth } from '@/context/authContext';
import { createCustomer } from '@/lib/api/customer';
import { stateCustomer } from '@/lib/api/stateCustomer';
import { advisors } from '@/lib/api/advisors';

export default function NewCustomer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    document: '',
    department: '',
    city: '',
    stateId: 0,
    birthdate: '',
    advisorId: 0,
  });
  const [alert, setAlert] = useState({ type: '', message: '', url: '' });
  const { usuario } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'department' ? { city: '' } : {}),
    }));
  };

  const handleReset = () =>
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      document: '',
      department: '',
      city: '',
      stateId: 0,
      birthdate: '',
      advisorId: 0,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      debugger;
      await createCustomer(formData);
      setAlert({
        type: 'success',
        message: 'Cliente creado correctamente.',
        url: '/CRM/dashboard/customers',
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error al crear cliente',
      });
    }
  };

  const fieldLabels = {
    name: 'Nombres y Apellidos',
    email: 'Correo',
    birthdate: 'Fecha de Nacimiento',
    phone: 'Teléfono',
    address: 'Dirección',
    document: 'Número de Documento',
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Crear Cliente Nuevo
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Ingrese la información personal y de contacto para registrar un nuevo
        cliente.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(fieldLabels).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {fieldLabels[key]}
              </label>
              <input
                type={key === 'birthdate' ? 'date' : 'text'}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                required
              />
            </div>
          ))}

          {usuario.role === 'ADMIN' && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Asignar Asesor
              </label>
              <select
                name="advisorId"
                value={formData.advisorId}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              >
                <option value="">Seleccione un asesor</option>
                {advisors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="stateId"
              value={formData.stateId}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              required
            >
              <option value="">Seleccione un estado</option>
              {stateCustomer.map((state) => (
                <option key={state} value={1}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <DepartaCiudad formData={formData} setFormData={setFormData} />
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <BtnReturn route="/CRM/dashboard/customers" />
          <BtnClean handleReset={handleReset} />
          <BtnSave />
        </div>
      </form>

      <AlertModal
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
        url={alert.url}
      />
    </div>
  );
}
