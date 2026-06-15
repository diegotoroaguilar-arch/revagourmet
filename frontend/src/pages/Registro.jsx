import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Registro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', confirmar: '', rol: 'usuario' });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setMensaje('');
    if (form.password.length < 6) return setMensaje('La contrasena debe tener minimo 6 caracteres');
    if (form.password !== form.confirmar) return setMensaje('Las contrasenas no coinciden');

    setCargando(true);
    try {
      await register({ nombre: form.nombre, correo: form.correo, password: form.password, rol: form.rol });
      navigate(form.rol === 'propietario' ? '/propietario' : '/restaurantes');
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'No se pudo crear la cuenta');
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="panel auth-card" onSubmit={enviar}>
        <span className="eyebrow">Nueva cuenta</span>
        <h2>Registrarse</h2>
        <label>
          Nombre completo
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        </label>
        <label>
          Correo electronico
          <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
        </label>
        <label>
          Contrasena
          <input type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <label>
          Confirmar contrasena
          <input type="password" minLength="6" value={form.confirmar} onChange={(e) => setForm({ ...form, confirmar: e.target.value })} required />
        </label>
        <label>
          Tipo de cuenta
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            <option value="usuario">Usuario</option>
            <option value="propietario">Propietario de restaurante</option>
          </select>
        </label>
        <button className="btn" disabled={cargando}>{cargando ? 'Creando...' : 'Crear cuenta'}</button>
        {mensaje && <div className="notice">{mensaje}</div>}
        <Link className="ghost full" to="/login">Ya tengo cuenta</Link>
      </form>
    </section>
  );
}
