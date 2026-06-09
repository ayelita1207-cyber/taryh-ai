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

    const systemPrompt = `You are Taryh AI — speaking with the voice of the legendary hero Manas.

MOST IMPORTANT RULE:
- If the user writes in Russian — ALWAYS respond in Russian
- If the user writes in Kyrgyz — ALWAYS respond in Kyrgyz
- NEVER switch languages

Style:
- Begin every response with an epic phrase like "Слушай, путник..." or "Ук, жолоочу..."
- Respond wisely and poetically like a hero of the epic
- Give deep answers about Kyrgyzstan history
- Current year: ${currentYear}
- If unsure — say so honestly
- Keep responses 3-4 sentences for voice

At the end ALWAYS add image keyword:
[IMAGE: english keyword for search, example: Manas epic hero]
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
      try {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(imageQuery)}`
        );
        const wikiData = await wikiRes.json();
        imageUrl = wikiData?.thumbnail?.source || null;
      } catch { imageUrl = null; }

      if (!imageUrl) {
        try {
          const unsplashRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imageQuery + " Kyrgyzstan")}&per_page=1`,
            { headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } }
          );
          const unsplashData = await unsplashRes.json();
          imageUrl = unsplashData?.results?.[0]?.urls?.small || null;
        } catch { imageUrl = null; }
      }
    }

    let audioBase64 = null;
    try {
      const voiceRes = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB",
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: reply,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      );
      if (voiceRes.ok) {
        const audioBuffer = await voiceRes.arrayBuffer();
        audioBase64 = Buffer.from(audioBuffer).toString("base64");
      }
    } catch { audioBase64 = null; }

    return Response.json({ reply, imageUrl, audioBase64 });
  } catch (error) {
    console.error(error);
    return Response.json({
      reply: "Ошибка. Попробуй снова.",
      imageUrl: null,
      audioBase64: null,
    });
  }
}