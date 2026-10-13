import { usuariosIniciales } from "../data/usuariosDemo";
import { expect, it } from "vitest";
import { guardarUsuario } from "./usuariosDemo";
it("limita los registros de usuario a los datos ficticios definidos", () => {
  const nuevo = guardarUsuario(usuariosIniciales, {
    nombre: "Usuario ficticio",
    correo: "demo@example.org",
    rol: "Cliente",
    clave: "Nunca guardar",
  });
  expect(nuevo[1]).not.toHaveProperty("clave");
  expect(() =>
    guardarUsuario(nuevo, {
      nombre: "Otro",
      correo: "demo@example.org",
      rol: "Cliente",
    }),
  ).toThrow();
});
