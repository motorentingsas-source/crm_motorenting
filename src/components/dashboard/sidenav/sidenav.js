'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NavLinks from './nav-links';
import { useAuth } from '@/context/authContext';
import Avatar from '../profile/avatar';

export default function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario } = useAuth();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 m-2 text-white bg-gray-900 rounded"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static`}
      >
        <div className="flex flex-col items-center py-6 space-y-2">
          <div className="w-full flex justify-end px-4 md:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <Avatar perfil={usuario} setPerfil={() => {}} />

          <Link
            href="/CRM/dashboard/profile/edit"
            className="text-sm text-white font-semibold underline hover:text-orange-400"
          >
            Editar perfil
          </Link>

          <h6 className="text-sm text-orange-400 font-semibold text-center px-2">
            {usuario?.role} - {usuario?.name}
          </h6>
        </div>

        <div className="border-t border-gray-700 mx-6 my-2" />

        <div className="flex-1 overflow-y-auto scroll-hidden px-2">
          <NavLinks />
        </div>
      </aside>
    </>
  );
}
