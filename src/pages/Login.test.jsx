import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../App";
import { cuentaDemo, cuentaCliente } from "../services/authDemo";
function abrir(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}
async function entrar(user) {
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    cuentaDemo.correo,
  );
  await user.type(
    screen.getByLabelText("Contraseña", { exact: true }),
    cuentaDemo.clave,
  );
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}
describe("Login y panel de demostración", () => {
  it("valida campos y los botones mostrar y ocultar contraseña", async () => {
    const user = userEvent.setup();
    abrir("/login");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
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
      screen.getByLabelText("Correo electrónico"),
      "otro@example.com",
    );
    await user.type(
      screen.getByLabelText("Contraseña", { exact: true }),
      "Incorrecta123",
    );
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
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
      screen.getByRole("heading", { name: "Iniciar sesión" }),
    ).toBeInTheDocument();
    expect(sessionStorage.getItem("gas-volcan-sesion-demo")).toBeNull();
    expect(
      screen.queryByRole("link", { name: "Administración" }),
    ).not.toBeInTheDocument();
  });
});

it("restringe administración sin sesión y con sesión cliente, incluso por URL directa", () => {
  for (const rol of [null, "cliente"]) {
    if (rol)
      sessionStorage.setItem(
        "gas-volcan-sesion-demo",
        JSON.stringify({ rol, vence: Date.now() + 60000 }),
      );
    for (const ruta of [
      "/admin",
      "/admin/productos",
      "/admin/usuarios",
      "/admin/categorias",
      "/admin/pruebas",
    ]) {
      const vista = abrir(ruta);
      expect(
        screen.queryByRole("navigation", { name: "Menú administrativo" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText("Resultado de la compra"),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: rol ? "Catálogo de productos" : "Iniciar sesión",
        }),
      ).toBeInTheDocument();
      vista.unmount();
    }
  }
});
it("permite entrar como cliente sin publicar credenciales ni controles administrativos", async () => {
  const user = userEvent.setup();
  const vista = abrir("/login");
  expect(screen.queryByText(cuentaCliente.correo)).not.toBeInTheDocument();
  expect(screen.queryByText(cuentaDemo.clave)).not.toBeInTheDocument();
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    cuentaCliente.correo,
  );
  await user.type(
    screen.getByLabelText("Contraseña", { exact: true }),
    cuentaCliente.clave,
  );
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
  expect(
    JSON.parse(sessionStorage.getItem("gas-volcan-sesion-demo")),
  ).toMatchObject({ rol: "cliente" });
  expect(
    screen.queryByRole("link", { name: "Administración" }),
  ).not.toBeInTheDocument();
  vista.unmount();
  abrir("/catalogo");
  expect(
    screen.getByRole("button", { name: "Cerrar sesión" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));
  expect(sessionStorage.getItem("gas-volcan-sesion-demo")).toBeNull();
});
it("configura la compra solo desde el panel y conserva el escenario al cambiar de cuenta", async () => {
  const user = userEvent.setup();
  sessionStorage.setItem(
    "gas-volcan-sesion-demo",
    JSON.stringify({ rol: "administrador", vence: Date.now() + 60000 }),
  );
  abrir("/admin/pruebas");
  expect(screen.getByText(cuentaCliente.correo)).toBeInTheDocument();
  await user.selectOptions(
    screen.getByLabelText("Resultado de la compra"),
    "error",
  );
  await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    cuentaCliente.correo,
  );
  await user.type(
    screen.getByLabelText("Contraseña", { exact: true }),
    cuentaCliente.clave,
  );
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
  expect(sessionStorage.getItem("gas-volcan-resultado-compra")).toBe("error");
  expect(
    screen.queryByText("Configuración de demostración"),
  ).not.toBeInTheDocument();
});
