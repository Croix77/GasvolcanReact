import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { cuentaDemo } from "../services/authDemo";
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
  if (sesion) return <Navigate to={destino} replace />;
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
      entrar(datos.correo, datos.clave);
      setDatos({ correo: "", clave: "" });
      navegar(destino, { replace: true });
    } catch (fallo) {
      setError(fallo.message);
    }
  }
  return (
    <section className="formulario-pagina">
      <h1>Acceso de administrador</h1>
      <p>
        Login de demostración para la entrega frontend. Utiliza solo esta cuenta
        ficticia; no introduzcas credenciales reales.
      </p>
      <p>
        Correo: <code>{cuentaDemo.correo}</code>
        <br />
        Contraseña de demostración: <code>{cuentaDemo.clave}</code>
      </p>
      <form noValidate onSubmit={enviar}>
        <CampoFormulario
          nombre="correo"
          etiqueta="Correo del administrador"
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
            Iniciar sesión de demostración
          </button>
        </div>
      </form>
    </section>
  );
}
export default Login;
