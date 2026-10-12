import { useEffect, useState } from "react";
import { productos } from "../data/productos";

const clave = "gas-el-volcan-carrito";

function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || "[]");
    if (!Array.isArray(datos)) return [];
    const ids = new Set();
    return datos.filter((item) => {
      if (!item || !productos.some((producto) => producto.id === item.id)
        || !Number.isSafeInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 99
        || ids.has(item.id)) return false;
      ids.add(item.id);
      return true;
    }).map(({ id, cantidad }) => ({ id, cantidad }));
  } catch {
    return [];
  }
}

export function useCarrito() {
  const [carrito, setCarrito] = useState(leerCarrito);

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(carrito));
    } catch {
      // El carrito sigue funcionando si el navegador bloquea el almacenamiento.
    }
  }, [carrito]);

  function agregar(id) {
    if (!productos.some((producto) => producto.id === id)) return;
    setCarrito((actual) => actual.some((item) => item.id === id)
      ? actual.map((item) => item.id === id ? { ...item, cantidad: Math.min(99, item.cantidad + 1) } : item)
      : [...actual, { id, cantidad: 1 }]);
  }

  function cambiarCantidad(id, cantidad) {
    if (!Number.isSafeInteger(cantidad) || cantidad < 1 || cantidad > 99) return;
    setCarrito((actual) => actual.map((item) => item.id === id ? { ...item, cantidad } : item));
  }

  function eliminar(id) {
    setCarrito((actual) => actual.filter((item) => item.id !== id));
  }

  return {
    items: carrito.map((item) => ({ ...productos.find((producto) => producto.id === item.id), cantidad: item.cantidad })),
    agregar, cambiarCantidad, eliminar, vaciar: () => setCarrito([]),
  };
}
