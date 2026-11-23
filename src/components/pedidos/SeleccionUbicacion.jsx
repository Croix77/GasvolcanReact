import { useState } from "react";
import MapaPedidos from "./MapaPedidos";
import { leerCoordenadas } from "../../utils/pedidos";

export default function SeleccionUbicacion({
  latitud, longitud, onChange, id, etiqueta, tipo = "entrega", requerido = false, error,
}) {
  const [abierto, setAbierto] = useState(false);
  const coordenadas = leerCoordenadas({ latitud, longitud });
  const puntos = coordenadas ? [{ id, ...coordenadas, tipo, etiqueta }] : [];
  const indicaciones = error ? `${id}-indicaciones ${id}-error` : `${id}-indicaciones`;

  return (
    <div className="my-3">
      <p className="small mb-2" id={`${id}-indicaciones`}>
        Marca el punto en el mapa o ingresa la latitud y la longitud.
      </p>
      <button type="button" className="btn btn-outline-secondary" aria-expanded={abierto}
        aria-controls={`${id}-mapa`} onClick={() => setAbierto(!abierto)}>
        {abierto ? "Ocultar mapa" : "Elegir punto en el mapa"}
      </button>
      <div className="mt-3" id={`${id}-mapa`} hidden={!abierto}>
        {abierto && <MapaPedidos puntos={puntos} etiqueta={etiqueta} onSeleccion={onChange} />}
      </div>
      {(requerido || abierto) && (
        <>
          <div className="row g-2 mt-2">
            <label className="col-6">
              Latitud
              <input type="number" name={`${id}-latitud`} className={`form-control ${error ? "is-invalid" : ""}`}
                step="any" min="-90" max="90" required={requerido} aria-invalid={Boolean(error)}
                aria-describedby={indicaciones} value={latitud}
                onChange={(evento) => onChange({ latitud: evento.target.value, longitud })} />
            </label>
            <label className="col-6">
              Longitud
              <input type="number" name={`${id}-longitud`} className={`form-control ${error ? "is-invalid" : ""}`}
                step="any" min="-180" max="180" required={requerido} aria-invalid={Boolean(error)}
                aria-describedby={indicaciones} value={longitud}
                onChange={(evento) => onChange({ latitud, longitud: evento.target.value })} />
            </label>
          </div>
          {(latitud !== "" || longitud !== "") && (
            <button type="button" className="btn btn-link px-0"
              onClick={() => onChange({ latitud: "", longitud: "" })}>
              Quitar punto
            </button>
          )}
        </>
      )}
      {error && <p id={`${id}-error`} role="alert" className="text-danger mt-2 mb-0">{error}</p>}
    </div>
  );
}
