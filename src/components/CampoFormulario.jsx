function CampoFormulario({
  nombre,
  etiqueta,
  valor,
  onChange,
  error,
  tipo = "text",
  multilinea = false,
  opciones,
  ...atributos
}) {
  const comunes = {
    id: nombre,
    name: nombre,
    value: valor,
    onChange,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${nombre}-error` : undefined,
    ...atributos,
  };
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={nombre}>
        {etiqueta}
      </label>
      {opciones ? (
        <select
          {...comunes}
          className={`form-select ${error ? "is-invalid" : ""}`}
        >
          <option value="">Selecciona una opción</option>
          {opciones.map((opcion) => (
            <option key={opcion}>{opcion}</option>
          ))}
        </select>
      ) : multilinea ? (
        <textarea
          {...comunes}
          rows={4}
          className={`form-control ${error ? "is-invalid" : ""}`}
        />
      ) : (
        <input
          {...comunes}
          type={tipo}
          className={`form-control ${error ? "is-invalid" : ""}`}
        />
      )}
      {error && (
        <p id={`${nombre}-error`} className="invalid-feedback">
          {error}
        </p>
      )}
    </div>
  );
}
export default CampoFormulario;
