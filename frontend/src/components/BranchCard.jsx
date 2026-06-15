import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone } from 'lucide-react';

export default function BranchCard({ sucursal }) {
  return (
    <article className="panel branch-card">
      <h3>{sucursal.nombre}</h3>
      <p><MapPin size={17} /> {sucursal.direccion}, {sucursal.ciudad}</p>
      <p><Clock size={17} /> {sucursal.horarioApertura} - {sucursal.horarioCierre}</p>
      <p><Phone size={17} /> {sucursal.telefono}</p>
      <Link className="btn" to={`/reservar/${sucursal.id}`}>Reservar</Link>
    </article>
  );
}
