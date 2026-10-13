import { useEffect, useState } from "react";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  recuperarCatalogo,
} from "../data/catalogo";

export function useCatalogo() {
  const [productos, setProductos] = useState(recuperarCatalogo);
  useEffect(() => {
    try {
      localStorage.setItem(
        "gas-el-volcan-catalogo-v1",
        JSON.stringify(
          productos.map((producto) => {
            const datos = { ...producto };
            delete datos.imagen;
            return datos;
          }),
        ),
      );
    } catch {
      // Los cambios siguen disponibles durante la sesión.
    }
  }, [productos]);
  return {
    productos,
    crear: (producto) => {
      const nuevo = { ...producto, id: crypto.randomUUID(), imagen: '' };
      setProductos((lista) => crearProducto(lista, nuevo));
    },
    actualizar: (id, producto) =>
      setProductos((lista) => actualizarProducto(lista, id, producto)),
    eliminar: (id) => setProductos((lista) => eliminarProducto(lista, id)),
  };
}
