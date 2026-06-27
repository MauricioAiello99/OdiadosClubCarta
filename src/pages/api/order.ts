import type { APIRoute } from 'astro';
import { getAuthenticatedDoc, getOrCreateDailySheet } from '../../lib/sheets';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { items, deliveryMethod } = body;

    const doc = await getAuthenticatedDoc();
    const sheet = await getOrCreateDailySheet(doc);

    const orderId = `OD-${Math.floor(Math.random() * 10000)}`;
    const date = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    const calculatedTotal = items.reduce((acc: number, item: any) => {
      return acc + (Number(item.price) * Number(item.quantity));
    }, 0);

    const itemsDetail = items.map((i: any) => `${i.quantity}x ${i.name}`).join('\n');

    await sheet.addRow({
      ID: orderId,
      Fecha: date,
      Detalle: itemsDetail,
      Total: `$${calculatedTotal}`,
      Estado: 'Pendiente',
      Envio: deliveryMethod || 'No especificado',
    });

    const myPhone = "5492615084928";
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

    return new Response(JSON.stringify({ success: true, redirectUrl: whatsappUrl }), { status: 200 });

  } catch (error) {
    console.error('Error Backend:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error interno al procesar pedido' }), { status: 500 });
  }
};
