import { createPrivateKey } from "node:crypto";
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
  const chaveBruta = chave
    .trim()
    .replace(/^"([\s\S]*)"$/, "$1")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  // O OpenSSL 3 usado no runtime do Vercel é, por vezes, mais estrito que o local ao
  // interpretar a string PEM diretamente. Reanalisar e reexportar a chave via crypto do
  // Node normaliza a codificação antes de repassá-la ao google-auth-library.
  let chaveLimpa: string;
  try {
    chaveLimpa = createPrivateKey(chaveBruta).export({ type: "pkcs8", format: "pem" }).toString();
  } catch (err) {
    console.error("[consultaLoa2027][diag] falha ao normalizar a chave privada com node:crypto:", err);
    throw new Error("Chave privada do Google Sheets em formato inválido (falha ao normalizar via crypto)");
  }

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
