import { describe, expect, it } from "vitest";
import { validarProducto } from "../services/catalogo";
import { validarContacto, validarEntrega, validarLogin } from "./validacion";
describe("Límites y tipos de los formularios", () => {
  it("acepta nombres con tildes, correos y teléfono chileno", () => {
    expect(
      validarContacto({
        nombre: "María José",
        correo: "demo@example.com",
        mensaje: "Consulta de prueba",
      }),
    ).toEqual({});
    expect(
      validarEntrega({
        nombre: "María José",
        telefono: "+56 9 1234 5678",
        direccion: "Parcela de prueba",
        comuna: "Chillán",
      }),
    ).toEqual({});
  });
  it("rechaza espacios, números como nombre, longitudes excesivas y correos inválidos", () => {
    expect(
      validarContacto({ nombre: "123", correo: "a@", mensaje: "  " }),
    ).toHaveProperty("nombre");
    expect(
      validarContacto({
        nombre: "A".repeat(101),
        correo: "a".repeat(151),
        mensaje: "x".repeat(1001),
      }),
    ).toHaveProperty("mensaje");
    expect(validarLogin({ correo: " ", clave: "corta" })).toHaveProperty(
      "clave",
    );
    for (const valor of [" ", null, true, -1, 1.5, "abc"]) {
      expect(
        validarProducto({
          nombre: "Gas",
          descripcion: "Cilindro",
          categoria: "Gas",
          precio: valor,
          stock: valor,
        }),
      ).toHaveProperty("precio");
    }
  });
  it("rechaza teléfonos imposibles, direcciones vacías y comunas fuera de cobertura", () => {
    expect(
      validarEntrega({
        nombre: "Prueba",
        telefono: "000000000",
        direccion: ".....",
        comuna: "Otra",
      }),
    ).toEqual(
      expect.objectContaining({
        telefono: expect.any(String),
        direccion: expect.any(String),
        comuna: expect.any(String),
      }),
    );
  });
});
