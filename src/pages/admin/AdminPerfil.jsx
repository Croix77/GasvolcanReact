import { useAuth } from "../../hooks/useAuth";
function AdminPerfil() {
  const { sesion } = useAuth();
  return (
    <section>
      <h1>Perfil</h1>
      <p><strong>Nombre:</strong> {sesion?.nombre}</p>
      <p><strong>Correo:</strong> {sesion?.correo}</p>
      <p><strong>Rol:</strong> {sesion?.rolReal || sesion?.rol}</p>
    </section>
  );
}
export default AdminPerfil;
