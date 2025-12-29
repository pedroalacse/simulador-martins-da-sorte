// api/sonhos.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS básico (pra evitar bloqueio do navegador)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Use POST" });

  try {
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

    if (!apiKey) {
      return res.status(500).json({
        error:
          "Chave do Gemini não encontrada. Crie GEMINI_API_KEY (ou GOOGLE_API_KEY) na Vercel e redeploy.",
      });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const sonho = (body?.sonho || "").toString().trim();

    if (!sonho) {
      return res.status(400).json({ error: "Envie { sonho: '...' }" });
    }

    const prompt = `
Você é o “Martins da Sorte – Sonhos da Sorte”.
Tarefa:
1) Interprete o sonho em português do Brasil (tom cultural/folclórico, educativo).
2) Identifique o ANIMAL do Jogo do Bicho mais associado ao sonho e entregue:
   - BICHO (nome)
   - GRUPO (1–25)
   - DEZENA (00–99)
   - CENTENA (000–999)
   - MILHAR (0000–9999)
3) Gere palpites para loterias da Caixa (somente números):
   - Mega-Sena (6 números 01–60)
   - Quina (5 números 01–80)
   - Lotofácil (15 números 01–25)
   - Timemania (10 números 01–80)
Formato de saída: JSON com as chaves:
{
  "titulo": string,
  "interpretacao": string,
  "bicho": { "nome": string, "grupo": number, "dezena": string, "centena": string, "milhar": string },
  "loterias": {
    "megasena": number[],
    "quina": number[],
    "lotofacil": number[],
    "timemania": number[]
  },
  "fraseFinal": string
}
Frase final (use exatamente):
"🍀 Boa sorte!
Se um dia a sorte bater à sua porta,
lembre de nós do Martins da Sorte.
Se quiser apoiar o projeto, considere fazer uma doação ao site."
Sonho do usuário: """${sonho}"""
    `.trim();

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    };

    const resp = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: any = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({
        error: "Gemini retornou erro",
        details: data,
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join("") ||
      "";

    // Tenta extrair JSON (o modelo às vezes vem com texto junto)
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    const jsonStr = start !== -1 && end !== -1 ? text.slice(start, end + 1) : "";

    if (!jsonStr) {
      return res.status(200).json({
        raw: text,
        warning: "Não consegui extrair JSON limpo; retornando texto bruto.",
      });
    }

    const parsed = JSON.parse(jsonStr);
    return res.status(200).json(parsed);
  } catch (err: any) {
    return res.status(500).json({
      error: "Falha ao interpretar",
      details: err?.message || String(err),
    });
  }
}
