import { useState } from "react";
import { Link } from "react-router-dom";
import { moneda } from "../utils/moneda";

function CarritoSidebar({ items, eliminar, vaciar, totalItems }) {
  const [abierto, setAbierto] = useState(false);
  const total = items.reduce((suma, item) => suma + (item.precio ?? 0) * item.cantidad, 0);
  const pendientes = items.some((item) => item.precio == null);

  if (items.length === 0 && !abierto) {
    return (
      <button
        className="btn btn-warning position-fixed bottom-0 end-0 m-3 shadow"
        style={{ zIndex: 1050 }}
        onClick={() => setAbierto(true)}
        aria-label={`Carrito (${totalItems} items)`}
      >
        <span className="d-flex align-items-center gap-2">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-10.5-11H4V5h1.5v2zm14 0H20V5h1.5v2zM6 7H4v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7h-2v12H6V7zm10-2v2h2V5h-2z"/></svg>
          <span className="badge bg-dark rounded-pill">{totalItems}</span>
        </span>
      </button>
    );
  }

  return (
    <>
      <button
        className="btn btn-warning position-fixed bottom-0 end-0 m-3 shadow d-md-none"
        style={{ zIndex: 1060 }}
        onClick={() => setAbierto(false)}
        aria-label="Cerrar carrito"
      >
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>

      <aside
        className={`carrito-sidebar ${abierto ? "abierto" : ""}`}
        aria-label="Carrito de compras"
        role="complementary"
      >
        <div className="carrito-header d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0">Carrito <span className="badge bg-secondary">({totalItems})</span></h2>
          <button className="btn-close d-md-none" onClick={() => setAbierto(false)} aria-label="Cerrar carrito" />
        </div>

        {items.length === 0 ? (
          <div className="carrito-vacio p-3 text-center">
            <span className="carrito-vacio-icono">＋</span>
            <p className="mt-2">Tu carrito está vacío.</p>
            <small>Elige un producto para comenzar.</small>
          </div>
        ) : (
          <>
            <ul className="list-group list-group-flush">
              {items.map((item, index) => (
                <li key={item.id} className="list-group-item px-3 py-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary">{index + 1}</span>
                        <strong className="small">{item.nombre}</strong>
                      </div>
                      <div className="small text-muted ms-3">
                        {item.precio == null ? "Precio por confirmar" : moneda(item.precio)} c/u
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold small">{moneda((item.precio ?? 0) * item.cantidad)}</span>
                      <button
                        className="btn btn-sm btn-outline-danger py-1 px-2"
                        onClick={() => eliminar(item.id)}
                        aria-label={`Eliminar ${item.nombre}`}
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-3 border-top">
              <div className="d-flex justify-content-between small mb-2">
                <span>{pendientes ? "Subtotal" : "Total"}</span>
                <strong>{moneda(total)}</strong>
              </div>
              {pendientes && (
                <p className="text-warning-emphasis small mb-2">
                  Precios pendientes de confirmar
                </p>
              )}
              <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary btn-sm" onClick={vaciar}>
                  Vaciar carrito
                </button>
                <Link to="/checkout" className="btn btn-primary btn-sm">
                  Continuar compra
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>

      {abierto && (
        <div className="carrito-backdrop d-md-none" onClick={() => setAbierto(false)} />
      )}
    </>
  );
}

export default CarritoSidebar;