import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import OfertasCarousel from "./OfertasCarousel";

const productos = [1, 2, 3, 4].map((id) => ({
  id: String(id), nombre: `Oferta ${id}`, descripcion: "Producto",
  precio: 1000, stock: 20, oferta: true,
}));

it("incluye la portada de formatos y permite pausar y reanudar las ofertas", () => {
  vi.useFakeTimers();
  try {
    const vista = render(<MemoryRouter><OfertasCarousel portada={<p>5, 11 y 15 kg</p>} productos={productos} onAgregar={vi.fn()} /></MemoryRouter>);
    expect(screen.getByText("5, 11 y 15 kg").closest(".oferta-slide")).toHaveAttribute("aria-hidden", "false");
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByRole("heading", { name: "Oferta 1" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Pausar" }));
    act(() => vi.advanceTimersByTime(8000));
    expect(screen.getByRole("heading", { name: "Oferta 1" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reanudar" }));
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByRole("heading", { name: "Oferta 2" })).toBeInTheDocument();
    vista.unmount();
  } finally { vi.useRealTimers(); }
});

it("recorre todas las ofertas, vuelve al inicio y permite elegir una", () => {
  vi.useFakeTimers();
  try {
    const vista = render(<MemoryRouter><OfertasCarousel productos={productos} onAgregar={vi.fn()} /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Oferta 1" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByRole("heading", { name: "Oferta 2" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ver oferta 4" }));
    expect(screen.getByRole("heading", { name: "Oferta 4" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByRole("heading", { name: "Oferta 1" })).toBeInTheDocument();
    vista.unmount();
  } finally { vi.useRealTimers(); }
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
