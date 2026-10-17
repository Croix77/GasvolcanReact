import { expect, it } from "vitest";
import { validarProducto, normalizarProducto } from "./catalogo";
import { productos } from "../data/productos";

const producto = {
  nombre: "Cilindro de prueba",
  descripcion: "Producto de ejemplo",
  categoria: "Gas",
  precio: 1000,
  stock: 5,
  oferta: true,
};

it("acepta un precio anterior mayor y permite dejarlo sin completar", () => {
  // Preparar: el precio actual es 1000 y el anterior es 1500.
  const oferta = { ...producto, precioAnterior: "1500" };

  // Actuar: validar y convertir el texto del campo en numero.
  const errores = validarProducto(oferta);
  const guardado = normalizarProducto(oferta);

  // Comprobar: no hay errores y se guarda un numero.
  expect(errores).toEqual({});
  expect(guardado.precioAnterior).toBe(1500);
  expect(validarProducto(producto)).toEqual({});
});

it("rechaza precios anteriores menores, iguales, negativos o decimales", () => {
  // Cada llamada representa una entrada incorrecta en el formulario.
  expect(validarProducto({ ...producto, precioAnterior: 900 })).toHaveProperty("precioAnterior");
  expect(validarProducto({ ...producto, precioAnterior: 1000 })).toHaveProperty("precioAnterior");
  expect(validarProducto({ ...producto, precioAnterior: -1 })).toHaveProperty("precioAnterior");
  expect(validarProducto({ ...producto, precioAnterior: 1.5 })).toHaveProperty("precioAnterior");
  expect(validarProducto({ ...producto, precioAnterior: true })).toHaveProperty("precioAnterior");
  expect(validarProducto({ ...producto, precioAnterior: "abc" })).toHaveProperty("precioAnterior");
  expect(validarProducto({ ...producto, precioAnterior: " " })).toHaveProperty("precioAnterior");
});

it("incluye tres productos iniciales con un descuento valido", () => {
  // Preparar y actuar: buscar las ofertas del catalogo inicial.
  const ofertas = productos.filter((item) => item.oferta);

  // Comprobar que los tres productos tengan un precio anterior mayor.
  expect(ofertas.length).toBeGreaterThanOrEqual(3);
  expect(ofertas[0].precioAnterior).toBeGreaterThan(ofertas[0].precio);
  expect(ofertas[1].precioAnterior).toBeGreaterThan(ofertas[1].precio);
  expect(ofertas[2].precioAnterior).toBeGreaterThan(ofertas[2].precio);
});
