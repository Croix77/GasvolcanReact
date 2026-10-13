import { useEffect, useState } from "react";
import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/catalogo";
import {
  agregarCategoria,
  editarCategoria,
  borrarCategoria,
} from "../services/categorias";
import {
  recuperarEstadoCatalogo,
  guardarEstadoCatalogo,
} from "../services/catalogoLocal";

export function useCatalogo() {
  const [estado, setEstado] = useState(recuperarEstadoCatalogo);
  useEffect(() => {
    guardarEstadoCatalogo(estado);
  }, [estado]);

  function crear(producto) {
    const nuevo = { ...producto, id: crypto.randomUUID(), imagen: "" };
    setEstado((actual) => ({
      ...actual,
      productos: crearProducto(actual.productos, nuevo),
    }));
  }
  function actualizar(id, producto) {
    setEstado((actual) => ({
      ...actual,
      productos: actualizarProducto(actual.productos, id, producto),
    }));
  }
  function eliminar(id) {
    setEstado((actual) => ({
      ...actual,
      productos: eliminarProducto(actual.productos, id),
    }));
  }
  function crearCategoria(nombre) {
    const categoria = { id: crypto.randomUUID(), nombre };
    setEstado(agregarCategoria(estado, categoria));
  }
  function actualizarCategoria(id, nombre) {
    setEstado(editarCategoria(estado, id, nombre));
  }
  function eliminarCategoria(id) {
    setEstado(borrarCategoria(estado, id));
  }
  return {
    ...estado,
    crear,
    actualizar,
    eliminar,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  };
}
