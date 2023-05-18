import nodemailer from 'nodemailer'
export const enviarEmail = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const info = await transport.sendMail({
    from: ' "Jonathan Torres - Administrador TASK" jonathan.torresmald@gmail.com',
    to: email,
    subject: 'TASK - Confirma tu Cuenta',
    text: 'Confirma tu cuenta',
    html: `
            <p>Hola ${nombre}, Confirma tu cuenta</p>
            <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>
            <a href='${process.env.FRONTEND_URL}/confirmar/${token}'>Confirmar Cuenta</a>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
  })
}

export const enviarEmailPassword = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const info = await transport.sendMail({
    from: ' "Jonathan Torres - Administrador TASK" jonathan.torresmald@gmail.com',
    to: email,
    subject: 'TASK - Resetea tu Password',
    text: 'Resetea tu Password',
    html: `
          <p>Hola ${nombre}, has solicitado resetear el password</p>
          <p>Para resetear tu password, solo debes hacer click en el siguiente enlace:</p>
          <a href='${process.env.FRONTEND_URL}/forgot-password/${token}'>Resetear Password</a>
          <p>Si tu hiciste esta petición, puedes ignorar el mensaje</p>
      `
  })
}