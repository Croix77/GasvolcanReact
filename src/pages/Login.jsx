import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validarLogin } from "../utils/validacion";
import CampoFormulario from "../components/CampoFormulario";

function Login() {
  const { sesion, entrar } = useAuth();
  const { state } = useLocation();
  const navegar = useNavigate();
  const destino = /^\/admin(?:\/|$)/.test(state?.desde || "")
    ? state.desde
    : "/admin";
  const [datos, setDatos] = useState({ correo: "", clave: "" });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  if (sesion)
    return (
      <Navigate
        to={sesion.rol === "administrador" ? destino : "/catalogo"}
        replace
      />
    );
  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
    setError("");
  }
  function enviar(evento) {
    evento.preventDefault();
    const resultado = validarLogin(datos);
    setErrores(resultado);
    setError("");
    if (Object.keys(resultado).length) return;
    try {
      const nueva = entrar(datos.correo, datos.clave);
      setDatos({ correo: "", clave: "" });
      navegar(nueva.rol === "administrador" ? destino : "/catalogo", {
        replace: true,
      });
    } catch (fallo) {
      setError(fallo.message);
    }
  }
  return (
    <section className="formulario-pagina">
      <h1>Iniciar sesión</h1>
      <form noValidate onSubmit={enviar}>
        <CampoFormulario
          nombre="correo"
          etiqueta="Correo electrónico"
          tipo="email"
          valor={datos.correo}
          onChange={cambiar}
          error={errores.correo}
          required
          maxLength={150}
          autoComplete="username"
        />
        <CampoFormulario
          nombre="clave"
          etiqueta="Contraseña"
          tipo={visible ? "text" : "password"}
          valor={datos.clave}
          onChange={cambiar}
          error={errores.clave}
          required
          maxLength={128}
          autoComplete="off"
        />
        <button
          type="button"
          className="btn btn-outline-secondary mb-3"
          onClick={() => setVisible(!visible)}
          aria-pressed={visible}
        >
          {visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        </button>
        {error && (
          <p role="alert" className="alert alert-danger">
            {error}
          </p>
        )}
        <div>
          <button type="submit" className="btn btn-primary">
            Iniciar sesión
          </button>
        </div>
      </form>
    </section>
  );
}
export default Login;
