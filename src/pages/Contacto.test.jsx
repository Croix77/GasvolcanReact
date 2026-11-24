import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import App from "../App";
import { iniciarSesionPrueba, simularApis } from "../test/apiPrueba";

function abrir(ruta, { correo, ...opciones } = {}) {
  iniciarSesionPrueba(correo);
  const fetch = simularApis(opciones);
  render(<MemoryRouter initialEntries={[ruta]}><App /></MemoryRouter>);
  return fetch;
}

function envios(fetch) {
  return fetch.mock.calls
    .filter(([url, opciones]) => url === "/api/v1/contacto/mensajes" && opciones.method === "POST")
    .map(([, opciones]) => JSON.parse(opciones.body));
}

it("conserva el contenido y la referencia si falla una consulta y se vuelve a enviar", async () => {
  const user = userEvent.setup();
  let primerIntento = true;
  const fetch = abrir("/contacto", {
    errorContacto: () => {
      if (!primerIntento) return null;
      primerIntento = false;
      return "El contacto no está disponible por el momento.";
    },
  });
  const mensaje = screen.getByLabelText("Mensaje");
  await user.type(mensaje, "¿Pueden entregar un cilindro mañana?");
  await user.click(screen.getByRole("button", { name: "Enviar consulta" }));
  expect(await screen.findByText("El contacto no está disponible por el momento.")).toBeInTheDocument();
  expect(mensaje).toHaveValue("¿Pueden entregar un cilindro mañana?");

  await user.click(screen.getByRole("button", { name: "Enviar consulta" }));
  expect(await screen.findByText("Recibimos tu consulta.")).toBeInTheDocument();
  expect(envios(fetch)).toHaveLength(2);
  expect(envios(fetch)[0]).toEqual(envios(fetch)[1]);
  expect(mensaje).toHaveValue("");
});

it("la administración consulta mensajes como texto y puede cambiar de página", async () => {
  const user = userEvent.setup();
  const fechaCreacion = "2026-11-24T12:00:00Z";
  abrir("/admin/contacto", {
    correo: "admin@example.com",
    paginasContacto: [
      [{ id: 2, nombre: "María O’Ryan", correo: "maria@example.com", mensaje: '<img src="falso" alt="inyectado">', fechaCreacion }],
      [{ id: 1, nombre: "Sofía", correo: "sofia@example.com", mensaje: "Consulta anterior del cliente.", fechaCreacion }],
    ],
  });
  expect(await screen.findByText('<img src="falso" alt="inyectado">')).toBeInTheDocument();
  expect(screen.queryByRole("img", { name: "inyectado" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Siguiente" }));
  expect(await screen.findByText("Consulta anterior del cliente.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Anterior" }));
  expect(await screen.findByText("maria@example.com")).toBeInTheDocument();
});

it("el cliente no puede abrir la bandeja ni consultar mensajes de otros usuarios", () => {
  const fetch = abrir("/admin/contacto");
  expect(screen.getByRole("heading", { name: "Acceso restringido" })).toBeInTheDocument();
  expect(fetch.mock.calls.some(([url]) => url.startsWith("/api/v1/contacto/mensajes"))).toBe(false);
});

it("la cuenta de vendedor no tiene enlace ni acceso directo al formulario", () => {
  const fetch = abrir("/contacto", { correo: "vendedor@example.com" });
  expect(screen.getByRole("heading", { name: "Acceso restringido" })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Contacto|Enviar una consulta/ })).not.toBeInTheDocument();
  expect(fetch.mock.calls.some(([url]) => url.startsWith("/api/v1/contacto/mensajes"))).toBe(false);
});
