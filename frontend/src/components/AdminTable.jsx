export default function AdminTable({ titulo, columnas, datos, onDelete }) {
  return (
    <section className="panel admin-section">
      <h3>{titulo}</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columnas.map((columna) => <th key={columna.key}>{columna.label}</th>)}
              {onDelete && <th>Accion</th>}
            </tr>
          </thead>
          <tbody>
            {datos.map((item) => (
              <tr key={item.id}>
                {columnas.map((columna) => <td key={columna.key}>{columna.render ? columna.render(item) : item[columna.key]}</td>)}
                {onDelete && <td><button className="ghost danger" onClick={() => onDelete(item.id)}>Eliminar</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
