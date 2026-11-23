import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./mapaPedidos.css";

const centroChillan = [-36.6066, -72.1034];
const urlMapa = import.meta.env.VITE_MAPA_TESELAS_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export default function MapaLeaflet({ puntos, etiqueta, onSeleccion }) {
  const contenedor = useRef(null);
  const mapa = useRef(null);
  const capa = useRef(null);
  const ultimoAjuste = useRef("");

  useEffect(() => {
    const vista = L.map(contenedor.current, { scrollWheelZoom: false }).setView(centroChillan, 12);
    L.tileLayer(urlMapa, {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(vista);
    mapa.current = vista;
    capa.current = L.layerGroup().addTo(vista);
    ultimoAjuste.current = "";

    return () => {
      vista.remove();
      mapa.current = null;
      capa.current = null;
    };
  }, []);

  useEffect(() => {
    if (!onSeleccion) return;
    const vista = mapa.current;
    const seleccionar = ({ latlng }) => onSeleccion({
      latitud: Number(latlng.lat.toFixed(6)),
      longitud: Number(L.Util.wrapNum(latlng.lng, [-180, 180], true).toFixed(6)),
    });
    vista.on("click", seleccionar);
    return () => vista.off("click", seleccionar);
  }, [onSeleccion]);

  useEffect(() => {
    const marcadores = capa.current;
    marcadores.clearLayers();
    for (const punto of puntos) {
      const icon = L.divIcon({
        className: `mapa-pedido-marca mapa-pedido-${punto.tipo}`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const texto = document.createElement("span");
      texto.textContent = punto.etiqueta;
      L.marker([punto.latitud, punto.longitud], { icon, title: punto.etiqueta })
        .bindPopup(texto)
        .addTo(marcadores);
    }

    // Al actualizar la ubicación se mantienen el zoom y el encuadre que eligió el usuario.
    const ajuste = puntos.map(({ id, tipo }) => `${id}-${tipo}`).join(",");
    if (ajuste && ajuste !== ultimoAjuste.current) {
      mapa.current.fitBounds(puntos.map(({ latitud, longitud }) => [latitud, longitud]), {
        maxZoom: 15, padding: [30, 30], animate: false,
      });
    }
    ultimoAjuste.current = ajuste;
  }, [puntos]);

  return <div className="mapa-pedidos" ref={contenedor} role="region" aria-label={etiqueta} />;
}
