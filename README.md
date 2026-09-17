# Consulta Pública Eletrônica — LOA 2027 (Várzea/RN)

Site independente e enxuto com um único formulário público (37 perguntas) para subsidiar a elaboração da
Lei Orçamentária Anual (LOA) 2027 do Município de Várzea/RN. Não há banco de dados: cada resposta enviada é
gravada diretamente numa planilha do Google Sheets, que é a única fonte de verdade dos dados coletados.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha as 4 variáveis (veja abaixo)
npm run dev
```

## Configuração do Google Sheets

1. Crie/reaproveite um projeto no [Google Cloud Console](https://console.cloud.google.com/) e ative a **Google Sheets API**.
2. Crie uma **conta de serviço** (Service Account) em APIs e Serviços → Credenciais.
3. Gere uma chave JSON para essa conta de serviço.
4. Crie a planilha no Google Sheets, copie o ID dela na URL, e compartilhe a planilha com o e-mail da conta de
   serviço (`client_email` do JSON) com permissão de **Editor**.
5. Configure as variáveis de ambiente (`.env.local` local, ou nas Environment Variables do Vercel em produção):
   - `GOOGLE_SHEETS_CLIENT_EMAIL` → campo `client_email` do JSON
   - `GOOGLE_SHEETS_PRIVATE_KEY` → campo `private_key` do JSON
   - `GOOGLE_SHEETS_SPREADSHEET_ID` → ID da planilha
   - `GOOGLE_SHEETS_TAB_NAME` → nome da aba onde as respostas serão gravadas (padrão: `Respostas`; criada
     automaticamente na primeira resposta, se ainda não existir)

Sem essas variáveis configuradas, o envio de respostas falha (não há fallback — a planilha é a única
persistência desta aplicação).

## Deploy

Aplicação Next.js padrão, pronta para deploy na Vercel. Configure as 4 variáveis de ambiente acima em
Settings → Environment Variables do projeto Vercel antes do primeiro deploy.
