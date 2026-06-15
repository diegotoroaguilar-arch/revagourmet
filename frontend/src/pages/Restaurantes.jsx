import { useEffect, useState } from 'react';
import api from '../services/api';
import RestaurantCard from '../components/RestaurantCard.jsx';

export default function Restaurantes() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/restaurantes')
      .then((res) => setRestaurantes(res.data))
      .catch(console.error)
      .finally(() => setCargando(false));
  }, []);

  return (
    <section className="page">
      <div className="section-heading">
        <span className="eyebrow">Seleccion curada</span>
        <h2>Restaurantes exclusivos</h2>
      </div>
      {cargando ? <p>Cargando restaurantes...</p> : <div className="restaurant-grid">{restaurantes.map((r) => <RestaurantCard key={r.id} restaurante={r} />)}</div>}
    </section>
  );
}
