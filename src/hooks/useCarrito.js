import { MAX_UNIDADES_POR_PRODUCTO } from "../utils/compra";
import { useEffect, useState } from "react";
import { productos } from "../data/productos";

const clave = "gas-el-volcan-carrito";

function leerCarrito(catalogo) {
  try {
    const guardado = localStorage.getItem(clave);
    const anterior =
      guardado == null
        ? JSON.parse(localStorage.getItem("pedidosGas") || "[]")
        : [];
    const datos =
      guardado == null && Array.isArray(anterior)
        ? anterior.map((item) => ({
            id: catalogo.find((producto) => producto.codigo === item?.codigo)
              ?.id,
            cantidad: 1,
          }))
        : JSON.parse(guardado || "[]");
    if (!Array.isArray(datos)) return [];
    const ids = new Set();
    return datos
      .filter((item) => {
        if (
          !item ||
          !catalogo.some((producto) => producto.id === item.id) ||
          !Number.isSafeInteger(item.cantidad) ||
          item.cantidad < 1 ||
          ids.has(item.id)
        )
          return false;
        ids.add(item.id);
        return true;
      })
      .map(({ id, cantidad }) => ({ id, cantidad: Math.min(cantidad, MAX_UNIDADES_POR_PRODUCTO) }));
  } catch {
    return [];
  }
}

export function useCarrito(catalogo = productos) {
  const [carrito, setCarrito] = useState(() => leerCarrito(catalogo));

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(carrito));
    } catch {
      // El carrito sigue funcionando si el navegador bloquea el almacenamiento.
    }
  }, [carrito]);

  function agregar(id) {
    const producto = catalogo.find((producto) => producto.id === id);
    if (!producto || producto.stock === 0) return;
    setCarrito((actual) =>
      actual.some((item) => item.id === id)
        ? actual.map((item) =>
            item.id === id
              ? {
                  ...item,
                  cantidad: Math.min(
                    MAX_UNIDADES_POR_PRODUCTO,
                    producto.stock ?? MAX_UNIDADES_POR_PRODUCTO,
                    item.cantidad + 1,
                  ),
                }
              : item,
          )
        : [...actual, { id, cantidad: 1 }],
    );
  }

  function cambiarCantidad(id, cantidad) {
    const producto = catalogo.find((producto) => producto.id === id);
    if (
      !producto ||
      !Number.isSafeInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > Math.min(MAX_UNIDADES_POR_PRODUCTO, producto.stock ?? MAX_UNIDADES_POR_PRODUCTO)
    )
      return;
    setCarrito((actual) =>
      actual.map((item) => (item.id === id ? { ...item, cantidad } : item)),
    );
  }

  function eliminar(id) {
    setCarrito((actual) => actual.filter((item) => item.id !== id));
  }

  return {
    items: carrito
      .filter((item) => catalogo.some((producto) => producto.id === item.id))
      .map((item) => ({
        ...catalogo.find((producto) => producto.id === item.id),
        cantidad: item.cantidad,
      })),
    agregar,
    cambiarCantidad,
    eliminar,
    vaciar: () => setCarrito([]),
  };
}
