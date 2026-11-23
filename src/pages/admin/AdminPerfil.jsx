import { useAuth } from "../../hooks/useAuth";
import { etiquetasRol } from "../../services/sesion";

export default function AdminPerfil() {
  const { sesion } = useAuth();
  return (
    <section>
      <h1>Mi perfil</h1>
      <p>{sesion.nombre}</p>
      <p>{sesion.correo}</p>
      <p>Rol: {etiquetasRol[sesion.rol]}</p>
    </section>
  );
}
