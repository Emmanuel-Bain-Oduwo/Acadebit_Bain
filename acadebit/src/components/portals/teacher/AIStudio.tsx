"use client";
import { useState } from "react";
import { useStore } from "@/store";

const TOOLS = [
  { icon: "📋", title: "Lesson Plan", desc: "Full CBC-aligned lesson plan with objectives, activities & assessment", color: "var(--blue)" },
  { icon: "🖼️", title: "Presentation", desc: "Auto-generated PowerPoint-style slides with visuals", color: "var(--purple)" },
  { icon: "📄", title: "Notes & PDF", desc: "Comprehensive student notes formatted for printing", color: "var(--green)" },
  { icon: "🎙️", title: "Podcast Script", desc: "Engaging audio script for flipped classroom learning", color: "var(--orange)" },
  { icon: "✍️", title: "Test Generator", desc: "CBC-format questions with marking scheme", color: "var(--red)" },
  { icon: "🃏", title: "Flashcard Builder", desc: "Spaced repetition flashcards for key concepts", color: "var(--teal)" },
];

const SAMPLE_OUTPUT = `## Lesson Plan: Quadratic Equations — Grade 8

**Strand:** Number · **Sub-strand:** Algebra
**Duration:** 40 minutes · **Week 7, Friday**

### Learning Outcomes
By end of lesson, learners will:
1. Solve quadratic equations using the quadratic formula
2. Identify roots of quadratic equations graphically

### Activities
- **Introduce** (5 min): Recap linear equations, ask "what if x² appears?"
- **Demonstrate** (15 min): Work through x² − 5x + 6 = 0 step-by-step
- **Pair Work** (10 min): Solve 3 equations using formula
- **Gallery Walk** (8 min): Teams share solutions on whiteboards
- **Exit Ticket** (2 min): Solve x² − 4 = 0

### CBC Assessment
| Competency | EE | ME | AE | BE |
|---|---|---|---|---|
| Applying formula correctly | 100% | ≥80% | ≥60% | <60% |`;

export default function AIStudio() {
  const { addToast } = useStore();
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const generate = () => {
    if (!topic.trim()) { addToast("warning", "Enter a topic to generate content"); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setOutput(SAMPLE_OUTPUT.replace("Quadratic Equations", topic));
      addToast("success", `AI content generated for "${topic}"`);
    }, 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>AI Teacher Studio</h1>
        <span className="badge" style={{ background: "rgba(168,85,247,.1)", color: "var(--purple)" }}>🤖 AI Powered</span>
      </div>

      {/* AI Input */}
      <div className="card">
        <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Generate Learning Content</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="e.g. Photosynthesis, Quadratic Equations, World War II..."
            style={{
              flex: 1,
              background: "var(--card2)",
              border: "1px solid var(--border)",
              borderRadius: 100,
              padding: "10px 16px",
              color: "var(--text)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button onClick={generate} disabled={generating} className="btn btn-primary" style={{ minWidth: 120, justifyContent: "center" }}>
            {generating ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="spinner" style={{ width: 14, height: 14, border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} />
                Generating...
              </span>
            ) : "⚡ Generate All"}
          </button>
        </div>
      </div>

      {/* AI Output */}
      {output && (
        <div className="card" style={{ background: "rgba(34,197,94,.03)", border: "1px solid rgba(34,197,94,.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <h3 style={{ color: "var(--green)", fontSize: 14, fontWeight: 700 }}>✅ Generated Content — {topic}</h3>
            <button onClick={() => addToast("success", "Copied to clipboard!")} className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 10px" }}>Copy</button>
          </div>
          <pre style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "DM Sans, sans-serif" }}>{output}</pre>
        </div>
      )}

      {/* Tool Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {TOOLS.map((t) => (
          <button
            key={t.title}
            onClick={() => { setTopic(t.title === "Lesson Plan" ? "Quadratic Equations" : topic || "Photosynthesis"); generate(); }}
            style={{
              background: "var(--card)",
              border: `1px solid var(--border)`,
              borderRadius: "var(--radius)",
              padding: 16,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${t.color}20`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 700 }}>{t.title}</p>
              <span className="badge" style={{ background: `${t.color}15`, color: t.color, fontSize: 9 }}>AI</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 11, lineHeight: 1.4 }}>{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Time Saved */}
      <div className="card">
        <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⏱️ Time Saved This Term</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {[
            { label: "Lesson Planning", hours: "4+", color: "var(--blue)" },
            { label: "Test Creation", hours: "3+", color: "var(--red)" },
            { label: "Material Design", hours: "2+", color: "var(--purple)" },
            { label: "Total Saved", hours: "9+", color: "var(--green)" },
          ].map((t) => (
            <div key={t.label} style={{ textAlign: "center", padding: 12, background: "var(--card2)", borderRadius: 8 }}>
              <p style={{ color: t.color, fontSize: 28, fontWeight: 800, fontFamily: "DM Mono" }}>{t.hours} hrs</p>
              <p style={{ color: "var(--text-muted)", fontSize: 11 }}>{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
