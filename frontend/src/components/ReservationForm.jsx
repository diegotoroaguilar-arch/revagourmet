export default function ReservationForm({ datos, setDatos, onSubmit, cargando, usuario }) {
  return (
    <form className="panel form-grid" onSubmit={onSubmit}>
      <h3>Confirmar reserva</h3>
      <div className="user-chip span-2">
        <strong>{usuario?.nombre}</strong>
        <span>{usuario?.correo}</span>
      </div>
      <label>
        Telefono de contacto
        <input value={datos.telefonoContacto} onChange={(e) => setDatos({ ...datos, telefonoContacto: e.target.value })} required />
      </label>
      <label className="span-2">
        Comentarios especiales
        <textarea value={datos.comentarios} onChange={(e) => setDatos({ ...datos, comentarios: e.target.value })} />
      </label>
      <button className="btn span-2" disabled={cargando}>{cargando ? 'Confirmando...' : 'Confirmar reserva'}</button>
    </form>
  );
}
