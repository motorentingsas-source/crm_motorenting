'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import NavLinks from './nav-links';
import { useAuth } from '@/context/authContext';
import Avatar from '../profile/avatar';

export default function SideNavigation() {
  const { usuario } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const [isHovering, setIsHovering] = useState(false);
  const hoverTimer = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setIsHovering(false);
    }, 150);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 rounded-lg bg-gray-900 p-2 text-white shadow-lg md:hidden"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed left-0 top-0 z-30 hidden h-full w-3 md:block"
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-lg bg-gray-800 px-1 py-2 shadow-md">
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed left-0 top-0 z-40 flex h-full w-64 flex-col
          bg-gray-900 text-white shadow-2xl
          transform transition-all duration-300
          ease-[cubic-bezier(0.4,0,0.2,1)]

          /* Mobile */
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}

          /* Desktop (STATIC md classes) */
          md:translate-x-0 md:opacity-100
        `}
        style={{
          transform:
            typeof window !== 'undefined' && window.innerWidth >= 768
              ? isHovering
                ? 'translateX(0)'
                : 'translateX(-100%)'
              : undefined,
          opacity:
            typeof window !== 'undefined' && window.innerWidth >= 768
              ? isHovering
                ? 1
                : 0
              : undefined,
        }}
      >
        <div className="relative flex flex-col items-center gap-2 border-b border-gray-800 px-4 py-6">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-red-400 md:hidden"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <Avatar perfil={usuario} setPerfil={() => {}} />

          <Link
            href="/CRM/dashboard/profile/edit"
            className="text-xs font-medium text-gray-300 hover:text-orange-400"
          >
            Editar perfil
          </Link>

          <div className="text-center">
            <p className="text-xs text-gray-400">{usuario?.role}</p>
            <p className="max-w-[200px] truncate text-sm font-semibold text-orange-400">
              {usuario?.name}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4 scroll-hidden">
          <NavLinks />
        </div>
      </aside>
    </>
  );
}
