import { Link, NavLink } from 'react-router-dom';
import { Gem, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <Gem size={22} />
        <span>RevaGourmet</span>
      </Link>
      <nav>
        <NavLink to="/restaurantes">Restaurantes</NavLink>
        <NavLink to="/registrar-restaurante">Registra tu restaurante</NavLink>
        {usuario ? (
          <>
            {usuario.rol === 'usuario' && <NavLink to="/mis-reservas">Mis reservas</NavLink>}
            {usuario.rol === 'propietario' && <NavLink to="/propietario">Panel Propietario</NavLink>}
            <NavLink to="/perfil">Perfil</NavLink>
            {usuario.rol === 'admin' && <NavLink to="/admin">Admin</NavLink>}
            <button className="nav-button" onClick={cerrarSesion}><LogOut size={16} /> Cerrar sesion</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Iniciar sesion</NavLink>
            <NavLink to="/registro">Registrarse</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
