import { leerEscenarioCompra } from "../services/escenarioCompra";
import { useAuth } from "../hooks/useAuth";
import { perfilClienteDemo } from "../data/perfilClienteDemo";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario";
import { validarEntrega, enfocarPrimerError } from "../utils/validacion";
import { moneda } from "../utils/moneda";
const comunas = [
  "Chillán",
  "Chillán Viejo",
  "El Carmen",
  "Pinto",
  "San Ignacio",
  "Bulnes",
  "Quillón",
];
function Checkout({ items, vaciar, onPedido }) {
  const navegar = useNavigate();
  const { sesion } = useAuth();
  const [datos, setDatos] = useState(() =>
    sesion?.rol === "cliente"
      ? { ...perfilClienteDemo }
      : { nombre: "", telefono: "", direccion: "", comuna: "" },
  );
  const [errores, setErrores] = useState({});
  const total = items.reduce(
    (suma, item) => suma + (item.precio ?? 0) * item.cantidad,
    0,
  );
  const noDisponible = items.some(
    (item) => item.precio == null || item.cantidad > item.stock,
  );
  if (!items.length)
    return (
      <section>
        <h1>Compra</h1>
        <p>Agrega productos antes de continuar.</p>
        <Link to="/catalogo">Ver catálogo</Link>
      </section>
    );
  function cambiar(evento) {
    const nuevosDatos = { ...datos, [evento.target.name]: evento.target.value };
    setDatos(nuevosDatos);
    if (Object.keys(errores).length > 0)
      setErrores(validarEntrega(nuevosDatos));
  }
  function enviar(evento) {
    evento.preventDefault();
    const nuevosErrores = validarEntrega(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length || noDisponible) {
      enfocarPrimerError(nuevosErrores);
      return;
    }
    const resultado = leerEscenarioCompra();
    const pedido = {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      items: items.map(({ id, nombre, precio, cantidad }) => ({
        id,
        nombre,
        precio,
        cantidad,
      })),
      total,
      comuna: datos.comuna,
      estado: resultado === "exito" ? "Confirmado" : "Fallido",
    };
    if (resultado === "exito") {
      onPedido(pedido);
      vaciar();
    }
    navegar(`/compra/${resultado}`, { state: { pedido } });
  }
  return (
    <section className="compra-pagina">
      <p className="sobre-titulo">UN PASO MÁS PARA TU PEDIDO</p>
      <h1>Datos de entrega</h1>
      <ol className="compra-pasos" aria-label="Pasos de compra">
        <li>
          <span>1</span> Carrito
        </li>
        <li aria-current="step">
          <span>2</span> Entrega
        </li>
        <li>
          <span>3</span> Resumen
        </li>
      </ol>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form className="formulario-tarjeta" noValidate onSubmit={enviar}>
            <CampoFormulario
              nombre="nombre"
              etiqueta="Nombre de quien recibe"
              valor={datos.nombre}
              onChange={cambiar}
              error={errores.nombre}
              required
              maxLength={100}
            />
            <CampoFormulario
              nombre="telefono"
              etiqueta="Teléfono"
              tipo="tel"
              valor={datos.telefono}
              onChange={cambiar}
              error={errores.telefono}
              required
              maxLength={20}
            />
            <CampoFormulario
              nombre="direccion"
              etiqueta="Dirección"
              valor={datos.direccion}
              onChange={cambiar}
              error={errores.direccion}
              required
              maxLength={200}
            />
            <CampoFormulario
              nombre="comuna"
              etiqueta="Comuna"
              opciones={comunas}
              valor={datos.comuna}
              onChange={cambiar}
              error={errores.comuna}
              required
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={noDisponible}
            >
              Confirmar compra
            </button>
          </form>
        </div>
        <aside className="col-12 col-lg-5">
          <div className="resumen-compra">
            <h2 className="h4">Resumen</h2>
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  {item.nombre} × {item.cantidad}
                </li>
              ))}
            </ul>
            <p className="fw-bold">Total de productos: {moneda(total)}</p>
            <p>
              Pago en efectivo al recibir en el flujo del negocio. El costo de
              despacho no está incluido.
            </p>
            {noDisponible && (
              <p role="alert">
                Revisa el carrito: hay productos sin precio confirmado o con
                stock insuficiente.
              </p>
            )}
            <Link to="/carrito">Volver al carrito</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
export default Checkout;
