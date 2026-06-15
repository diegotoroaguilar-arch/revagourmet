import { useEffect, useState } from 'react';
import { Building2, CalendarDays, CheckCircle2, Table2 } from 'lucide-react';
import api from '../services/api';
import AdminTable from '../components/AdminTable.jsx';

const restaurantEmpty = { nombre: '', descripcion: '', tipoComida: '', rangoPrecio: '$$$$', imagen: '', estado: true };
const branchEmpty = { restauranteId: '', nombre: '', direccion: '', ciudad: '', horarioApertura: '18:00', horarioCierre: '23:30', telefono: '', estado: true };
const tableEmpty = { sucursalId: '', numero: '', capacidad: 4, zona: 'interior', estado: true };

export default function Admin() {
  const [stats, setStats] = useState({});
  const [restaurantes, setRestaurantes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [restaurantForm, setRestaurantForm] = useState(restaurantEmpty);
  const [branchForm, setBranchForm] = useState(branchEmpty);
  const [tableForm, setTableForm] = useState(tableEmpty);

  function cargar() {
    Promise.all([
      api.get('/dashboard/estadisticas'),
      api.get('/restaurantes'),
      api.get('/sucursales'),
      api.get('/mesas'),
      api.get('/reservas'),
      api.get('/admin/restaurantes-pendientes')
    ]).then(([st, re, su, me, rs, pe]) => {
      setStats(st.data);
      setRestaurantes(re.data);
      setSucursales(su.data);
      setMesas(me.data);
      setReservas(rs.data);
      setPendientes(pe.data);
    });
  }

  useEffect(() => { cargar(); }, []);

  async function crearRestaurante(e) {
    e.preventDefault();
    await api.post('/restaurantes', restaurantForm);
    setRestaurantForm(restaurantEmpty);
    cargar();
  }

  async function crearSucursal(e) {
    e.preventDefault();
    await api.post('/sucursales', branchForm);
    setBranchForm(branchEmpty);
    cargar();
  }

  async function crearMesa(e) {
    e.preventDefault();
    await api.post('/mesas', tableForm);
    setTableForm(tableEmpty);
    cargar();
  }

  async function eliminar(ruta, id) {
    await api.delete(`/${ruta}/${id}`);
    cargar();
  }

  async function cambiarEstado(id, accion) {
    await api.put(`/admin/restaurantes/${id}/${accion}`);
    cargar();
  }

  const cards = [
    ['Total reservas', stats.totalReservas, CalendarDays],
    ['Reservas activas', stats.reservasActivas, CheckCircle2],
    ['Restaurantes', stats.restaurantes, Building2],
    ['Mesas disponibles', stats.mesasDisponibles, Table2]
  ];

  return (
    <section className="page admin-page">
      <div className="section-heading">
        <span className="eyebrow">Control</span>
        <h2>Panel administrador</h2>
      </div>

      <div className="stats-grid">
        {cards.map(([label, value, Icon]) => (
          <div className="stat-card" key={label}>
            <Icon size={24} />
            <span>{label}</span>
            <strong>{value ?? 0}</strong>
          </div>
        ))}
      </div>

      <div className="admin-forms">
        <form className="panel mini-form" onSubmit={crearRestaurante}>
          <h3>Nuevo restaurante</h3>
          <input placeholder="Nombre" value={restaurantForm.nombre} onChange={(e) => setRestaurantForm({ ...restaurantForm, nombre: e.target.value })} required />
          <input placeholder="Tipo de comida" value={restaurantForm.tipoComida} onChange={(e) => setRestaurantForm({ ...restaurantForm, tipoComida: e.target.value })} required />
          <input placeholder="Rango precio" value={restaurantForm.rangoPrecio} onChange={(e) => setRestaurantForm({ ...restaurantForm, rangoPrecio: e.target.value })} required />
          <input placeholder="URL imagen" value={restaurantForm.imagen} onChange={(e) => setRestaurantForm({ ...restaurantForm, imagen: e.target.value })} required />
          <textarea placeholder="Descripcion" value={restaurantForm.descripcion} onChange={(e) => setRestaurantForm({ ...restaurantForm, descripcion: e.target.value })} required />
          <button className="btn">Crear</button>
        </form>

        <form className="panel mini-form" onSubmit={crearSucursal}>
          <h3>Nueva sucursal</h3>
          <select value={branchForm.restauranteId} onChange={(e) => setBranchForm({ ...branchForm, restauranteId: e.target.value })} required>
            <option value="">Restaurante</option>
            {restaurantes.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
          <input placeholder="Nombre" value={branchForm.nombre} onChange={(e) => setBranchForm({ ...branchForm, nombre: e.target.value })} required />
          <input placeholder="Direccion" value={branchForm.direccion} onChange={(e) => setBranchForm({ ...branchForm, direccion: e.target.value })} required />
          <input placeholder="Ciudad" value={branchForm.ciudad} onChange={(e) => setBranchForm({ ...branchForm, ciudad: e.target.value })} required />
          <input placeholder="Telefono" value={branchForm.telefono} onChange={(e) => setBranchForm({ ...branchForm, telefono: e.target.value })} required />
          <button className="btn">Crear</button>
        </form>

        <form className="panel mini-form" onSubmit={crearMesa}>
          <h3>Nueva mesa</h3>
          <select value={tableForm.sucursalId} onChange={(e) => setTableForm({ ...tableForm, sucursalId: e.target.value })} required>
            <option value="">Sucursal</option>
            {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
          <input placeholder="Numero" type="number" value={tableForm.numero} onChange={(e) => setTableForm({ ...tableForm, numero: e.target.value })} required />
          <input placeholder="Capacidad" type="number" value={tableForm.capacidad} onChange={(e) => setTableForm({ ...tableForm, capacidad: e.target.value })} required />
          <select value={tableForm.zona} onChange={(e) => setTableForm({ ...tableForm, zona: e.target.value })}>
            <option>interior</option><option>terraza</option><option>ventana</option><option>VIP</option>
          </select>
          <button className="btn">Crear</button>
        </form>
      </div>

      <AdminTable titulo="Restaurantes" datos={restaurantes} onDelete={(id) => eliminar('restaurantes', id)} columnas={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'tipoComida', label: 'Comida' },
        { key: 'rangoPrecio', label: 'Precio' }
      ]} />
      <section className="panel admin-section">
        <h3>Restaurantes pendientes</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nombre</th><th>Comida</th><th>Telefono</th><th>Accion</th></tr></thead>
            <tbody>
              {pendientes.map((r) => (
                <tr key={r.id}>
                  <td>{r.nombre}</td>
                  <td>{r.tipoComida}</td>
                  <td>{r.telefonoContacto}</td>
                  <td className="table-actions">
                    <button className="btn" onClick={() => cambiarEstado(r.id, 'aprobar')}>Aprobar</button>
                    <button className="ghost danger" onClick={() => cambiarEstado(r.id, 'rechazar')}>Rechazar</button>
                  </td>
                </tr>
              ))}
              {!pendientes.length && <tr><td colSpan="4">No hay restaurantes pendientes.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <AdminTable titulo="Sucursales" datos={sucursales} onDelete={(id) => eliminar('sucursales', id)} columnas={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'ciudad', label: 'Ciudad' },
        { key: 'telefono', label: 'Telefono' }
      ]} />
      <AdminTable titulo="Mesas" datos={mesas} onDelete={(id) => eliminar('mesas', id)} columnas={[
        { key: 'numero', label: 'Mesa' },
        { key: 'capacidad', label: 'Capacidad' },
        { key: 'zona', label: 'Zona' }
      ]} />
      <AdminTable titulo="Reservas" datos={reservas} columnas={[
        { key: 'cliente', label: 'Usuario', render: (r) => r.Usuario?.nombre || r.Cliente?.nombre },
        { key: 'fecha', label: 'Fecha' },
        { key: 'hora', label: 'Hora' },
        { key: 'estado', label: 'Estado' }
      ]} />
    </section>
  );
}
