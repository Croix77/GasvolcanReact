import { productos as iniciales } from "../data/productos";
import { normalizarProducto, validarProducto } from "./catalogo";
import { validarCategoria } from "./categorias";

const claveCatalogo = "gas-volcan-catalogo-v2";
const claveAnterior = "gas-el-volcan-catalogo-v1";

function recuperarProductos(lista) {
  if (!Array.isArray(lista)) throw new Error("Catálogo inválido.");
  const ids = new Set();
  return lista.map((producto) => {
    if (
      !producto ||
      typeof producto.id !== "string" ||
      !producto.id ||
      ids.has(producto.id)
    ) {
      throw new Error("Identificador inválido o duplicado.");
    }
    if (Object.keys(validarProducto(producto)).length > 0)
      throw new Error("Producto inválido.");
    ids.add(producto.id);
    const original = iniciales.find((item) => item.id === producto.id);
    return {
      ...original,
      ...normalizarProducto(producto),
      imagen: original?.imagen || "",
    };
  });
}

function categoriasDelCatalogo(productos) {
  const nombres = [
    ...new Set(
      [...iniciales, ...productos].map((producto) => producto.categoria),
    ),
  ];
  return nombres.map((nombre, indice) => ({
    id: `categoria-${indice}`,
    nombre,
  }));
}

function recuperarVersionAnterior() {
  let productos = iniciales;
  try {
    const guardado = localStorage.getItem(claveAnterior);
    if (guardado !== null) productos = recuperarProductos(JSON.parse(guardado));
  } catch {
    // Si no se puede recuperar, se utiliza el catálogo inicial.
  }
  return { productos, categorias: categoriasDelCatalogo(productos) };
}

export function recuperarEstadoCatalogo() {
  try {
    const guardado = localStorage.getItem(claveCatalogo);
    if (guardado === null) return recuperarVersionAnterior();
    const datos = JSON.parse(guardado);
    if (!Array.isArray(datos?.categorias))
      throw new Error("Categorías inválidas.");
    const ids = new Set();
    for (const categoria of datos.categorias) {
      if (
        !categoria ||
        typeof categoria.id !== "string" ||
        !categoria.id ||
        ids.has(categoria.id)
      )
        throw new Error("Identificador de categoría inválido.");
      if (validarCategoria(categoria.nombre, datos.categorias, categoria.id))
        throw new Error("Categoría inválida.");
      ids.add(categoria.id);
    }
    const categorias = datos.categorias.map(({ id, nombre }) => ({
      id,
      nombre: nombre.trim(),
    }));
    const productos = recuperarProductos(datos.productos);
    for (const producto of productos) {
      if (
        !categorias.some((categoria) => categoria.nombre === producto.categoria)
      )
        throw new Error("Categoría del producto inexistente.");
    }
    return { productos, categorias };
  } catch {
    return recuperarVersionAnterior();
  }
}

export function guardarEstadoCatalogo(estado) {
  try {
    localStorage.setItem(claveCatalogo, JSON.stringify(estado));
    return true;
  } catch {
    return false;
  }
}
