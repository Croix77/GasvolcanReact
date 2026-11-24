import { useRef, useState } from "react";
import CampoFormulario from "../components/CampoFormulario";
import { useAuth } from "../hooks/useAuth";
import { pedirApi } from "../services/api";
import { enfocarPrimerError, validarContacto } from "../utils/validacion";
import { crearUuid } from "../utils/uuid";

export default function Contacto() {
  const { sesion } = useAuth();
  const [datos, setDatos] = useState(() => ({ nombre: sesion.nombre, mensaje: "" }));
  const [errores, setErrores] = useState({});
  const [errorEnvio, setErrorEnvio] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const intento = useRef(null);

  function cambiar(evento) {
    const nuevosDatos = { ...datos, [evento.target.name]: evento.target.value };
    setDatos(nuevosDatos);
    if (Object.keys(errores).length) setErrores(validarContacto(nuevosDatos));
    setErrorEnvio("");
    setConfirmado(false);
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (intento.current?.enviando) return;
    const nuevosErrores = validarContacto(datos);
    setErrores(nuevosErrores);
    setErrorEnvio("");
    setConfirmado(false);
    if (Object.keys(nuevosErrores).length) {
      enfocarPrimerError(nuevosErrores);
      return;
    }

    const consulta = { nombre: datos.nombre.trim(), mensaje: datos.mensaje.trim() };
    const firma = JSON.stringify(consulta);
    // Una respuesta perdida puede reintentarse sin duplicar la consulta.
    if (intento.current?.firma !== firma) {
      intento.current = { firma, referencia: crearUuid() };
    }
    const envio = intento.current;
    envio.enviando = true;
    setEnviando(true);
    try {
      await pedirApi("/contacto/mensajes", {
        token: sesion.token,
        metodo: "POST",
        datos: { ...consulta, referencia: envio.referencia },
      });
      setDatos({ ...consulta, mensaje: "" });
      setConfirmado(true);
      intento.current = null;
    } catch (fallo) {
      setErrorEnvio(fallo.message);
      if (fallo.campos) {
        setErrores(fallo.campos);
        enfocarPrimerError(fallo.campos);
      }
    } finally {
      envio.enviando = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-pagina formulario-tarjeta">
      <h1>Contacto</h1>
      <p className="texto-introduccion">Envía una consulta sobre productos o despacho.</p>
      <form noValidate onSubmit={enviar} aria-busy={enviando}>
        <CampoFormulario nombre="nombre" etiqueta="Nombre" valor={datos.nombre}
          onChange={cambiar} error={errores.nombre} readOnly={enviando} required maxLength={100} autoComplete="name" />
        <CampoFormulario nombre="correo" etiqueta="Correo electrónico" tipo="email"
          valor={sesion.correo} readOnly />
        <CampoFormulario nombre="mensaje" etiqueta="Mensaje" valor={datos.mensaje} multilinea
          onChange={cambiar} error={errores.mensaje} readOnly={enviando} required maxLength={1000} />
        <button className="btn btn-primary" type="submit" disabled={enviando}>
          {enviando ? "Enviando consulta…" : "Enviar consulta"}
        </button>
        {errorEnvio && <p role="alert" className="alert alert-danger mt-3">{errorEnvio}</p>}
        {confirmado && <p role="status" className="alert alert-success mt-3">Recibimos tu consulta.</p>}
      </form>
    </section>
  );
}
