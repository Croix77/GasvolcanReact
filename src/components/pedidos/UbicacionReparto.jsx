import { useEffect, useState } from "react";
import { pedirNegocio } from "../../services/api";
import { leerCoordenadas } from "../../utils/pedidos";
import SeleccionUbicacion from "./SeleccionUbicacion";

const opcionesGPS = { maximumAge: 10_000, timeout: 15_000 };

export default function UbicacionReparto({ pedidoId, token, recargar }) {
  const [punto, setPunto] = useState({ latitud: "", longitud: "" });
  const [compartiendo, setCompartiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!compartiendo) return;
    const controlador = new AbortController();
    let ultimoEnvio = 0;
    let enviando = false;

    // El navegador comparte la ubicación solo cuando el repartidor lo activa en este pedido.
    const seguimiento = navigator.geolocation.watchPosition(async ({ coords }) => {
      if (enviando || Date.now() - ultimoEnvio < 15_000 || controlador.signal.aborted) return;
      ultimoEnvio = Date.now();
      enviando = true;
      try {
        await pedirNegocio(`/pedidos/${pedidoId}/ubicacion`, {
          token, metodo: "PUT", signal: controlador.signal,
          datos: { latitud: coords.latitude, longitud: coords.longitude },
        });
        if (!controlador.signal.aborted) {
          setError("");
          setMensaje("Ubicación compartida.");
          recargar();
        }
      } catch (fallo) {
        if (!controlador.signal.aborted) setError(fallo.message);
      } finally {
        enviando = false;
      }
    }, () => {
      setError("No se pudo obtener tu ubicación. Revisa el permiso del navegador o marca un punto.");
      setCompartiendo(false);
    }, opcionesGPS);

    return () => {
      controlador.abort();
      navigator.geolocation.clearWatch(seguimiento);
    };
  }, [compartiendo, pedidoId, recargar, token]);

  function alternarGPS() {
    setError("");
    setMensaje("");
    if (!window.isSecureContext || !navigator.geolocation) {
      setError("La ubicación automática requiere HTTPS o localhost. También puedes marcar un punto en el mapa.");
      return;
    }
    setCompartiendo(!compartiendo);
  }

  async function guardarPunto() {
    const datos = leerCoordenadas(punto);
    setError("");
    setMensaje("");
    if (!datos) {
      setError("Indica una latitud y una longitud válidas.");
      return;
    }
    setGuardando(true);
    try {
      await pedirNegocio(`/pedidos/${pedidoId}/ubicacion`, { token, metodo: "PUT", datos });
      setMensaje("Ubicación guardada.");
      recargar();
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="mt-3 border-top pt-3">
      <h3 className="h6">Ubicación del reparto</h3>
      <button type="button" className="btn btn-outline-primary" aria-pressed={compartiendo}
        disabled={guardando} onClick={alternarGPS}>
        {compartiendo ? "Dejar de compartir ubicación" : "Compartir mi ubicación"}
      </button>
      {compartiendo ? (
        <p className="mt-2 mb-0">Mantén abierta esta pantalla durante el recorrido.</p>
      ) : (
        <>
          <SeleccionUbicacion {...punto} id={`reparto-${pedidoId}`} etiqueta="Ubicación del reparto"
            tipo="repartidor" onChange={setPunto} />
          {(punto.latitud !== "" || punto.longitud !== "") && (
            <button type="button" className="btn btn-outline-primary" disabled={guardando} onClick={guardarPunto}>
              Guardar ubicación marcada
            </button>
          )}
        </>
      )}
      {mensaje && <p role="status" className="mt-2 mb-0">{mensaje}</p>}
      {error && <p role="alert" className="mt-2 mb-0">{error}</p>}
    </div>
  );
}
