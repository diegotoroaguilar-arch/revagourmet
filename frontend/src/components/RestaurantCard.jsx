import { Link } from 'react-router-dom';
import { MapPin, Utensils } from 'lucide-react';

export default function RestaurantCard({ restaurante }) {
  return (
    <article className="restaurant-card">
      <img src={restaurante.imagen} alt={restaurante.nombre} />
      <div className="card-body">
        <div className="card-topline">
          <span>{restaurante.rangoPrecio}</span>
          <span>{restaurante.estado ? 'Activo' : 'Inactivo'}</span>
        </div>
        <h3>{restaurante.nombre}</h3>
        <p>{restaurante.descripcion}</p>
        <div className="meta-row">
          <span><Utensils size={16} /> {restaurante.tipoComida}</span>
          <span><MapPin size={16} /> Premium</span>
        </div>
        <Link className="btn full" to={`/restaurantes/${restaurante.id}/sucursales`}>
          Ver sucursales
        </Link>
      </div>
    </article>
  );
}
