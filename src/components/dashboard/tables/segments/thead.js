export default function Thead({ rol, view, delivered }) {
  return (
    <thead className="bg-gray-100 border-b border-gray-200">
      <tr>
        {rol === 'ADMIN' && view === 'customers' && !delivered && (
          <>
            <th className="px-4 py-3 text-center">Asignar</th>
            <th className="px-4 py-3">Asesor</th>
          </>
        )}
        {delivered && rol !== 'ASESOR' && (
          <>
            <th className="px-4 py-3">Asesor</th>
          </>
        )}
        <th className="px-4 py-3">Nombre</th>
        <th className="px-4 py-3">Correo</th>
        <th className="px-4 py-3">Teléfono</th>
        {view === 'customers' && <th className="px-4 py-3">Estado Actual</th>}
        <th className="px-4 py-3 text-center">Acciones</th>
      </tr>
    </thead>
  );
}
