import { useEffect, useState } from "react";
const clave = "gas-volcan-pedidos-demo-v1";
function recuperar() {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || "[]");
    if (!Array.isArray(datos)) return [];
    const ids = new Set();
    return datos
      .filter(
        (pedido) =>
          pedido &&
          typeof pedido.id === "string" &&
          !ids.has(pedido.id) &&
          (ids.add(pedido.id), typeof pedido.fecha === "string") &&
          Array.isArray(pedido.items) &&
          pedido.items.length > 0 &&
          pedido.items.every(
            (item) =>
              typeof item.id === "string" &&
              typeof item.nombre === "string" &&
              Number.isSafeInteger(item.cantidad) &&
              item.cantidad > 0 &&
              Number.isSafeInteger(item.precio) &&
              item.precio >= 0,
          ),
      )
      .slice(-50)
      .map(limpiar);
  } catch {
    return [];
  }
}
function limpiar(pedido) {
  const items = pedido.items.map(({ id, nombre, precio, cantidad }) => ({
    id,
    nombre,
    precio,
    cantidad,
  }));
  return {
    id: pedido.id,
    fecha: pedido.fecha,
    items,
    total: items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    estado: "Confirmado (simulación)",
  };
}
export function usePedidos() {
  const [pedidos, setPedidos] = useState(recuperar);
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(pedidos));
    } catch {
      /* Disponible durante la sesión. */
    }
  }, [pedidos]);
  return {
    pedidos,
    agregar: (pedido) =>
      setPedidos((actual) =>
        actual.some((item) => item.id === pedido.id)
          ? actual
          : [...actual, limpiar(pedido)].slice(-50),
      ),
    eliminar: (id) =>
      setPedidos((actual) => actual.filter((pedido) => pedido.id !== id)),
  };
}
