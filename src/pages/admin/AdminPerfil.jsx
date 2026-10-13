import { useAuth } from "../../hooks/useAuth";
function AdminPerfil() {
  const { sesion } = useAuth();
  return (
    <section>
      <h1>Perfil de demostración</h1>
      <p>{sesion.nombre}</p>
      <p>Rol: {sesion.rol}</p>
      <p>La sesión vence después de 30 minutos. No se guarda la contraseña.</p>
    </section>
  );
}
export default AdminPerfil;
