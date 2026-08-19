export default function SearchFilter({
  name,
  value = '',
  className = '',
  title = '',
  type = 'text',
  options = [],
  handleFilterChange,
}) {
  if (type === 'select') {
    return (
      <select
        name={name}
        value={value}
        onChange={handleFilterChange}
        aria-label={`Filtrar ${title}`}
        className={`${className} cursor-pointer`}
      >
        <option value="">Todos</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (type === 'date') {
    return (
      <input
        type="date"
        name={name}
        value={value}
        onChange={handleFilterChange}
        aria-label={`Filtrar ${title}`}
        className={className}
      />
    );
  }

  if (type === 'time') {
    return (
      <input
        type="time"
        name={name}
        value={value}
        onChange={handleFilterChange}
        aria-label={`Filtrar ${title}`}
        className={className}
      />
    );
  }

  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleFilterChange}
      placeholder={`Filtrar ${title}`}
      aria-label={`Filtrar ${title}`}
      className={className}
    />
  );
}
