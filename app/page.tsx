"use client";

import { useState, useRef } from "react";

const timelineEvents = [
  { year: "III в. до н.э.", title: "Первые упоминания кыргызов", desc: "Кыргызы впервые упомянуты в китайских летописях как народ на берегах Енисея.", color: "#534AB7", prompt: "Расскажи подробнее о первых упоминаниях кыргызов в истории" },
  { year: "840 г. н.э.", title: "Кыргызский каганат", desc: "Великий Кыргызский каганат достиг наибольшего могущества, победив уйгуров.", color: "#534AB7", prompt: "Расскажи про Кыргызский каганат 840 года" },
  { year: "XVIII в.", title: "Эпоха Манаса", desc: "Легендарный герой Манас объединил 40 кыргызских племён в борьбе за свободу.", color: "#BA7517", prompt: "Кто такой Манас и почему он важен для кыргызского народа?" },
  { year: "1876 г.", title: "Вхождение в Российскую империю", desc: "Кыргызские земли вошли в состав Российской империи как Ферганская область.", color: "#0F6E56", prompt: "Как Кыргызстан вошёл в состав Российской империи?" },
  { year: "1916 г.", title: "Восстание кыргызов", desc: "Народное восстание против царской мобилизации. Жестоко подавлено.", color: "#993C1D", prompt: "Расскажи про восстание кыргызов 1916 года" },
  { year: "1936 г.", title: "Кыргызская ССР", desc: "Кыргызстан стал отдельной союзной республикой в составе СССР.", color: "#185FA5", prompt: "Как образовалась Кыргызская ССР?" },
  { year: "1991 г.", title: "Независимость Кыргызстана", desc: "31 августа 1991 года Кыргызстан провозгласил независимость от СССР.", color: "#185FA5", prompt: "Расскажи про независимость Кыргызстана в 1991 году" },
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; imageUrl?: string | null; }[]>([]);
  const [tab, setTab] = useState<"chat" | "timeline">("chat");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  function copyText(text: string, index: number) {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function speakText(text: string, index: number) {
    if (playingIndex === index) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";
    utter.rate = 0.75;
    utter.pitch = 0.5;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => v.lang.startsWith("ru") && v.name.toLowerCase().includes("male"))
      || voices.find(v => v.lang.startsWith("ru"))
      || voices[0];
    if (maleVoice) utter.voice = maleVoice;
    synthRef.current = utter;
    utter.onend = () => setPlayingIndex(null);
    window.speechSynthesis.speak(utter);
    setPlayingIndex(index);
  }

  async function askAI(customMessage?: string) {
    const msg = customMessage || question;
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setQuestion("");
    setTab("chat");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, imageUrl: data.imageUrl }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Ошибка подключения 😢" }]);
    }
  }

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "radial-gradient(circle at top, #0f172a 0%, #020617 40%, #000000 100%)", color: "white", padding: "20px", fontFamily: "Arial" }}>
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "180px", pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(180deg, rgba(255,215,0,0.22), transparent 35%)", opacity: 0.85 }} />
      <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "180px", pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(180deg, rgba(255,215,0,0.22), transparent 35%)", opacity: 0.85 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto", paddingTop: "60px" }}>
        <h1 style={{ textAlign: "center", fontSize: "52px", background: "linear-gradient(90deg, #facc15, #f59e0b, #f97316, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "10px", fontWeight: "bold" }}>
          Taryh AI
        </h1>
        <p style={{ textAlign: "center", color: "#cbd5e1", marginBottom: "20px" }}>
          Умный помощник по истории Кыргызстана kg
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button onClick={() => setTab("chat")} style={{ padding: "10px 24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: tab === "chat" ? "rgba(56,189,248,0.2)" : "transparent", color: "white", cursor: "pointer", fontSize: "14px" }}>Чат</button>
          <button onClick={() => setTab("timeline")} style={{ padding: "10px 24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: tab === "timeline" ? "rgba(250,204,21,0.2)" : "transparent", color: "white", cursor: "pointer", fontSize: "14px" }}>📅 Лента истории</button>
          <a href="/quiz" style={{ padding: "10px 24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "white", fontSize: "14px", textDecoration: "none" }}>🏆 Викторина</a>
          <a href="/map" style={{ padding: "10px 24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "white", fontSize: "14px", textDecoration: "none" }}>🗺️ Карта истории</a>
        </div>

        {tab === "chat" && (
          <>
            <div style={{ border: "1px solid rgba(148,163,184,0.18)", borderRadius: "24px", padding: "24px", background: "rgba(15,23,42,0.72)", marginBottom: "24px", boxShadow: "0 0 45px rgba(56,189,248,0.12)" }}>
              {messages.length === 0 && (
                <p style={{ textAlign: "center", color: "#475569", padding: "20px 0" }}>Задай вопрос по истории Кыргызстана...</p>
              )}
              {messages.map((msg, index) => (
                <div key={index} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "16px" }}>
                  <div style={{ maxWidth: "75%", padding: "16px 20px", borderRadius: "28px", background: msg.role === "user" ? "#0369a1" : "#111827", lineHeight: "1.65" }}>
                    {msg.role === "assistant" ? "⚔️ " : "👤 "}
                    {msg.content}
                    {msg.role === "assistant" && msg.imageUrl && (
                      <img src={msg.imageUrl} alt="историческое фото" style={{ display: "block", marginTop: "12px", borderRadius: "12px", maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }} />
                    )}
                    {msg.role === "assistant" && (
                      <div style={{ display: "flex", gap: "4px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "8px" }}>
                        <button
                          onClick={() => copyText(msg.content, index)}
                          title="Копировать"
                          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "6px", border: "none", background: copiedIndex === index ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)", color: copiedIndex === index ? "#22c55e" : "#94a3b8", cursor: "pointer", fontSize: "12px", transition: "all 0.2s" }}
                        >
                          {copiedIndex === index ? "✓ Скопировано" : "⎘ Копировать"}
                        </button>
                        <button
                          onClick={() => speakText(msg.content, index)}
                          title="Слушать"
                          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "6px", border: "none", background: playingIndex === index ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.06)", color: playingIndex === index ? "#f59e0b" : "#94a3b8", cursor: "pointer", fontSize: "12px", transition: "all 0.2s" }}
                        >
                          {playingIndex === index ? "⏸ Пауза" : "🔊 Слушать"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button onClick={() => setMessages([])} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "white", cursor: "pointer", fontSize: 16 }}>+</button>
              <input
                type="text"
                placeholder="Например: Кто такой Манас?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") askAI(); }}
                style={{ flex: 1, padding: "18px", borderRadius: "18px", border: "1px solid rgba(56,189,248,0.5)", background: "rgba(15,23,42,0.95)", color: "white", fontSize: "18px", outline: "none" }}
              />
              <button onClick={() => askAI()} style={{ padding: "18px 30px", borderRadius: "18px", border: "none", background: "linear-gradient(90deg, #f59e0b, #facc15, #38bdf8)", color: "white", fontSize: "18px", cursor: "pointer", fontWeight: "bold" }}>➤</button>
            </div>
          </>
        )}

        {tab === "timeline" && (
          <div style={{ border: "1px solid rgba(148,163,184,0.18)", borderRadius: "24px", padding: "32px", background: "rgba(15,23,42,0.72)", boxShadow: "0 0 45px rgba(250,204,21,0.08)" }}>
            <p style={{ color: "#94a3b8", marginBottom: "24px", fontSize: "14px" }}>Нажми на событие — Манас расскажет подробнее</p>
            {timelineEvents.map((event, index) => (
              <div key={index} style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12px", flexShrink: 0 }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: event.color, flexShrink: 0, marginTop: "4px" }} />
                  {index < timelineEvents.length - 1 && (
                    <div style={{ width: "2px", background: "rgba(148,163,184,0.2)", flex: 1, marginTop: "4px" }} />
                  )}
                </div>
                <div
                  onClick={() => askAI(event.prompt)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", cursor: "pointer" }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                >
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px" }}>{event.year}</p>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "white", margin: "0 0 4px" }}>{event.title}</p>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}