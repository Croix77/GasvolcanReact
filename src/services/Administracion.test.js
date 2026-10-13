import { usuariosIniciales } from "../data/usuariosDemo";
import { expect, it } from "vitest";
import {
  agregarCategoria,
  editarCategoria,
  borrarCategoria,
} from "./categorias";
import { guardarUsuario, recuperarUsuarios } from "./usuariosDemo";
const estado = {
  categorias: [{ id: "gas", nombre: "Gas" }],
  productos: [{ id: "prod", categoria: "Gas" }],
};
it("opera categorías sin mutar los productos anteriores", () => {
  const nuevo = editarCategoria(estado, "gas", "Cilindros");
  expect(nuevo.productos[0].categoria).toBe("Cilindros");
  expect(estado.productos[0].categoria).toBe("Gas");
  expect(() => borrarCategoria(estado, "gas")).toThrow();
  expect(() =>
    agregarCategoria(estado, { id: "otro", nombre: "gas" }),
  ).toThrow();
});
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
it("tolera registros de usuarios corruptos o duplicados", () => {
  localStorage.setItem("gas-volcan-usuarios-demo-v1", "{");
  expect(recuperarUsuarios()).toEqual(usuariosIniciales);
  localStorage.setItem(
    "gas-volcan-usuarios-demo-v1",
    JSON.stringify([usuariosIniciales[0], usuariosIniciales[0]]),
  );
  expect(recuperarUsuarios()).toEqual(usuariosIniciales);
});
