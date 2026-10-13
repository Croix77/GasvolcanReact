import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import {
  cuentaDemo,
  iniciarSesionDemo,
  recuperarSesionDemo,
} from "../services/authDemo";
function abrir(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}
async function entrar(user) {
  await user.type(
    screen.getByLabelText("Correo del administrador"),
    cuentaDemo.correo,
  );
  await user.type(
    screen.getByLabelText("Contraseña", { exact: true }),
    cuentaDemo.clave,
  );
  await user.click(
    screen.getByRole("button", { name: "Iniciar sesión de demostración" }),
  );
}
describe("Login y panel de demostración", () => {

  it("valida campos y los botones mostrar y ocultar contraseña", async () => {
    const user = userEvent.setup();
    abrir("/login");
    await user.click(
      screen.getByRole("button", { name: "Iniciar sesión de demostración" }),
    );
    expect(screen.getByText("Escribe un correo válido.")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Contraseña", { exact: true }),
    ).toHaveAttribute("type", "password");
    await user.click(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    );
    expect(
      screen.getByLabelText("Contraseña", { exact: true }),
    ).toHaveAttribute("type", "text");
    await user.click(
      screen.getByRole("button", { name: "Ocultar contraseña" }),
    );
    expect(
      screen.getByLabelText("Contraseña", { exact: true }),
    ).toHaveAttribute("type", "password");
  });
  it("rechaza credenciales incorrectas sin crear sesión", async () => {
    const user = userEvent.setup();
    abrir("/login");
    await user.type(
      screen.getByLabelText("Correo del administrador"),
      "otro@example.com",
    );
    await user.type(
      screen.getByLabelText("Contraseña", { exact: true }),
      "Incorrecta123",
    );
    await user.click(
      screen.getByRole("button", { name: "Iniciar sesión de demostración" }),
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Correo o contraseña incorrectos",
    );
    expect(sessionStorage.getItem("gas-volcan-sesion-demo")).toBeNull();
  });
  it("regresa a la ruta solicitada, conserva sesión al montar y cierra sesión", async () => {
    const user = userEvent.setup();
    const vista = abrir("/admin/productos");
    await entrar(user);
    expect(
      screen.getByRole("heading", { name: "Administración del catálogo" }),
    ).toBeInTheDocument();
    expect(sessionStorage.getItem("gas-volcan-sesion-demo")).not.toContain(
      cuentaDemo.clave,
    );
    vista.unmount();
    abrir("/admin/perfil");
    expect(
      screen.getByRole("heading", { name: "Perfil de demostración" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(
      screen.getByRole("heading", { name: "Acceso de administrador" }),
    ).toBeInTheDocument();
    expect(sessionStorage.getItem("gas-volcan-sesion-demo")).toBeNull();
    await user.click(screen.getByRole("link", { name: "Administración" }));
    expect(
      screen.getByRole("heading", { name: "Acceso de administrador" }),
    ).toBeInTheDocument();
  });
  it("rechaza sesiones corruptas, con rol incorrecto o vencidas", () => {
    for (const dato of [
      "{",
      JSON.stringify({ rol: "cliente", vence: Date.now() + 10000 }),
      JSON.stringify({ rol: "administrador", vence: Date.now() - 1 }),
    ]) {
      sessionStorage.setItem("gas-volcan-sesion-demo", dato);
      expect(recuperarSesionDemo()).toBeNull();
    }
    expect(() =>
      iniciarSesionDemo(cuentaDemo.correo, cuentaDemo.clave + " "),
    ).toThrow();
  });
  it("vence automáticamente una sesión activa", () => {
    vi.useFakeTimers();
    try {
      sessionStorage.setItem(
        "gas-volcan-sesion-demo",
        JSON.stringify({ rol: "administrador", vence: Date.now() + 1000 }),
      );
      abrir("/admin/perfil");
      act(() => vi.advanceTimersByTime(1001));
      expect(
        screen.getByRole("heading", { name: "Acceso de administrador" }),
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
  it("navega por el panel general, reportes y pedidos", async () => {
    sessionStorage.setItem(
      "gas-volcan-sesion-demo",
      JSON.stringify({ rol: "administrador", vence: Date.now() + 1800000 }),
    );
    const user = userEvent.setup();
    abrir("/admin");
    expect(
      screen.getByRole("heading", { name: "Panel de administración" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("link", { name: "Reportes", exact: true }),
    );
    expect(
      screen.getByRole("heading", { name: "Reportes de demostración" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("link", { name: "Pedidos", exact: true }),
    );
    expect(
      screen.getByText("No hay pedidos de demostración registrados."),
    ).toBeInTheDocument();
  });
});
