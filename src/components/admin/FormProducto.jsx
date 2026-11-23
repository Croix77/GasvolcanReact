import { enfocarPrimerError } from "../../utils/validacion";
import { useState } from "react";
import CampoFormulario from "../CampoFormulario";
import { validarProducto } from "../../services/catalogo";

const inicial = {
  codigo: "",
  nombre: "",
  descripcion: "",
  descripcionLarga: "",
  categoria: "",
  unidad: "Unidad",
  imagen: "",
  precio: "",
  precioComercial: "",
  precioAnterior: "",
  stock: "",
  stockCritico: "",
  oferta: false,
};

const nombresFormulario = { categoria: "categoria-admin", categoriaId: "categoria-admin" };
const maximoEntero = 2_147_483_647;

function validar(datos) {
  const resultado = validarProducto(datos);
  if (!/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(datos.codigo.trim()) || datos.codigo.trim().length > 40)
    resultado.codigo = "Escribe un código de hasta 40 caracteres con letras, números o guiones entre grupos.";
  if (!datos.unidad.trim() || datos.unidad.trim().length > 30)
    resultado.unidad = "Escribe la unidad de venta.";
  if (datos.descripcion.length > 400)
    resultado.descripcion = "Usa hasta 400 caracteres en la descripción.";
  for (const campo of ["precio", "precioComercial", "precioAnterior", "stock", "stockCritico"]) {
    const valor = datos[campo];
    if (valor !== "" && valor != null &&
        (!/^\d+$/.test(String(valor).trim()) || Number(valor) > maximoEntero))
      resultado[campo] ??= "Escribe un entero desde cero hasta 2147483647.";
  }
  return resultado;
}

function FormProducto({ producto, categorias, onGuardar, onCancelar, deshabilitado = false }) {
  const [datos, setDatos] = useState(() => ({
    ...inicial,
    ...producto,
    codigo: producto?.codigo ?? producto?.id ?? "",
  }));
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(evento) {
    const campo = evento.target.name === "categoria-admin" ? "categoria" : evento.target.name;
    const valor = evento.target.type === "checkbox" ? evento.target.checked : evento.target.value;
    const nuevosDatos = { ...datos, [campo]: valor };
    setDatos(nuevosDatos);
    setError("");
    if (Object.keys(errores).length) setErrores(validar(nuevosDatos));
  }

  async function guardar(evento) {
    evento.preventDefault();
    const resultado = validar(datos);
    setErrores(resultado);
    setError("");
    if (Object.keys(resultado).length) {
      enfocarPrimerError(resultado, nombresFormulario);
      return;
    }
    setEnviando(true);
    try {
      await onGuardar(datos);
      setDatos(inicial);
      setErrores({});
    } catch (fallo) {
      const campos = fallo.campos ?? {};
      setErrores(campos);
      setError(fallo.message);
      enfocarPrimerError(campos, nombresFormulario);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form noValidate onSubmit={guardar} aria-busy={enviando}>
      <fieldset disabled={enviando || deshabilitado}>
        <CampoFormulario nombre="codigo" etiqueta="Código del producto" valor={datos.codigo}
          onChange={cambiar} error={errores.codigo} required maxLength={40} />
        <CampoFormulario nombre="nombre" etiqueta="Nombre del producto" valor={datos.nombre}
          onChange={cambiar} error={errores.nombre} required maxLength={100} />
        <CampoFormulario nombre="descripcion" etiqueta="Descripción" multilinea
          valor={datos.descripcion} onChange={cambiar} error={errores.descripcion} required maxLength={400} />
        <CampoFormulario nombre="descripcionLarga" etiqueta="Descripción del detalle (opcional)" multilinea
          valor={datos.descripcionLarga ?? ""} onChange={cambiar} error={errores.descripcionLarga} maxLength={1000} />
        <CampoFormulario nombre="categoria-admin" etiqueta="Categoría del producto" opciones={categorias}
          valor={datos.categoria} onChange={cambiar} error={errores.categoria || errores.categoriaId} required />
        <CampoFormulario nombre="unidad" etiqueta="Unidad de venta" valor={datos.unidad}
          onChange={cambiar} error={errores.unidad} required maxLength={30} />
        <CampoFormulario nombre="imagen" etiqueta="Ruta de la imagen (opcional)" valor={datos.imagen ?? ""}
          onChange={cambiar} error={errores.imagen} maxLength={255} />
        <CampoFormulario nombre="precio" etiqueta="Precio residencial (CLP)" tipo="number"
          valor={datos.precio} onChange={cambiar} error={errores.precio} required min={0} step={1} />
        <CampoFormulario nombre="precioComercial" etiqueta="Precio comercial (CLP, opcional)" tipo="number"
          valor={datos.precioComercial ?? ""} onChange={cambiar} error={errores.precioComercial} min={0} step={1} />
        <CampoFormulario nombre="precioAnterior" etiqueta="Precio anterior (CLP, opcional)" tipo="number"
          valor={datos.precioAnterior ?? ""} onChange={cambiar} error={errores.precioAnterior} min={0} step={1} />
        <CampoFormulario nombre="stock" etiqueta="Stock" tipo="number"
          valor={datos.stock} onChange={cambiar} error={errores.stock} required min={0} step={1} />
        <CampoFormulario nombre="stockCritico" etiqueta="Umbral de stock crítico (opcional)" tipo="number"
          valor={datos.stockCritico ?? ""} onChange={cambiar} error={errores.stockCritico} min={0} step={1} />
        <div className="form-check mb-3">
          <input className="form-check-input" id="oferta" name="oferta" type="checkbox"
            checked={datos.oferta} onChange={cambiar} />
          <label className="form-check-label" htmlFor="oferta">Destacar en ofertas</label>
        </div>
        <button className="btn btn-primary" type="submit">Guardar producto</button>
        {producto && (
          <button className="btn btn-outline-secondary ms-2" type="button" onClick={onCancelar}>
            Cancelar edición
          </button>
        )}
      </fieldset>
      {error && <p role="alert" className="alert alert-danger mt-3">{error}</p>}
    </form>
  );
}
export default FormProducto;
