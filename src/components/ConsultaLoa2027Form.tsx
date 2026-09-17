"use client";

import { useMemo, useState } from "react";
import { QUESTOES, SECOES, Questao } from "@/lib/consultaLoa2027Questoes";

type Valor = string | string[] | Record<string, string>;
type EstadoRespostas = Record<string, Valor>;

const OPCAO_OUTRO = "Outro";

export function ConsultaLoa2027Form() {
  const [respostas, setRespostas] = useState<EstadoRespostas>({});
  const [outros, setOutros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const questoesPorSecao = useMemo(() => {
    return SECOES.map((secao) => ({
      secao,
      questoes: QUESTOES.filter((q) => q.secao === secao),
    }));
  }, []);

  function setTexto(id: string, valor: string) {
    setRespostas((atual) => ({ ...atual, [id]: valor }));
  }

  function setUnica(id: string, valor: string) {
    setRespostas((atual) => ({ ...atual, [id]: valor }));
  }

  function toggleMultipla(id: string, opcao: string, max?: number) {
    setRespostas((atual) => {
      const atuais = Array.isArray(atual[id]) ? (atual[id] as string[]) : [];
      const jaSelecionada = atuais.includes(opcao);
      if (jaSelecionada) {
        return { ...atual, [id]: atuais.filter((o) => o !== opcao) };
      }
      if (max && atuais.length >= max) return atual;
      return { ...atual, [id]: [...atuais, opcao] };
    });
  }

  function setGrade(id: string, linha: string, coluna: string) {
    setRespostas((atual) => {
      const grade = (atual[id] as Record<string, string>) ?? {};
      return { ...atual, [id]: { ...grade, [linha]: coluna } };
    });
  }

  function setOutroTexto(id: string, valor: string) {
    setOutros((atual) => ({ ...atual, [id]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const nome = respostas["q1"];
    if (typeof nome !== "string" || !nome.trim()) {
      setErro("Por favor, informe o nome completo (pergunta 1).");
      return;
    }

    const payload: Record<string, unknown> = { ...respostas };
    for (const [id, texto] of Object.entries(outros)) {
      if (texto.trim()) payload[`${id}_outro`] = texto.trim();
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Não foi possível enviar sua resposta. Tente novamente.");
      }
      setEnviado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado ao enviar.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-2xl">✅</p>
        <h2 className="mt-2 text-lg font-bold text-emerald-900">Resposta enviada com sucesso!</h2>
        <p className="mt-1 text-sm text-emerald-800">
          Agradecemos sua participação na Consulta Pública da LOA 2027. Suas contribuições serão consideradas na
          elaboração do orçamento municipal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {questoesPorSecao.map(({ secao, questoes }) => (
        <fieldset key={secao} className="rounded-xl border border-slate-200 bg-white p-6">
          <legend className="mb-4 text-base font-bold text-slate-900">{secao}</legend>
          <div className="space-y-6">
            {questoes.map((questao) => (
              <QuestaoCampo
                key={questao.id}
                questao={questao}
                valor={respostas[questao.id]}
                outroTexto={outros[questao.id] ?? ""}
                onTexto={(v) => setTexto(questao.id, v)}
                onUnica={(v) => setUnica(questao.id, v)}
                onToggleMultipla={(opcao) => toggleMultipla(questao.id, opcao, questao.maxSelecoes)}
                onGrade={(linha, coluna) => setGrade(questao.id, linha, coluna)}
                onOutroTexto={(v) => setOutroTexto(questao.id, v)}
              />
            ))}
          </div>
        </fieldset>
      ))}

      {erro && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Enviar respostas"}
      </button>
    </form>
  );
}

function QuestaoCampo({
  questao,
  valor,
  outroTexto,
  onTexto,
  onUnica,
  onToggleMultipla,
  onGrade,
  onOutroTexto,
}: {
  questao: Questao;
  valor: Valor | undefined;
  outroTexto: string;
  onTexto: (v: string) => void;
  onUnica: (v: string) => void;
  onToggleMultipla: (opcao: string) => void;
  onGrade: (linha: string, coluna: string) => void;
  onOutroTexto: (v: string) => void;
}) {
  const selecionadas = Array.isArray(valor) ? valor : [];
  const unicaSelecionada = typeof valor === "string" ? valor : "";
  const grade = valor && typeof valor === "object" && !Array.isArray(valor) ? (valor as Record<string, string>) : {};

  return (
    <div>
      <p className="text-sm font-semibold text-slate-800">
        {questao.numero}. {questao.texto}
        {questao.obrigatoria && <span className="text-red-500"> *</span>}
      </p>
      {questao.maxSelecoes && (
        <p className="mt-0.5 text-xs text-slate-400">Selecione no máximo {questao.maxSelecoes} opções.</p>
      )}

      {questao.tipo === "texto" && (
        <textarea
          className="input mt-2"
          rows={questao.numero === 1 || questao.numero === 2 || questao.numero === 6 || questao.numero === 9 ? 1 : 3}
          value={typeof valor === "string" ? valor : ""}
          onChange={(e) => onTexto(e.target.value)}
          required={questao.obrigatoria}
        />
      )}

      {questao.tipo === "unica" && (
        <div className="mt-2 space-y-1.5">
          {questao.opcoes?.map((opcao) => (
            <label key={opcao} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name={questao.id}
                value={opcao}
                checked={unicaSelecionada === opcao}
                onChange={() => onUnica(opcao)}
                className="h-4 w-4"
              />
              {opcao}
            </label>
          ))}
          {questao.temOutro && (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={questao.id}
                  value={OPCAO_OUTRO}
                  checked={unicaSelecionada === OPCAO_OUTRO}
                  onChange={() => onUnica(OPCAO_OUTRO)}
                  className="h-4 w-4"
                />
                Outro:
              </label>
              {unicaSelecionada === OPCAO_OUTRO && (
                <input
                  type="text"
                  className="input"
                  value={outroTexto}
                  onChange={(e) => onOutroTexto(e.target.value)}
                />
              )}
            </div>
          )}
        </div>
      )}

      {questao.tipo === "multipla" && (
        <div className="mt-2 space-y-1.5">
          {questao.opcoes?.map((opcao) => (
            <label key={opcao} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={selecionadas.includes(opcao)}
                onChange={() => onToggleMultipla(opcao)}
                className="h-4 w-4"
              />
              {opcao}
            </label>
          ))}
          {questao.temOutro && (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selecionadas.includes(OPCAO_OUTRO)}
                  onChange={() => onToggleMultipla(OPCAO_OUTRO)}
                  className="h-4 w-4"
                />
                Outro:
              </label>
              {selecionadas.includes(OPCAO_OUTRO) && (
                <input
                  type="text"
                  className="input"
                  value={outroTexto}
                  onChange={(e) => onOutroTexto(e.target.value)}
                />
              )}
            </div>
          )}
        </div>
      )}

      {questao.tipo === "grade" && (
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="p-1 text-left text-xs font-semibold uppercase text-slate-500"></th>
                {questao.colunas?.map((coluna) => (
                  <th key={coluna} className="p-1 text-center text-xs font-semibold uppercase text-slate-500">
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questao.linhas?.map((linha) => (
                <tr key={linha} className="border-t border-slate-100">
                  <td className="p-1 text-slate-700">{linha}</td>
                  {questao.colunas?.map((coluna) => (
                    <td key={coluna} className="p-1 text-center">
                      <input
                        type="radio"
                        name={`${questao.id}__${linha}`}
                        checked={grade[linha] === coluna}
                        onChange={() => onGrade(linha, coluna)}
                        className="h-4 w-4"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
