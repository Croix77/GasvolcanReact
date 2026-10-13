import { describe, expect, it } from "vitest";
import { validarContacto, validarEntrega, validarLogin } from "./validacion";
import { validarProducto } from "../data/catalogo";
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
  it.each([" ", null, true, -1, 1.5, "abc"])(
    "rechaza valores numéricos inválidos %s",
    (valor) => {
      expect(
        validarProducto({
          nombre: "Producto",
          descripcion: "Descripción",
          categoria: "Accesorios",
          precio: valor,
          stock: valor,
        }),
      ).toHaveProperty("precio");
    },
  );
  it("permite precio gratis y stock cero", () => {
    expect(
      validarProducto({
        nombre: "Producto",
        descripcion: "Descripción",
        categoria: "Accesorios",
        precio: 0,
        stock: 0,
      }),
    ).toEqual({});
  });
});
