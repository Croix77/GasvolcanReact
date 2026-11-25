import { MAX_UNIDADES_POR_PRODUCTO } from "../utils/compra";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CampoFormulario from "../components/CampoFormulario";
import { validarEntrega, enfocarPrimerError } from "../utils/validacion";
import { moneda } from "../utils/moneda";
import { crearPedido } from "../services/pedidosApi";

const comunas = ["Chillán", "Chillán Viejo", "El Carmen", "Pinto", "San Ignacio", "Bulnes", "Quillón"];

function Checkout({ items, vaciar, onPedido }) {
  const navegar = useNavigate();
  const { sesion, asegurarToken, cargando } = useAuth();
  const ubicacion = useLocation();
  const [datos, setDatos] = useState({ nombre: sesion?.nombre || "", telefono: "", direccion: "", comuna: "" });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => { if (sesion?.nombre) setDatos((d) => ({ ...d, nombre: d.nombre || sesion.nombre })); }, [sesion]);

  const total = items.reduce((suma, item) => suma + (item.precio ?? 0) * item.cantidad, 0);
  const noDisponible = items.some((item) => item.precio == null || item.cantidad > item.stock || item.cantidad < 1 || item.cantidad > MAX_UNIDADES_POR_PRODUCTO);
  if (cargando) return <p>Cargando...</p>;
  if (!sesion) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  if (!items.length) return <section><h1>Compra</h1><p>Agrega productos antes de continuar.</p></section>;

  function cambiar(evento) {
    const nuevosDatos = { ...datos, [evento.target.name]: evento.target.value };
    setDatos(nuevosDatos);
    if (Object.keys(errores).length > 0) setErrores(validarEntrega(nuevosDatos));
  }

  async function enviar(evento) {
    evento.preventDefault();
    const nuevosErrores = validarEntrega(datos);
    setErrores(nuevosErrores);
    setError("");
    if (Object.keys(nuevosErrores).length || noDisponible) { enfocarPrimerError(nuevosErrores); return; }
    setEnviando(true);
    try {
      const token = await asegurarToken();
      const payload = {
        nombre: datos.nombre.trim(),
        telefono: datos.telefono.trim(),
        direccion: datos.direccion.trim(),
        comuna: datos.comuna,
        latitudEntrega: -36.6067,
        longitudEntrega: -72.1034,
        referenciaCompra: crypto.randomUUID(),
        items: items.map((item) => ({ id: item.id, cantidad: item.cantidad, precioEsperado: item.precio })),
      };
      const pedido = await crearPedido(payload, token);
      const resumen = {
        id: String(pedido.id),
        fecha: pedido.fechaCreacion,
        estado: pedido.estado,
        comuna: pedido.comuna,
        total: pedido.total,
        items: (pedido.items || []).map((i) => ({ id: i.id, nombre: i.nombre, precio: i.precioUnitario, cantidad: i.cantidad })),
      };
      onPedido(resumen);
      vaciar();
      navegar("/compra/exito", { state: { pedido: resumen } });
    } catch (e) {
      setError(e.message || "No se pudo completar la compra.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="compra-pagina">
      <p className="sobre-titulo">UN PASO MÁS PARA TU PEDIDO</p>
      <h1>Datos de entrega</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form className="formulario-tarjeta" noValidate onSubmit={enviar}>
            <CampoFormulario nombre="nombre" etiqueta="Nombre de quien recibe" valor={datos.nombre} onChange={cambiar} error={errores.nombre} required maxLength={100} />
            <CampoFormulario nombre="telefono" etiqueta="Teléfono" tipo="tel" valor={datos.telefono} onChange={cambiar} error={errores.telefono} required maxLength={20} />
            <CampoFormulario nombre="direccion" etiqueta="Dirección" valor={datos.direccion} onChange={cambiar} error={errores.direccion} required maxLength={200} />
            <CampoFormulario nombre="comuna" etiqueta="Comuna" opciones={comunas} valor={datos.comuna} onChange={cambiar} error={errores.comuna} required />
            {error && <p role="alert" className="alert alert-danger">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={noDisponible || enviando}>{enviando ? "Confirmando..." : "Confirmar compra"}</button>
          </form>
        </div>
        <aside className="col-12 col-lg-5">
          <div className="resumen-compra">
            <h2 className="h4">Resumen</h2>
            <ul>{items.map((item) => <li key={item.id}>{item.nombre} × {item.cantidad}</li>)}</ul>
            <p className="fw-bold">Total de productos: {moneda(total)}</p>
            <p>Pago en efectivo al recibir. El costo de despacho no está incluido.</p>
            {noDisponible && <p role="alert">Revisa el carrito: hay productos sin precio confirmado, stock insuficiente o cantidades fuera del límite.</p>}
          </div>
        </aside>
      </div>
    </section>
  );
}
export default Checkout;
