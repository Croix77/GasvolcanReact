import { lazy, Suspense } from "react";

const MapaLeaflet = lazy(() => import("./MapaLeaflet"));

export default function MapaPedidos(props) {
  return (
    <Suspense fallback={<p role="status">Cargando mapa…</p>}>
      <MapaLeaflet {...props} />
    </Suspense>
  );
}
