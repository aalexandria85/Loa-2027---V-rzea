// Perguntas da Consulta Pública Eletrônica – LOA 2027 (Prefeitura Municipal de Várzea/RN).
// Compartilhado entre o formulário público (client) e a rota de API que grava no Google Sheets (server).

// Fim do prazo de participação: 25/09/2026, 23:59:59 (horário de Brasília).
export const DATA_LIMITE_CONSULTA = "2026-09-25T23:59:59-03:00";

export function consultaEncerrada(agora: Date = new Date()): boolean {
  return agora.getTime() > new Date(DATA_LIMITE_CONSULTA).getTime();
}

export type TipoQuestao = "texto" | "unica" | "multipla" | "grade";

export interface Questao {
  id: string;
  secao: string;
  numero: number;
  texto: string;
  tipo: TipoQuestao;
  opcoes?: string[];
  linhas?: string[];
  colunas?: string[];
  maxSelecoes?: number;
  temOutro?: boolean;
  obrigatoria?: boolean;
}

export const SECOES = [
  "I. Identificação do Cidadão",
  "II. Execução Orçamentária 2026 e Prioridades para a LOA 2027",
  "III. Áreas Prioritárias para o Município em 2027",
  "IV. Saúde Pública",
  "V. Educação",
  "VI. Infraestrutura e Urbanismo",
  "VII. Assistência Social e Habitação",
  "VIII. Desenvolvimento Econômico, Emprego e Renda",
  "IX. Meio Ambiente",
  "X. Cultura, Esporte e Lazer",
  "XI. Gestão Pública, Transparência e Participação Social",
  "XII. Contribuição Final",
] as const;

export const QUESTOES: Questao[] = [
  {
    id: "q1",
    secao: SECOES[0],
    numero: 1,
    texto: "Nome completo",
    tipo: "texto",
    obrigatoria: true,
  },
  {
    id: "q2",
    secao: SECOES[0],
    numero: 2,
    texto: "Documento de identificação (CPF ou RG)",
    tipo: "texto",
  },
  {
    id: "q3",
    secao: SECOES[0],
    numero: 3,
    texto: "Idade",
    tipo: "unica",
    opcoes: ["até 18 anos", "de 19 a 29 anos", "de 30 a 49 anos", "de 50 a 59 anos", "acima de 60 anos"],
  },
  {
    id: "q4",
    secao: SECOES[0],
    numero: 4,
    texto: "Sexo",
    tipo: "unica",
    opcoes: ["Masculino", "Feminino", "Outro", "Prefiro não informar"],
  },
  {
    id: "q5",
    secao: SECOES[0],
    numero: 5,
    texto: "Escolaridade",
    tipo: "unica",
    opcoes: [
      "Analfabeto(a)",
      "Fundamental incompleto",
      "Fundamental completo",
      "Médio incompleto",
      "Médio completo",
      "Superior incompleto",
      "Superior completo",
      "Pós-graduação (lato ou stricto sensu)",
    ],
  },
  {
    id: "q6",
    secao: SECOES[0],
    numero: 6,
    texto: "Profissão ou ocupação principal",
    tipo: "texto",
  },
  {
    id: "q7",
    secao: SECOES[0],
    numero: 7,
    texto: "Renda familiar mensal (soma de todos os moradores da casa)",
    tipo: "unica",
    opcoes: ["até 1 salário mínimo", "de 1 a 2 salários mínimos", "de 2 a 5 salários mínimos", "acima de 5 salários mínimos"],
  },
  {
    id: "q8",
    secao: SECOES[0],
    numero: 8,
    texto: "Você pertence a algum dos seguintes grupos? (Marque os que se aplicam)",
    tipo: "multipla",
    opcoes: [
      "Pessoa com deficiência",
      "Idoso(a)",
      "Jovem (15 a 29 anos)",
      "Mulher chefe de família",
      "Agricultor familiar",
      "Morador de área rural",
      "Morador de área urbana",
    ],
    temOutro: true,
  },
  {
    id: "q9",
    secao: SECOES[0],
    numero: 9,
    texto: "Bairro, comunidade ou distrito onde mora",
    tipo: "texto",
  },
  {
    id: "q10",
    secao: SECOES[0],
    numero: 10,
    texto: "Tempo de residência no município",
    tipo: "unica",
    opcoes: ["menos de 1 ano", "de 1 a 5 anos", "de 6 a 10 anos", "mais de 10 anos"],
  },
  {
    id: "q11",
    secao: SECOES[0],
    numero: 11,
    texto: "Como você se informa sobre ações da Prefeitura",
    tipo: "multipla",
    opcoes: [
      "Rádio local",
      "Redes sociais (WhatsApp, YouTube, Instagram, Facebook)",
      "Site da Prefeitura",
      "Jornais impressos",
      "Conversa com vizinhos",
    ],
    temOutro: true,
  },
  {
    id: "q12",
    secao: SECOES[1],
    numero: 12,
    texto: "Como você avalia a execução do orçamento da Prefeitura em 2026, até o momento?",
    tipo: "unica",
    opcoes: ["Ótimo", "Bom", "Regular", "Ruim", "Não sei avaliar"],
  },
  {
    id: "q13",
    secao: SECOES[1],
    numero: 13,
    texto:
      "Dentro das prioridades já definidas na LDO 2027, qual obra, serviço ou investimento você considera mais urgente para o orçamento de 2027?",
    tipo: "texto",
  },
  {
    id: "q14",
    secao: SECOES[2],
    numero: 14,
    texto: "Na sua opinião, quais áreas devem receber mais atenção e recursos da Prefeitura? (Marque até 3)",
    tipo: "multipla",
    opcoes: [
      "Saúde",
      "Educação",
      "Segurança Pública",
      "Assistência Social",
      "Transporte e Mobilidade",
      "Agricultura e Desenvolvimento Rural",
      "Infraestrutura Urbana (pavimentação, iluminação etc.)",
      "Meio Ambiente e Saneamento",
      "Esporte, Cultura e Lazer",
      "Habitação",
      "Emprego e Geração de Renda",
      "Turismo e Desenvolvimento Econômico",
      "Administração e Gestão Pública",
    ],
    maxSelecoes: 3,
    temOutro: true,
  },
  {
    id: "q15",
    secao: SECOES[3],
    numero: 15,
    texto: "Você ou sua família utilizam os serviços de saúde pública do município?",
    tipo: "unica",
    opcoes: ["Sim, com frequência", "Sim, ocasionalmente", "Não"],
  },
  {
    id: "q16",
    secao: SECOES[3],
    numero: 16,
    texto: "Quais serviços de saúde você mais utiliza?",
    tipo: "multipla",
    opcoes: [
      "Unidade Básica de Saúde (UBS/PSF)",
      "Pronto Atendimento / Hospital",
      "Farmácia básica",
      "Atendimento domiciliar (equipe de saúde da família)",
    ],
    temOutro: true,
  },
  {
    id: "q17",
    secao: SECOES[3],
    numero: 17,
    texto: "Indique os principais problemas que você percebe na saúde do município",
    tipo: "multipla",
    opcoes: [
      "Falta de médicos ou especialistas",
      "Atendimento lento ou desorganizado",
      "Falta de medicamentos",
      "Estrutura física precária",
      "Demora para exames",
    ],
    temOutro: true,
  },
  {
    id: "q18",
    secao: SECOES[3],
    numero: 18,
    texto: "O que você sugere para melhorar os serviços de saúde?",
    tipo: "texto",
  },
  {
    id: "q19",
    secao: SECOES[4],
    numero: 19,
    texto: "Você ou seus filhos estão matriculados na rede pública municipal de ensino?",
    tipo: "unica",
    opcoes: ["Sim", "Não"],
  },
  {
    id: "q20",
    secao: SECOES[4],
    numero: 20,
    texto: "Quais são os principais desafios enfrentados nas escolas públicas do município?",
    tipo: "multipla",
    opcoes: [
      "Falta de professores",
      "Estrutura inadequada",
      "Transporte escolar insuficiente",
      "Merenda escolar de baixa qualidade",
      "Ausência de atividades extracurriculares",
    ],
    temOutro: true,
  },
  {
    id: "q21",
    secao: SECOES[4],
    numero: 21,
    texto: "Sugestões para a melhoria da educação pública",
    tipo: "texto",
  },
  {
    id: "q22",
    secao: SECOES[5],
    numero: 22,
    texto: "Como você avalia os serviços abaixo na sua rua ou bairro?",
    tipo: "grade",
    linhas: [
      "Pavimentação de ruas",
      "Iluminação pública",
      "Coleta de lixo",
      "Drenagem de águas pluviais",
      "Abastecimento de água",
      "Rede de esgoto",
    ],
    colunas: ["Ótimo", "Bom", "Regular", "Ruim", "Inexistente"],
  },
  {
    id: "q23",
    secao: SECOES[5],
    numero: 23,
    texto: "Quais obras ou melhorias são urgentes no seu bairro/comunidade?",
    tipo: "texto",
  },
  {
    id: "q24",
    secao: SECOES[6],
    numero: 24,
    texto: "Você conhece ou participa de algum programa de assistência social da Prefeitura?",
    tipo: "unica",
    opcoes: ["Sim", "Não"],
  },
  {
    id: "q25",
    secao: SECOES[6],
    numero: 25,
    texto: "Quais ações sociais são mais urgentes em sua comunidade? (Marque até 2)",
    tipo: "multipla",
    opcoes: [
      "Apoio a famílias em extrema pobreza",
      "Apoio à infância e adolescência",
      "Atendimento à população idosa",
      "Casas populares",
      "Apoio a pessoas com deficiência",
    ],
    maxSelecoes: 2,
    temOutro: true,
  },
  {
    id: "q26",
    secao: SECOES[6],
    numero: 26,
    texto: "Sugestões para melhorar a assistência social e habitação",
    tipo: "texto",
  },
  {
    id: "q27",
    secao: SECOES[7],
    numero: 27,
    texto: "Você está atualmente empregado(a)?",
    tipo: "unica",
    opcoes: [
      "Sim, com carteira assinada",
      "Sim, informal/autônomo",
      "Não, estou desempregado(a)",
      "Sou aposentado(a) ou pensionista",
      "Sou estudante",
    ],
    temOutro: true,
  },
  {
    id: "q28",
    secao: SECOES[7],
    numero: 28,
    texto: "O que a Prefeitura pode fazer para estimular a economia local? (Marque até 3)",
    tipo: "multipla",
    opcoes: [
      "Apoiar micro e pequenos empreendedores",
      "Promover cursos de qualificação",
      "Criar feiras e espaços de comércio local",
      "Investir em turismo e cultura",
      "Incentivar cooperativas e agricultura familiar",
    ],
    maxSelecoes: 3,
    temOutro: true,
  },
  {
    id: "q29",
    secao: SECOES[8],
    numero: 29,
    texto: "Quais problemas ambientais você identifica no município? (Marque até 3)",
    tipo: "multipla",
    opcoes: ["Acúmulo de lixo ou descarte irregular", "Desmatamento", "Poluição de rios, lagoas ou praias", "Falta de educação ambiental"],
    maxSelecoes: 3,
    temOutro: true,
  },
  {
    id: "q30",
    secao: SECOES[8],
    numero: 30,
    texto: "O que você sugere para melhorar o cuidado ambiental?",
    tipo: "texto",
  },
  {
    id: "q31",
    secao: SECOES[9],
    numero: 31,
    texto: "Existem atividades culturais, esportivas ou de lazer disponíveis no seu bairro/comunidade?",
    tipo: "unica",
    opcoes: ["Sim, de forma regular", "Sim, mas são poucas", "Não existem"],
  },
  {
    id: "q32",
    secao: SECOES[9],
    numero: 32,
    texto: "O que você gostaria de ver na sua comunidade?",
    tipo: "multipla",
    opcoes: ["Eventos culturais e artísticos", "Atividades esportivas para crianças e jovens", "Oficinas e cursos de arte/música", "Espaços públicos revitalizados"],
    temOutro: true,
  },
  {
    id: "q33",
    secao: SECOES[10],
    numero: 33,
    texto: "Você já participou de alguma audiência pública ou reunião com a Prefeitura?",
    tipo: "unica",
    opcoes: ["Sim", "Não"],
  },
  {
    id: "q34",
    secao: SECOES[10],
    numero: 34,
    texto: "Você sente que suas opiniões são consideradas na gestão municipal?",
    tipo: "unica",
    opcoes: ["Sim", "Não", "Parcialmente", "Nenhuma das respostas anteriores"],
  },
  {
    id: "q35",
    secao: SECOES[10],
    numero: 35,
    texto: "O que pode melhorar a transparência e a participação cidadã?",
    tipo: "multipla",
    opcoes: ["Aplicativos e portais com dados acessíveis", "Mais audiências públicas", "Conselhos comunitários atuantes", "Prestação de contas mais clara"],
    temOutro: true,
  },
  {
    id: "q36",
    secao: SECOES[11],
    numero: 36,
    texto: "Qual é o maior problema do município, na sua opinião?",
    tipo: "texto",
  },
  {
    id: "q37",
    secao: SECOES[11],
    numero: 37,
    texto: "Deixe aqui suas sugestões gerais para a administração municipal e para a LOA 2027",
    tipo: "texto",
  },
];

export type RespostaValor = string | string[] | Record<string, string>;
export type Respostas = Record<string, RespostaValor>;

export function questaoPorId(id: string): Questao | undefined {
  return QUESTOES.find((q) => q.id === id);
}

export const CABECALHO_PLANILHA = ["ID", "Recebido em", ...QUESTOES.map((q) => `${q.numero}. ${q.texto}`)];

export function formatarValorResposta(valor: unknown, outro?: string): string {
  if (Array.isArray(valor)) {
    return valor.map((v) => (v === "Outro" && outro ? `Outro: ${outro}` : v)).join("; ");
  }
  if (valor && typeof valor === "object") {
    return Object.entries(valor as Record<string, string>)
      .map(([linha, coluna]) => `${linha}: ${coluna}`)
      .join("; ");
  }
  if (typeof valor === "string") {
    return valor === "Outro" && outro ? `Outro: ${outro}` : valor;
  }
  return "";
}

/** Monta uma linha de planilha/CSV a partir dos dados de uma resposta, sem depender do tipo do banco. */
export function linhaPlanilha(id: string, createdAtIso: string, respostas: Respostas): string[] {
  const dataHora = new Date(createdAtIso).toLocaleString("pt-BR");
  const colunas = QUESTOES.map((q) =>
    formatarValorResposta(respostas[q.id], respostas[`${q.id}_outro`] as string | undefined)
  );
  return [id, dataHora, ...colunas];
}

const IDS_VALIDOS = new Set(QUESTOES.map((q) => q.id));

/** Mantém apenas chaves de perguntas reais (qN ou qN_outro), evitando payloads arbitrários. */
export function sanitizarRespostas(input: unknown): Respostas {
  if (!input || typeof input !== "object") return {};
  const respostas: Respostas = {};
  for (const [chave, valor] of Object.entries(input as Record<string, unknown>)) {
    const idBase = chave.replace(/_outro$/, "");
    if (!IDS_VALIDOS.has(idBase)) continue;

    if (typeof valor === "string") {
      respostas[chave] = valor.slice(0, 2000);
    } else if (Array.isArray(valor)) {
      respostas[chave] = valor.filter((v): v is string => typeof v === "string").map((v) => v.slice(0, 500));
    } else if (valor && typeof valor === "object") {
      const grade: Record<string, string> = {};
      for (const [linha, coluna] of Object.entries(valor as Record<string, unknown>)) {
        if (typeof coluna === "string") grade[linha.slice(0, 200)] = coluna.slice(0, 200);
      }
      respostas[chave] = grade;
    }
  }
  return respostas;
}
