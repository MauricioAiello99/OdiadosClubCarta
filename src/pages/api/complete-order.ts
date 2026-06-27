import type { APIRoute } from 'astro';
import { getAuthenticatedDoc, getOrCreateDailySheet } from '../../lib/sheets';

export const POST: APIRoute = async ({ request }) => {
  const { rowIndex, status = 'Listo' } = await request.json();

  const doc = await getAuthenticatedDoc();
  const sheet = await getOrCreateDailySheet(doc);
  const rows = await sheet.getRows();

  const target = rows.find(r => r.rowNumber === rowIndex);
  if (!target) {
    return new Response(JSON.stringify({ success: false, error: 'Pedido no encontrado' }), { status: 404 });
  }

  target.set('Estado', status);
  await target.save();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
