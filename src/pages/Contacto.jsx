import { useState } from "react";
import CampoFormulario from "../components/CampoFormulario";
import { validarContacto, enfocarPrimerError } from "../utils/validacion";
const inicial = { nombre: "", correo: "", mensaje: "" };
function Contacto() {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [validado, setValidado] = useState(false);
  function cambiar(evento) {
    const nuevosDatos = { ...datos, [evento.target.name]: evento.target.value };
    setDatos(nuevosDatos);
    if (Object.keys(errores).length > 0)
      setErrores(validarContacto(nuevosDatos));
    setValidado(false);
  }
  function validar(evento) {
    evento.preventDefault();
    const resultado = validarContacto(datos);
    setErrores(resultado);
    enfocarPrimerError(resultado);
    setValidado(Object.keys(resultado).length === 0);
  }
  return (
    <section className="formulario-pagina formulario-tarjeta">
      <p className="sobre-titulo">HABLEMOS DE TU PEDIDO</p>
      <h1>Contacto</h1>
      <p className="texto-introduccion">
        Prepara tu consulta sobre productos y despacho.
      </p>
      <form noValidate onSubmit={validar}>
        <CampoFormulario
          nombre="nombre"
          etiqueta="Nombre"
          valor={datos.nombre}
          onChange={cambiar}
          error={errores.nombre}
          required
          maxLength={100}
          autoComplete="name"
        />
        <CampoFormulario
          nombre="correo"
          etiqueta="Correo electrónico"
          tipo="email"
          valor={datos.correo}
          onChange={cambiar}
          error={errores.correo}
          required
          maxLength={150}
          autoComplete="email"
        />
        <CampoFormulario
          nombre="mensaje"
          etiqueta="Mensaje"
          multilinea
          valor={datos.mensaje}
          onChange={cambiar}
          error={errores.mensaje}
          required
          maxLength={1000}
        />
        <button className="btn btn-primary" type="submit">
          Validar consulta
        </button>
        {validado && (
          <p role="status" className="alert alert-success mt-3">
            Consulta validada. No se ha enviado ningún mensaje.
          </p>
        )}
      </form>
    </section>
  );
}
export default Contacto;
