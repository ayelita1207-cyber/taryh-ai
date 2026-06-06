"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState<{
    role: "user" | "assistant";
    content: string;
  }[]>([]);

  async function askAI() {
    if (!question.trim()) return;

    const userMessage = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setQuestion("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ошибка подключения 😢",
        },
      ]);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 40%, #000000 100%)",
        color: "white",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: "180px",
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(180deg, rgba(255,215,0,0.22), transparent 35%), radial-gradient(circle at 50% 20%, rgba(255,215,0,0.16), transparent 30%)",
          opacity: 0.85,
        }}
      />

      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "180px",
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(180deg, rgba(255,215,0,0.22), transparent 35%), radial-gradient(circle at 50% 20%, rgba(255,215,0,0.16), transparent 30%)",
          opacity: 0.85,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "1200px",
          height: "160px",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.14), transparent 35%), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.12), transparent 30%)",
          clipPath:
            "polygon(0 42%, 8% 34%, 18% 48%, 28% 30%, 38% 44%, 48% 24%, 58% 40%, 68% 26%, 78% 38%, 88% 30%, 100% 42%, 100% 0, 0 0)",
          opacity: 0.25,
          pointerEvents: "none",
          zIndex: 0,
          filter: "blur(0.5px)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "900px",
          margin: "0 auto",
          paddingTop: "140px",
        }}
      >
        <div style={{ height: 8, marginBottom: 12 }} />

        <h1
          style={{
            textAlign: "center",
            fontSize: "52px",
            background:
              "linear-gradient(90deg, #facc15, #f59e0b, #f97316, #38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "10px",
            fontWeight: "bold",
            textShadow:
              "0 0 25px rgba(250,204,21,0.35), 0 0 45px rgba(56,189,248,0.18)",
          }}
        >
          Taryh AI
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "30px",
            letterSpacing: "0.02em",
          }}
        >
          Умный помощник по истории Кыргызстана
        </p>

        <div
          style={{
            border: "1px solid rgba(148,163,184,0.18)",
            borderRadius: "24px",
            padding: "24px",
            background: "rgba(15,23,42,0.72)",
            marginBottom: "24px",
            boxShadow: "0 0 45px rgba(56,189,248,0.12)",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "16px 20px",
                  borderRadius: "28px",
                  boxShadow:
                    msg.role === "user"
                      ? "0 0 30px rgba(2,132,199,0.22)"
                      : "0 0 30px rgba(148,163,184,0.12)",
                  background:
                    msg.role === "user" ? "#0369a1" : "#111827",
                  lineHeight: "1.65",
                }}
              >
                <>
                  {msg.role === "assistant" ? "🤖 " : "👤 "}
                  {msg.content}
                </>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setMessages([])}
            aria-label="Новый чат"
            title="Новый чат"
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: 16,
              transition: "transform 120ms ease, background 120ms ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.background = "transparent";
            }}
          >
            +
          </button>

          <input
            type="text"
            placeholder="Например: Кто такой Манас?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askAI();
              }
            }}
            style={{
              flex: 1,
              padding: "18px",
              borderRadius: "18px",
              border: "1px solid rgba(56,189,248,0.5)",
              background: "rgba(15,23,42,0.95)",
              color: "white",
              fontSize: "18px",
              outline: "none",
            }}
          />

          <button
            onClick={askAI}
            style={{
              padding: "18px 30px",
              borderRadius: "18px",
              border: "none",
              background:
                "linear-gradient(90deg, #f59e0b, #facc15, #38bdf8)",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 0 25px rgba(59,130,246,0.35)",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </main>
  );
}