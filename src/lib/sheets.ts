import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_HEADERS = ['ID', 'Fecha', 'Detalle', 'Total', 'Estado', 'Envio'];

export function getTodaySheetName(): string {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date()).replace(/\//g, '-');
}

export async function getAuthenticatedDoc(): Promise<GoogleSpreadsheet> {
  const privateKey = import.meta.env.GOOGLE_PRIVATE_KEY
    ? import.meta.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  const auth = new JWT({
    email: import.meta.env.GOOGLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(import.meta.env.GOOGLE_SHEET_ID, auth);
  await doc.loadInfo();
  return doc;
}

export async function getOrCreateDailySheet(doc: GoogleSpreadsheet) {
  const name = getTodaySheetName();
  let sheet = doc.sheetsByTitle[name];
  if (!sheet) {
    sheet = await doc.addSheet({ title: name, headerValues: SHEET_HEADERS });
  }
  return sheet;
}
