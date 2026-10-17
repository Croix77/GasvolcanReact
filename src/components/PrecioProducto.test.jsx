import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import PrecioProducto from "./PrecioProducto";
import { validarProducto, normalizarProducto } from "../services/catalogo";
import { productos } from "../data/productos";

it("muestra el precio anterior tachado en oferta y lo oculta al quitar la oferta", () => {
  const vista = render(<PrecioProducto precio={5900} precioAnterior={6500} oferta />);
  expect(screen.getByText("$6.500").tagName).toBe("DEL");
  expect(screen.getByText("$5.900")).toBeInTheDocument();
  expect(screen.getByText("En oferta")).toBeInTheDocument();
  vista.rerender(<PrecioProducto precio={5900} precioAnterior={6500} />);
  expect(screen.queryByText("$6.500")).not.toBeInTheDocument();
  expect(screen.queryByText("En oferta")).not.toBeInTheDocument();
});

it("conserva Gratis y la etiqueta de oferta aunque no haya precio anterior", () => {
  const vista = render(<PrecioProducto precio={0} precioAnterior={1000} oferta />);
  expect(screen.getByText("Gratis")).toHaveClass("producto-gratis");
  expect(screen.getByText("$1.000").tagName).toBe("DEL");
  vista.rerender(<PrecioProducto precio={0} oferta />);
  expect(screen.getByText("Gratis")).toBeInTheDocument();
  expect(screen.getByText("En oferta")).toBeInTheDocument();
  expect(screen.queryByText(/Antes/)).not.toBeInTheDocument();
});

it("incluye tres descuentos iniciales y valida el precio anterior sin inventarlo", () => {
  expect(productos.filter((p) => p.oferta && p.precioAnterior > p.precio).length).toBeGreaterThanOrEqual(3);
  const producto = { nombre: "Gas", descripcion: "Cilindro", categoria: "Gas", precio: 1000, stock: 5, oferta: true };
  for (const precioAnterior of [1000, 900, -1, 1.5, true, "abc", " "]) {
    expect(validarProducto({ ...producto, precioAnterior })).toHaveProperty("precioAnterior");
  }
  expect(validarProducto(producto)).toEqual({});
  expect(normalizarProducto({ ...producto, precioAnterior: "1500" }).precioAnterior).toBe(1500);
});
