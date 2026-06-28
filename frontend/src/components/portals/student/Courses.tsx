"use client";
import { useState } from "react";
import { Play, Headphones, FileText, Layers, Download, BookOpen, ChevronRight } from "lucide-react";

const SUBJECTS = ["All", "Mathematics", "Science", "English", "Kiswahili", "Social Studies"];

const CONTENT: {
  id: string; subject: string; title: string; type: "video" | "podcast" | "notes" | "flashcards";
  duration: string; progress: number; offline: boolean; ai: boolean; new?: boolean;
}[] = [
  { id: "c1", subject: "Mathematics", title: "Quadratic Equations — Full Lesson", type: "video", duration: "14 min", progress: 100, offline: true, ai: false },
  { id: "c2", subject: "Mathematics", title: "Linear Equations Podcast", type: "podcast", duration: "18 min", progress: 60, offline: true, ai: true },
  { id: "c3", subject: "Science", title: "Photosynthesis — Diagrams & Notes", type: "notes", duration: "8 pages", progress: 0, offline: true, ai: true, new: true },
  { id: "c4", subject: "Science", title: "Cell Biology Flashcards (42 cards)", type: "flashcards", duration: "42 cards", progress: 45, offline: true, ai: true },
  { id: "c5", subject: "English", title: "Reading Comprehension Strategies", type: "video", duration: "11 min", progress: 80, offline: false, ai: false },
  { id: "c6", subject: "English", title: "Essay Writing Guide — Notes", type: "notes", duration: "12 pages", progress: 100, offline: true, ai: true },
  { id: "c7", subject: "Kiswahili", title: "Insha — AI Voice Lesson (Kiswahili)", type: "podcast", duration: "22 min", progress: 0, offline: false, ai: true, new: true },
  { id: "c8", subject: "Social Studies", title: "Map Reading & Interpretation", type: "video", duration: "9 min", progress: 0, offline: true, ai: false },
  { id: "c9", subject: "Mathematics", title: "Algebra Key Terms Flashcards", type: "flashcards", duration: "30 cards", progress: 80, offline: true, ai: true },
  { id: "c10", subject: "Science", title: "Forces & Motion Podcast", type: "podcast", duration: "15 min", progress: 0, offline: false, ai: true, new: true },
];

const TYPE_META: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  video:      { icon: <Play size={14} />, label: "Video", color: "#ef4444", bg: "rgba(239,68,68,.1)" },
  podcast:    { icon: <Headphones size={14} />, label: "Podcast", color: "var(--yellow)", bg: "rgba(245,158,11,.1)" },
  notes:      { icon: <FileText size={14} />, label: "Notes", color: "var(--blue)", bg: "rgba(59,130,246,.1)" },
  flashcards: { icon: <Layers size={14} />, label: "Flashcards", color: "var(--purple)", bg: "rgba(168,85,247,.1)" },
};

const XP_MAP = { video: 10, podcast: 8, notes: 5, flashcards: 15 };

export default function Courses() {
  const [subject, setSubject] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [active, setActive] = useState<string | null>(null);

  const filtered = CONTENT.filter(
    (c) => (subject === "All" || c.subject === subject) && (typeFilter === "All" || c.type === typeFilter)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div>
        <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>🎬 Courses & Lessons</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Videos · Podcasts · Notes · Flashcards — all CBC-tagged, all offline-ready</p>
      </div>

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {[
          { icon: "🎬", label: "Video Lessons", value: "24", color: "#ef4444" },
          { icon: "🎧", label: "Podcasts", value: "18", color: "var(--yellow)" },
          { icon: "📄", label: "Notes/PDFs", value: "31", color: "var(--blue)" },
          { icon: "🃏", label: "Flashcard Decks", value: "12", color: "var(--purple)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <div>
              <p style={{ color: s.color, fontSize: 18, fontWeight: 800 }}>{s.value}</p>
              <p style={{ color: "var(--muted)", fontSize: 11 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SUBJECTS.map((s) => (
            <button key={s} onClick={() => setSubject(s)}
              style={{
                padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid",
                fontFamily: "inherit",
                background: subject === s ? "var(--navy)" : "transparent",
                color: subject === s ? "#fff" : "var(--muted)",
                borderColor: subject === s ? "var(--navy)" : "var(--border)",
              }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "video", "podcast", "notes", "flashcards"].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100,
                fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: typeFilter === t ? "var(--bg2)" : "transparent",
                color: typeFilter === t ? "var(--navy)" : "var(--muted)",
                border: "1.5px solid var(--border)",
              }}>
              {t !== "All" && <span style={TYPE_META[t] ? { color: TYPE_META[t].color } : {}}>{t === "video" ? "▶" : t === "podcast" ? "🎧" : t === "notes" ? "📄" : "🃏"}</span>}
              {t === "All" ? "All Types" : TYPE_META[t]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 14 }}>
        {filtered.map((c) => {
          const meta = TYPE_META[c.type];
          const isActive = active === c.id;
          return (
            <div key={c.id} className="card card-hover" onClick={() => setActive(isActive ? null : c.id)}
              style={{ border: isActive ? "2px solid var(--navy)" : "1px solid var(--border)", transition: "all 0.2s" }}>
              {/* Type + new badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: meta.bg, color: meta.color, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                  {meta.icon} {meta.label}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {c.new && <span className="badge" style={{ background: "rgba(34,197,94,.1)", color: "var(--green)", fontSize: 9 }}>NEW</span>}
                  {c.ai && <span className="badge" style={{ background: "rgba(168,85,247,.1)", color: "var(--purple)", fontSize: 9 }}>🤖 AI</span>}
                  {c.offline && <span className="badge" style={{ background: "rgba(59,130,246,.1)", color: "var(--blue)", fontSize: 9 }}>📶 Offline</span>}
                </div>
              </div>

              <p style={{ color: "var(--navy)", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{c.title}</p>
              <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 10 }}>{c.subject} · {c.duration}</p>

              {/* Progress */}
              {c.progress > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "var(--muted)", fontSize: 10 }}>{c.progress === 100 ? "✅ Completed" : `${c.progress}% done`}</span>
                    <span style={{ color: "var(--muted2)", fontSize: 10 }}>+{XP_MAP[c.type]} XP</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${c.progress}%`, background: c.progress === 100 ? "var(--green)" : "var(--navy)" }} />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-navy" style={{ flex: 1, justifyContent: "center", padding: "8px 12px", fontSize: 12 }}>
                  {c.type === "video" ? <><Play size={12} /> Watch</> :
                   c.type === "podcast" ? <><Headphones size={12} /> Listen</> :
                   c.type === "flashcards" ? <><Layers size={12} /> Study</> :
                   <><BookOpen size={12} /> Read</>}
                </button>
                {(c.offline || c.type === "notes") && (
                  <button className="btn btn-ghost" style={{ padding: "8px 12px", fontSize: 12 }}>
                    <Download size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendation */}
      <div className="card" style={{ background: "var(--navy)", border: "none" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🤖</span>
          <div>
            <p style={{ color: "var(--yellow)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>AI CONTENT RECOMMENDATION</p>
            <p style={{ color: "#fff", fontSize: 13, lineHeight: 1.6 }}>
              Based on your Maths score (74%) and last week&apos;s test, I recommend starting with the{" "}
              <strong style={{ color: "var(--yellow)" }}>Quadratic Equations flashcard deck</strong> today — you scored 58% on those questions.
              Then watch the <strong style={{ color: "var(--yellow)" }}>Linear Equations podcast</strong> (18 min) while commuting.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn" style={{ background: "var(--yellow)", color: "#fff", fontSize: 12, padding: "7px 14px" }}>
                Start Recommended <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
