import { useEffect, useState } from "react";
import { pedirNegocio } from "../services/api";
import { normalizarProducto } from "../services/catalogo";

const vacio = { token: null, productos: [], categorias: [], error: "" };

export function useCatalogo(token) {
  const [estado, setEstado] = useState(vacio);
  const [revision, setRevision] = useState(0);
  const recargar = () => setRevision((valor) => valor + 1);

  useEffect(() => {
    if (!token) return;
    const control = new AbortController();
    const opciones = { token, signal: control.signal };
    // Las dos listas se publican juntas para que el filtro y el formulario coincidan.
    Promise.all([pedirNegocio("/productos", opciones), pedirNegocio("/categorias", opciones)])
      .then(([productos, categorias]) => {
        if (!control.signal.aborted) setEstado({ token, productos, categorias, error: "" });
      })
      .catch((fallo) => {
        if (!control.signal.aborted) {
          setEstado((anterior) => ({
            ...(anterior.token === token ? anterior : vacio),
            token,
            error: fallo.message,
          }));
        }
      });
    return () => control.abort();
  }, [token, revision]);

  const actual = token && estado.token === token ? estado : vacio;

  function modificar(cambios) {
    // Una respuesta anterior al cierre de sesión no modifica la nueva lista.
    setEstado((anterior) => anterior.token === token ? cambios(anterior) : anterior);
  }

  function datosProducto(producto) {
    const datos = normalizarProducto(producto);
    const categoria = actual.categorias.find(({ nombre }) => nombre === datos.categoria);
    if (!categoria) throw new Error("Selecciona una categoría registrada.");
    const enteroOpcional = (valor) => valor == null || valor === "" ? null : Number(valor);
    return {
      codigo: datos.codigo.trim(),
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      descripcionLarga: datos.descripcionLarga?.trim(),
      unidad: datos.unidad.trim(),
      categoriaId: categoria.id,
      precio: datos.precio,
      precioComercial: enteroOpcional(datos.precioComercial),
      precioAnterior: datos.oferta ? datos.precioAnterior : null,
      stock: datos.stock,
      stockCritico: enteroOpcional(datos.stockCritico),
      imagen: datos.imagen?.trim(),
      oferta: datos.oferta,
      version: datos.version,
    };
  }

  async function crear(producto) {
    const creado = await pedirNegocio("/productos", { token, metodo: "POST", datos: datosProducto(producto) });
    modificar((anterior) => ({ ...anterior, productos: [...anterior.productos, creado] }));
  }

  async function actualizar(id, producto) {
    const editado = await pedirNegocio(`/productos/${encodeURIComponent(id)}`, {
      token, metodo: "PUT", datos: datosProducto(producto),
    });
    modificar((anterior) => ({
      ...anterior, productos: anterior.productos.map((item) => item.id === id ? editado : item),
    }));
  }

  async function eliminar(id) {
    await pedirNegocio(`/productos/${encodeURIComponent(id)}`, { token, metodo: "DELETE" });
    modificar((anterior) => ({ ...anterior, productos: anterior.productos.filter((item) => item.id !== id) }));
  }

  async function crearCategoria(nombre) {
    const creada = await pedirNegocio("/categorias", { token, metodo: "POST", datos: { nombre: nombre.trim() } });
    modificar((anterior) => ({ ...anterior, categorias: [...anterior.categorias, creada] }));
  }

  async function actualizarCategoria(id, nombre) {
    const editada = await pedirNegocio(`/categorias/${id}`, { token, metodo: "PUT", datos: { nombre: nombre.trim() } });
    modificar((anterior) => ({
      ...anterior,
      categorias: anterior.categorias.map((item) => item.id === id ? editada : item),
      productos: anterior.productos.map((item) =>
        item.categoriaId === id ? { ...item, categoria: editada.nombre } : item,
      ),
    }));
  }

  async function eliminarCategoria(id) {
    await pedirNegocio(`/categorias/${id}`, { token, metodo: "DELETE" });
    modificar((anterior) => ({ ...anterior, categorias: anterior.categorias.filter((item) => item.id !== id) }));
  }

  return {
    productos: actual.productos,
    categorias: actual.categorias,
    cargando: Boolean(token && estado.token !== token),
    error: actual.error,
    recargar,
    crear,
    actualizar,
    eliminar,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  };
}
