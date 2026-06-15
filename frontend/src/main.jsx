import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Restaurantes from './pages/Restaurantes.jsx';
import Sucursales from './pages/Sucursales.jsx';
import Reserva from './pages/Reserva.jsx';
import MisReservas from './pages/MisReservas.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Perfil from './pages/Perfil.jsx';
import RegistrarRestaurante from './pages/RegistrarRestaurante.jsx';
import PanelPropietario from './pages/PanelPropietario.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="restaurantes" element={<Restaurantes />} />
            <Route path="restaurantes/:restauranteId/sucursales" element={<Sucursales />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="registrar-restaurante" element={<RegistrarRestaurante />} />
            <Route path="perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="propietario" element={<ProtectedRoute><PanelPropietario /></ProtectedRoute>} />
            <Route path="reservar/:sucursalId" element={<ProtectedRoute><Reserva /></ProtectedRoute>} />
            <Route path="mis-reservas" element={<ProtectedRoute><MisReservas /></ProtectedRoute>} />
            <Route path="admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
