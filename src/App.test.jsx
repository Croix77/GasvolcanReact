import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import App from "./App";

function renderApp(ruta = "/catalogo") {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}

function getProductCard(nombre) {
  const catalogo = screen.getByRole("region", { name: "Catálogo de productos" });
  return within(catalogo).getByRole("heading", { name: nombre, level: 2 }).closest("article");
}

function getSidebar() {
  return screen.getByRole("dialog", { name: /Carrito de compras/ });
}

function getFloatingCartButton() {
  return screen.getByRole("button", { name: /Carrito \(\d+ items?\)/ });
}

it("mantiene el panel cerrado con productos y permite cerrarlo con Escape", async () => {
  localStorage.setItem("gas-el-volcan-carrito", JSON.stringify([{ id: "gas-15kg", cantidad: 1 }]));
  const user = userEvent.setup();
  renderApp();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  const boton = getFloatingCartButton();
  await user.click(boton);
  expect(getSidebar()).toBeInTheDocument();
  expect(boton).toHaveAttribute("aria-expanded", "true");
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(boton).toHaveAttribute("aria-expanded", "false");
  expect(boton).toHaveFocus();
});

it("abre la pagina Carrito desde el menu y muestra su estado vacio", async () => {
  const user = userEvent.setup();
  renderApp("/");
  await user.click(screen.getByRole("link", { name: "Carrito", exact: true }));
  expect(screen.getByRole("heading", { level: 1, name: "Carrito (0)" })).toBeInTheDocument();
  expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
});

it("recupera productos en la ruta Carrito y permite cambiar cantidad y vaciar", async () => {
  localStorage.setItem("gas-el-volcan-carrito", JSON.stringify([{ id: "gas-15kg", cantidad: 1 }]));
  const user = userEvent.setup();
  renderApp("/carrito");
  const pagina = screen.getByRole("region", { name: "Carrito (1)" });
  expect(within(pagina).getByRole("heading", { name: "Cilindro de Gas 15 Kg" })).toBeInTheDocument();
  await user.selectOptions(within(pagina).getByRole("combobox"), "2");
  expect(within(pagina).getByText("Total: $32.000")).toBeInTheDocument();
  expect(getFloatingCartButton()).toHaveTextContent("2");
  expect(within(pagina).getByRole("link", { name: "Continuar compra" })).toHaveAttribute("href", "/checkout");
  await user.click(within(pagina).getByRole("button", { name: "Vaciar carrito" }));
  expect(within(pagina).getByText("Tu carrito está vacío.")).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("gas-el-volcan-carrito"))).toEqual([]);
});

it("Inicio no muestra el catalogo y permite abrirlo con Ver productos", async () => {
  const user = userEvent.setup();
  renderApp("/");
  expect(screen.queryByRole("region", { name: "Catálogo de productos" })).not.toBeInTheDocument();
  expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  expect(getFloatingCartButton()).toHaveTextContent("0");
  await user.click(screen.getByRole("link", { name: "Ver productos" }));
  expect(screen.getByRole("heading", { level: 1, name: "Catálogo de productos" })).toBeInTheDocument();
  for (const peso of [5, 11, 15]) {
    const card = getProductCard(`Cilindro de Gas ${peso} Kg`);
    expect(within(card).getByRole("img")).toHaveAttribute("src");
  }
  const btn = getFloatingCartButton();
  expect(btn).toHaveTextContent("0");
});

it("agrega productos y muestra sidebar con numeración", async () => {
  const user = userEvent.setup();
  renderApp();
  const espia = vi.spyOn(Storage.prototype, "setItem");
  const card = getProductCard("Cilindro de Gas 15 Kg");
  await user.click(within(card).getByRole("button", { name: "Añadir al Carrito" }));
  await user.click(within(card).getByRole("button", { name: "Añadir al Carrito" }));

  await user.click(getFloatingCartButton());
  const sidebar = getSidebar();
  expect(within(sidebar).getByText("1")).toBeInTheDocument(); // badge número
  expect(within(sidebar).getByText("Cilindro de Gas 15 Kg")).toBeInTheDocument();
  expect(within(sidebar).getAllByText("$32.000")).toHaveLength(2); // item + total
  expect(JSON.parse(localStorage.getItem("gas-el-volcan-carrito"))).toEqual([{ id: "gas-15kg", cantidad: 2 }]);
  expect(espia).toHaveBeenCalledWith("gas-el-volcan-carrito", JSON.stringify([{ id: "gas-15kg", cantidad: 2 }]));
});

it("permite eliminar y vaciar carrito desde sidebar", async () => {
  const user = userEvent.setup();
  renderApp();
  const card = getProductCard("Cilindro de Gas 15 Kg");
  await user.click(within(card).getByRole("button", { name: "Añadir al Carrito" }));

  await user.click(getFloatingCartButton());
  const sidebar = getSidebar();
  await user.click(within(sidebar).getByRole("button", { name: "Eliminar Cilindro de Gas 15 Kg" }));
  await user.click(screen.getByRole("button", { name: "Cerrar carrito" }));
  // tras eliminar, vuelve al botón flotante
  expect(getFloatingCartButton()).toHaveTextContent("0");

  const card5 = getProductCard("Cilindro de Gas 5 Kg");
  await user.click(within(card5).getByRole("button", { name: "Añadir al Carrito" }));
  await user.click(getFloatingCartButton());
  const sidebar2 = getSidebar();
  await user.click(within(sidebar2).getByRole("button", { name: "Vaciar carrito" }));
  expect(JSON.parse(localStorage.getItem("gas-el-volcan-carrito"))).toEqual([]);
  await user.click(screen.getByRole("button", { name: "Cerrar carrito" }));
  expect(getFloatingCartButton()).toHaveTextContent("0");
});

it("recupera carrito al recargar y muestra cantidad en badge", async () => {
  localStorage.setItem("gas-el-volcan-carrito", JSON.stringify([{ id: "gas-15kg", cantidad: 90 }]));
  const user = userEvent.setup();
  const vista = renderApp();
  const card = getProductCard("Cilindro de Gas 15 Kg");
  await user.click(within(card).getByRole("button", { name: "Añadir al Carrito" }));

  await user.click(getFloatingCartButton());
  const sidebar = getSidebar();
  expect(within(sidebar).getByText("(90)")).toBeInTheDocument(); // badge en header
  vista.unmount();
  renderApp();
  await user.click(getFloatingCartButton());
  expect(within(getSidebar()).getByText("(90)")).toBeInTheDocument();
});
