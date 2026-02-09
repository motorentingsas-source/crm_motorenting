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
        className={className}
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

  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleFilterChange}
      placeholder={`Filtrar ${title}`}
      className={className}
    />
  );
}
