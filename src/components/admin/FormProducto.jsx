import { enfocarPrimerError } from "../../utils/validacion";
import { useState } from "react";
import CampoFormulario from "../CampoFormulario";
import { validarProducto } from "../../services/catalogo";
const inicial = {
  nombre: "",
  descripcion: "",
  categoria: "",
  precio: "",
  precioAnterior: "",
  stock: "",
  oferta: false,
};
function FormProducto({ producto, categorias, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(() => producto || inicial);
  const [errores, setErrores] = useState({});
  function cambiar(evento) {
    const nuevosDatos = {
      ...datos,
      [evento.target.name]:
        evento.target.type === "checkbox"
          ? evento.target.checked
          : evento.target.value,
    };
    setDatos(nuevosDatos);
    if (Object.keys(errores).length > 0)
      setErrores(validarProducto(nuevosDatos));
  }
  function guardar(evento) {
    evento.preventDefault();
    const resultado = validarProducto(datos);
    setErrores(resultado);
    if (Object.keys(resultado).length) {
      enfocarPrimerError(resultado, { categoria: "categoria-admin" });
      return;
    }
    onGuardar(datos);
    setDatos(inicial);
    setErrores({});
  }
  return (
    <form noValidate onSubmit={guardar}>
      <CampoFormulario
        nombre="nombre"
        etiqueta="Nombre del producto"
        valor={datos.nombre}
        onChange={cambiar}
        error={errores.nombre}
        required
        maxLength={100}
      />
      <CampoFormulario
        nombre="descripcion"
        etiqueta="Descripción"
        multilinea
        valor={datos.descripcion}
        onChange={cambiar}
        error={errores.descripcion}
        required
        maxLength={500}
      />
      <CampoFormulario
        nombre="categoria-admin"
        etiqueta="Categoría del producto"
        opciones={categorias}
        valor={datos.categoria}
        onChange={(evento) => {
          const nuevosDatos = { ...datos, categoria: evento.target.value };
          setDatos(nuevosDatos);
          if (Object.keys(errores).length > 0)
            setErrores(validarProducto(nuevosDatos));
        }}
        error={errores.categoria}
        required
      />
      <CampoFormulario
        nombre="precio"
        etiqueta="Precio residencial (CLP)"
        tipo="number"
        valor={datos.precio}
        onChange={cambiar}
        error={errores.precio}
        required
        min={0}
        step={1}
      />
      <CampoFormulario
        nombre="precioAnterior"
        etiqueta="Precio anterior (CLP, opcional)"
        tipo="number"
        valor={datos.precioAnterior ?? ""}
        onChange={cambiar}
        error={errores.precioAnterior}
        min={0}
        step={1}
      />
      <CampoFormulario
        nombre="stock"
        etiqueta="Stock"
        tipo="number"
        valor={datos.stock}
        onChange={cambiar}
        error={errores.stock}
        required
        min={0}
        step={1}
      />
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          id="oferta"
          name="oferta"
          type="checkbox"
          checked={datos.oferta}
          onChange={cambiar}
        />
        <label className="form-check-label" htmlFor="oferta">
          Destacar en ofertas
        </label>
      </div>
      <button className="btn btn-primary" type="submit">
        Guardar producto
      </button>
      {producto && (
        <button
          type="button"
          className="btn btn-outline-secondary ms-2"
          onClick={onCancelar}
        >
          Cancelar edición
        </button>
      )}
    </form>
  );
}
export default FormProducto;
