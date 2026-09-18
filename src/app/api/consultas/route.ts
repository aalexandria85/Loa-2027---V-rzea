import { NextRequest, NextResponse } from "next/server";
import { consultaEncerrada, sanitizarRespostas } from "@/lib/consultaLoa2027Questoes";
import { registrarRespostaNaPlanilha } from "@/lib/googleSheets";

export async function POST(request: NextRequest) {
  if (consultaEncerrada()) {
    return NextResponse.json(
      { error: "O prazo para participar desta consulta pública encerrou em 30/09/2026." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const respostas = sanitizarRespostas(body);
  if (typeof respostas.q1 !== "string" || !respostas.q1.trim()) {
    return NextResponse.json({ error: "Informe o nome completo" }, { status: 400 });
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();

  try {
    await registrarRespostaNaPlanilha(id, createdAt, respostas);
  } catch (err) {
    console.error("Falha ao registrar resposta da consulta LOA 2027:", err);
    return NextResponse.json(
      { error: "Não foi possível registrar sua resposta agora. Tente novamente em instantes." },
      { status: 502 }
    );
  }

  return NextResponse.json({ id }, { status: 201 });
}
