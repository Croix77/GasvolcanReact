import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import App from "../App";

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>,
  );
}

it("muestra errores de validación al enviar formulario vacío", async () => {
  const user = userEvent.setup();
  renderLogin();
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
  expect(screen.getByText("Escribe un correo válido.")).toBeInTheDocument();
});

it("alterna visibilidad de contraseña con botones mostrar/ocultar", async () => {
  const user = userEvent.setup();
  renderLogin();
  const passwordInput = screen.getByLabelText("Contraseña", { exact: true });
  expect(passwordInput).toHaveAttribute("type", "password");
  await user.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
  expect(passwordInput).toHaveAttribute("type", "text");
  await user.click(screen.getByRole("button", { name: "Ocultar contraseña" }));
  expect(passwordInput).toHaveAttribute("type", "password");
});

it("rechaza credenciales incorrectas", async () => {
  const user = userEvent.setup();
  renderLogin();
  await user.type(screen.getByLabelText("Correo electrónico"), "otro@example.com");
  await user.type(screen.getByLabelText("Contraseña", { exact: true }), "Incorrecta123");
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Correo o contraseña incorrectos");
});

it("inicia sesión como administrador y redirige a admin", async () => {
  const user = userEvent.setup();
  renderLogin();
  await user.type(screen.getByLabelText("Correo electrónico"), "admin@example.com");
  await user.type(screen.getByLabelText("Contraseña", { exact: true }), "VolcanDemo123!");
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
  expect(screen.getByText("Conectado: Administrador")).toBeInTheDocument();
  expect(screen.getByText("Sesión iniciada como administrador.")).toBeInTheDocument();
});

it("inicia sesión como cliente sin mostrar controles admin", async () => {
  const user = userEvent.setup();
  renderLogin();
  await user.type(screen.getByLabelText("Correo electrónico"), "cliente@example.com");
  await user.type(screen.getByLabelText("Contraseña", { exact: true }), "ClienteDemo123!");
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
  expect(screen.getByText("Conectado: Cliente")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Administración" })).not.toBeInTheDocument();
});

it("cierra sesión correctamente", async () => {
  const user = userEvent.setup();
  renderLogin();
  await user.type(screen.getByLabelText("Correo electrónico"), "admin@example.com");
  await user.type(screen.getByLabelText("Contraseña", { exact: true }), "VolcanDemo123!");
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
  await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));
  expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
  expect(screen.getByText("Sesión cerrada. Ahora estás fuera de tu cuenta.")).toBeInTheDocument();
});