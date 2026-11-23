import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, it, vi } from "vitest";
import Checkout from "./Checkout";
import ResultadoCompra from "./ResultadoCompra";

vi.mock("../hooks/useAuth", () => ({ useAuth: () => ({ sesion: { nombre: "María Pérez" } }) }));

const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const items = [{ id: "gas-5kg", nombre: "Cilindro", precio: 5900, cantidad: 2, stock: 4 }];

function montar(onPedido) {
  const vaciar = vi.fn();
  render(
    <MemoryRouter initialEntries={["/checkout"]}>
      <Routes>
        <Route path="/checkout" element={<Checkout items={items} vaciar={vaciar} onPedido={onPedido} />} />
        <Route path="/compra/:resultado" element={<ResultadoCompra />} />
      </Routes>
    </MemoryRouter>,
  );
  return vaciar;
}

async function completarDatos(user, incluirPunto = true) {
  expect(screen.getByLabelText("Nombre de quien recibe")).toHaveValue("María Pérez");
  await user.type(screen.getByLabelText("Teléfono"), "+56 9 1234 5678");
  await user.type(screen.getByLabelText("Dirección"), "Pasaje de prueba 123");
  await user.selectOptions(screen.getByLabelText("Comuna"), "Chillán");
  if (incluirPunto) {
    await user.type(screen.getByLabelText("Latitud"), "-36.60");
    await user.type(screen.getByLabelText("Longitud"), "-72.10");
  }
}

it("envía la entrega y las cantidades; muestra el total confirmado por el servidor", async () => {
  const onPedido = vi.fn().mockResolvedValue({ id: 8, items, total: 12000, comuna: "Chillán" });
  const vaciar = montar(onPedido);
  const user = userEvent.setup();
  await completarDatos(user);
  await user.click(screen.getByRole("button", { name: "Confirmar compra" }));
  expect(onPedido).toHaveBeenCalledWith({
    nombre: "María Pérez", telefono: "+56 9 1234 5678", direccion: "Pasaje de prueba 123",
    comuna: "Chillán", items: [{ id: "gas-5kg", cantidad: 2 }],
    latitudEntrega: -36.6, longitudEntrega: -72.1, referenciaCompra: expect.stringMatching(uuid),
  });
  expect(vaciar).toHaveBeenCalledOnce();
  expect(await screen.findByRole("heading", { name: "Compra confirmada" })).toBeInTheDocument();
  expect(screen.getByText("Total de productos: $12.000")).toBeInTheDocument();
});

it("mantiene el carrito cuando el servidor rechaza un pedido", async () => {
  const onPedido = vi.fn().mockRejectedValue(new Error("Stock insuficiente para Cilindro."));
  const vaciar = montar(onPedido);
  const user = userEvent.setup();
  await completarDatos(user);
  await user.click(screen.getByRole("button", { name: "Confirmar compra" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Stock insuficiente para Cilindro.");
  expect(vaciar).not.toHaveBeenCalled();
  expect(screen.getByLabelText("Dirección")).toHaveValue("Pasaje de prueba 123");
});

it("exige ambas coordenadas y enfoca el campo pendiente", async () => {
  const onPedido = vi.fn();
  montar(onPedido);
  const user = userEvent.setup();
  await completarDatos(user, false);
  await user.type(screen.getByLabelText("Latitud"), "-36.60");
  await user.click(screen.getByRole("button", { name: "Confirmar compra" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Marca el punto de entrega en el mapa");
  expect(screen.getByLabelText("Longitud")).toHaveFocus();
  expect(screen.getByLabelText("Longitud")).toHaveAttribute("aria-invalid", "true");
  expect(onPedido).not.toHaveBeenCalled();
});

it("usa la misma referencia al reintentar y genera otra si cambian los datos", async () => {
  const onPedido = vi.fn()
    .mockRejectedValueOnce(new Error("Se perdió la conexión."))
    .mockRejectedValueOnce(new Error("Se perdió la conexión."))
    .mockResolvedValue({ id: 8, items, total: 12000, comuna: "Chillán" });
  const vaciar = montar(onPedido);
  const user = userEvent.setup();
  await completarDatos(user);
  const confirmar = screen.getByRole("button", { name: "Confirmar compra" });

  await user.click(confirmar);
  expect(await screen.findByRole("alert")).toHaveTextContent("Se perdió la conexión.");
  await user.click(confirmar);
  expect(await screen.findByRole("alert")).toHaveTextContent("Se perdió la conexión.");

  const [primerIntento, segundoIntento] = onPedido.mock.calls.map(([datos]) => datos.referenciaCompra);
  expect(primerIntento).toMatch(uuid);
  expect(segundoIntento).toBe(primerIntento);
  expect(vaciar).not.toHaveBeenCalled();

  await user.type(screen.getByLabelText("Dirección"), " A");
  await user.click(confirmar);
  expect(await screen.findByRole("heading", { name: "Compra confirmada" })).toBeInTheDocument();
  expect(onPedido.mock.calls[2][0].referenciaCompra).toMatch(uuid);
  expect(onPedido.mock.calls[2][0].referenciaCompra).not.toBe(primerIntento);
  expect(vaciar).toHaveBeenCalledOnce();
});
