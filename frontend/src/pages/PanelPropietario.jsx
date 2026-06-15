import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import AdminTable from '../components/AdminTable.jsx';

const restauranteInicial = {
  nombre: '', descripcion: '', tipoComida: '', rangoPrecio: '', ciudad: 'La Paz', imagen: '',
  telefonoContacto: '77591720', correoContacto: '', propietarioNombre: '', nit: '',
  direccion: '', horarioApertura: '18:00', horarioCierre: '23:30'
};
const sucursalInicial = { restauranteId: '', nombre: '', direccion: '', ciudad: 'La Paz', horarioApertura: '18:00', horarioCierre: '23:30', telefono: '77591720', estado: true };
const mesaInicial = { sucursalId: '', numero: '', capacidad: 4, zona: 'interior', estado: true };

export default function PanelPropietario() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [restauranteForm, setRestauranteForm] = useState(restauranteInicial);
  const [sucursalForm, setSucursalForm] = useState(sucursalInicial);
  const [mesaForm, setMesaForm] = useState(mesaInicial);
  const [mensaje, setMensaje] = useState('');

  function cargar() {
    Promise.all([
      api.get('/mis-restaurantes'),
      api.get('/propietario/reservas')
    ]).then(([r, rs]) => {
      setRestaurantes(r.data);
      setReservas(rs.data);
    }).catch((error) => setMensaje(error.response?.data?.mensaje || 'No se pudo cargar el panel'));
  }

  useEffect(() => { cargar(); }, []);

  const sucursales = useMemo(() => restaurantes.flatMap((r) => (r.Sucursals || []).map((s) => ({ ...s, restaurante: r.nombre }))), [restaurantes]);
  const mesas = useMemo(() => sucursales.flatMap((s) => (s.Mesas || []).map((m) => ({ ...m, sucursal: s.nombre }))), [sucursales]);

  const stats = [
    ['Total reservas', reservas.length],
    ['Reservas del dia', reservas.filter((r) => r.fecha === new Date().toISOString().slice(0, 10)).length],
    ['Mesas disponibles', mesas.filter((m) => m.estado).length],
    ['Restaurantes activos', restaurantes.filter((r) => r.estado === 'aprobado').length]
  ];

  async function crearRestaurante(e) {
    e.preventDefault();
    const restaurante = await api.post('/restaurantes/registrar', {
      nombre: restauranteForm.nombre,
      descripcion: restauranteForm.descripcion,
      tipoComida: restauranteForm.tipoComida,
      rangoPrecio: restauranteForm.rangoPrecio,
      imagen: restauranteForm.imagen,
      telefonoContacto: restauranteForm.telefonoContacto,
      correoContacto: restauranteForm.correoContacto,
      nit: restauranteForm.nit
    });
    await api.post(`/mis-restaurantes/${restaurante.data.id}/sucursales`, {
      nombre: `${restauranteForm.nombre} Principal`,
      direccion: restauranteForm.direccion,
      ciudad: restauranteForm.ciudad,
      horarioApertura: restauranteForm.horarioApertura,
      horarioCierre: restauranteForm.horarioCierre,
      telefono: restauranteForm.telefonoContacto
    });
    setRestauranteForm(restauranteInicial);
    setMensaje('Restaurante registrado como pendiente. El administrador debe aprobarlo.');
    cargar();
  }

  async function crearSucursal(e) {
    e.preventDefault();
    await api.post(`/mis-restaurantes/${sucursalForm.restauranteId}/sucursales`, sucursalForm);
    setSucursalForm(sucursalInicial);
    cargar();
  }

  async function crearMesa(e) {
    e.preventDefault();
    await api.post(`/sucursales/${mesaForm.sucursalId}/mesas`, mesaForm);
    setMesaForm(mesaInicial);
    cargar();
  }

  async function eliminar(ruta, id) {
    await api.delete(`/${ruta}/${id}`);
    cargar();
  }

  return (
    <section className="page admin-page">
      <div className="section-heading">
        <span className="eyebrow">Propietario</span>
        <h2>Panel Propietario</h2>
      </div>
      {mensaje && <div className="notice">{mensaje}</div>}

      <div className="stats-grid">
        {stats.map(([label, value]) => <div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>

      <div className="admin-forms">
        <form className="panel mini-form" onSubmit={crearRestaurante}>
          <h3>Registrar restaurante</h3>
          {['nombre', 'descripcion', 'tipoComida', 'rangoPrecio', 'ciudad', 'imagen', 'telefonoContacto', 'correoContacto', 'propietarioNombre', 'nit', 'direccion'].map((campo) => (
            campo === 'descripcion'
              ? <textarea key={campo} placeholder="Descripcion" value={restauranteForm[campo]} onChange={(e) => setRestauranteForm({ ...restauranteForm, [campo]: e.target.value })} required />
              : <input key={campo} placeholder={campo} value={restauranteForm[campo]} onChange={(e) => setRestauranteForm({ ...restauranteForm, [campo]: e.target.value })} required={campo !== 'nit'} />
          ))}
          <input type="time" value={restauranteForm.horarioApertura} onChange={(e) => setRestauranteForm({ ...restauranteForm, horarioApertura: e.target.value })} />
          <input type="time" value={restauranteForm.horarioCierre} onChange={(e) => setRestauranteForm({ ...restauranteForm, horarioCierre: e.target.value })} />
          <button className="btn">Registrar</button>
        </form>

        <form className="panel mini-form" onSubmit={crearSucursal}>
          <h3>Agregar sucursal</h3>
          <select value={sucursalForm.restauranteId} onChange={(e) => setSucursalForm({ ...sucursalForm, restauranteId: e.target.value })} required>
            <option value="">Restaurante</option>
            {restaurantes.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
          <input placeholder="Nombre" value={sucursalForm.nombre} onChange={(e) => setSucursalForm({ ...sucursalForm, nombre: e.target.value })} required />
          <input placeholder="Direccion" value={sucursalForm.direccion} onChange={(e) => setSucursalForm({ ...sucursalForm, direccion: e.target.value })} required />
          <input placeholder="Ciudad" value={sucursalForm.ciudad} onChange={(e) => setSucursalForm({ ...sucursalForm, ciudad: e.target.value })} required />
          <button className="btn">Agregar sucursal</button>
        </form>

        <form className="panel mini-form" onSubmit={crearMesa}>
          <h3>Agregar mesa</h3>
          <select value={mesaForm.sucursalId} onChange={(e) => setMesaForm({ ...mesaForm, sucursalId: e.target.value })} required>
            <option value="">Sucursal</option>
            {sucursales.map((s) => <option key={s.id} value={s.id}>{s.restaurante} - {s.nombre}</option>)}
          </select>
          <input placeholder="Numero" type="number" value={mesaForm.numero} onChange={(e) => setMesaForm({ ...mesaForm, numero: e.target.value })} required />
          <input placeholder="Capacidad" type="number" value={mesaForm.capacidad} onChange={(e) => setMesaForm({ ...mesaForm, capacidad: e.target.value })} required />
          <select value={mesaForm.zona} onChange={(e) => setMesaForm({ ...mesaForm, zona: e.target.value })}>
            <option>interior</option><option>terraza</option><option>ventana</option><option>VIP</option>
          </select>
          <button className="btn">Agregar mesa</button>
        </form>
      </div>

      <AdminTable titulo="Mis restaurantes" datos={restaurantes} onDelete={(id) => eliminar('mis-restaurantes', id)} columnas={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'estado', label: 'Estado' },
        { key: 'telefonoContacto', label: 'Telefono' }
      ]} />
      <AdminTable titulo="Sucursales" datos={sucursales} onDelete={(id) => eliminar('sucursales', id)} columnas={[
        { key: 'restaurante', label: 'Restaurante' },
        { key: 'nombre', label: 'Sucursal' },
        { key: 'direccion', label: 'Direccion' }
      ]} />
      <AdminTable titulo="Reservas recibidas" datos={reservas} columnas={[
        { key: 'usuario', label: 'Usuario', render: (r) => r.Usuario?.nombre || r.Cliente?.nombre },
        { key: 'fecha', label: 'Fecha' },
        { key: 'hora', label: 'Hora' },
        { key: 'estado', label: 'Estado' }
      ]} />
    </section>
  );
}
