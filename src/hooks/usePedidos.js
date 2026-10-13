import { useEffect, useState } from "react";
const clave = "gas-volcan-pedidos-demo-v1";
function recuperar() {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || "[]");
    if (!Array.isArray(datos)) return [];
    const ids = new Set();
    const pedidos = [];
    for (const pedido of datos) {
      if (!pedido || typeof pedido.id !== "string" || ids.has(pedido.id))
        continue;
      if (
        typeof pedido.fecha !== "string" ||
        !Array.isArray(pedido.items) ||
        pedido.items.length === 0
      )
        continue;
      const itemsValidos = pedido.items.every(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.nombre === "string" &&
          Number.isSafeInteger(item.cantidad) &&
          item.cantidad > 0 &&
          Number.isSafeInteger(item.precio) &&
          item.precio >= 0,
      );
      if (!itemsValidos) continue;
      ids.add(pedido.id);
      pedidos.push(limpiar(pedido));
    }
    return pedidos.slice(-50);
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
    estado: "Confirmado",
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
