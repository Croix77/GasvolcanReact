import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import TarjetaProducto from "./TarjetaProducto";
it("muestra Gratis y ejecuta la función del botón recibida por props", async () => {
  const agregar = vi.fn();
  render(
    <MemoryRouter>
      <TarjetaProducto
        id="gratis"
        nombre="Accesorio gratuito"
        descripcion="Prueba"
        precio={0}
        oferta
        stock={2}
        onAgregar={agregar}
      />
    </MemoryRouter>,
  );
  expect(screen.getByText("Gratis")).toHaveClass("producto-gratis");
  expect(screen.getByText("En oferta")).toHaveClass("producto-oferta");
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "Añadir al Carrito" }));
  expect(agregar).toHaveBeenCalledTimes(1);
});
it("deshabilita el botón cuando el producto está agotado", async () => {
  const agregar = vi.fn();
  render(
    <MemoryRouter>
      <TarjetaProducto
        id="agotado"
        nombre="Agotado"
        descripcion="Prueba"
        precio={1000}
        stock={0}
        onAgregar={agregar}
      />
    </MemoryRouter>,
  );
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "Añadir al Carrito" }));
  expect(agregar).not.toHaveBeenCalled();
});

it("muestra aviso de stock crítico en el límite y lo oculta con stock suficiente", () => {
  const vista = render(
    <MemoryRouter>
      <TarjetaProducto
        id="critico"
        nombre="Cilindro"
        descripcion="Gas"
        categoria="Cilindros de Gas"
        imagen="/img/gas-5kg.png"
        oferta
        precio={6500}
        stock={5}
        stockCritico={5}
        onAgregar={vi.fn()}
      />
    </MemoryRouter>,
  );
  expect(screen.getByText("En oferta")).toBeInTheDocument();
  expect(
    screen.getByText("Stock crítico: quedan pocas unidades."),
  ).toBeInTheDocument();
  expect(screen.getByText("Cilindros de Gas")).toBeInTheDocument();
  vista.rerender(
    <MemoryRouter>
      <TarjetaProducto
        id="critico"
        nombre="Cilindro"
        descripcion="Gas"
        precio={6500}
        stock={6}
        stockCritico={5}
        onAgregar={vi.fn()}
      />
    </MemoryRouter>,
  );
  expect(screen.queryByText("En oferta")).not.toBeInTheDocument();
  expect(
    screen.queryByText("Stock crítico: quedan pocas unidades."),
  ).not.toBeInTheDocument();
});
