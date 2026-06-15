import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, admin = false }) {
  const { usuario, cargandoPerfil } = useAuth();

  if (cargandoPerfil) return <section className="page"><p>Cargando sesion...</p></section>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (admin && usuario.rol !== 'admin') return <Navigate to="/" replace />;

  return children;
}
