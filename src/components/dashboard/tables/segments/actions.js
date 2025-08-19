import { EyeIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Actions({
  isLocked,
  rol,
  info,
  view,
  setSelected,
  handleDelete,
}) {
  return (
    <div className="flex justify-center space-x-3">
      <button
        onClick={() => setSelected(info)}
        disabled={isLocked}
        className={`${
          isLocked
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-500 hover:text-blue-700'
        } cursor-pointer`}
      >
        <EyeIcon className="w-5 h-5" />
      </button>

      <Link
        href={isLocked ? '#' : `/CRM/dashboard/${view}/edit/${info.id}`}
        className={`${
          isLocked
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-green-500 hover:text-green-700'
        }`}
      >
        <PencilIcon className="w-5 h-5" />
      </Link>

      {rol === 'Administrador' && (
        <button
          onClick={() => handleDelete(info.id)}
          disabled={isLocked}
          className="text-red-500 hover:text-red-700 cursor-pointer"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
