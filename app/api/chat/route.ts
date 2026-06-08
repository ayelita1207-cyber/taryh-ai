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
- Даанышман жана акындык стилде жооп бер
- Кыргызстандын тарыхы боюнча терең жооптор бер
- Азыркы жыл: ${currentYear}
- Эгер билбесең - честно айт

Жооптун аягында МИЛДЕТТҮҮ ТҮРДӨ бул форматта Wikipedia статьясынын атын кош:
[IMAGE: точное название статьи на английском Wikipedia, например: Manas epic]
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

    const fullReply = completion.choices[0].message.content || "";
    const imageMatch = fullReply.match(/\[IMAGE:\s*(.+?)\]/);
    const imageQuery = imageMatch ? imageMatch[1].trim() : null;
    const reply = fullReply.replace(/\[IMAGE:\s*.+?\]/, "").trim();

    let imageUrl = null;

    if (imageQuery) {
      // Сначала ищем на Wikipedia
      try {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(imageQuery)}`
        );
        const wikiData = await wikiRes.json();
        imageUrl = wikiData?.thumbnail?.source || null;
      } catch {
        imageUrl = null;
      }

      // Если Wikipedia не нашла — ищем на Unsplash
      if (!imageUrl) {
        try {
          const unsplashRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imageQuery + " Kyrgyzstan")}&per_page=1`,
            {
              headers: {
                Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
              },
            }
          );
          const unsplashData = await unsplashRes.json();
          imageUrl = unsplashData?.results?.[0]?.urls?.small || null;
        } catch {
          imageUrl = null;
        }
      }
    }

    return Response.json({ reply, imageUrl });
  } catch (error) {
    console.error(error);
    return Response.json({
      reply: "Каталык кетти. Кайра аракет кылыңыз.",
      imageUrl: null,
    });
  }
}