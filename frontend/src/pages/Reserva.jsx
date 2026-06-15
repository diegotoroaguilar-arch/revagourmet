import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import TableCard from '../components/TableCard.jsx';
import ReservationForm from '../components/ReservationForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const hoy = new Date().toISOString().slice(0, 10);

export default function Reserva() {
  const { sucursalId } = useParams();
  const { usuario } = useAuth();
  const [sucursal, setSucursal] = useState(null);
  const [filtros, setFiltros] = useState({ fecha: hoy, hora: '20:00', personas: 2 });
  const [mesas, setMesas] = useState([]);
  const [mesa, setMesa] = useState(null);
  const [datosReserva, setDatosReserva] = useState({ telefonoContacto: '', comentarios: '' });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    api.get('/sucursales').then((res) => {
      setSucursal(res.data.find((item) => String(item.id) === String(sucursalId)));
    });
  }, [sucursalId]);

  useEffect(() => {
    setMesa(null);
    api.get('/mesas/disponibles', { params: { sucursalId, fecha: filtros.fecha, hora: filtros.hora, personas: filtros.personas } })
      .then((res) => setMesas(res.data))
      .catch((error) => setMensaje(error.response?.data?.mensaje || 'No se pudieron cargar las mesas'));
  }, [sucursalId, filtros]);

  const resumen = useMemo(() => ({
    restaurante: sucursal?.Restaurante?.nombre,
    sucursal: sucursal?.nombre,
    mesa: mesa ? `Mesa ${mesa.numero} - ${mesa.zona}` : 'Selecciona una mesa',
    fecha: filtros.fecha,
    hora: filtros.hora,
    personas: filtros.personas
  }), [sucursal, mesa, filtros]);

  async function confirmar(e) {
    e.preventDefault();
    if (!mesa) {
      setMensaje('Selecciona una mesa disponible');
      return;
    }
    setCargando(true);
    setMensaje('');
    try {
      await api.post('/reservas', {
        mesaId: mesa.id,
        fecha: filtros.fecha,
        hora: filtros.hora,
        cantidadPersonas: Number(filtros.personas),
        telefonoContacto: datosReserva.telefonoContacto,
        comentarios: datosReserva.comentarios
      });
      setMensaje('Reserva confirmada correctamente');
      setDatosReserva({ telefonoContacto: '', comentarios: '' });
      const res = await api.get('/mesas/disponibles', { params: { sucursalId, fecha: filtros.fecha, hora: filtros.hora, personas: filtros.personas } });
      setMesas(res.data);
      setMesa(null);
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al crear la reserva');
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="page reserve-page">
      <div className="section-heading">
        <span className="eyebrow">Reserva</span>
        <h2>{sucursal?.Restaurante?.nombre} - {sucursal?.nombre}</h2>
      </div>

      <div className="reserve-layout">
        <div>
          <div className="panel filters">
            <label>Fecha<input type="date" min={hoy} value={filtros.fecha} onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })} /></label>
            <label>Hora<input type="time" value={filtros.hora} onChange={(e) => setFiltros({ ...filtros, hora: e.target.value })} /></label>
            <label>Personas<input type="number" min="1" value={filtros.personas} onChange={(e) => setFiltros({ ...filtros, personas: e.target.value })} /></label>
          </div>

          <div className="table-map">
            {mesas.map((item) => <TableCard key={item.id} mesa={item} seleccionada={mesa?.id === item.id} onSelect={setMesa} />)}
            {!mesas.length && <p className="empty">No hay mesas disponibles para esa busqueda.</p>}
          </div>
        </div>

        <aside>
          <div className="panel summary">
            <h3>Resumen</h3>
            {Object.entries(resumen).map(([key, value]) => <p key={key}><span>{key}</span><strong>{value}</strong></p>)}
          </div>
          <ReservationForm datos={datosReserva} setDatos={setDatosReserva} onSubmit={confirmar} cargando={cargando} usuario={usuario} />
          {mensaje && <div className="notice">{mensaje}</div>}
          <Link className="ghost full" to="/mis-reservas">Ir a mis reservas</Link>
        </aside>
      </div>
    </section>
  );
}
