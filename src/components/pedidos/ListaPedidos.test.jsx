import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import ListaPedidos from "./ListaPedidos";

const pedidos = [
  { id: "ped-123", estado: "Confirmado", total: 16000, items: [{ id: "1", nombre: "Cilindro 15kg", cantidad: 1 }] },
  { id: "ped-456", estado: "Pendiente", total: 6500, items: [{ id: "2", nombre: "Cilindro 5kg", cantidad: 1 }] },
];

it("muestra 'No hay pedidos' si lista vacía", () => {
  render(<ListaPedidos pedidos={[]} eliminar={vi.fn()} />);
  expect(screen.getByText("No hay pedidos registrados.")).toBeInTheDocument();
});

it("renderiza lista de pedidos con datos", () => {
  render(<ListaPedidos pedidos={pedidos} eliminar={vi.fn()} />);
  expect(screen.getByText("Pedido ped-123")).toBeInTheDocument();
  expect(screen.getByText("Confirmado · $16.000")).toBeInTheDocument();
  expect(screen.getByText("Cilindro 15kg × 1")).toBeInTheDocument();
  expect(screen.getByText("Pedido ped-456")).toBeInTheDocument();
  expect(screen.getByText("Pendiente · $6.500")).toBeInTheDocument();
  expect(screen.getByText("Cilindro 5kg × 1")).toBeInTheDocument();
});

it("muestra botón eliminar si prop eliminar existe", () => {
  render(<ListaPedidos pedidos={pedidos} eliminar={vi.fn()} />);
  expect(screen.getByRole("button", { name: "Eliminar pedido ped-123" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Eliminar pedido ped-456" })).toBeInTheDocument();
});

it("oculta botón eliminar si no hay prop eliminar", () => {
  render(<ListaPedidos pedidos={pedidos} />);
  expect(screen.queryByRole("button", { name: /Eliminar pedido/ })).not.toBeInTheDocument();
});

it("llama eliminar al click en botón", async () => {
  const user = userEvent.setup();
  const eliminar = vi.fn();
  render(<ListaPedidos pedidos={pedidos} eliminar={eliminar} />);
  await user.click(screen.getByRole("button", { name: "Eliminar pedido ped-123" }));
  expect(eliminar).toHaveBeenCalledWith("ped-123");
});