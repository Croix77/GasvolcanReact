import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import { Link } from "react-router-dom";
import { moneda } from "../utils/moneda";

function CarritoSidebar({ items, eliminar, vaciar, totalItems }) {
  const [abierto, setAbierto] = useState(false);
  const total = items.reduce((suma, item) => suma + (item.precio ?? 0) * item.cantidad, 0);
  const pendientes = items.some((item) => item.precio == null);

  return (
    <>
      <button
        type="button"
        className="btn btn-warning position-fixed bottom-0 end-0 m-3 shadow"
        style={{ zIndex: 1030 }}
        onClick={() => setAbierto(true)}
        aria-label={`Carrito (${totalItems} items)`}
        aria-expanded={abierto}
        aria-controls="resumen-carrito"
      >
        Carrito <span className="badge bg-dark rounded-pill">{totalItems}</span>
      </button>
      <Offcanvas
        id="resumen-carrito"
        show={abierto}
        onHide={() => setAbierto(false)}
        placement="end"
        className="carrito-sidebar"
        aria-labelledby="titulo-resumen-carrito"
      >
        <Offcanvas.Header closeButton closeLabel="Cerrar carrito">
          <Offcanvas.Title as="h2" id="titulo-resumen-carrito" className="h5">
            Carrito de compras <span className="badge bg-secondary">({totalItems})</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
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
                <Link to="/checkout" onClick={() => setAbierto(false)} className="btn btn-primary btn-sm">
                  Continuar compra
                </Link>
              </div>
            </div>
          </>
        )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default CarritoSidebar;
