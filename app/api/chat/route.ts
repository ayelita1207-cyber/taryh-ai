import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;
    const currentYear = new Date().getFullYear();

    const systemPrompt = `You are Taryh AI — an expert assistant on the history of Kyrgyzstan.

Instructions:
- Answer in the same language the user used (Russian or Kyrgyz preferred).
- For questions about Kyrgyz history, provide thorough, sourced answers when possible.
- For general questions, answer clearly and concisely.
- Current year: ${currentYear}. If asked for the current year, respond exactly: "Сейчас ${currentYear} год." (or translated appropriately to the user's language).
- If you are unsure about a factual detail, say you are unsure and suggest how the user can verify (links or sources).
- Prefer accuracy over verbosity. If a short answer is possible, give it, then offer an expanded explanation.
- When appropriate, ask a brief clarifying question before answering.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.2,
      max_tokens: 1200,
      top_p: 0.95,
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply: "Произошла ошибка при обращении к Taryh AI.",
    });
  }
}