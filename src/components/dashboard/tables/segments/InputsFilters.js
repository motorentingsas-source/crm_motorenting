import SearchFilter from './inputSearch/searchFilter';

export default function InputFilters({
  rol,
  view,
  filters,
  handleFilterChange,
}) {
  const allFilters = [
    {
      name: 'advisor',
      title: 'Asesor',
      show: rol === 'Administrador' && view === 'customers',
    },
    { name: 'name', title: 'Nombre', show: true },
    { name: 'email', title: 'Correo', show: true },
    { name: 'phone', title: 'Teléfono', show: true },
    { name: 'state', title: 'Estado', show: view === 'customers' },
  ];

  return (
    <tr>
      {rol === 'Administrador' && view === 'customers' && <th></th>}

      {allFilters
        .filter((f) => f.show)
        .map(({ name, title }) => (
          <th key={name} className="px-4 py-2">
            <SearchFilter
              name={name}
              title={title}
              value={filters[name] || ''}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              handleFilterChange={handleFilterChange}
            />
          </th>
        ))}

      <th className="px-4 py-2"></th>
    </tr>
  );
}
