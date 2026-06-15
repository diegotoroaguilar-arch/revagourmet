import { Link } from 'react-router-dom';
import { CalendarCheck, Crown, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="eyebrow"><Crown size={16} /> Reservas gastronomicas premium</span>
        <h1>RevaGourmet</h1>
        <p>Elige restaurantes exclusivos, inicia sesion, selecciona la mesa perfecta y confirma tu reserva con una experiencia premium.</p>
        <div className="hero-actions">
          <Link className="btn" to="/restaurantes"><Sparkles size={18} /> Explorar restaurantes</Link>
          <Link className="ghost" to="/mis-reservas"><CalendarCheck size={18} /> Ver mis reservas</Link>
        </div>
      </div>
    </section>
  );
}
