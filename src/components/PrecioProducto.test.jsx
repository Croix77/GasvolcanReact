import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import PrecioProducto from "./PrecioProducto";

it("muestra el precio anterior tachado en oferta y lo oculta al quitar la oferta", () => {
  // Preparar y mostrar el precio del producto.
  const vista = render(<PrecioProducto precio={5900} precioAnterior={6500} oferta />);
  // Comprobar: el precio anterior utiliza la etiqueta de tachado.
  expect(screen.getByText("$6.500").tagName).toBe("DEL");
  expect(screen.getByText("$5.900")).toBeInTheDocument();
  expect(screen.getByText("En oferta")).toBeInTheDocument();
  // Actuar: mostrar el mismo producto sin ese dato.
  vista.rerender(<PrecioProducto precio={5900} precioAnterior={6500} />);
  expect(screen.queryByText("$6.500")).not.toBeInTheDocument();
  expect(screen.queryByText("En oferta")).not.toBeInTheDocument();
});

it("conserva Gratis y la etiqueta de oferta aunque no haya precio anterior", () => {
  // Preparar y mostrar el precio del producto.
  const vista = render(<PrecioProducto precio={0} precioAnterior={1000} oferta />);
  expect(screen.getByText("Gratis")).toHaveClass("producto-gratis");
  expect(screen.getByText("$1.000").tagName).toBe("DEL");
  // Actuar: mostrar el mismo producto sin ese dato.
  vista.rerender(<PrecioProducto precio={0} oferta />);
  expect(screen.getByText("Gratis")).toBeInTheDocument();
  expect(screen.getByText("En oferta")).toBeInTheDocument();
  expect(screen.queryByText(/Antes/)).not.toBeInTheDocument();
});

