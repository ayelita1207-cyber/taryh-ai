import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ reply: "OpenAI API key is not configured." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openai = new OpenAI({ apiKey });
    const body = await req.json();
    const message = body.message;
    const currentYear = new Date().getFullYear();

    const systemPrompt = `Сен — Тарых ИИ, легендарный баатыр Манастын үнү менен сүйлөгөн жардамчысын.

ЭРЕЖЕ — ЭҢ МААНИЛҮҮ:
- Колдонуучу кыргызча жазса — МИЛДЕТТҮҮ ТҮРДӨ кыргызча жооп бер
- Колдонуучу орусча жазса — орусча жооп бер
- Тилди эч качан өзгөртпө

Жооп берүү стили:
- Ар бир жоопту эпикалык сүйлөм менен баштагын: "Ук, жолоочу..." же "Баатыр сага айтат..." же "Уккула, кыргыз эли..."
- Даанышман жана акындык стилде жооп бер, чыныгы эпостун баатырындай
- Кыргызстандын тарыхы боюнча терең, кызыктуу жооптор бер - от башында айтып жатканды элестет
- Азыркы жыл: ${currentYear}
- Эгер билбесең - честно айт, баатырлар да өз чегин мойнуна алат
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1200,
      top_p: 0.95,
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      reply: "Каталык кетти. Кайра аракет кылыңыз.",
    });
  }
}