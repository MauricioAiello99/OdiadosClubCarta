import type { APIRoute } from 'astro';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const POST: APIRoute = async ({ request }) => {
  const { rowIndex } = await request.json();

  const privateKey = import.meta.env.GOOGLE_PRIVATE_KEY
    ? import.meta.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  const serviceAccountAuth = new JWT({
    email: import.meta.env.GOOGLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(import.meta.env.GOOGLE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  const target = rows.find(r => r.rowNumber === rowIndex);
  if (!target) {
    return new Response(JSON.stringify({ success: false, error: 'Pedido no encontrado' }), { status: 404 });
  }

  target.set('Estado', 'Listo');
  await target.save();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
