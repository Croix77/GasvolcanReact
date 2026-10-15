import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import App from "../App";
import { perfilClienteDemo } from "../data/perfilClienteDemo";

function renderApp(ruta = "/catalogo", carrito = []) {
  if (carrito.length > 0) {
    localStorage.setItem("gas-el-volcan-carrito", JSON.stringify(carrito));
  }
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}

it("bloquea checkout si stock cambió a 0", () => {
  localStorage.setItem("gas-el-volcan-catalogo-v1", JSON.stringify([{
    id: "gas-15kg",
    nombre: "Cilindro de Gas 15 Kg",
    descripcion: "Cilindro",
    categoria: "Cilindros de Gas",
    precio: 16000,
    stock: 0,
  }]));
  renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }]);
  expect(screen.getByRole("button", { name: "Confirmar compra" })).toBeDisabled();
  expect(screen.getByRole("alert")).toHaveTextContent("stock insuficiente");
});

it("filtra por categoría y búsqueda en página categorías", async () => {
  const user = userEvent.setup();
  renderApp("/categorias");
  await user.click(screen.getByRole("link", { name: "Ver productos de Reguladores" }));
  expect(screen.getByRole("combobox")).toHaveValue("Reguladores");
  expect(screen.getAllByRole("article")).toHaveLength(3);
  await user.type(screen.getByLabelText("Buscar productos"), "inexistente");
  expect(screen.queryAllByRole("article")).toHaveLength(0);
  expect(screen.getByText(/No hay productos disponibles/)).toBeInTheDocument();
});

it("navega a detalle de producto desde tarjeta", async () => {
  const user = userEvent.setup();
  renderApp("/catalogo");
  const card = screen.getByRole("heading", { name: "Cilindro de Gas 5 Kg" }).closest("article");
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

it("rechaza checkout vacío", () => {
  renderApp("/checkout");
  expect(screen.getByText("Agrega productos antes de continuar.")).toBeInTheDocument();
});

it("rechaza checkout con datos de entrega inválidos", async () => {
  const user = userEvent.setup();
  renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }]);
  await user.click(screen.getByRole("button", { name: "Confirmar compra" }));
  expect(screen.getByText("Escribe la dirección de entrega.")).toBeInTheDocument();
});

it("autocompleta datos de cliente y completa compra", async () => {
  const user = userEvent.setup();
  sessionStorage.setItem("gas-volcan-sesion-demo", JSON.stringify({ rol: "cliente", vence: Date.now() + 60000 }));
  renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }]);
  expect(screen.getByLabelText("Nombre de quien recibe")).toHaveValue(perfilClienteDemo.nombre);
  expect(screen.getByLabelText("Teléfono")).toHaveValue(perfilClienteDemo.telefono);
  expect(screen.getByLabelText("Dirección")).toHaveValue(perfilClienteDemo.direccion);
  expect(screen.getByLabelText("Comuna")).toHaveValue(perfilClienteDemo.comuna);
  await user.clear(screen.getByLabelText("Nombre de quien recibe"));
  await user.type(screen.getByLabelText("Nombre de quien recibe"), "Cliente ficticio");
  await user.clear(screen.getByLabelText("Teléfono"));
  await user.type(screen.getByLabelText("Teléfono"), "912345678");
  await user.clear(screen.getByLabelText("Dirección"));
  await user.type(screen.getByLabelText("Dirección"), "Dirección ficticia 123");
  await user.selectOptions(screen.getByLabelText("Comuna"), "Chillán");
  await user.click(screen.getByRole("button", { name: "Confirmar compra" }));
  expect(screen.getByRole("heading", { name: "Compra confirmada" })).toBeInTheDocument();
  expect(localStorage.getItem("gas-el-volcan-carrito")).toBe("[]");
});

it("muestra error y conserva carrito si compra falla", async () => {
  const user = userEvent.setup();
  sessionStorage.setItem("gas-volcan-resultado-compra", "error");
  renderApp("/checkout", [{ id: "gas-15kg", cantidad: 1 }]);
  await user.type(screen.getByLabelText("Nombre de quien recibe"), "Cliente ficticio");
  await user.type(screen.getByLabelText("Teléfono"), "912345678");
  await user.type(screen.getByLabelText("Dirección"), "Dirección ficticia 123");
  await user.selectOptions(screen.getByLabelText("Comuna"), "Chillán");
  await user.click(screen.getByRole("button", { name: "Confirmar compra" }));
  expect(screen.getByRole("heading", { name: "No se pudo completar la compra" })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("gas-el-volcan-carrito"))).toHaveLength(1);
});

it("muestra 404 para producto inexistente y ruta inválida", () => {
  renderApp("/productos/no-existe");
  expect(screen.getByRole("heading", { level: 1, name: "Producto no encontrado" })).toBeInTheDocument();
  renderApp("/ruta-no-existe");
  expect(screen.getByRole("heading", { level: 1, name: "Página no encontrada" })).toBeInTheDocument();
});