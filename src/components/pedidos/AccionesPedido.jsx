import { useState } from "react";
import { pedirNegocio } from "../../services/api";
import UbicacionReparto from "./UbicacionReparto";

export default function AccionesPedido({ pedido, sesion, repartidores, recargar }) {
  const [repartidor, setRepartidor] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [editarUbicacion, setEditarUbicacion] = useState(false);
  const { id, estado, correoRepartidor } = pedido;
  const puedeGestionar = ["administrador", "operadora"].includes(sesion.rol);
  const esRepartidor = sesion.rol === "repartidor" && sesion.correo === correoRepartidor;
  const puedeAsignar = puedeGestionar && ["PENDIENTE", "ASIGNADO"].includes(estado);
  const puedeActualizar = puedeGestionar || esRepartidor;
  const puedeUbicar = estado === "EN_CAMINO" && (sesion.rol === "administrador" || esRepartidor);
  const siguiente = estado === "ASIGNADO" ? "EN_CAMINO" : "ENTREGADO";
  const destinatario = repartidor ?? correoRepartidor ?? "";

  async function guardar(accion, datos, exito) {
    setError("");
    setMensaje("");
    setGuardando(true);
    try {
      await pedirNegocio(`/pedidos/${id}/${accion}`, { token: sesion.token, metodo: "PATCH", datos });
      setMensaje(exito);
      setRepartidor(null);
      recargar();
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      {puedeAsignar && repartidores.length > 0 && (
        <form className="mb-2" onSubmit={(evento) => {
          evento.preventDefault();
          guardar("asignacion", { correoRepartidor: destinatario }, "Repartidor asignado.");
        }}>
          <label htmlFor={`asignacion-${id}`} className="form-label">Repartidor para pedido {id}</label>
          <div className="d-flex align-items-start gap-2 flex-wrap">
            <select id={`asignacion-${id}`} className="form-select w-auto mw-100" value={destinatario}
              onChange={(evento) => setRepartidor(evento.target.value)} required>
              <option value="">Selecciona un repartidor</option>
              {repartidores.map((persona) => (
                <option key={persona.id} value={persona.correo}>{persona.nombre}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-outline-primary"
              disabled={guardando || !destinatario || destinatario === correoRepartidor}>
              Asignar
            </button>
          </div>
        </form>
      )}
      {puedeAsignar && repartidores.length === 0 && <p>No hay repartidores disponibles para asignar.</p>}
      {puedeActualizar && ["ASIGNADO", "EN_CAMINO"].includes(estado) && (
        <button type="button" className="btn btn-primary me-2" disabled={guardando}
          onClick={() => guardar("estado", { estado: siguiente }, "Estado del pedido actualizado.")}>
          {estado === "ASIGNADO" ? "Marcar en camino" : "Registrar entrega y pago"}
        </button>
      )}
      {puedeUbicar && (
        <button type="button" className="btn btn-outline-secondary" aria-expanded={editarUbicacion}
          onClick={() => setEditarUbicacion(!editarUbicacion)}>
          {editarUbicacion ? "Cerrar ubicación del reparto" : "Actualizar ubicación"}
        </button>
      )}
      {puedeUbicar && editarUbicacion && (
        <UbicacionReparto pedidoId={id} token={sesion.token} recargar={recargar} />
      )}
      {mensaje && <p role="status" className="mt-2 mb-0">{mensaje}</p>}
      {error && <p role="alert" className="mt-2 mb-0">{error}</p>}
    </>
  );
}
