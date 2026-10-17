import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import OfertasCarousel from "./OfertasCarousel";

// Datos pequenos y explicitos para identificar cada oferta.
const productos = [
  { id: "1", nombre: "Oferta 1", precio: 1000, stock: 20, oferta: true },
  { id: "2", nombre: "Oferta 2", precio: 2000, stock: 20, oferta: true },
  { id: "3", nombre: "Oferta 3", precio: 3000, stock: 20, oferta: true },
  { id: "4", nombre: "Oferta 4", precio: 4000, stock: 20, oferta: true },
];

// Restaurar el reloj real despues de cada prueba.
afterEach(() => vi.useRealTimers());

it("la imagen enlaza al detalle del producto", () => {
  // Preparar: una oferta que tiene imagen.
  const oferta = { ...productos[0], imagen: "/img/gas-5kg.png" };
  render(
    <MemoryRouter>
      <OfertasCarousel productos={[oferta]} onAgregar={vi.fn()} />
    </MemoryRouter>,
  );

  // Comprobar la imagen y la direccion del enlace.
  const enlace = screen.getByRole("link", { name: "Ver Oferta 1" });
  expect(within(enlace).getByRole("img")).toHaveAttribute("src", "/img/gas-5kg.png");
  expect(enlace).toHaveAttribute("href", "/productos/1");
});

it("incluye la portada de formatos y pausa la rotacion durante la interaccion", () => {
  // El reloj simulado permite avanzar cuatro segundos sin esperar.
  vi.useFakeTimers();
  const vista = render(<MemoryRouter><OfertasCarousel portada={<p>5, 11 y 15 kg</p>} productos={productos} onAgregar={vi.fn()} /></MemoryRouter>);
  expect(screen.queryByRole("button", { name: "Pausar" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ver todas las ofertas" })).toHaveAttribute("href", "/ofertas");
  expect(screen.getByRole("button", { name: "Ver destacado 1" })).toHaveAttribute("aria-current", "true");
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.getByRole("heading", { name: "Oferta 1" })).toBeInTheDocument();
  fireEvent.mouseEnter(screen.getByRole("region"));
  act(() => vi.advanceTimersByTime(8000));
  expect(screen.getByRole("heading", { name: "Oferta 1" })).toBeInTheDocument();
  fireEvent.mouseLeave(screen.getByRole("region"));
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.getByRole("heading", { name: "Oferta 2" })).toBeInTheDocument();
  vista.unmount();
});

it("recorre todas las ofertas, vuelve al inicio y permite elegir una", () => {
  // El reloj simulado permite avanzar cuatro segundos sin esperar.
  vi.useFakeTimers();
  const vista = render(<MemoryRouter><OfertasCarousel productos={productos} onAgregar={vi.fn()} /></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Oferta 1" })).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.getByRole("heading", { name: "Oferta 2" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Ver oferta 4" }));
  expect(screen.getByRole("heading", { name: "Oferta 4" })).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.getByRole("heading", { name: "Oferta 1" })).toBeInTheDocument();
  vista.unmount();
});

it("permite agregar la oferta y admite una sola oferta o ninguna", () => {
  const agregar = vi.fn();
  const vista = render(<MemoryRouter><OfertasCarousel productos={productos.slice(0, 1)} onAgregar={agregar} /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Añadir al Carrito" }));
  expect(agregar).toHaveBeenCalledWith(productos[0]);
  expect(screen.queryByText(/Cambia automáticamente/)).not.toBeInTheDocument();
  vista.rerender(<MemoryRouter><OfertasCarousel productos={[]} onAgregar={agregar} /></MemoryRouter>);
  expect(screen.queryByRole("region")).not.toBeInTheDocument();
});

it("mantiene una oferta visible si se reduce la lista mientras se navega", () => {
  const vista = render(<MemoryRouter><OfertasCarousel productos={productos} onAgregar={vi.fn()} /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Ver oferta 4" }));
  vista.rerender(<MemoryRouter><OfertasCarousel productos={productos.slice(0, 2)} onAgregar={vi.fn()} /></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Oferta 2" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ver oferta 2" })).toHaveAttribute("aria-current", "true");
});
