import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializa Resend con tu clave API (asegúrate de tenerla en tu .env.local)
const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Nota: 'onboarding@resend.dev' solo funciona para correos de prueba hacia la cuenta registrada.
    // Cambia esto por tu propio dominio verificado y ajusta el 'to' al correo donde quieres recibir.
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      // Agrega tu correo personal y el de tu dominio separados por comas
      to: ['randy6grullon@gmail.com', 'randygrullon@grullonb.com'], 
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al enviar email:", error);
    return NextResponse.json({ error: 'Hubo un error enviando el correo' }, { status: 500 });
  }
}
