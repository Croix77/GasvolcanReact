import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario";

export default function AdminInventario({ productos, ajustarStock, recargar, cargando, error }) {
  const [ajuste, setAjuste] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [rechazado, setRechazado] = useState(false);
  const [aviso, setAviso] = useState("");
  const [fallo, setFallo] = useState("");
  const producto = productos.find(({ id }) => id === ajuste?.id);
  const requiereRevisar = rechazado || producto?.versionStock !== ajuste?.version;

  function seleccionar(id) {
    const elegido = productos.find((item) => item.id === id);
    setAjuste(elegido ? { id, unidades: String(elegido.stock), version: elegido.versionStock } : null);
    setRechazado(false);
    setAviso("");
    setFallo("");
  }

  async function guardar(evento) {
    evento.preventDefault();
    if (!producto || cargando || error || requiereRevisar || guardando) return;
    setFallo("");
    setAviso("");
    const stock = Number(ajuste.unidades);
    if (!/^\d+$/.test(ajuste.unidades) || stock > 2_147_483_647) {
      setFallo("Ingresa una cantidad entera entre 0 y 2147483647.");
      return;
    }

    setGuardando(true);
    try {
      const guardado = await ajustarStock(ajuste.id, stock, ajuste.version);
      setAjuste({ id: guardado.id, unidades: String(guardado.stock), version: guardado.version });
      setAviso("Existencias actualizadas.");
    } catch (problema) {
      setFallo(problema.message);
      if (problema.status === 409) {
        setRechazado(true);
        recargar();
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section>
      <h1>Inventario</h1>
      <form noValidate onSubmit={guardar} aria-busy={guardando} className="formulario-tarjeta">
        <label htmlFor="inventario-producto" className="form-label">Producto</label>
        <select id="inventario-producto" className="form-select mb-3"
          value={producto?.id ?? ""} onChange={(evento) => seleccionar(evento.target.value)}
          disabled={guardando || cargando || Boolean(error)}>
          <option value="">Selecciona un producto</option>
          {productos.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
        </select>
        {producto && (
          <>
            <p>Unidades registradas: {producto.stock}</p>
            {producto.versionStock === null && <p>El producto ingresará al inventario al guardar su primera cantidad.</p>}
            <CampoFormulario nombre="inventario-unidades" etiqueta="Unidades disponibles" tipo="number"
              valor={ajuste.unidades} min={0} max={2_147_483_647} step={1}
              disabled={guardando || cargando || requiereRevisar || Boolean(error)} required
              onChange={(evento) => setAjuste({ ...ajuste, unidades: evento.target.value })} />
            {requiereRevisar && (
              <>
                <p>Revisa las unidades registradas antes de volver a ajustar el inventario.</p>
                <button type="button" className="btn btn-outline-secondary me-2"
                  disabled={guardando || cargando || Boolean(error)} onClick={() => seleccionar(producto.id)}>
                  Usar cantidad actual
                </button>
              </>
            )}
            <button type="submit" className="btn btn-primary"
              disabled={guardando || cargando || requiereRevisar || Boolean(error)}>
              Guardar inventario
            </button>
          </>
        )}
        {fallo && <p role="alert" className="alert alert-danger mt-3">{fallo}</p>}
        {aviso && <p role="status" className="mt-3">{aviso}</p>}
      </form>
    </section>
  );
}
