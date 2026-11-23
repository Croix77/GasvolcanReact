import { useCallback, useEffect, useState } from "react";
import { pedirNegocio } from "../services/api";

const INTERVALO = 15_000;

export function usePedidos(token, fecha = "") {
  const [consulta, setConsulta] = useState({ pedidos: [], error: "" });
  const [revision, setRevision] = useState(0);
  const ruta = fecha ? `/pedidos?fecha=${encodeURIComponent(fecha)}` : "/pedidos";

  useEffect(() => {
    if (!token) return;
    const controlador = new AbortController();
    let temporizador;
    let consultando = false;

    // Solo consulta mientras la pestaña está visible y evita solapar solicitudes.
    async function consultar() {
      if (consultando || document.hidden) return;
      clearTimeout(temporizador);
      consultando = true;
      try {
        const pedidos = await pedirNegocio(ruta, { token, signal: controlador.signal });
        if (!controlador.signal.aborted) setConsulta({ token, ruta, pedidos, error: "" });
      } catch (error) {
        if (!controlador.signal.aborted) {
          setConsulta((anterior) => ({
            token,
            ruta,
            pedidos: anterior.token === token && anterior.ruta === ruta ? anterior.pedidos : [],
            error: error.message,
          }));
        }
      } finally {
        consultando = false;
        if (!controlador.signal.aborted) temporizador = setTimeout(consultar, INTERVALO);
      }
    }

    consultar();
    document.addEventListener("visibilitychange", consultar);
    return () => {
      controlador.abort();
      clearTimeout(temporizador);
      document.removeEventListener("visibilitychange", consultar);
    };
  }, [token, ruta, revision]);

  const recargar = useCallback(() => setRevision((actual) => actual + 1), []);

  async function agregar(datos) {
    const pedido = await pedirNegocio("/pedidos", { token, metodo: "POST", datos });
    recargar();
    return pedido;
  }

  // Al cambiar de sesión o fecha, nunca se muestran datos de la consulta anterior.
  const mismosFiltros = Boolean(token && consulta.token === token && consulta.ruta === ruta);
  return {
    pedidos: mismosFiltros ? consulta.pedidos : [],
    cargando: Boolean(token && !mismosFiltros),
    error: mismosFiltros ? consulta.error : "",
    recargar,
    agregar,
  };
}
