import { google } from "googleapis";
import { CABECALHO_PLANILHA, linhaPlanilha, Respostas } from "./consultaLoa2027Questoes";

const NOME_ABA = process.env.GOOGLE_SHEETS_TAB_NAME || "Respostas";

interface ContaServico {
  client_email: string;
  private_key: string;
}

function getConfig() {
  const jsonBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!jsonBase64 || !spreadsheetId) {
    throw new Error(
      "Integração com o Google Sheets não configurada (GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 / GOOGLE_SHEETS_SPREADSHEET_ID)"
    );
  }

  // Guardar o JSON inteiro da conta de serviço em Base64 evita qualquer corrupção de
  // aspas, quebras de linha ou caracteres invisíveis que costuma ocorrer ao colar uma
  // chave PEM multi-linha diretamente em variáveis de ambiente de painéis como o Vercel.
  let conta: ContaServico;
  try {
    const jsonTexto = Buffer.from(jsonBase64.trim(), "base64").toString("utf8");
    conta = JSON.parse(jsonTexto);
  } catch (err) {
    console.error("[consultaLoa2027][diag] falha ao decodificar GOOGLE_SERVICE_ACCOUNT_JSON_BASE64:", err);
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 inválida (não decodifica para um JSON de conta de serviço)");
  }
  if (!conta.client_email || !conta.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 não contém client_email/private_key");
  }

  return { email: conta.client_email, chave: conta.private_key, spreadsheetId };
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
