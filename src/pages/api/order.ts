import type { APIRoute } from 'astro';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    // Recibimos la lista de productos y el método de envío (Delivery/Take Away)
    const { items, deliveryMethod } = body; 

    // 1. Autenticación con Google
    const privateKey = import.meta.env.GOOGLE_PRIVATE_KEY
      ? import.meta.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const serviceAccountAuth = new JWT({
      email: import.meta.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(import.meta.env.GOOGLE_SHEET_ID, serviceAccountAuth);

    // 2. Cargar hoja
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // 3. Preparar datos
    const orderId = `OD-${Math.floor(Math.random() * 10000)}`;
    const date = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    const calculatedTotal = items.reduce((acc: number, item: any) => {
        return acc + (Number(item.price) * Number(item.quantity));
    }, 0);

    const itemsDetail = items.map((i: any) => `${i.quantity}x ${i.name}`).join('\n');

    // 4. Guardar en Google Sheets
    await sheet.addRow([
      orderId,
      date,
      itemsDetail,
      `$${calculatedTotal}`,
      'Pendiente',
      deliveryMethod || 'No especificado'
    ]);

    // 5. Generar Mensaje de WhatsApp
    const myPhone = "5492615084928"; 
    
    // Elegimos el ícono según el método
    const deliveryIcon = deliveryMethod === 'Delivery' ? '🛵' : '🥡';
    const deliveryText = deliveryMethod === 'Delivery' ? 'ENVÍO A DOMICILIO' : 'RETIRO POR LOCAL (TAKE AWAY)';

    const message = 
      `💀 *NUEVO PEDIDO BLACKLIST* 💀\n\n` +
      `Hola Odiados! Aquí los detalles de mi pedido *#${orderId}*.\n` +
      `${deliveryIcon} *${deliveryText}*\n\n` +
      `🔥 *EL MENÚ:*\n` +
      `${itemsDetail}\n\n` +
      `💰 *TOTAL: $${calculatedTotal}*\n\n` +
      `_Espero confirmación para pagar._`;

    const whatsappUrl = `https://wa.me/${myPhone}?text=${encodeURIComponent(message)}`;

    // 6. Responder al Frontend con éxito y el link
    return new Response(JSON.stringify({ 
      success: true, 
      redirectUrl: whatsappUrl 
    }), { status: 200 });

  } catch (error) {
    console.error('Error Backend:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Error interno al procesar pedido' 
    }), { status: 500 });
  }
}