import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

function renderApp() {
  return render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
}

const clave = "gas-el-volcan-carrito";

function tarjeta(nombre) {
  return within(screen.getByRole("region", { name: "Catálogo de productos" }))
    .getByRole("heading", { name: nombre, level: 3 })
    .closest("article");
}

function carrito() {
  return screen.getByRole("region", { name: /Carrito \(/ });
}

describe("Catálogo y carrito", () => {
  it("muestra los tres cilindros con imágenes y un carrito vacío", () => {
    renderApp();
    for (const peso of [5, 11, 15]) {
      expect(
        within(tarjeta(`Cilindro de Gas ${peso} Kg`)).getByRole("img"),
      ).toHaveAttribute("src");
    }
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
  });

  it("agrupa productos repetidos, calcula el total y guarda solo id y cantidad", async () => {
    const user = userEvent.setup();
    renderApp();
    const boton = within(tarjeta("Cilindro de Gas 15 Kg")).getByRole("button");
    await user.click(boton);
    await user.click(boton);
    expect(within(carrito()).getByRole("combobox")).toHaveValue("2");
    expect(within(carrito()).getByText("Total: $32.000")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(clave))).toEqual([
      { id: "gas-15kg", cantidad: 2 },
    ]);
  });

  it("permite cambiar cantidad, eliminar y vaciar", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      within(tarjeta("Cilindro de Gas 15 Kg")).getByRole("button"),
    );
    await user.selectOptions(within(carrito()).getByRole("combobox"), "3");
    expect(within(carrito()).getByText("Total: $48.000")).toBeInTheDocument();
    await user.click(
      within(carrito()).getByRole("button", {
        name: "Eliminar Cilindro de Gas 15 Kg",
      }),
    );
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
    await user.click(
      within(tarjeta("Cilindro de Gas 5 Kg")).getByRole("button"),
    );
    await user.click(
      within(carrito()).getByRole("button", { name: "Vaciar carrito" }),
    );
    expect(JSON.parse(localStorage.getItem(clave))).toEqual([]);
  });

  it("recupera el carrito al montar de nuevo y limita la cantidad al stock", async () => {
    localStorage.setItem(
      clave,
      JSON.stringify([{ id: "gas-15kg", cantidad: 90 }]),
    );
    const user = userEvent.setup();
    const vista = renderApp();
    await user.click(
      within(tarjeta("Cilindro de Gas 15 Kg")).getByRole("button"),
    );
    expect(within(carrito()).getByRole("combobox")).toHaveValue("90");
    vista.unmount();
    renderApp();
    expect(within(carrito()).getByRole("combobox")).toHaveValue("90");
  });

});
