import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import BranchCard from '../components/BranchCard.jsx';

export default function Sucursales() {
  const { restauranteId } = useParams();
  const [sucursales, setSucursales] = useState([]);
  const [restaurante, setRestaurante] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(`/restaurantes/${restauranteId}`),
      api.get(`/sucursales/restaurante/${restauranteId}`)
    ]).then(([restauranteRes, sucursalesRes]) => {
      setRestaurante(restauranteRes.data);
      setSucursales(sucursalesRes.data);
    }).catch(console.error);
  }, [restauranteId]);

  return (
    <section className="page">
      <div className="section-heading">
        <span className="eyebrow">Sucursales</span>
        <h2>{restaurante?.nombre || 'Restaurante'}</h2>
      </div>
      <div className="grid-2">
        {sucursales.map((sucursal) => <BranchCard key={sucursal.id} sucursal={sucursal} />)}
      </div>
    </section>
  );
}
