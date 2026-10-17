import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import App from "../App";

it("oculta el historial y redirige al login si un visitante solicita la ruta", () => {
  render(<MemoryRouter initialEntries={["/mis-pedidos"]}><App /></MemoryRouter>);
  expect(screen.queryByRole("link", { name: "Historial de pedidos" })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Historial de pedidos" })).not.toBeInTheDocument();
});

it("regresa al historial al ingresar como cliente y lo protege al cerrar sesion", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={["/mis-pedidos"]}><App /></MemoryRouter>);
  await user.type(screen.getByLabelText("Correo electrónico"), "cliente@example.com");
  await user.type(screen.getByLabelText("Contraseña", { exact: true }), "ClienteDemo123!");
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
  expect(screen.getByRole("heading", { level: 1, name: "Historial de pedidos" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Historial de pedidos" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));
  expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Historial de pedidos" })).not.toBeInTheDocument();
});
