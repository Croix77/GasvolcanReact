import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import TarjetaProducto from "./TarjetaProducto";

it("muestra 'Gratis' cuando precio es 0", () => {
  render(
    <MemoryRouter>
      <TarjetaProducto
        id="gratis"
        nombre="Accesorio gratuito"
        descripcion="Prueba"
        precio={0}
        oferta
        stock={2}
        onAgregar={vi.fn()}
      />
    </MemoryRouter>,
  );
  expect(screen.getByText("Gratis")).toHaveClass("producto-gratis");
});

it("muestra etiqueta 'En oferta' cuando oferta es true", () => {
  render(
    <MemoryRouter>
      <TarjetaProducto
        id="oferta"
        nombre="Producto en oferta"
        descripcion="Prueba"
        precio={1000}
        oferta
        stock={5}
        onAgregar={vi.fn()}
      />
    </MemoryRouter>,
  );
  expect(screen.getByText("En oferta")).toHaveClass("producto-oferta");
});

it("llama a onAgregar al hacer click en el botón", async () => {
  const agregar = vi.fn();
  render(
    <MemoryRouter>
      <TarjetaProducto
        id="normal"
        nombre="Producto normal"
        descripcion="Prueba"
        precio={1000}
        stock={5}
        onAgregar={agregar}
      />
    </MemoryRouter>,
  );
  await userEvent.setup().click(screen.getByRole("button", { name: "Añadir al Carrito" }));
  expect(agregar).toHaveBeenCalledTimes(1);
});

it("deshabilita el botón cuando stock es 0", () => {
  render(
    <MemoryRouter>
      <TarjetaProducto
        id="agotado"
        nombre="Agotado"
        descripcion="Prueba"
        precio={1000}
        stock={0}
        onAgregar={vi.fn()}
      />
    </MemoryRouter>,
  );
  const boton = screen.getByRole("button", { name: "Añadir al Carrito" });
  expect(boton).toBeDisabled();
});

it("muestra aviso de stock crítico cuando stock <= stockCritico", () => {
  render(
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
  expect(screen.getByText("Stock crítico: quedan pocas unidades.")).toBeInTheDocument();
});

it("oculta aviso de stock crítico cuando stock > stockCritico", () => {
  render(
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
  expect(screen.queryByText("Stock crítico: quedan pocas unidades.")).not.toBeInTheDocument();
});