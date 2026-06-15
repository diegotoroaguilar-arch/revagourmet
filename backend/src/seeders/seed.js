const bcrypt = require('bcryptjs');
const { Restaurante, Sucursal, Mesa, Cliente, Reserva, Usuario } = require('../models');

const telefono = '77591720';

const restaurantesBase = [
  {
    nombre: 'La Suisse',
    descripcion: 'Cocina suiza e internacional de alta gama, carnes, fondue y platos europeos. Destaca por su vista panoramica desde el piso 38.',
    tipoComida: 'Suiza e internacional',
    rangoPrecio: 'Bs 150-250+',
    imagen: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    sucursales: [
      { nombre: 'La Suisse La Paz', direccion: 'Green Tower, piso 38, Gral. Inofuentes, Calacoto', ciudad: 'La Paz' },
      { nombre: 'La Suisse Santa Cruz', direccion: 'Torre Ejecutiva, piso 18', ciudad: 'Santa Cruz' }
    ]
  },
  {
    nombre: 'Fellini',
    descripcion: 'Cocina italiana con pizzas al horno de lena, pastas, ravioles, gnocchis y postres italianos.',
    tipoComida: 'Italiana',
    rangoPrecio: 'Bs 80-180',
    imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    sucursales: [{ nombre: 'Fellini San Miguel', direccion: 'Calle Gabriel Rene Moreno 1383, San Miguel', ciudad: 'La Paz' }]
  },
  {
    nombre: 'Nina',
    descripcion: 'Fusion internacional con carnes ahumadas, comida boliviana moderna, sushi, rolls, arroces y platos asiaticos.',
    tipoComida: 'Fusion internacional',
    rangoPrecio: 'Bs 120-200',
    imagen: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    sucursales: [{ nombre: 'Nina Green Tower', direccion: 'Green Tower, piso 3, Gral. Inofuentes, Calacoto', ciudad: 'La Paz' }]
  },
  {
    nombre: 'New Tokyo',
    descripcion: 'Cocina japonesa con sushi, sashimi, ramen, tempura y otros platos tradicionales.',
    tipoComida: 'Japonesa',
    rangoPrecio: 'Bs 80-160',
    imagen: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1200&q=80',
    sucursales: [{ nombre: 'New Tokyo Calacoto', direccion: 'Calle 17 No. 8048, Calacoto', ciudad: 'La Paz' }]
  },
  {
    nombre: 'Ancestral',
    descripcion: 'Alta cocina boliviana contemporanea con menus de degustacion y reinterpretaciones gourmet de ingredientes bolivianos.',
    tipoComida: 'Boliviana contemporanea',
    rangoPrecio: 'Bs 200-350+',
    imagen: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    sucursales: [{ nombre: 'Ancestral Achumani', direccion: 'Calle 10 de Achumani, Maria F. Goya #135', ciudad: 'La Paz' }]
  },
  { nombre: 'ASAU', descripcion: 'Parrilla premium y carnes.', tipoComida: 'Parrilla premium y carnes', rangoPrecio: 'Bs 100-200', imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'ASAU Calacoto', direccion: 'Calle Santiago Fajardo #123, Calacoto', ciudad: 'La Paz' }] },
  { nombre: 'Arami', descripcion: 'Alta cocina amazonica y boliviana.', tipoComida: 'Amazonica y boliviana', rangoPrecio: 'Bs 200+', imagen: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Arami San Jorge', direccion: 'Av. Aviador #77, San Jorge', ciudad: 'La Paz' }] },
  { nombre: 'Mi Chola', descripcion: 'Cocina boliviana gourmet.', tipoComida: 'Boliviana gourmet', rangoPrecio: 'Bs 200+', imagen: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Mi Chola Sopocachi', direccion: 'Pasaje Medinacelli #2228, esquina 20 de Octubre, Sopocachi', ciudad: 'La Paz' }] },
  { nombre: 'Gustu', descripcion: 'Alta cocina boliviana.', tipoComida: 'Alta cocina boliviana', rangoPrecio: 'Bs 250-450+', imagen: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Gustu Calacoto', direccion: 'Calle 10 de Calacoto #300', ciudad: 'La Paz' }] },
  { nombre: 'Yerbabuena Restaurante', descripcion: 'Cocina internacional, saludable y fusion.', tipoComida: 'Internacional saludable', rangoPrecio: 'Bs 80-200', imagen: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Yerbabuena Calacoto', direccion: 'Calle 16 #8009, Calacoto', ciudad: 'La Paz' }] },
  { nombre: 'Carbon & Sal', descripcion: 'Parrilla argentina.', tipoComida: 'Parrilla argentina', rangoPrecio: 'Bs 60-120', imagen: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Carbon & Sal Achumani', direccion: 'Av. Alexander esquina Calle 13 #70, Achumani', ciudad: 'La Paz' }] },
  { nombre: 'Imilla Alzada', descripcion: 'Pizzas artesanales y cocina boliviana moderna.', tipoComida: 'Pizzas y boliviana moderna', rangoPrecio: 'Bs 40-120', imagen: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Imilla Alzada Cota Cota', direccion: 'Calle Alvarez Plata No. 50, Cota Cota', ciudad: 'La Paz' }] },
  { nombre: 'FUEGO Parrilla Experience', descripcion: 'Parrilla y carnes premium.', tipoComida: 'Parrilla y carnes premium', rangoPrecio: 'Bs 80-200', imagen: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'FUEGO Zona Sur', direccion: 'Calle Adolfo Gonzales No. 27, Zona Sur', ciudad: 'La Paz' }] },
  { nombre: 'Hard Rock Cafe', descripcion: 'Cocina americana con hamburguesas, costillas BBQ, alitas, sandwiches y cocteles en un ambiente inspirado en musica rock.', tipoComida: 'Americana', rangoPrecio: 'Bs 80-180', imagen: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Hard Rock Cafe Calacoto', direccion: 'El Bosque Boulevard, Calle 15 de Calacoto', ciudad: 'La Paz' }] },
  { nombre: 'La Casa del Camba', descripcion: 'Comida tipica del oriente boliviano con majao, keperi, locro y preparaciones de carne.', tipoComida: 'Oriente boliviano', rangoPrecio: 'Bs 80-180', imagen: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'La Casa del Camba Calacoto', direccion: 'El Bosque Boulevard, Calle 15 de Calacoto', ciudad: 'La Paz' }] },
  { nombre: 'Popular Cocina Boliviana', descripcion: 'Cocina boliviana contemporanea con recetas tradicionales, tecnicas modernas y presentaciones cuidadas.', tipoComida: 'Boliviana contemporanea', rangoPrecio: 'Bs 120-250', imagen: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Popular Casco Viejo', direccion: 'Calle Linares, Casco Viejo', ciudad: 'La Paz' }] },
  { nombre: 'Ali Pacha', descripcion: 'Alta cocina vegana basada en ingredientes bolivianos transformados en platos innovadores y elegantes.', tipoComida: 'Vegana de autor', rangoPrecio: 'Bs 180-350+', imagen: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Ali Pacha Centro', direccion: 'Calle Colon, Centro de La Paz', ciudad: 'La Paz' }] },
  { nombre: 'Phayawi', descripcion: 'Cocina boliviana de autor con ingredientes andinos y sabores tradicionales mediante tecnicas contemporaneas.', tipoComida: 'Boliviana de autor', rangoPrecio: 'Bs 150-300', imagen: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', sucursales: [{ nombre: 'Phayawi Achumani', direccion: 'Achumani Calle 22, Zona Sur', ciudad: 'La Paz' }] }
];

async function crearUsuario(correo, nombre, password, rol) {
  const hash = await bcrypt.hash(password, 10);
  const [usuario] = await Usuario.findOrCreate({
    where: { correo },
    defaults: { nombre, correo, password: hash, rol }
  });
  await usuario.update({ nombre, rol });
  return usuario;
}

async function cargarDatos() {
  await crearUsuario('admin@reservaprime.com', 'Administrador RevaGourmet', 'admin123', 'admin');
  await crearUsuario('admin@revagourmet.com', 'Administrador RevaGourmet', 'admin123', 'admin');
  const usuarioDemo = await crearUsuario('usuario@revagourmet.com', 'Usuario Demo', 'usuario123', 'usuario');
  const propietarioDemo = await crearUsuario('propietario@revagourmet.com', 'Propietario Demo', 'propietario123', 'propietario');

  for (const datos of restaurantesBase) {
    const [restaurante] = await Restaurante.findOrCreate({
      where: { nombre: datos.nombre },
      defaults: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        tipoComida: datos.tipoComida,
        rangoPrecio: datos.rangoPrecio,
        imagen: datos.imagen,
        telefonoContacto: telefono,
        correoContacto: `contacto@${datos.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
        propietarioId: propietarioDemo.id,
        estado: 'aprobado'
      }
    });
    await restaurante.update({
      descripcion: datos.descripcion,
      tipoComida: datos.tipoComida,
      rangoPrecio: datos.rangoPrecio,
      imagen: datos.imagen,
      telefonoContacto: telefono,
      correoContacto: restaurante.correoContacto || `contacto@${datos.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
      propietarioId: restaurante.propietarioId || propietarioDemo.id,
      estado: restaurante.estado || 'aprobado'
    });

    for (const sucursalDatos of datos.sucursales) {
      const [sucursal] = await Sucursal.findOrCreate({
        where: { restauranteId: restaurante.id, nombre: sucursalDatos.nombre },
        defaults: {
          restauranteId: restaurante.id,
          ...sucursalDatos,
          horarioApertura: '18:00',
          horarioCierre: '23:30',
          telefono,
          estado: true
        }
      });
      await sucursal.update({ ...sucursalDatos, telefono });

      for (let m = 1; m <= 8; m++) {
        await Mesa.findOrCreate({
          where: { sucursalId: sucursal.id, numero: m },
          defaults: {
            sucursalId: sucursal.id,
            numero: m,
            capacidad: [2, 4, 4, 6, 2, 8, 6, 10][m - 1],
            zona: ['interior', 'terraza', 'ventana', 'VIP'][(m - 1) % 4],
            estado: true
          }
        });
      }
    }
  }

  const reservaDemo = await Reserva.findOne({ where: { usuarioId: usuarioDemo.id, fecha: '2026-06-20', hora: '20:00' } });
  if (!reservaDemo) {
    const [cliente] = await Cliente.findOrCreate({
      where: { correo: usuarioDemo.correo },
      defaults: { nombre: usuarioDemo.nombre, telefono, correo: usuarioDemo.correo }
    });
    const mesaDemo = await Mesa.findOne();
    await Reserva.create({
      usuarioId: usuarioDemo.id,
      clienteId: cliente.id,
      mesaId: mesaDemo.id,
      fecha: '2026-06-20',
      hora: '20:00',
      cantidadPersonas: 2,
      telefonoContacto: telefono,
      comentarios: 'Mesa tranquila para aniversario',
      estado: 'confirmada'
    });
  }

  await Sucursal.update({ telefono }, { where: {} });
  await Restaurante.update({ telefonoContacto: telefono }, { where: {} });
}

module.exports = cargarDatos;
