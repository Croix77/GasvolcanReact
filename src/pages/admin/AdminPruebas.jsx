import { useState } from "react";
import { cuentaCliente } from "../../services/authDemo";
import {
  leerEscenarioCompra,
  guardarEscenarioCompra,
} from "../../services/escenarioCompra";
function AdminPruebas() {
  const [resultado, setResultado] = useState(leerEscenarioCompra);
  const [mensaje, setMensaje] = useState("");
  return (
    <section>
      <h1>Configuración de demostración</h1>
      <p>
        Este frontend no realiza cobros, despachos ni envíos de mensajes. Usa
        datos ficticios. La autenticación real se incorporará con el backend.
      </p>
      <h2 className="h4">Acceso de cliente</h2>
      <p>
        Correo: <code>{cuentaCliente.correo}</code>
        <br />
        Contraseña: <code>{cuentaCliente.clave}</code>
      </p>
      <p>
        Cierra la sesión administrativa e ingresa con esta cuenta desde el mismo
        login para recorrer catálogo, carrito, compra y Mis pedidos. Los datos
        ficticios de entrega se completan automáticamente y se pueden editar.
      </p>
      <label htmlFor="escenario-compra" className="form-label">
        Resultado de la compra
      </label>
      <select
        id="escenario-compra"
        className="form-select"
        value={resultado}
        onChange={(evento) => {
          const valor = evento.target.value;
          if (guardarEscenarioCompra(valor)) {
            setResultado(valor);
            setMensaje("Configuración guardada para esta pestaña.");
          } else
            setMensaje(
              "No se pudo guardar la configuración en este navegador.",
            );
        }}
      >
        <option value="exito">Compra exitosa</option>
        <option value="error">Compra fallida</option>
      </select>
      <p>
        La selección se conserva al cambiar de cuenta en esta pestaña. Para
        volver al resultado exitoso, cámbialo aquí.
      </p>
      <p role="status">{mensaje}</p>
    </section>
  );
}
export default AdminPruebas;
