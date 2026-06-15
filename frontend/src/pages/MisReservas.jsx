import { useEffect, useState } from 'react';
import api from '../services/api';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [cancelando, setCancelando] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');

  function cargar() {
    api.get('/mis-reservas').then((res) => setReservas(res.data)).catch(console.error);
  }

  useEffect(() => { cargar(); }, []);

  function abrirCancelacion(reserva) {
    setCancelando(reserva);
    setMotivo('');
    setMensaje('');
  }

  async function confirmarCancelacion(e) {
    e.preventDefault();
    if (!motivo.trim() || motivo.trim().length < 5) {
      setMensaje('Escribe un motivo de al menos 5 caracteres.');
      return;
    }
    await api.put(`/reservas/${cancelando.id}/cancelar`, { motivoCancelacion: motivo });
    setCancelando(null);
    setMotivo('');
    cargar();
  }

  return (
    <section className="page">
      <div className="section-heading">
        <span className="eyebrow">Historial</span>
        <h2>Mis reservas</h2>
      </div>
      <div className="reservation-list">
        {reservas.map((reserva) => (
          <article className="panel reservation-item" key={reserva.id}>
            <div>
              <h3>{reserva.Mesa?.Sucursal?.Restaurante?.nombre}</h3>
              <p>{reserva.Mesa?.Sucursal?.nombre} - Mesa {reserva.Mesa?.numero}</p>
              <p>{reserva.Usuario?.nombre || reserva.Cliente?.nombre} | {reserva.fecha} a las {reserva.hora} | {reserva.cantidadPersonas} personas</p>
            </div>
            <div className="reservation-actions">
              <span className={`status ${reserva.estado}`}>{reserva.estado}</span>
              {reserva.estado === 'cancelada' && reserva.motivoCancelacion && <small className="cancel-reason">{reserva.motivoCancelacion}</small>}
              {reserva.estado !== 'cancelada' && <button className="ghost danger" onClick={() => abrirCancelacion(reserva)}>Cancelar</button>}
            </div>
          </article>
        ))}
      </div>
      {cancelando && (
        <div className="modal-backdrop">
          <form className="panel cancel-modal" onSubmit={confirmarCancelacion}>
            <h3>Cancelar reserva</h3>
            <p>{cancelando.Mesa?.Sucursal?.Restaurante?.nombre} - Mesa {cancelando.Mesa?.numero}</p>
            <label>
              Motivo de la cancelacion
              <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: No podre asistir por un imprevisto" required />
            </label>
            {mensaje && <div className="notice">{mensaje}</div>}
            <div className="modal-actions">
              <button className="btn" type="submit">Confirmar cancelacion</button>
              <button className="ghost" type="button" onClick={() => setCancelando(null)}>Volver</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
