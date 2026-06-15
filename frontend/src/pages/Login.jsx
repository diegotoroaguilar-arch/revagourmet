import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ correo: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setMensaje('');
    setCargando(true);
    try {
      const usuario = await login(form);
      navigate(usuario.rol === 'admin' ? '/admin' : '/restaurantes');
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'No se pudo iniciar sesion');
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="panel auth-card" onSubmit={enviar}>
        <span className="eyebrow">Acceso</span>
        <h2>Iniciar sesion</h2>
        <label>
          Correo electronico
          <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
        </label>
        <label>
          Contrasena
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="btn" disabled={cargando}>{cargando ? 'Ingresando...' : 'Iniciar sesion'}</button>
        {mensaje && <div className="notice">{mensaje}</div>}
        <p className="auth-help">Demo admin: admin@revagourmet.com / admin123</p>
        <Link className="ghost full" to="/registro">Crear cuenta</Link>
      </form>
    </section>
  );
}
