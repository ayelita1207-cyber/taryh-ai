"use client";

import { useState } from "react";

const questions = [
  { question: "В каком году Кыргызстан провозгласил независимость?", options: ["1989", "1991", "1993", "1995"], correct: 1 },
  { question: "Кто является главным героем кыргызского эпоса?", options: ["Эр Тоштук", "Манас", "Семетей", "Сейтек"], correct: 1 },
  { question: "Какое озеро является самым большим в Кыргызстане?", options: ["Сон-Куль", "Чатыр-Куль", "Иссык-Куль", "Сары-Челек"], correct: 2 },
  { question: "Какой город является столицей Кыргызстана?", options: ["Ош", "Талас", "Нарын", "Бишкек"], correct: 3 },
  { question: "В каком веке был создан эпос Манас?", options: ["X век", "XIV век", "XVIII век", "IX век"], correct: 1 },
  { question: "Сколько племён объединил Манас?", options: ["20", "30", "40", "50"], correct: 2 },
  { question: "Какая горная система находится в Кыргызстане?", options: ["Гималаи", "Тянь-Шань", "Памир", "Алтай"], correct: 1 },
  { question: "Когда кыргызские земли вошли в состав России?", options: ["1856", "1876", "1896", "1916"], correct: 1 },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === questions[current].correct) {
      setScore((s) => s + 1);
    }
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 1200);
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  const q = questions[current];

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(circle at top, #0f172a 0%, #020617 40%, #000000 100%)", color: "white", padding: "20px", fontFamily: "Arial", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <h1 style={{ textAlign: "center", fontSize: "36px", background: "linear-gradient(90deg, #facc15, #f59e0b, #f97316, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px", fontWeight: "bold" }}>
          Тарых Викторина
        </h1>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "32px" }}>История Кыргызстана 🇰🇬</p>

        {!finished ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ color: "#64748b", fontSize: "14px" }}>Вопрос {current + 1} из {questions.length}</span>
              <span style={{ color: "#facc15", fontSize: "14px" }}>Очки: {score}</span>
            </div>

            <div style={{ background: "rgba(15,23,42,0.72)", border: "1px solid rgba(148,163,184,0.18)", borderRadius: "20px", padding: "28px", marginBottom: "20px" }}>
              <p style={{ fontSize: "18px", lineHeight: "1.6", margin: 0 }}>{q.question}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {q.options.map((option, index) => {
                let bg = "rgba(255,255,255,0.03)";
                let border = "1px solid rgba(148,163,184,0.18)";
                if (selected !== null) {
                  if (index === questions[current].correct) { bg = "rgba(34,197,94,0.2)"; border = "1px solid #22c55e"; }
                  else if (index === selected) { bg = "rgba(239,68,68,0.2)"; border = "1px solid #ef4444"; }
                }
                return (
                  <button key={index} onClick={() => handleAnswer(index)} style={{ padding: "16px 20px", borderRadius: "14px", border, background: bg, color: "white", fontSize: "16px", cursor: selected !== null ? "default" : "pointer", textAlign: "left" }}>
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ background: "rgba(15,23,42,0.72)", border: "1px solid rgba(148,163,184,0.18)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>
              {score >= 6 ? "🏆" : score >= 4 ? "⚔️" : "📚"}
            </p>
            <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
              {score >= 6 ? "Отлично! Ты знаток истории!" : score >= 4 ? "Хороший результат!" : "Продолжай изучать историю!"}
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: "32px", fontSize: "18px" }}>
              Твой результат: {score} из {questions.length}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={restart} style={{ padding: "14px 28px", borderRadius: "14px", border: "none", background: "linear-gradient(90deg, #f59e0b, #facc15)", color: "white", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}>
                Играть снова
              </button>
              <a href="/" style={{ padding: "14px 28px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontSize: "16px", textDecoration: "none", display: "flex", alignItems: "center" }}>
                На главную
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}