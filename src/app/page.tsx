import { ConsultaLoa2027Form } from "@/components/ConsultaLoa2027Form";
import { consultaEncerrada } from "@/lib/consultaLoa2027Questoes";

export const dynamic = "force-dynamic";

export default function ConsultaLoa2027Page() {
  const encerrada = consultaEncerrada();

  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <p className="text-sm font-bold uppercase leading-tight">Prefeitura Municipal de Várzea/RN</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Participação Cidadã</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Consulta Pública Eletrônica — LOA 2027</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">Prazo para participar: até 30/09/2026</p>

        <p className="mt-4 text-slate-600">
          Este questionário tem como finalidade ouvir a população para identificar prioridades, problemas,
          carências e sugestões que subsidiem a elaboração da Lei Orçamentária Anual (LOA) para o exercício de
          2027. A LOA é o instrumento legal que estima a receita e fixa a despesa do Município para o ano
          seguinte, de forma compatível com as metas e prioridades já definidas na Lei de Diretrizes
          Orçamentárias (LDO) 2027 e no Plano Plurianual (PPA) vigente.
        </p>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Atenção:</strong> as sugestões e prioridades aqui coletadas serão consideradas dentro da
          capacidade fiscal do Município e das metas e prioridades já estabelecidas na LDO 2027, em observância
          ao equilíbrio entre receitas e despesas do Município.
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Os dados pessoais fornecidos neste formulário estão protegidos pela Lei Geral de Proteção de Dados
          Pessoais (LGPD), Lei Federal nº 13.709/2018, e serão utilizados exclusivamente para fins de
          identificação do perfil dos participantes desta consulta pública.
        </div>

        <div className="mt-8">
          {encerrada ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-2xl">🗓️</p>
              <h2 className="mt-2 text-lg font-bold text-slate-900">Prazo de participação encerrado</h2>
              <p className="mt-1 text-sm text-slate-600">
                O prazo para responder a esta consulta pública encerrou em 30/09/2026. Agradecemos a
                participação de todos os cidadãos que contribuíram para a elaboração da LOA 2027.
              </p>
            </div>
          ) : (
            <ConsultaLoa2027Form />
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Prefeitura Municipal de Várzea/RN — Consulta Pública LOA 2027
      </footer>
    </div>
  );
}
