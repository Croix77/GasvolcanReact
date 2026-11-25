import { useCallback, useEffect, useState } from "react";
import { listarCategorias, crearCategoria as apiCrearCategoria, actualizarCategoria as apiActualizarCategoria, eliminarCategoria as apiEliminarCategoria } from "../services/categoriasApi";
import { listarProductos, listarStock, crearProducto as apiCrearProducto, actualizarProducto as apiActualizarProducto, eliminarProducto as apiEliminarProducto, guardarStock } from "../services/productosApi";
import { useAuth } from "./useAuth";

function mapProducto(p, stockMap) {
  return {
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion || "",
    descripcionLarga: p.descripcionLarga || "",
    unidad: p.unidad || "unidad",
    categoriaId: p.categoriaId,
    categoria: p.categoria || "",
    precio: Number(p.precio ?? 0),
    precioComercial: p.precioComercial ?? null,
    precioAnterior: p.precioAnterior ?? null,
    stock: Number(stockMap.get(p.id)?.stock ?? 0),
    stockVersion: stockMap.get(p.id)?.version,
    stockCritico: Number(p.stockCritico ?? 10),
    imagen: p.imagen || "",
    oferta: Boolean(p.oferta),
    version: p.version,
  };
}

export function useCatalogo() {
  const { sesion, asegurarToken } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [cats, prods, stocks] = await Promise.all([listarCategorias(), listarProductos(), listarStock().catch(() => [])]);
      const stockMap = new Map((stocks || []).map((s) => [s.id, s]));
      setCategorias((cats || []).map((c) => ({ id: c.id, nombre: c.nombre })));
      setProductos((prods || []).map((p) => mapProducto(p, stockMap)));
      setError("");
    } catch (e) {
      setError(e.message || "No se pudo cargar el catálogo.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  async function conToken(fn) {
    const token = await asegurarToken();
    if (!token) throw new Error("Sesión inválida.");
    return fn(token);
  }

  async function crear(datos) {
    await conToken(async (token) => {
      const cat = categorias.find((c) => c.nombre === datos.categoria);
      const payload = {
        codigo: datos.codigo || datos.nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40),
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        descripcionLarga: datos.descripcionLarga || datos.descripcion,
        unidad: datos.unidad || "unidad",
        categoriaId: cat?.id,
        precio: Number(datos.precio),
        precioAnterior: datos.precioAnterior === "" || datos.precioAnterior == null ? null : Number(datos.precioAnterior),
        stockCritico: Number(datos.stockCritico ?? 10),
        imagen: datos.imagen || "",
        oferta: Boolean(datos.oferta),
      };
      const creado = await apiCrearProducto(payload, token);
      const stock = Number(datos.stock ?? 0);
      if (Number.isFinite(stock) && stock >= 0) {
        await guardarStock(creado.id, stock, token);
      }
    });
    await cargar();
  }

  async function actualizar(id, datos) {
    await conToken(async (token) => {
      const actual = productos.find((p) => p.id === id);
      const cat = categorias.find((c) => c.nombre === datos.categoria) || categorias.find((c) => c.id === datos.categoriaId);
      const payload = {
        codigo: datos.codigo || actual?.codigo || id,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        descripcionLarga: datos.descripcionLarga || actual?.descripcionLarga || datos.descripcion,
        unidad: datos.unidad || actual?.unidad || "unidad",
        categoriaId: cat?.id || actual?.categoriaId,
        precio: Number(datos.precio),
        precioAnterior: datos.precioAnterior === "" || datos.precioAnterior == null ? null : Number(datos.precioAnterior),
        stockCritico: Number(datos.stockCritico ?? actual?.stockCritico ?? 10),
        imagen: datos.imagen ?? actual?.imagen ?? "",
        oferta: Boolean(datos.oferta),
        version: actual?.version,
      };
      await apiActualizarProducto(id, payload, token);
      const stock = Number(datos.stock ?? 0);
      if (Number.isFinite(stock) && stock >= 0) {
        await guardarStock(id, stock, token, actual?.stockVersion);
      }
    });
    await cargar();
  }

  async function eliminar(id) {
    await conToken((token) => apiEliminarProducto(id, token));
    await cargar();
  }

  async function crearCategoria(nombre) {
    await conToken((token) => apiCrearCategoria(nombre, token));
    await cargar();
  }
  async function actualizarCategoria(id, nombre) {
    await conToken((token) => apiActualizarCategoria(id, nombre, token));
    await cargar();
  }
  async function eliminarCategoria(id) {
    await conToken((token) => apiEliminarCategoria(id, token));
    await cargar();
  }

  return { productos, categorias, cargando, error, recargar: cargar, crear, actualizar, eliminar, crearCategoria, actualizarCategoria, eliminarCategoria };
}
