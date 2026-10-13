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
        stock={2}
        onAgregar={agregar}
      />
    </MemoryRouter>,
  );
  expect(screen.getByText("Gratis")).toBeInTheDocument();
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
