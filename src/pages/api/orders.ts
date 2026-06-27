import type { APIRoute } from 'astro';
import { getAuthenticatedDoc, getOrCreateDailySheet } from '../../lib/sheets';

export const GET: APIRoute = async () => {
  const doc = await getAuthenticatedDoc();
  const sheet = await getOrCreateDailySheet(doc);
  const rows = await sheet.getRows();

  const pending = rows
    .filter(row => row.get('Estado') === 'Pendiente')
    .map(row => ({
      rowIndex: row.rowNumber,
      id: row.get('ID'),
      fecha: row.get('Fecha'),
      detalle: row.get('Detalle'),
      total: row.get('Total'),
      envio: row.get('Envio'),
    }));

  return new Response(JSON.stringify({ orders: pending }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
