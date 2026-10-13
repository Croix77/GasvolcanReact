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
  let campo;
  const clase = error ? "is-invalid" : "";
  if (opciones) {
    campo = (
      <select {...comunes} className={`form-select ${clase}`}>
        <option value="">Selecciona una opción</option>
        {opciones.map((opcion) => (
          <option key={opcion}>{opcion}</option>
        ))}
      </select>
    );
  } else if (multilinea) {
    campo = (
      <textarea {...comunes} rows={4} className={`form-control ${clase}`} />
    );
  } else {
    campo = (
      <input {...comunes} type={tipo} className={`form-control ${clase}`} />
    );
  }
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={nombre}>
        {etiqueta}
      </label>
      {campo}
      {error && (
        <p id={`${nombre}-error`} className="invalid-feedback">
          {error}
        </p>
      )}
    </div>
  );
}
export default CampoFormulario;
