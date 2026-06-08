"use client";

import { useEffect, useRef, useState } from "react";

const historicalPlaces = [
  { name: "Бишкек", lat: 42.8746, lng: 74.5698, desc: "Столица Кыргызстана. Основан в 1825 году.", prompt: "Расскажи историю города Бишкек" },
  { name: "Ош", lat: 40.5283, lng: 72.7985, desc: "Один из старейших городов Центральной Азии. Возраст более 3000 лет.", prompt: "Расскажи историю древнего города Ош" },
  { name: "Талас", lat: 42.5170, lng: 72.2429, desc: "Место великой Таласской битвы 751 года.", prompt: "Расскажи про Таласскую битву 751 года" },
  { name: "Нарын", lat: 41.4280, lng: 75.9906, desc: "Древний город на Великом Шёлковом пути.", prompt: "Расскажи историю города Нарын и Шёлкового пути" },
  { name: "Иссык-Куль", lat: 42.4500, lng: 77.0000, desc: "Священное озеро кыргызского народа.", prompt: "Расскажи об озере Иссык-Куль и его истории" },
  { name: "Узген", lat: 40.7697, lng: 73.2985, desc: "Древний город, столица Карахандского каганата.", prompt: "Расскажи про древний город Узген и Карахандский каганат" },
  { name: "Каракол", lat: 42.4833, lng: 78.3833, desc: "Город основан в 1869 году русскими исследователями.", prompt: "Расскажи историю города Каракол" },
];

export default function MapPage() {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState("");

  async function askAbout(prompt: string, name: string) {
    setSelectedPlace(name);
    setLoading(true);
    setReply("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await response.json();
      setReply(data.reply);
    } catch {
      setReply("Ошибка подключения 😢");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = L.default.map(mapRef.current!).setView([41.5, 74.5], 7);
      mapInstanceRef.current = map;

      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      historicalPlaces.forEach((place) => {
        const marker = L.default.marker([place.lat, place.lng]).addTo(map);
        marker.bindPopup(`
          <div style="font-family: Arial; max-width: 200px;">
            <h3 style="margin: 0 0 8px; color: #1e293b;">${place.name}</h3>
            <p style="margin: 0 0 10px; color: #475569; font-size: 13px;">${place.desc}</p>
            <button onclick="window.askAbout('${place.prompt}', '${place.name}')" style="padding: 6px 12px; background: #f59e0b; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; color: white;">
              Узнать историю ⚔️
            </button>
          </div>
        `);
      });

      (window as any).askAbout = (prompt: string, name: string) => {
        askAbout(prompt, name);
      };
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(circle at top, #0f172a 0%, #020617 40%, #000000 100%)", color: "white", fontFamily: "Arial" }}>
      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "36px", background: "linear-gradient(90deg, #facc15, #f59e0b, #f97316, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px", fontWeight: "bold" }}>
          Карта истории
        </h1>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "20px" }}>Нажми на точку — узнай историю места 🗺️</p>
        <a href="/" style={{ display: "inline-block", marginBottom: "16px", color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>← На главную</a>
      </div>

      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />

      {(loading || reply) && (
        <div style={{ maxWidth: "900px", margin: "24px auto", padding: "0 20px" }}>
          <div style={{ border: "1px solid rgba(148,163,184,0.18)", borderRadius: "24px", padding: "24px", background: "rgba(15,23,42,0.72)" }}>
            {selectedPlace && (
              <p style={{ color: "#facc15", fontWeight: "bold", marginBottom: "12px", fontSize: "16px" }}>
                ⚔️ Манас рассказывает о {selectedPlace}:
              </p>
            )}
            {loading ? (
              <p style={{ color: "#94a3b8" }}>Манас думает...</p>
            ) : (
              <p style={{ lineHeight: "1.7", color: "white" }}>{reply}</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}