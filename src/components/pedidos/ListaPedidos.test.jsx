import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import ListaPedidos from "./ListaPedidos";

const pedidos = [
  { id: 123, nombre: "María Pérez", telefono: "912345678", estado: "ENTREGADO", pagoEfectivo: true,
    total: 16000, items: [{ id: "gas-15kg", nombre: "Cilindro 15kg", cantidad: 1 }] },
  { id: 456, estado: "PENDIENTE", total: 6500, items: [{ id: "gas-5kg", nombre: "Cilindro 5kg", cantidad: 1 }] },
];

it("muestra un mensaje cuando no hay pedidos", () => {
  render(<ListaPedidos pedidos={[]} />);
  expect(screen.getByText("No hay pedidos registrados.")).toBeInTheDocument();
});

it("muestra pedidos con estado, total, unidades y confirmación del pago", () => {
  render(<ListaPedidos pedidos={pedidos} />);
  expect(screen.getByRole("heading", { name: "Pedido 123" })).toBeInTheDocument();
  expect(screen.getByText("Entregado · $16.000")).toBeInTheDocument();
  expect(screen.getByText("Cilindro 15kg × 1")).toBeInTheDocument();
  expect(screen.getByText("Pendiente · $6.500")).toBeInTheDocument();
  expect(screen.getByText("Pago en efectivo registrado.")).toBeInTheDocument();
  expect(screen.getByText("Pago en efectivo al recibir.")).toBeInTheDocument();
});

it("muestra datos de contacto solo en la vista operativa", () => {
  const vista = render(<ListaPedidos pedidos={pedidos} />);
  expect(screen.queryByText(/Contacto: María Pérez/)).not.toBeInTheDocument();
  vista.rerender(<ListaPedidos pedidos={pedidos} mostrarContacto />);
  expect(screen.getByText("Contacto: María Pérez · 912345678")).toBeInTheDocument();
});
