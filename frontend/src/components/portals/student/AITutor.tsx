"use client";
import { useState, useRef, useEffect } from "react";
import { FLASHCARDS, TEST_SCORES } from "@/lib/data";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Send, Mic, MicOff, Volume2 } from "lucide-react";

const INITIAL_MESSAGES = [
  { role: "ai", text: "Hello Brian! 👋 I'm your AI tutor. What would you like to learn today? You can ask me anything about your subjects!" },
  { role: "user", text: "Can you explain how to solve quadratic equations?" },
  { role: "ai", text: "Great question! The quadratic formula is x = (−b ± √(b²−4ac)) / 2a\n\nFor example, to solve x² − 5x + 6 = 0:\n• a=1, b=−5, c=6\n• x = (5 ± √(25−24)) / 2 = (5 ± 1) / 2\n• x = 3 or x = 2 ✅" },
];

const QUICK = [
  { label: "Photosynthesis", text: "Explain photosynthesis" },
  { label: "Insha Writing", text: "How do I write a good Kiswahili insha?" },
  { label: "Water Cycle", text: "Explain the water cycle" },
];

const AI_RESPONSES: Record<string, string> = {
  photo: "Photosynthesis is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\nGreen plants use chlorophyll in their leaves to absorb sunlight and convert water and carbon dioxide into glucose (food) and oxygen. It happens in the chloroplasts!",
  insha: "For a great Kiswahili insha:\n1. **Utangulizi** (Introduction) — set the scene\n2. **Kiini** (Body) — 2-3 paragraphs with detail\n3. **Hitimisho** (Conclusion) — wrap up with a lesson\n\nUse vivid language and varied sentence structure. Avoid repetition!",
  water: "The Water Cycle has 4 stages:\n☀️ **Evaporation** — sun heats water → vapor rises\n☁️ **Condensation** — vapor cools → clouds form\n🌧️ **Precipitation** — water falls as rain/snow\n🏔️ **Collection** — water collects in oceans/rivers, cycle repeats!",
  default: "That's a great question! Let me think... Based on your CBC curriculum, here's what you need to know: Focus on understanding the concept first, then practice with examples. Remember, the competency-based approach values understanding over memorisation! 🎓",
};

function getAIResponse(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("photo") || t.includes("synthesis")) return AI_RESPONSES.photo;
  if (t.includes("insha") || t.includes("kiswahili")) return AI_RESPONSES.insha;
  if (t.includes("water") || t.includes("cycle")) return AI_RESPONSES.water;
  return AI_RESPONSES.default;
}

const VOICE_HINTS = [
  "Ask me anything about Maths...",
  "I'm listening — speak now...",
  "Try: 'Explain photosynthesis'",
  "Try: 'Help me with quadratics'",
];

export default function AITutor() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [hintIdx, setHintIdx] = useState(0);
  const msgEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  useEffect(() => {
    if (!voiceMode) return;
    const iv = setInterval(() => setHintIdx((i) => (i + 1) % VOICE_HINTS.length), 2500);
    return () => clearInterval(iv);
  }, [voiceMode]);

  const send = (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    setVoiceTranscript("");
    setTyping(true);
    setSpeaking(false);
    setTimeout(() => {
      setTyping(false);
      const response = getAIResponse(msg);
      setMessages((m) => [...m, { role: "ai", text: response }]);
      if (voiceMode) {
        setSpeaking(true);
        setTimeout(() => setSpeaking(false), 3000);
      }
    }, 1200);
  };

  const toggleListen = () => {
    if (listening) {
      setListening(false);
      if (voiceTranscript) send(voiceTranscript);
    } else {
      setListening(true);
      setVoiceTranscript("");
      setTimeout(() => {
        setVoiceTranscript("Explain photosynthesis to me");
        setListening(false);
        setTimeout(() => send("Explain photosynthesis to me"), 600);
      }, 2500);
    }
  };

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => setCardIdx((i) => (i + 1) % FLASHCARDS.length), 200);
  };

  const card = FLASHCARDS[cardIdx];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>AI Tutor & Flashcards</h1>
        <button
          onClick={() => { setVoiceMode((v) => !v); setListening(false); setSpeaking(false); }}
          className="btn"
          style={{
            background: voiceMode ? "var(--purple)" : "var(--card2)",
            color: voiceMode ? "#fff" : "var(--muted)",
            border: "1.5px solid",
            borderColor: voiceMode ? "var(--purple)" : "var(--border)",
            gap: 6, fontSize: 12,
          }}>
          {voiceMode ? <Volume2 size={13} /> : <Mic size={13} />}
          {voiceMode ? "Voice Mode ON" : "Switch to Voice"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: 16 }}>
        {/* Chat / Voice Panel */}
        <div className="card" style={{ display: "flex", flexDirection: "column", height: 480 }}>
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
            {voiceMode ? "🎙️ Voice Tutor" : "💬 AI Tutor Chat"}
          </h3>

          {voiceMode ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
              {/* AI Avatar */}
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: speaking
                    ? "linear-gradient(135deg, var(--purple), var(--blue))"
                    : "linear-gradient(135deg, rgba(168,85,247,.2), rgba(59,130,246,.2))",
                  border: `3px solid ${speaking ? "var(--purple)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 40,
                  animation: speaking ? "pulse 1s ease-in-out infinite" : "none",
                  transition: "all 0.4s ease",
                }}>
                  🤖
                </div>
                {speaking && (
                  <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "3px solid rgba(168,85,247,.3)", animation: "ripple 1.2s linear infinite" }} />
                )}
              </div>

              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                  {speaking ? "AI Tutor is speaking..." : listening ? "Listening..." : "Tap mic to ask a question"}
                </p>
                <p style={{ color: "var(--muted)", fontSize: 12, minHeight: 18 }}>
                  {listening ? "🔴 Recording..." : speaking ? "🔊 Playing response..." : VOICE_HINTS[hintIdx]}
                </p>
                {voiceTranscript && (
                  <p style={{ color: "var(--purple)", fontSize: 12, fontStyle: "italic", marginTop: 8 }}>
                    &ldquo;{voiceTranscript}&rdquo;
                  </p>
                )}
              </div>

              {speaking && (
                <div style={{ display: "flex", gap: 4, alignItems: "center", height: 40 }}>
                  {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 0.3, 0.8, 0.7].map((h, i) => (
                    <div key={i} style={{ width: 4, height: `${h * 36}px`, borderRadius: 4, background: "var(--purple)", animation: `soundbar 0.${5 + (i % 5)}s ease-in-out infinite alternate` }} />
                  ))}
                </div>
              )}

              <button onClick={toggleListen}
                style={{
                  width: 64, height: 64, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: listening ? "#ef4444" : "var(--purple)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: listening ? "0 0 0 8px rgba(239,68,68,.25)" : "0 4px 16px rgba(168,85,247,.4)",
                  transition: "all 0.3s",
                }}>
                {listening ? <MicOff size={24} color="#fff" /> : <Mic size={24} color="#fff" />}
              </button>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {QUICK.map((q) => (
                  <button key={q.label}
                    onClick={() => { setVoiceTranscript(q.text); setTimeout(() => send(q.text), 400); }}
                    style={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 100, padding: "3px 10px", color: "var(--muted)", fontSize: 11, cursor: "pointer" }}>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {QUICK.map((q) => (
                  <button key={q.label} onClick={() => send(q.text)}
                    style={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 100, padding: "3px 10px", color: "var(--muted)", fontSize: 11, cursor: "pointer" }}>
                    {q.label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "80%",
                      background: m.role === "user" ? "var(--purple)" : "var(--card2)",
                      color: m.role === "user" ? "#fff" : "var(--text)",
                      borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                      padding: "8px 12px", fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-wrap",
                    }}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div style={{ display: "flex", gap: 4, padding: "8px 12px", background: "var(--card2)", borderRadius: "12px 12px 12px 4px", width: "fit-content" }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--muted)", display: "inline-block" }} />
                    ))}
                  </div>
                )}
                <div ref={msgEnd} />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask anything..."
                  style={{
                    flex: 1, background: "var(--card2)", border: "1px solid var(--border)",
                    borderRadius: 100, padding: "8px 14px", color: "var(--text)", fontSize: 13, outline: "none",
                  }}
                />
                <button onClick={() => send()} className="btn btn-primary" style={{ borderRadius: "50%", width: 36, height: 36, padding: 0, justifyContent: "center", flexShrink: 0 }}>
                  <Send size={14} />
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Flashcard */}
          <div className="card">
            <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🃏 Flashcards ({cardIdx + 1}/{FLASHCARDS.length})</h3>
            <div className="perspective" style={{ height: 140 }}>
              <div className={`flip-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((f) => !f)}
                style={{ width: "100%", height: "100%", position: "relative", cursor: "pointer" }}>
                <div className="flip-front" style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(168,85,247,.2), rgba(59,130,246,.2))",
                  border: "1px solid rgba(168,85,247,.3)",
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, textAlign: "center",
                }}>
                  <p style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>❓ {card.q}</p>
                </div>
                <div className="flip-back" style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(34,197,94,.2), rgba(20,184,166,.2))",
                  border: "1px solid rgba(34,197,94,.3)",
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, textAlign: "center",
                }}>
                  <p style={{ color: "var(--green)", fontSize: 13, fontWeight: 500 }}>✅ {card.a}</p>
                </div>
              </div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 11, textAlign: "center", margin: "6px 0 10px" }}>Click card to flip</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={nextCard} className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>✗ Didn&apos;t know</button>
              <button onClick={nextCard} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>✓ Got it!</button>
            </div>
          </div>

          {/* Test Progress */}
          <div className="card">
            <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📈 Weekly Test Progress</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={TEST_SCORES}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <YAxis domain={[50, 100]} tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="brian" stroke="var(--purple)" strokeWidth={2} dot={{ fill: "var(--purple)", r: 3 }} name="Brian" />
                <Line type="monotone" dataKey="classAvg" stroke="var(--border)" strokeWidth={2} strokeDasharray="4 4" name="Class Avg" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes soundbar { 0% { transform: scaleY(0.4); } 100% { transform: scaleY(1); } }
      `}</style>
    </div>
  );
}
