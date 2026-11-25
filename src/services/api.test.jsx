import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import App from "../App";
import AuthProvider from "../contexts/AuthProvider";
import { useAuth } from "../hooks/useAuth";
import { iniciarSesionPrueba } from "../test/apiPrueba";

function abrirConRespuesta(estado) {
  iniciarSesionPrueba();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: estado }));
  render(<MemoryRouter initialEntries={["/catalogo"]}><App /></MemoryRouter>);
}

it("limpia la sesión y vuelve al login si el servidor rechaza el token", async () => {
  abrirConRespuesta(401);
  expect(await screen.findByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
  expect(screen.getByText(/Tu sesión ya no está activa/)).toBeInTheDocument();
  expect(sessionStorage.getItem("gas-volcan-sesion-fullstack")).toBeNull();
});

it("muestra falta de permisos sin cerrar una sesión válida", async () => {
  abrirConRespuesta(403);
  expect(await screen.findByRole("alert")).toHaveTextContent("Tu cuenta no tiene permiso");
  expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeInTheDocument();
  expect(sessionStorage.getItem("gas-volcan-sesion-fullstack")).not.toBeNull();
});

function TokenPrueba() {
  return <span>{useAuth().sesion.token}</span>;
}

it("reintenta renovar si Auth se reinicia y conserva la sesión al recuperarse", async () => {
  vi.useFakeTimers();
  try {
    iniciarSesionPrueba();
    const vence = Math.ceil((Date.now() + 3_600_000) / 1000) + 300;
    const nuevoToken = "cabecera." + btoa(JSON.stringify({ exp: vence })) + ".firma";
    const fetch = vi.spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new TypeError("Auth no está disponible temporalmente"))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        token: nuevoToken, correo: "cliente@example.com", rol: "CLIENTE", nombre: "Cliente",
      })));
    render(<AuthProvider><TokenPrueba /></AuthProvider>);

    await act(() => vi.advanceTimersByTimeAsync(3_540_000));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(nuevoToken)).not.toBeInTheDocument();

    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(screen.getByText(nuevoToken)).toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});
