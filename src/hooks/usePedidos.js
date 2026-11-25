import { useCallback, useEffect, useState } from "react";
import { listarPedidos } from "../services/pedidosApi";
import { useAuth } from "./useAuth";

function mapPedido(p) {
  return {
    id: String(p.id),
    fecha: p.fechaCreacion,
    estado: p.estado,
    total: Number(p.total || 0),
    comuna: p.comuna,
    direccion: p.direccion,
    nombre: p.nombre,
    items: (p.items || []).map((i) => ({ id: i.id, nombre: i.nombre, precio: i.precioUnitario, cantidad: i.cantidad })),
  };
}

export function usePedidos() {
  const { sesion, asegurarToken } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    if (!sesion) { setPedidos([]); return; }
    setCargando(true);
    try {
      const token = await asegurarToken();
      if (!token) { setPedidos([]); return; }
      const data = await listarPedidos(token);
      setPedidos((data || []).map(mapPedido));
    } catch {
      setPedidos([]);
    } finally {
      setCargando(false);
    }
  }, [sesion, asegurarToken]);

  useEffect(() => { cargar(); }, [cargar]);

  return { pedidos, cargando, recargar: cargar, agregar: () => cargar() };
}
