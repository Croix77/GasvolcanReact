import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import TablaProductos from "./TablaProductos";

const productos = [
  { id: "1", nombre: "Cilindro 5kg", precio: 6500, stock: 10 },
  { id: "2", nombre: "Regulador", precio: 8990, stock: 5 },
];

it("renderiza tabla con productos", () => {
  render(<TablaProductos productos={productos} onEditar={vi.fn()} onEliminar={vi.fn()} />);
  expect(screen.getByText("Cilindro 5kg")).toBeInTheDocument();
  expect(screen.getByText("Regulador")).toBeInTheDocument();
  expect(screen.getByText("$6.500")).toBeInTheDocument();
  expect(screen.getByText("$8.990")).toBeInTheDocument();
  expect(screen.getByText("10")).toBeInTheDocument();
  expect(screen.getByText("5")).toBeInTheDocument();
});

it("llama onEditar al click en Editar", async () => {
  const onEditar = vi.fn();
  render(<TablaProductos productos={productos} onEditar={onEditar} onEliminar={vi.fn()} />);
  await userEvent.setup().click(screen.getByRole("button", { name: "Editar Cilindro 5kg" }));
  expect(onEditar).toHaveBeenCalledWith(productos[0]);
});

it("llama onEliminar al click en Eliminar", async () => {
  const onEliminar = vi.fn();
  render(<TablaProductos productos={productos} onEditar={vi.fn()} onEliminar={onEliminar} />);
  await userEvent.setup().click(screen.getByRole("button", { name: "Eliminar Cilindro 5kg" }));
  expect(onEliminar).toHaveBeenCalledWith(productos[0]);
});

it("muestra solo cabecera si no hay productos", () => {
  render(<TablaProductos productos={[]} onEditar={vi.fn()} onEliminar={vi.fn()} />);
  expect(screen.getByText("Producto")).toBeInTheDocument();
  expect(screen.getByText("Precio")).toBeInTheDocument();
  expect(screen.getByText("Stock")).toBeInTheDocument();
  expect(screen.getByText("Acciones")).toBeInTheDocument();
  expect(screen.queryAllByRole("row")).toHaveLength(1);
});