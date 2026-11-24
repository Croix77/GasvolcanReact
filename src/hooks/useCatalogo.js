import { useEffect, useState } from "react";
import { pedirApi } from "../services/api";
import { normalizarProducto } from "../services/catalogo";

const vacio = { token: null, productos: [], categorias: [], existencias: {}, error: "" };

export function useCatalogo(token) {
  const [estado, setEstado] = useState(vacio);
  const [revision, setRevision] = useState(0);
  const recargar = () => setRevision((valor) => valor + 1);

  useEffect(() => {
    if (!token) return;
    const control = new AbortController();
    const opciones = { token, signal: control.signal };
    Promise.all([
      pedirApi("/productos", opciones),
      pedirApi("/categorias", opciones),
      pedirApi("/stock", opciones),
    ]).then(([productos, categorias, stock]) => {
      if (!control.signal.aborted) {
        const existencias = Object.fromEntries(stock.map((item) => [item.id, item]));
        setEstado({ token, revision, productos, categorias, existencias, error: "" });
      }
    }).catch((fallo) => {
      if (!control.signal.aborted) {
        setEstado((anterior) => ({
          ...(anterior.token === token ? anterior : vacio),
          token, revision, error: fallo.message,
        }));
      }
    });
    return () => control.abort();
  }, [token, revision]);

  const actual = token && estado.token === token ? estado : vacio;
  const nombres = new Map(actual.categorias.map(({ id, nombre }) => [id, nombre]));
  // Productos aporta la ficha y Pedidos aporta las unidades vendibles.
  const productos = actual.productos.map((producto) => ({
    ...producto,
    categoria: nombres.get(producto.categoriaId) ?? producto.categoria,
    stock: actual.existencias[producto.id]?.stock ?? 0,
    versionStock: actual.existencias[producto.id]?.version ?? null,
  }));

  function modificar(cambios) {
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
      stockCritico: enteroOpcional(datos.stockCritico),
      imagen: datos.imagen?.trim(),
      oferta: datos.oferta,
      version: datos.version,
    };
  }

  async function crear(producto) {
    const creado = await pedirApi("/productos", { token, metodo: "POST", datos: datosProducto(producto) });
    modificar((anterior) => ({ ...anterior, productos: [...anterior.productos, creado] }));
  }

  async function actualizar(id, producto) {
    const editado = await pedirApi(`/productos/${encodeURIComponent(id)}`, {
      token, metodo: "PUT", datos: datosProducto(producto),
    });
    modificar((anterior) => ({
      ...anterior, productos: anterior.productos.map((item) => item.id === id ? editado : item),
    }));
  }

  async function eliminar(id) {
    await pedirApi(`/productos/${encodeURIComponent(id)}`, { token, metodo: "DELETE" });
    modificar((anterior) => ({ ...anterior, productos: anterior.productos.filter((item) => item.id !== id) }));
  }

  async function ajustarStock(id, stock, version) {
    const guardado = await pedirApi(`/stock/${encodeURIComponent(id)}`, {
      token, metodo: "PUT", datos: { stock, version },
    });
    modificar((anterior) => ({ ...anterior, existencias: { ...anterior.existencias, [id]: guardado } }));
    return guardado;
  }

  async function crearCategoria(nombre) {
    const creada = await pedirApi("/categorias", { token, metodo: "POST", datos: { nombre: nombre.trim() } });
    modificar((anterior) => ({ ...anterior, categorias: [...anterior.categorias, creada] }));
  }

  async function actualizarCategoria(id, nombre) {
    const editada = await pedirApi(`/categorias/${id}`, { token, metodo: "PUT", datos: { nombre: nombre.trim() } });
    modificar((anterior) => ({
      ...anterior,
      categorias: anterior.categorias.map((item) => item.id === id ? editada : item),
    }));
  }

  async function eliminarCategoria(id) {
    await pedirApi(`/categorias/${id}`, { token, metodo: "DELETE" });
    modificar((anterior) => ({ ...anterior, categorias: anterior.categorias.filter((item) => item.id !== id) }));
  }

  return {
    productos,
    categorias: actual.categorias,
    cargando: Boolean(token && actual.revision !== revision),
    error: actual.error,
    recargar,
    crear,
    actualizar,
    eliminar,
    ajustarStock,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  };
}
