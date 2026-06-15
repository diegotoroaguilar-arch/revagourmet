const nodemailer = require('nodemailer');

const copiaReservas = 'diegotoroaguilar@gmail.com';

function smtpConfigurado() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function crearTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function resumenReserva(reserva) {
  const restaurante = reserva.Mesa?.Sucursal?.Restaurante?.nombre || 'Restaurante';
  const sucursal = reserva.Mesa?.Sucursal?.nombre || 'Sucursal';
  const mesa = reserva.Mesa?.numero || '';
  const nombre = reserva.Usuario?.nombre || reserva.Cliente?.nombre || 'cliente';
  const fecha = new Date(`${reserva.fecha}T00:00:00`).toLocaleDateString('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return {
    subject: 'Confirmacion de tu reserva',
    text: [
      `Gracias ${nombre}!`,
      '',
      'Tu reserva ya ha sido recibida por el restaurante.',
      `Puedes comunicarte con ${restaurante} usando el telefono ${reserva.telefonoContacto}.`,
      '',
      `Restaurante: ${restaurante}`,
      `Sucursal: ${sucursal}`,
      `Mesa: ${mesa}`,
      `Fecha: ${fecha}`,
      `Hora: ${reserva.hora}`,
      `Personas: ${reserva.cantidadPersonas}`,
      `Telefono: ${reserva.telefonoContacto}`,
      `Comentarios: ${reserva.comentarios || 'Sin comentarios'}`,
      '',
      'Gracias por usar RevaGourmet.'
    ].join('\n'),
    html: `
      <div style="margin:0 auto;max-width:620px;background:#ffffff;font-family:Arial,sans-serif;color:#2b2b2b">
        <div style="background:#f4f4f4;padding:34px 24px;text-align:center">
          <div style="display:inline-block;width:74px;height:74px;border-radius:50%;background:#d8b15d;color:#111;font-size:42px;font-weight:800;line-height:74px">R</div>
          <h1 style="margin:22px 0 0;font-size:30px;color:#222">Confirmacion de tu reserva</h1>
        </div>
        <div style="padding:34px 38px">
          <h2 style="font-size:30px;margin:0 0 22px;color:#222">Gracias ${nombre}!</h2>
          <p style="font-size:18px;line-height:1.6;margin:0 0 18px">Tu reserva ya ha sido recibida por el restaurante.</p>
          <p style="font-size:18px;line-height:1.6;margin:0 0 34px">Puedes comunicarte con <strong>${restaurante}</strong> desde RevaGourmet o al telefono <strong>${reserva.telefonoContacto}</strong>.</p>
          <table style="width:100%;border-collapse:collapse;font-size:16px">
            <thead>
              <tr>
                <th style="text-align:left;border-bottom:1px solid #ddd;padding:12px;color:#777">Detalles</th>
                <th style="text-align:left;border-bottom:1px solid #ddd;padding:12px;color:#777">Reserva</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding:12px;border-bottom:1px solid #eee">Restaurante</td><td style="padding:12px;border-bottom:1px solid #eee"><strong>${restaurante}</strong></td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #eee">Sucursal</td><td style="padding:12px;border-bottom:1px solid #eee">${sucursal}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #eee">Mesa</td><td style="padding:12px;border-bottom:1px solid #eee">${mesa}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #eee">Fecha</td><td style="padding:12px;border-bottom:1px solid #eee">${fecha}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #eee">Hora</td><td style="padding:12px;border-bottom:1px solid #eee">${reserva.hora}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #eee">Personas</td><td style="padding:12px;border-bottom:1px solid #eee">${reserva.cantidadPersonas}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #eee">Comentarios</td><td style="padding:12px;border-bottom:1px solid #eee">${reserva.comentarios || 'Sin comentarios'}</td></tr>
            </tbody>
          </table>
          <p style="margin:30px 0 0;color:#777">Gracias por usar <strong>RevaGourmet</strong>.</p>
        </div>
      </div>
    `
  };
}

async function enviarCorreoReserva(reserva) {
  const destinatarios = [reserva.Usuario?.correo, copiaReservas].filter(Boolean);
  const contenido = resumenReserva(reserva);

  if (!smtpConfigurado()) {
    console.log('Correo de reserva no enviado: configura SMTP_HOST, SMTP_USER y SMTP_PASS en .env');
    console.log(`Destinatarios previstos: ${destinatarios.join(', ')}`);
    console.log(contenido.text);
    return { enviado: false, motivo: 'SMTP no configurado' };
  }

  const transporter = crearTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: destinatarios,
    subject: contenido.subject,
    text: contenido.text,
    html: contenido.html
  });

  return { enviado: true };
}

module.exports = { enviarCorreoReserva };
