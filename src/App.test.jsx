import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import Carrito from "./components/Carrito";

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

  it("avisa que un precio pendiente impide calcular el total final", async () => {
    render(
      <MemoryRouter>
        <Carrito
          items={[
            { id: "gas-5kg", nombre: "Gas 5 kg", precio: null, cantidad: 1 },
            { id: "gas-15kg", nombre: "Gas 15 kg", precio: 16000, cantidad: 1 },
          ]}
          cambiarCantidad={vi.fn()}
          eliminar={vi.fn()}
          vaciar={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(
      within(carrito()).getByText(
        "Subtotal de productos con precio confirmado: $16.000",
      ),
    ).toBeInTheDocument();
    expect(
      within(carrito()).getByText(/El importe final está pendiente/),
    ).toBeInTheDocument();
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

  it("descarta identificadores, cantidades y registros duplicados inválidos", () => {
    localStorage.setItem(
      clave,
      JSON.stringify([
        null,
        { id: "desconocido", cantidad: 1 },
        { id: "gas-5kg", cantidad: -1 },
        { id: "gas-11kg", cantidad: 1.5 },
        { id: "gas-15kg", cantidad: 2 },
        { id: "gas-15kg", cantidad: 4 },
      ]),
    );
    renderApp();
    expect(within(carrito()).getAllByRole("combobox")).toHaveLength(1);
    expect(within(carrito()).getByRole("combobox")).toHaveValue("2");
  });

  it("tolera datos guardados corruptos", () => {
    localStorage.setItem(clave, "{invalido");
    renderApp();
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
  });

  it("funciona durante la sesión si el navegador bloquea el almacenamiento", async () => {
    const lectura = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("Bloqueado");
      });
    const escritura = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Bloqueado");
      });
    try {
      const user = userEvent.setup();
      renderApp();
      await user.click(
        within(tarjeta("Cilindro de Gas 15 Kg")).getByRole("button"),
      );
      expect(within(carrito()).getByText("Total: $16.000")).toBeInTheDocument();
    } finally {
      lectura.mockRestore();
      escritura.mockRestore();
    }
  });
});
