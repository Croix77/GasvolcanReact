import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import MisPedidos from "./MisPedidos";

it("muestra la carga y permite reintentar tras un error de conexión", async () => {
  const recargar = vi.fn();
  const vista = render(<MisPedidos pedidos={[]} cargando recargar={recargar} />);
  expect(screen.getByRole("status")).toHaveTextContent("Cargando pedidos");
  vista.rerender(<MisPedidos pedidos={[]} error="Servidor sin conexión" recargar={recargar} />);
  expect(screen.getByRole("alert")).toHaveTextContent("Servidor sin conexión");
  await userEvent.setup().click(screen.getByRole("button", { name: "Reintentar" }));
  expect(recargar).toHaveBeenCalledOnce();
});

it("muestra el estado y abre el seguimiento individual si el cliente lo pide", async () => {
  const pedidos = [{ id: 20, estado: "EN_CAMINO", total: 5900, items: [] }];
  const user = userEvent.setup();
  render(<MisPedidos pedidos={pedidos} />);
  expect(screen.getByText("En camino · $5.900")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Ver seguimiento del pedido 20" }));
  expect(screen.getByText("No hay ubicaciones registradas para mostrar en el mapa.")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Ocultar seguimiento del pedido 20" }));
  expect(screen.queryByText(/No hay ubicaciones/)).not.toBeInTheDocument();
});


it("dibuja el punto de entrega y la última posición del repartidor", async () => {
  const pedidos = [{
    id: 20, estado: "EN_CAMINO", total: 5900, items: [],
    latitudEntrega: -36.60, longitudEntrega: -72.10,
    latitudRepartidor: -36.61, longitudRepartidor: -72.12,
  }];
  render(<MisPedidos pedidos={pedidos} />);
  await userEvent.setup().click(screen.getByRole("button", { name: "Ver seguimiento del pedido 20" }));
  expect(await screen.findByRole("region", { name: "Mapa del pedido 20" })).toBeInTheDocument();
  expect(screen.getByTitle("Entrega · pedido 20")).toBeInTheDocument();
  expect(screen.getByTitle("Última posición del repartidor · pedido 20")).toBeInTheDocument();
});
