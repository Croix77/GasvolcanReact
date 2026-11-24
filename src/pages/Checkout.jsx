import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario";
import SeleccionUbicacion from "../components/pedidos/SeleccionUbicacion";
import { useAuth } from "../hooks/useAuth";
import { MAX_UNIDADES_POR_PRODUCTO } from "../utils/compra";
import { moneda } from "../utils/moneda";
import { comunasEntrega, leerCoordenadas } from "../utils/pedidos";
import { validarEntrega, enfocarPrimerError } from "../utils/validacion";

function crearReferenciaCompra() {
  // Los bytes aleatorios permiten generar el UUID incluso al probar sin HTTPS.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function Checkout({ items, vaciar, onPedido, actualizandoCatalogo = false, catalogoConError = false }) {
  const navegar = useNavigate();
  const { sesion } = useAuth();
  const [datos, setDatos] = useState(() => ({
    nombre: sesion?.nombre ?? "", telefono: "", direccion: "", comuna: "",
  }));
  const [punto, setPunto] = useState({ latitud: "", longitud: "" });
  const [errores, setErrores] = useState({});
  const [errorEnvio, setErrorEnvio] = useState("");
  const [errorPunto, setErrorPunto] = useState("");
  const intento = useRef(null);
  const [enviando, setEnviando] = useState(false);

  const total = items.reduce((suma, item) => suma + (item.precio ?? 0) * item.cantidad, 0);
  const noDisponible = items.some((item) =>
    item.precio == null || item.cantidad > item.stock || !Number.isSafeInteger(item.cantidad) ||
    item.cantidad < 1 || item.cantidad > MAX_UNIDADES_POR_PRODUCTO,
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
    if (Object.keys(errores).length > 0) setErrores(validarEntrega(nuevosDatos));
    setErrorEnvio("");
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (intento.current?.enviando || noDisponible || actualizandoCatalogo || catalogoConError) return;
    const nuevosErrores = validarEntrega(datos);
    setErrores(nuevosErrores);
    setErrorEnvio("");
    setErrorPunto("");
    if (Object.keys(nuevosErrores).length) {
      enfocarPrimerError(nuevosErrores);
      return;
    }

    const coordenadas = leerCoordenadas(punto);
    if (!coordenadas) {
      setErrorPunto("Marca el punto de entrega en el mapa o ingresa ambas coordenadas válidas.");
      enfocarPrimerError({
        [leerCoordenadas({ latitud: punto.latitud, longitud: 0 }) ? "entrega-longitud" : "entrega-latitud"]: true,
      });
      return;
    }

    // El servidor comprueba el precio que se muestra antes de reservar las unidades.
    const solicitud = {
      nombre: datos.nombre.trim(),
      telefono: datos.telefono.trim(),
      direccion: datos.direccion.trim(),
      comuna: datos.comuna,
      items: items.map(({ id, cantidad, precio }) => ({ id, cantidad, precioEsperado: precio }))
        .sort((a, b) => a.id.localeCompare(b.id)),
      latitudEntrega: coordenadas.latitud,
      longitudEntrega: coordenadas.longitud,
    };
    const firma = JSON.stringify({ ...solicitud, telefono: solicitud.telefono.replace(/[\s()-]/g, "") });

    // Si se perdió la respuesta de red, el siguiente envío de la misma compra conserva su UUID.
    if (intento.current?.firma !== firma) {
      intento.current = { firma, referencia: crearReferenciaCompra() };
    }
    intento.current.enviando = true;
    setEnviando(true);
    try {
      const pedido = await onPedido({ ...solicitud, referenciaCompra: intento.current.referencia });
      vaciar();
      navegar("/compra/exito", { state: { pedido }, replace: true });
    } catch (fallo) {
      if (fallo.status === 409) {
        intento.current.firma = null;
        setErrorEnvio(`${fallo.message} Revisa el carrito y vuelve a confirmar.`);
      } else {
        setErrorEnvio(fallo.message);
      }
      if (fallo.campos) {
        setErrores(fallo.campos);
        const coordenadaConError = fallo.campos.latitudEntrega || fallo.campos.longitudEntrega;
        if (coordenadaConError) setErrorPunto(coordenadaConError);
        enfocarPrimerError(fallo.campos, { latitudEntrega: "entrega-latitud", longitudEntrega: "entrega-longitud" });
      }
    } finally {
      intento.current.enviando = false;
      setEnviando(false);
    }
  }

  return (
    <section className="compra-pagina">
      <h1>Datos de entrega</h1>
      <ol className="compra-pasos" aria-label="Pasos de compra">
        <li><span>1</span> Carrito</li>
        <li aria-current="step"><span>2</span> Entrega</li>
        <li><span>3</span> Resumen</li>
      </ol>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form className="formulario-tarjeta" noValidate onSubmit={enviar}>
            <CampoFormulario nombre="nombre" etiqueta="Nombre de quien recibe" valor={datos.nombre}
              onChange={cambiar} error={errores.nombre} required maxLength={100} autoComplete="name" />
            <CampoFormulario nombre="telefono" etiqueta="Teléfono" tipo="tel" valor={datos.telefono}
              onChange={cambiar} error={errores.telefono} required maxLength={30} autoComplete="tel" />
            <CampoFormulario nombre="direccion" etiqueta="Dirección" valor={datos.direccion}
              onChange={cambiar} error={errores.direccion} required maxLength={200} autoComplete="street-address" />
            <CampoFormulario nombre="comuna" etiqueta="Comuna" opciones={comunasEntrega} valor={datos.comuna}
              onChange={cambiar} error={errores.comuna} required />
            <fieldset>
              <legend className="h6">Punto de entrega</legend>
              <SeleccionUbicacion {...punto} id="entrega" etiqueta="Mapa para marcar el punto de entrega"
                requerido error={errorPunto} onChange={(nuevoPunto) => {
                  setPunto(nuevoPunto);
                  setErrorPunto("");
                }} />
            </fieldset>
            {errorEnvio && <p role="alert" className="alert alert-danger">{errorEnvio}</p>}
            <button className="btn btn-primary" type="submit" disabled={noDisponible || enviando || actualizandoCatalogo || catalogoConError}>
              {enviando ? "Confirmando compra…" : "Confirmar compra"}
            </button>
          </form>
        </div>
        <aside className="col-12 col-lg-5">
          <div className="resumen-compra">
            <h2 className="h4">Resumen</h2>
            <ul>
              {items.map((item) => <li key={item.id}>{item.nombre} × {item.cantidad}</li>)}
            </ul>
            <p className="fw-bold">Total de productos: {moneda(total)}</p>
            <p>Pago en efectivo al recibir. El total se confirma con el servidor.</p>
            {actualizandoCatalogo && <p role="status">Actualizando precios y existencias…</p>}
            {noDisponible && (
              <p role="alert">
                Revisa el carrito: incluye productos sin precio confirmado, con stock insuficiente o por encima
                del límite de {MAX_UNIDADES_POR_PRODUCTO} unidades por producto.
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
