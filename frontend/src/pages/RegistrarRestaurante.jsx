import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PanelPropietario from './PanelPropietario.jsx';

export default function RegistrarRestaurante() {
  const { usuario } = useAuth();

  if (!usuario) {
    return (
      <section className="auth-page">
        <div className="panel auth-card">
          <span className="eyebrow">Restaurantes</span>
          <h2>Registra tu restaurante</h2>
          <p className="auth-help">Para registrar un restaurante necesitas iniciar sesion o crear una cuenta como propietario.</p>
          <Link className="btn" to="/registro">Crear cuenta de propietario</Link>
          <Link className="ghost full" to="/login">Iniciar sesion</Link>
        </div>
      </section>
    );
  }

  if (usuario.rol !== 'propietario' && usuario.rol !== 'admin') {
    return (
      <section className="page">
        <div className="panel auth-card">
          <h2>Cuenta de propietario requerida</h2>
          <p className="auth-help">Crea una cuenta con rol propietario para registrar restaurantes, sucursales y mesas.</p>
          <Link className="btn" to="/registro">Registrarme como propietario</Link>
        </div>
      </section>
    );
  }

  return <PanelPropietario />;
}
