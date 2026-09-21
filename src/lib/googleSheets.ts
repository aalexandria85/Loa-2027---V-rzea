import { google } from "googleapis";
import { CABECALHO_PLANILHA, linhaPlanilha, Respostas } from "./consultaLoa2027Questoes";

const NOME_ABA = process.env.GOOGLE_SHEETS_TAB_NAME || "Respostas";

function getConfig() {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const chave = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!email || !chave || !spreadsheetId) {
    throw new Error(
      "Integração com o Google Sheets não configurada (GOOGLE_SHEETS_CLIENT_EMAIL / GOOGLE_SHEETS_PRIVATE_KEY / GOOGLE_SHEETS_SPREADSHEET_ID)"
    );
  }
  const chaveLimpa = chave.trim().replace(/^"([\s\S]*)"$/, "$1").replace(/\\n/g, "\n");
  return { email, chave: chaveLimpa, spreadsheetId };
}

function getSheetsClient(email: string, chave: string) {
  const auth = new google.auth.JWT({
    email,
    key: chave,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function garantirAba(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string): Promise<void> {
  const planilha = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });
  const existe = planilha.data.sheets?.some((s) => s.properties?.title === NOME_ABA);
  if (!existe) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: NOME_ABA } } }] },
    });
  }
}

async function garantirCabecalho(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string): Promise<void> {
  await garantirAba(sheets, spreadsheetId);

  const atual = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${NOME_ABA}!A1:A1`,
  });
  if (!atual.data.values || atual.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${NOME_ABA}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [CABECALHO_PLANILHA] },
    });
  }
}

/**
 * Grava uma resposta da Consulta LOA 2027 na planilha Google configurada.
 * Aqui a planilha É a fonte de verdade (não há banco de dados nesta aplicação),
 * então uma falha é propagada para o chamador tratar/reportar ao cidadão.
 */
export async function registrarRespostaNaPlanilha(id: string, createdAtIso: string, respostas: Respostas): Promise<void> {
  const config = getConfig();
  const sheets = getSheetsClient(config.email, config.chave);
  await garantirCabecalho(sheets, config.spreadsheetId);

  const linha = linhaPlanilha(id, createdAtIso, respostas);
  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${NOME_ABA}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [linha] },
  });
}
