import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario";
import { validarContacto, enfocarPrimerError } from "../utils/validacion";
import { enviarMensaje } from "../services/contactoApi";
import { useAuth } from "../hooks/useAuth";

const inicial = { nombre: "", mensaje: "" };
function Contacto() {
  const { sesion, asegurarToken, cargando } = useAuth();
  const ubicacion = useLocation();
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState({ tipo: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  if (cargando) return <p>Cargando...</p>;
  if (!sesion) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;

  function cambiar(evento) {
    const nuevosDatos = { ...datos, [evento.target.name]: evento.target.value };
    setDatos(nuevosDatos);
    if (Object.keys(errores).length > 0) setErrores(validarContacto({ ...nuevosDatos, correo: "demo@example.com" }));
    setEstado({ tipo: "", mensaje: "" });
  }

  async function enviar(evento) {
    evento.preventDefault();
    const resultado = validarContacto({ ...datos, correo: "demo@example.com" });
    delete resultado.correo;
    setErrores(resultado);
    if (Object.keys(resultado).length) { enfocarPrimerError(resultado); return; }
    setEnviando(true);
    try {
      const token = await asegurarToken();
      await enviarMensaje({ nombre: datos.nombre.trim(), mensaje: datos.mensaje.trim(), referencia: crypto.randomUUID() }, token);
      setDatos(inicial);
      setEstado({ tipo: "success", mensaje: "Mensaje enviado correctamente." });
    } catch (e) {
      setEstado({ tipo: "danger", mensaje: e.message || "No se pudo enviar el mensaje." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-pagina formulario-tarjeta">
      <p className="sobre-titulo">HABLEMOS DE TU PEDIDO</p>
      <h1>Contacto</h1>
      <p className="texto-introduccion">Envía tu consulta sobre productos y despacho. La respuesta se asocia a tu cuenta.</p>
      <form noValidate onSubmit={enviar}>
        <CampoFormulario nombre="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} required maxLength={100} autoComplete="name" />
        <CampoFormulario nombre="mensaje" etiqueta="Mensaje" multilinea valor={datos.mensaje} onChange={cambiar} error={errores.mensaje} required maxLength={1000} />
        <button className="btn btn-primary" type="submit" disabled={enviando}>{enviando ? "Enviando..." : "Enviar consulta"}</button>
        {estado.mensaje && <p role="status" className={`alert alert-${estado.tipo} mt-3`}>{estado.mensaje}</p>}
      </form>
    </section>
  );
}
export default Contacto;
