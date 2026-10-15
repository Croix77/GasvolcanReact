import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import FormProducto from "./FormProducto";

const categorias = ["Cilindros", "Reguladores", "Accesorios"];

it("renderiza formulario vacío para crear", () => {
  render(<FormProducto categorias={categorias} onGuardar={vi.fn()} onCancelar={vi.fn()} />);
  expect(screen.getByLabelText("Nombre del producto")).toHaveValue("");
  expect(screen.getByLabelText("Descripción")).toHaveValue("");
  expect(screen.getByLabelText("Categoría del producto")).toHaveValue("");
  expect(screen.getByLabelText("Precio residencial (CLP)")).toBeInTheDocument();
  expect(screen.getByLabelText("Stock")).toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "Destacar en ofertas" })).not.toBeChecked();
  expect(screen.getByRole("button", { name: "Guardar producto" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Cancelar edición" })).not.toBeInTheDocument();
});

it("renderiza formulario con datos para editar", () => {
  const producto = { nombre: "Test", descripcion: "Desc", categoria: "Reguladores", precio: "100", stock: "5", oferta: true };
  render(<FormProducto producto={producto} categorias={categorias} onGuardar={vi.fn()} onCancelar={vi.fn()} />);
  expect(screen.getByLabelText("Nombre del producto")).toHaveValue("Test");
  expect(screen.getByLabelText("Descripción")).toHaveValue("Desc");
  expect(screen.getByLabelText("Categoría del producto")).toHaveValue("Reguladores");
  expect(screen.getByLabelText("Precio residencial (CLP)")).toHaveValue(100);
  expect(screen.getByLabelText("Stock")).toHaveValue(5);
  expect(screen.getByRole("checkbox", { name: "Destacar en ofertas" })).toBeChecked();
  expect(screen.getByRole("button", { name: "Cancelar edición" })).toBeInTheDocument();
});

it("muestra errores al enviar vacío", async () => {
  const user = userEvent.setup();
  render(<FormProducto categorias={categorias} onGuardar={vi.fn()} onCancelar={vi.fn()} />);
  await user.click(screen.getByRole("button", { name: "Guardar producto" }));
  expect(screen.getByText("Escribe el nombre del producto.")).toBeInTheDocument();
  expect(screen.getByText("Escribe una descripción.")).toBeInTheDocument();
  expect(screen.getByText("Selecciona una categoría.")).toBeInTheDocument();
  expect(screen.getByText("El precio debe ser un entero desde cero.")).toBeInTheDocument();
  expect(screen.getByText("El stock debe ser un entero desde cero.")).toBeInTheDocument();
});

it("llama onGuardar con datos válidos", async () => {
  const user = userEvent.setup();
  const onGuardar = vi.fn();
  render(<FormProducto categorias={categorias} onGuardar={onGuardar} onCancelar={vi.fn()} />);
  await user.type(screen.getByLabelText("Nombre del producto"), "Nuevo");
  await user.type(screen.getByLabelText("Descripción"), "Descripción nueva");
  await user.selectOptions(screen.getByLabelText("Categoría del producto"), "Accesorios");
  await user.type(screen.getByLabelText("Precio residencial (CLP)"), "1500");
  await user.type(screen.getByLabelText("Stock"), "10");
  await user.click(screen.getByRole("button", { name: "Guardar producto" }));
  expect(onGuardar).toHaveBeenCalledWith(expect.objectContaining({
    nombre: "Nuevo",
    categoria: "Accesorios",
    precio: "1500",
    stock: "10",
  }));
});

it("llama onCancelar al click en cancelar", async () => {
  const user = userEvent.setup();
  const onCancelar = vi.fn();
  const producto = { nombre: "Test", descripcion: "Desc", categoria: "Reguladores", precio: "100", stock: "5", oferta: false };
  render(<FormProducto producto={producto} categorias={categorias} onGuardar={vi.fn()} onCancelar={onCancelar} />);
  await user.click(screen.getByRole("button", { name: "Cancelar edición" }));
  expect(onCancelar).toHaveBeenCalledTimes(1);
});