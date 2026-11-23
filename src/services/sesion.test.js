import { expect, it } from "vitest";
import { guardarSesion, iniciarSesion, recuperarSesion } from "./sesion";
import { simularApis } from "../test/apiPrueba";

it("envía la contraseña al login y conserva solamente la sesión", async () => {
  const fetch = simularApis();
  const sesion = await iniciarSesion(" CLIENTE@example.com ", "ClienteDemo123!");
  guardarSesion(sesion);

  const [, opciones] = fetch.mock.calls[0];
  expect(JSON.parse(opciones.body)).toEqual({
    correo: "cliente@example.com",
    password: "ClienteDemo123!",
  });
  expect(recuperarSesion()).toMatchObject({ rol: "cliente", correo: "cliente@example.com" });
  expect(sessionStorage.getItem("gas-volcan-sesion-fullstack")).not.toContain("ClienteDemo123!");
});
