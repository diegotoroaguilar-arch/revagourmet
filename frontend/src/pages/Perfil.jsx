import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Perfil() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <section className="page">
      <div className="section-heading">
        <span className="eyebrow">Cuenta</span>
        <h2>Perfil de usuario</h2>
      </div>
      <div className="panel profile-card">
        <p><span>Nombre</span><strong>{usuario?.nombre}</strong></p>
        <p><span>Correo</span><strong>{usuario?.correo}</strong></p>
        <p><span>Rol</span><strong>{usuario?.rol}</strong></p>
        <div className="hero-actions">
          <Link className="btn" to="/mis-reservas">Mis reservas</Link>
          <button className="ghost danger" onClick={cerrarSesion}>Cerrar sesion</button>
        </div>
      </div>
    </section>
  );
}
