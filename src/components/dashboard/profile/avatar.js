'use client';

import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import useUsers from '@/lib/api/hooks/useUsers';
import AlertModal from '../modals/alertModal';

export default function Avatar({ perfil = {}, setPerfil }) {
  const [alert, setAlert] = useState({ message: '' });
  const [avatarPreview, setAvatarPreview] = useState(perfil?.avatar || null);
  const { uploadUserAvatar } = useUsers();

  useEffect(() => {
    setAvatarPreview(perfil?.avatar || null);
  }, [perfil?.avatar]);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : '?');

  const colors = [
    'bg-orange-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];

  const getColor = (name) => {
    if (!name) return colors[0];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const handleRemoveAvatar = async () => {
    const updated = { ...perfil, avatar: null };
    setPerfil(updated);
    setAvatarPreview(null);
    localStorage.setItem('usuario', JSON.stringify(updated));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAvatarPreview(URL.createObjectURL(file));
      const resp = await uploadUserAvatar(file);
      const updatedUser = resp?.data ?? resp;
      if (updatedUser) {
        setPerfil(updatedUser);
        setAvatarPreview(updatedUser.avatar ?? avatarPreview);
        localStorage.setItem('usuario', JSON.stringify(updatedUser));
        setAlert({
          message: 'Se actualizó el avatar.',
        });
      }
    } catch (err) {
      console.error('Error subiendo avatar:', err);
      setAlert({
        message: 'Error al subir avatar',
      });
    }
  };

  return (
    <>
      <div className="relative w-24 h-24">
        <label className="w-full h-full block rounded-full overflow-hidden group">
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          {avatarPreview || perfil?.avatar ? (
            <img
              src={avatarPreview || perfil.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-white font-bold ${getColor(
                perfil?.name
              )}`}
            >
              {getInitial(perfil?.name)}
            </div>
          )}

          <div
            className="absolute inset-0 font-semibold bg-black/40 opacity-0 group-hover:opacity-100 flex 
      items-center justify-center text-white text-xs transition cursor-pointer rounded-full"
          >
            Cambiar
          </div>
        </label>

        {(avatarPreview || perfil?.avatar) && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            className="absolute -top-2 -right-2 bg-white p-1 rounded-full text-red-500 hover:text-red-700 shadow cursor-pointer"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      <span className="text-red-100 text-xs">{alert.message}</span>
    </>
  );
}
