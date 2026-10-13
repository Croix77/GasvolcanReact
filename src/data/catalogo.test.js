import { beforeEach, describe, expect, it } from "vitest";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  leerProducto,
  recuperarCatalogo,
  validarProducto,
} from "./catalogo";
import { productos } from "./productos";
const producto = {
  id: "nuevo",
  nombre: " Regulador ",
  descripcion: " Descripción ",
  categoria: "Accesorios",
  precio: "1000",
  stock: "3",
};
beforeEach(() => localStorage.clear());
describe("Datos y CRUD del catálogo", () => {
  it("crea sin modificar el arreglo anterior y normaliza los datos", () => {
    const lista = crearProducto(productos, producto);
    expect(lista).toHaveLength(productos.length + 1);
    expect(productos.some((item) => item.id === "nuevo")).toBe(false);
    expect(leerProducto(lista, "nuevo")).toMatchObject({
      nombre: "Regulador",
      precio: 1000,
      stock: 3,
    });
  });
  it("rechaza duplicados y productos inválidos", () => {
    expect(() =>
      crearProducto(productos, { ...producto, id: productos[0].id }),
    ).toThrow();
    expect(() =>
      crearProducto(productos, { ...producto, precio: -1 }),
    ).toThrow();
    expect(
      validarProducto({
        nombre: "",
        descripcion: "",
        categoria: "",
        precio: "",
        stock: "",
      }),
    ).toHaveProperty("stock");
  });
  it("actualiza conservando el id y el estado anterior", () => {
    const nueva = actualizarProducto(productos, "gas-5kg", {
      precio: 7000,
      id: "otro",
    });
    expect(leerProducto(nueva, "gas-5kg").precio).toBe(7000);
    expect(leerProducto(productos, "gas-5kg").precio).toBe(6500);
    expect(() => actualizarProducto(productos, "inexistente", {})).toThrow();
  });
  it("elimina solamente el producto solicitado", () => {
    expect(eliminarProducto(productos, "gas-5kg")).toHaveLength(
      productos.length - 1,
    );
    expect(
      leerProducto(eliminarProducto(productos, "gas-5kg"), "gas-5kg"),
    ).toBeUndefined();
  });
  it("recupera datos persistidos y admite un catálogo vacío", () => {
    localStorage.setItem(
      "gas-el-volcan-catalogo-v1",
      JSON.stringify([producto]),
    );
    expect(recuperarCatalogo()[0]).toMatchObject({ precio: 1000, imagen: "" });
    localStorage.setItem("gas-el-volcan-catalogo-v1", "[]");
    expect(recuperarCatalogo()).toEqual([]);
  });
  it("restaura los datos iniciales ante almacenamiento corrupto o duplicado", () => {
    localStorage.setItem("gas-el-volcan-catalogo-v1", "{");
    expect(recuperarCatalogo()).toEqual(productos);
    localStorage.setItem(
      "gas-el-volcan-catalogo-v1",
      JSON.stringify([producto, producto]),
    );
    expect(recuperarCatalogo()).toEqual(productos);
  });
});
