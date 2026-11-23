import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import App from "../App";
import { claveCarritoCliente, iniciarSesionPrueba, simularApis } from "../test/apiPrueba";

function renderApp(ruta = "/catalogo", carrito = [], api) {
  iniciarSesionPrueba();
  const fetch = simularApis(api);
  if (carrito.length > 0) {
    localStorage.setItem(claveCarritoCliente, JSON.stringify(carrito));
  }
  const vista = render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
  return { ...vista, fetch };
}

it("bloquea checkout si stock cambió a 0", async () => {
  renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }], { productos: [{
    id: "gas-15kg", nombre: "Cilindro de Gas 15 Kg", descripcion: "Cilindro",
    categoria: "Cilindros de Gas", precio: 16000, stock: 0,
  }] });
  expect(await screen.findByRole("button", { name: "Confirmar compra" })).toBeDisabled();
  expect(screen.getByRole("alert")).toHaveTextContent("stock insuficiente");
});

it("filtra por categoría y búsqueda en página categorías", async () => {
  const user = userEvent.setup();
  renderApp("/categorias");
  await user.click(await screen.findByRole("link", { name: "Ver productos de Reguladores" }));
  expect(screen.getByRole("combobox")).toHaveValue("Reguladores");
  expect(screen.getAllByRole("article")).toHaveLength(3);
  await user.type(screen.getByLabelText("Buscar productos"), "inexistente");
  expect(screen.queryAllByRole("article")).toHaveLength(0);
  expect(screen.getByText(/No hay productos disponibles/)).toBeInTheDocument();
});

it("navega a detalle de producto desde tarjeta", async () => {
  const user = userEvent.setup();
  renderApp("/catalogo");
  const card = (await screen.findByRole("heading", { name: "Cilindro de Gas 5 Kg" })).closest("article");
  await user.click(within(card).getByRole("link", { name: "Ver detalle" }));
  expect(screen.getByRole("heading", { level: 1, name: "Cilindro de Gas 5 Kg" })).toBeInTheDocument();
});

it("valida formulario de contacto", async () => {
  const user = userEvent.setup();
  renderApp("/contacto");
  await user.click(screen.getByRole("button", { name: "Validar consulta" }));
  expect(screen.getByText("Escribe un correo válido.")).toBeInTheDocument();
  await user.type(screen.getByLabelText("Nombre"), "Cliente ficticio");
  await user.type(screen.getByLabelText("Correo electrónico"), "demo@example.com");
  await user.type(screen.getByLabelText("Mensaje"), "Consulta de demostración");
  await user.click(screen.getByRole("button", { name: "Validar consulta" }));
  expect(screen.getByText("Consulta validada. No se ha enviado ningún mensaje.")).toBeInTheDocument();
});

it("rechaza checkout vacío", async () => {
  renderApp("/checkout");
  expect(await screen.findByText("Agrega productos antes de continuar.")).toBeInTheDocument();
});

it("rechaza checkout con datos de entrega inválidos", async () => {
  const user = userEvent.setup();
  renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }]);
  await user.click(await screen.findByRole("button", { name: "Confirmar compra" }));
  expect(screen.getByText("Escribe la dirección de entrega.")).toBeInTheDocument();
});

async function ingresarEntrega(user) {
  await user.type(await screen.findByLabelText("Teléfono"), "912345678");
  await user.type(screen.getByLabelText("Dirección"), "Dirección ficticia 123");
  await user.selectOptions(screen.getByLabelText("Comuna"), "Chillán");
  await user.type(screen.getByLabelText("Latitud"), "-36.60");
  await user.type(screen.getByLabelText("Longitud"), "-72.10");
  await user.click(screen.getByRole("button", { name: "Confirmar compra" }));
}

it("rellena el nombre de la sesión y envía únicamente identificadores y cantidades", async () => {
  const user = userEvent.setup();
  const { fetch } = renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }]);
  expect(await screen.findByLabelText("Nombre de quien recibe")).toHaveValue("Cliente de prueba");
  await ingresarEntrega(user);
  expect(await screen.findByRole("heading", { name: "Compra confirmada" })).toBeInTheDocument();
  const compra = fetch.mock.calls.find(([url, opciones]) =>
    url.endsWith("/api/v1/pedidos") && opciones.method === "POST");
  expect(JSON.parse(compra[1].body)).toEqual({
    nombre: "Cliente de prueba", telefono: "912345678", direccion: "Dirección ficticia 123",
    comuna: "Chillán", items: [{ id: "gas-15kg", cantidad: 1 }],
    latitudEntrega: -36.6, longitudEntrega: -72.1, referenciaCompra: expect.any(String),
  });
  expect(localStorage.getItem(claveCarritoCliente)).toBe("[]");
});

it("muestra el error del servidor y conserva el carrito", async () => {
  const user = userEvent.setup();
  renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }], { errorCompra: "Stock insuficiente." });
  await ingresarEntrega(user);
  expect(await screen.findByRole("alert")).toHaveTextContent("Stock insuficiente.");
  expect(JSON.parse(localStorage.getItem(claveCarritoCliente))).toHaveLength(1);
});

it("muestra 404 para producto inexistente y ruta inválida", async () => {
  renderApp("/productos/no-existe");
  expect(await screen.findByRole("heading", { level: 1, name: "Producto no encontrado" })).toBeInTheDocument();
  renderApp("/ruta-no-existe");
  expect(screen.getByRole("heading", { level: 1, name: "Página no encontrada" })).toBeInTheDocument();
});
