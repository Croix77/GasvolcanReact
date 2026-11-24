import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { useAuth } from "../hooks/useAuth";
import { pedirAuth, pedirApi } from "../services/api";
import PedidosDespacho from "./PedidosDespacho";

vi.mock("../hooks/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("../services/api", () => ({ pedirAuth: vi.fn(), pedirApi: vi.fn() }));

const pedido = {
  id: 5, correoCliente: "cliente@example.com", estado: "PENDIENTE", items: [],
  total: 5900, nombre: "Cliente de prueba", telefono: "912345678",
};
const repartidor = { id: 24, nombre: "Repartidora de prueba", correo: "reparto@example.com" };

it("la operadora consulta por fecha y asigna un repartidor activo", async () => {
  useAuth.mockReturnValue({ sesion: { token: "token-operadora", rol: "operadora" } });
  pedirAuth.mockResolvedValue([repartidor]);
  pedirApi.mockImplementation(async (ruta) => ruta.includes("asignacion") ? {} : [pedido]);
  const user = userEvent.setup();
  render(<PedidosDespacho />);
  const selector = await screen.findByLabelText("Repartidor para pedido 5");
  await user.selectOptions(selector, repartidor.correo);
  await user.click(screen.getByRole("button", { name: "Asignar" }));

  expect(pedirApi).toHaveBeenCalledWith(expect.stringMatching(/^\/despacho\?fecha=\d{4}-\d{2}-\d{2}$/),
    expect.objectContaining({ token: "token-operadora" }));
  expect(pedirApi).toHaveBeenCalledWith("/despacho/5/asignacion", {
    token: "token-operadora", metodo: "PATCH", datos: { correoRepartidor: repartidor.correo },
  });
  expect(await screen.findByText("Repartidor asignado.")).toBeInTheDocument();
});

it("el repartidor puede marcar la entrega y registrar el pago", async () => {
  useAuth.mockReturnValue({ sesion: { token: "token-repartidor", correo: repartidor.correo, rol: "repartidor" } });
  let estado = "EN_CAMINO";
  pedirApi.mockImplementation(async (ruta, opciones) => {
    if (ruta.endsWith("/estado")) estado = opciones.datos.estado;
    return [{ ...pedido, correoRepartidor: repartidor.correo, estado, pagoEfectivo: estado === "ENTREGADO" }];
  });
  render(<PedidosDespacho />);
  const boton = await screen.findByRole("button", { name: "Registrar entrega y pago" });
  await userEvent.setup().click(boton);

  expect(pedirApi).toHaveBeenCalledWith("/despacho/5/estado", {
    token: "token-repartidor", metodo: "PATCH", datos: { estado: "ENTREGADO" },
  });
  await waitFor(() => expect(screen.getByText("Pago en efectivo registrado.")).toBeInTheDocument());
  expect(screen.queryByRole("button", { name: "Asignar" })).not.toBeInTheDocument();
});
