import { useEffect, useState } from "react";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  recuperarCatalogo,
  validarProducto,
} from "../services/catalogo";
import { productos as iniciales } from "../data/productos";
import {
  agregarCategoria,
  editarCategoria,
  borrarCategoria,
  validarCategoria,
} from "../services/categorias";
const clave = "gas-volcan-catalogo-v2";
function recuperar() {
  const productos = recuperarCatalogo().map((item) => ({
    ...iniciales.find((original) => original.id === item.id),
    ...item,
  }));
  const categorias = [
    ...new Set(
      [...iniciales, ...productos].map((producto) => producto.categoria),
    ),
  ].map((nombre, indice) => ({ id: `categoria-${indice}`, nombre }));
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || "null");
    if (
      !datos ||
      !Array.isArray(datos.productos) ||
      !Array.isArray(datos.categorias)
    )
      return { productos, categorias };
    if (
      datos.categorias.some(
        (item) =>
          !item ||
          typeof item.id !== "string" ||
          validarCategoria(item.nombre, datos.categorias, item.id),
      ) ||
      new Set(datos.categorias.map((item) => item.id)).size !==
        datos.categorias.length
    )
      return { productos, categorias };
    if (
      datos.productos.some(
        (item) =>
          !item ||
          typeof item.id !== "string" ||
          Object.keys(validarProducto(item)).length ||
          !datos.categorias.some(
            (categoria) => categoria.nombre === item.categoria,
          ),
      ) ||
      new Set(datos.productos.map((item) => item.id)).size !==
        datos.productos.length
    )
      return { productos, categorias };
    return {
      categorias: datos.categorias.map(({ id, nombre }) => ({ id, nombre })),
      productos: datos.productos.map((item) => ({
        ...iniciales.find((original) => original.id === item.id),
        ...item,
        precio: Number(item.precio),
        stock: Number(item.stock),
        oferta: Boolean(item.oferta),
        imagen:
          iniciales.find((original) => original.id === item.id)?.imagen || "",
      })),
    };
  } catch {
    return { productos, categorias };
  }
}
export function useCatalogo() {
  const [estado, setEstado] = useState(recuperar);
  useEffect(() => {
    const productos = estado.productos.map((producto) => {
      const datos = { ...producto };
      delete datos.imagen;
      return datos;
    });
    try {
      localStorage.setItem(clave, JSON.stringify({ ...estado, productos }));
      localStorage.setItem(
        "gas-el-volcan-catalogo-v1",
        JSON.stringify(productos),
      );
    } catch {
      /* Disponible en memoria durante la sesión. */
    }
  }, [estado]);
  return {
    ...estado,
    crear: (producto) => {
      const nuevo = { ...producto, id: crypto.randomUUID(), imagen: "" };
      setEstado((actual) => ({
        ...actual,
        productos: crearProducto(actual.productos, nuevo),
      }));
    },
    actualizar: (id, producto) =>
      setEstado((actual) => ({
        ...actual,
        productos: actualizarProducto(actual.productos, id, producto),
      })),
    eliminar: (id) =>
      setEstado((actual) => ({
        ...actual,
        productos: eliminarProducto(actual.productos, id),
      })),
    crearCategoria: (nombre) =>
      setEstado(agregarCategoria(estado, { id: crypto.randomUUID(), nombre })),
    actualizarCategoria: (id, nombre) =>
      setEstado(editarCategoria(estado, id, nombre)),
    eliminarCategoria: (id) => setEstado(borrarCategoria(estado, id)),
  };
}
