'use client';

import { useState } from 'react';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Correo:', correo);
    console.log('Contraseña:', contrasena);
    console.log('Recordar contraseña:', recordar);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-black rounded-2xl shadow-lg p-6 pb-9">
        <div className="flex flex-col items-center">
          <img
            src="/images/logoMotoRenting.png"
            alt="Logo MotoRenting"
            style={{ width: 'auto', height: '100px' }}
          />
          <h1 className="text-xl font-semibold text-white text-center py-3">
            Bienvenido a MotoRenting SAS
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white font-semibold py-2">
              Correo
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingrese su correo"
              required
              className="w-full px-4 py-2 border text-white text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-white font-semibold py-2">
              Contraseña
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
              className="w-full px-4 py-2 border text-white text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              id="recordar"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
              className="accent-blue-600"
            />
            <label
              htmlFor="recordar"
              className="text-xs text-white font-semibold"
            >
              Recordar Contraseña
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold py-2 mt-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
