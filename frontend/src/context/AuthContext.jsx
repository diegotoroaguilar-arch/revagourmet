import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [cargandoPerfil, setCargandoPerfil] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setCargandoPerfil(true);
    api.get('/auth/perfil')
      .then((res) => {
        setUsuario(res.data.usuario);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      })
      .catch(() => cerrarSesion())
      .finally(() => setCargandoPerfil(false));
  }, []);

  function guardarSesion(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  }

  async function login(credenciales) {
    const res = await api.post('/auth/login', credenciales);
    guardarSesion(res.data);
    return res.data.usuario;
  }

  async function register(datos) {
    const res = await api.post('/auth/register', datos);
    guardarSesion(res.data);
    return res.data.usuario;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  const value = useMemo(() => ({ usuario, cargandoPerfil, login, register, cerrarSesion }), [usuario, cargandoPerfil]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
