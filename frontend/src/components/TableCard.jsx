import { Armchair } from 'lucide-react';

export default function TableCard({ mesa, seleccionada, onSelect }) {
  return (
    <button className={`table-card ${seleccionada ? 'selected' : ''}`} onClick={() => onSelect(mesa)} type="button">
      <Armchair size={24} />
      <strong>Mesa {mesa.numero}</strong>
      <span>{mesa.capacidad} personas</span>
      <small>{mesa.zona}</small>
    </button>
  );
}
