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

it("valida y envía una consulta con el correo de la sesión en solo lectura", async () => {
  const user = userEvent.setup();
  const { fetch } = renderApp("/contacto");
  const boton = screen.getByRole("button", { name: "Enviar consulta" });
  const correo = screen.getByLabelText("Correo electrónico");
  expect(correo).toHaveValue("cliente@example.com");
  expect(correo).toHaveAttribute("readonly");
  await user.click(boton);
  expect(screen.getByText("Escribe un mensaje de 10 a 1000 caracteres.")).toBeInTheDocument();

  const mensaje = screen.getByLabelText("Mensaje");
  await user.type(mensaje, "Consulta de demostración");
  await user.click(boton);
  expect(await screen.findByText("Recibimos tu consulta.")).toBeInTheDocument();
  const envios = fetch.mock.calls.filter(([url, opciones]) => url === "/api/v1/contacto/mensajes" && opciones.method === "POST");
  expect(envios).toHaveLength(1);
  expect(envios[0][1].headers.Authorization).toMatch(/^Bearer /);
  expect(JSON.parse(envios[0][1].body)).toEqual({
    nombre: "Cliente de prueba", mensaje: "Consulta de demostración",
    referencia: expect.stringMatching(/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/),
  });
  expect(mensaje).toHaveValue("");
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

it("rellena el nombre de la sesión y envía el precio esperado de cada producto", async () => {
  const user = userEvent.setup();
  const { fetch } = renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }]);
  expect(await screen.findByLabelText("Nombre de quien recibe")).toHaveValue("Cliente de prueba");
  await ingresarEntrega(user);
  expect(await screen.findByRole("heading", { name: "Compra confirmada" })).toBeInTheDocument();
  const compra = fetch.mock.calls.find(([url, opciones]) =>
    url.endsWith("/api/v1/pedidos") && opciones.method === "POST");
  expect(JSON.parse(compra[1].body)).toEqual({
    nombre: "Cliente de prueba", telefono: "912345678", direccion: "Dirección ficticia 123",
    comuna: "Chillán", items: [{ id: "gas-15kg", cantidad: 1, precioEsperado: 16000 }],
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

it("refresca el total en un conflicto de precio y espera una nueva confirmación", async () => {
  const user = userEvent.setup();
  const productos = [{
    id: "gas-15kg", nombre: "Cilindro de Gas 15 Kg", descripcion: "Cilindro",
    categoria: "Cilindros de Gas", precio: 16000, stock: 5,
  }];
  const { fetch } = renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }], {
    productos,
    errorCompra: ({ items }) => {
      if (items[0].precioEsperado === 17000) return null;
      productos[0].precio = 17000;
      return "El precio del producto cambió.";
    },
  });

  await ingresarEntrega(user);
  expect(await screen.findByRole("alert")).toHaveTextContent("El precio del producto cambió.");
  expect(await screen.findByText("Total de productos: $17.000")).toBeInTheDocument();
  expect(screen.getByLabelText("Dirección")).toHaveValue("Dirección ficticia 123");
  expect(JSON.parse(localStorage.getItem(claveCarritoCliente))).toHaveLength(1);
  const compras = () => fetch.mock.calls.filter(([ruta, opciones]) =>
    ruta === "/api/v1/pedidos" && opciones.method === "POST").map(([, opciones]) => JSON.parse(opciones.body));
  expect(compras()).toHaveLength(1);

  await user.click(await screen.findByRole("button", { name: "Confirmar compra" }));
  expect(await screen.findByRole("heading", { name: "Compra confirmada" })).toBeInTheDocument();
  const [primera, segunda] = compras();
  expect(primera.items[0].precioEsperado).toBe(16000);
  expect(segunda.items[0].precioEsperado).toBe(17000);
  expect(primera.referenciaCompra).not.toBe(segunda.referenciaCompra);
});

it("muestra 404 para producto inexistente y ruta inválida", async () => {
  renderApp("/productos/no-existe");
  expect(await screen.findByRole("heading", { level: 1, name: "Producto no encontrado" })).toBeInTheDocument();
  renderApp("/ruta-no-existe");
  expect(screen.getByRole("heading", { level: 1, name: "Página no encontrada" })).toBeInTheDocument();
});
