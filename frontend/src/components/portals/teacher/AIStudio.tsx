"use client";
import { useState } from "react";
import { useStore } from "@/store";
import { Sparkles, ChevronRight, Copy, Download } from "lucide-react";

const TOOLS = [
  {
    id: "lesson", icon: "📋", title: "Lesson Plan Generator", color: "var(--blue)",
    desc: "Full CBC-aligned lesson plan with objectives, activities & assessment rubric",
    placeholder: "e.g. Quadratic Equations, Grade 8",
    sample: `## Lesson Plan: {{TOPIC}} — Grade 8

**Strand:** Number · **Sub-strand:** Algebra
**Duration:** 40 minutes · Week 7, Friday

### Learning Outcomes
By end of lesson, learners will:
1. Solve problems using the concept of {{TOPIC}}
2. Apply knowledge in real-world contexts
3. Collaborate in group assessment activities

### Activities
- **Introduce** (5 min): Recap prior knowledge — quick oral quiz
- **Demonstrate** (15 min): Step-by-step worked examples on board
- **Pair Work** (10 min): Solve 3 problems using the method
- **Gallery Walk** (8 min): Teams share solutions on whiteboards
- **Exit Ticket** (2 min): 1 independent problem to assess mastery

### CBC Assessment Rubric
| Competency | EE (≥80%) | ME (65–79%) | AE (50–64%) | BE (<50%) |
|---|---|---|---|---|
| Applying concepts correctly | Full accuracy | Minor errors | Partial | Attempts only |
| Collaboration | Leads group | Participates | Minimal | Disengaged |`,
  },
  {
    id: "slides", icon: "🖼️", title: "Presentation Builder", color: "var(--purple)",
    desc: "Auto-generate PowerPoint-style slides with structured content and visuals",
    placeholder: "e.g. Photosynthesis, Grade 7",
    sample: `## Slide Deck: {{TOPIC}}

**Slide 1 — Title:** {{TOPIC}} | Grade 8 Science | Week 7

**Slide 2 — Learning Objectives**
- Define the key process of {{TOPIC}}
- Identify the inputs and outputs
- Draw and label a diagram from memory

**Slide 3 — Key Concept**
[Diagram placeholder] Core process explained in simple terms.
- Point 1: What it is
- Point 2: Where it happens
- Point 3: Why it matters

**Slide 4 — Real-World Connection**
"Why does this matter in Kenya?"
- Agricultural application
- Environmental context

**Slide 5 — Check for Understanding**
Quick class question: "Turn to your partner and explain {{TOPIC}} in one sentence."

**Slide 6 — Summary & Homework**
- Today we learned: [3 key points]
- Homework: Complete flashcard set + watch recap podcast`,
  },
  {
    id: "notes", icon: "📄", title: "Notes & PDF Creator", color: "var(--green)",
    desc: "Comprehensive printable student notes with definitions, examples and diagrams",
    placeholder: "e.g. Forces & Motion, Grade 8",
    sample: `## Student Notes: {{TOPIC}}

**Subject:** Science · **Grade:** 8 · **Term:** 2, Week 7

---
### 1. Introduction
{{TOPIC}} is one of the most important concepts in this strand. Understanding it helps explain everyday phenomena around us.

### 2. Key Definitions
| Term | Definition |
|---|---|
| Key Term 1 | Clear, simple definition |
| Key Term 2 | CBC-aligned explanation |
| Key Term 3 | With local context |

### 3. Worked Examples
**Example 1:** Step-by-step solution with annotations
**Example 2:** Real-world Kenyan context problem

### 4. Summary Points (for revision)
✅ Point 1 — The most important takeaway
✅ Point 2 — Common exam question area
✅ Point 3 — Link to other strands

### 5. Practice Questions
1. (AE level) Basic recall question
2. (ME level) Application question
3. (EE level) Analysis & evaluation question`,
  },
  {
    id: "podcast", icon: "🎙️", title: "AI Voice & Podcast Script", color: "var(--yellow)",
    desc: "Engaging audio script for flipped classroom — AI voice-ready with intro/outro",
    placeholder: "e.g. Algebra Key Concepts, Grade 8",
    sample: `## Podcast Script: {{TOPIC}}

**Duration:** ~15 minutes · AI Voice: Kenyan English
**Audience:** Grade 8 learners · Offline-ready

---
[INTRO MUSIC — 5 seconds]

HOST: "Welcome to Acadebit Learning Audio. I'm your AI tutor, and today we're diving into {{TOPIC}}. Grab a pen — this is going to be a great session!"

[SEGMENT 1 — What is it?]
"Let's start with the basics. {{TOPIC}} is... [explanation in simple terms]. Think of it like this: [local analogy]."

[SEGMENT 2 — How does it work?]
"Now, here's the part most students find tricky. [Core process explained]. But here's a trick to remember it..."

[SEGMENT 3 — Example]
"Let's work through a real KCSE-style question together. [Question]. Step one: [step]. Step two: [step]. And there's our answer."

[SEGMENT 4 — Summary]
"Before we finish, let me recap the three things you must remember about {{TOPIC}}:
1. [Point 1]
2. [Point 2]
3. [Point 3]"

[OUTRO]
"Great work today! Open Acadebit and complete the flashcard set to lock this in. See you next session!"
[OUTRO MUSIC]`,
  },
  {
    id: "test", icon: "✍️", title: "Test & Exam Generator", color: "#ef4444",
    desc: "CBC-format test with Section A, B, C — complete with marking scheme",
    placeholder: "e.g. Mathematics Mid-term, Grade 8",
    sample: `## {{TOPIC}} — Test Paper
**Grade:** 8 · **Time:** 1 hour 30 min · **Total Marks:** 80
**Instructions:** Answer ALL questions in Section A, any 3 in Section B, any 2 in Section C.

---
### Section A — Multiple Choice (20 marks, 2 each)
1. Which of the following best describes...? (a) ... (b) ... (c) ... (d) ...
2. Calculate the value of... [KCSE-style question]
3. State the correct definition of...
[...10 questions total]

### Section B — Short Answer (36 marks, 12 each)
**Question 11:** Show all working. (a) Solve... (b) Explain why... (c) Calculate...
**Question 12:** [Diagram-based question] (a) Label the diagram. (b) Describe the process.
**Question 13:** [Data response] Analyse the table and answer (a)–(d).

### Section C — Extended Response (24 marks, 12 each)
**Question 14:** Discuss the significance of [concept] in the Kenyan context. Use examples.
**Question 15:** A student claims that... Evaluate this claim with evidence.

---
## MARKING SCHEME
**Q1–10:** 1. (b) · 2. (c) · 3. (a) [all answers]
**Q11:** (a) [Full method] 4 marks working + 2 answer · (b) [3 key points, 2 marks each]`,
  },
  {
    id: "flash", icon: "🃏", title: "Flashcard Generator", color: "var(--teal)",
    desc: "Spaced repetition flashcards — term/definition pairs for any topic",
    placeholder: "e.g. Cell Biology, Grade 8 Science",
    sample: `## Flashcard Set: {{TOPIC}} (30 cards)

**Card 1**
Q: Define {{TOPIC}} in one sentence.
A: [Clear, examiner-approved definition]

**Card 2**
Q: What are the 3 main components of {{TOPIC}}?
A: 1. [Component A] · 2. [Component B] · 3. [Component C]

**Card 3**
Q: Give a real-world example of {{TOPIC}} seen in Kenya.
A: [Local, relatable example]

**Card 4**
Q: What is the formula/equation used for {{TOPIC}}?
A: [Formula with units]

**Card 5**
Q: How does {{TOPIC}} differ from [related concept]?
A: [Clear comparison — key distinction]

[...25 more cards covering definitions, applications, formulas, diagrams, and exam-style questions at EE, ME, AE levels]`,
  },
  {
    id: "image", icon: "🖼", title: "Image & Diagram Assistant", color: "var(--navy)",
    desc: "Generate labeled diagram descriptions, charts and infographic scripts",
    placeholder: "e.g. Human Digestive System, Grade 8",
    sample: `## Diagram: {{TOPIC}}

### Diagram Description (for drawing or printing)

**Title:** {{TOPIC}} — Labeled Diagram
**Orientation:** Portrait · **Size:** A4

**Main Structure:**
[Outer boundary] — label with name and function
[Inner component 1] — arrow pointing right, label: "Name — Function"
[Inner component 2] — arrow pointing left, label: "Name — Function"
[Central area] — label: "Key process occurs here"

**Key Labels (8 minimum):**
1. [Label 1] → [Function]
2. [Label 2] → [Function]
3. [Label 3] → [Function]
4. [Label 4] → [Function]
5. [Label 5] → [Function]

**Caption:** "Fig 1.1 — {{TOPIC}} as studied in CBC Grade 8 Science Strand 3"

**Exam Note:** KCSE frequently asks students to label this diagram (3–5 marks).
**Tip for learners:** Draw the outline first, then add labels. Use a pencil for arrows.`,
  },
  {
    id: "insights", icon: "📊", title: "Student Progress Insights", color: "var(--green)",
    desc: "AI analysis of class performance — at-risk alerts and re-teach suggestions",
    placeholder: "e.g. Grade 8A Maths Week 7 Report",
    sample: `## AI Progress Report: {{TOPIC}}

**Class:** Grade 8A · **Week:** 7 · **Generated:** Today

---
### 📊 Summary
- Average score: **70%** (↑ from 66% last week)
- Students at EE: 12 (27%) · ME: 21 (47%) · AE: 9 (20%) · BE: 3 (7%)
- Engagement: Video watch rate 84% · Flashcard completion 71%

### ⚠ At-Risk Students (3)
| Student | Area of Concern | Recommended Action |
|---|---|---|
| Kevin N. | Below 50% in Maths, Science | Assign remedial flashcards + parent alert |
| Daniel K. | Attendance 73%, missing tests | Check welfare, catch-up plan |
| James M. | Dropped 8% from last week | Re-watch video lesson, tutor session |

### 🔁 Re-teach Recommendations
1. **Factorisation** — 8 students scored <55%. Re-teach in next lesson using visual method.
2. **Map Reading** — Only 49% watched the video. Re-assign with shorter clip + quiz.
3. **Essay Structure** — 5 students below 55% in English. Assign podcast + writing exercise.

### ✅ Strengths to Celebrate
- Cynthia A. scored 96% — nominate for Week 7 leaderboard
- Science average ↑ 8% — photosynthesis lesson was highly effective
- 7 students completed their full daily study plan (100% tasks)`,
  },
];

export default function AIStudio() {
  const { addToast } = useStore();
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const generate = () => {
    const t = topic.trim() || activeTool.placeholder.replace("e.g. ", "");
    setGenerating(true);
    setOutput(null);
    setTimeout(() => {
      setGenerating(false);
      setOutput(activeTool.sample.replace(/{{TOPIC}}/g, t));
      addToast("success", `${activeTool.title} generated for "${t}"`);
    }, 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Sparkles size={22} color="var(--purple)" />
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>🤖 AI Teacher Studio</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>8 AI tools — lesson plans, tests, podcasts, slides, flashcards and more</p>
        </div>
        <span className="badge" style={{ background: "rgba(168,85,247,.1)", color: "var(--purple)", marginLeft: "auto", fontSize: 11 }}>AI Powered</span>
      </div>

      {/* Tool Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => { setActiveTool(t); setOutput(null); setTopic(""); }}
            style={{
              padding: "12px 14px", borderRadius: 12, textAlign: "left", cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
              background: activeTool.id === t.id ? "var(--navy)" : "#fff",
              border: `1.5px solid ${activeTool.id === t.id ? "var(--navy)" : "var(--border)"}`,
              boxShadow: activeTool.id === t.id ? "0 4px 16px rgba(26,51,101,.18)" : "none",
            }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{t.icon}</div>
            <p style={{ color: activeTool.id === t.id ? "#fff" : "var(--navy)", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{t.title}</p>
            <p style={{ color: activeTool.id === t.id ? "rgba(255,255,255,.65)" : "var(--muted)", fontSize: 10, lineHeight: 1.4 }}>{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Active Tool Input */}
      <div className="card" style={{ border: `2px solid ${activeTool.color}20`, background: `${activeTool.color}05` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 24 }}>{activeTool.icon}</span>
          <div>
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700 }}>{activeTool.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{activeTool.desc}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder={activeTool.placeholder}
            className="input"
            style={{ flex: 1 }}
          />
          <button onClick={generate} disabled={generating} className="btn btn-navy"
            style={{ minWidth: 140, justifyContent: "center", gap: 6 }}>
            {generating ? (
              <>
                <span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                Generating...
              </>
            ) : (
              <><Sparkles size={13} /> Generate</>
            )}
          </button>
        </div>
      </div>

      {/* Generated Output */}
      {output && (
        <div className="card" style={{ border: "1.5px solid rgba(34,197,94,.3)", background: "rgba(34,197,94,.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{activeTool.icon}</span>
              <h3 style={{ color: "var(--green)", fontSize: 14, fontWeight: 700 }}>
                ✅ {activeTool.title} — {topic || activeTool.placeholder.replace("e.g. ", "")}
              </h3>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 12px" }}
                onClick={() => addToast("success", "Copied to clipboard!")}>
                <Copy size={11} /> Copy
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 12px" }}
                onClick={() => addToast("info", "Downloading PDF...")}>
                <Download size={11} /> PDF
              </button>
              <button className="btn btn-navy" style={{ fontSize: 11, padding: "5px 12px" }}>
                Publish to Class <ChevronRight size={11} />
              </button>
            </div>
          </div>
          <pre style={{
            color: "var(--text)", fontSize: 12, lineHeight: 1.7,
            whiteSpace: "pre-wrap", fontFamily: "inherit",
            background: "var(--bg)", padding: 16, borderRadius: 10,
            maxHeight: 480, overflowY: "auto",
          }}>{output}</pre>
        </div>
      )}

      {/* Time Saved */}
      <div className="card" style={{ background: "var(--navy)", border: "none" }}>
        <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>⏱️ Time Saved This Term</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {[
            { label: "Lesson Planning", hours: "6+", color: "var(--blue)" },
            { label: "Test Creation", hours: "4+", color: "#ef4444" },
            { label: "Material Design", hours: "3+", color: "var(--purple)" },
            { label: "Marking & Feedback", hours: "5+", color: "var(--yellow)" },
            { label: "Total Saved", hours: "18+", color: "var(--green)" },
          ].map((t) => (
            <div key={t.label} style={{ textAlign: "center", padding: "14px 12px", background: "rgba(255,255,255,.07)", borderRadius: 10 }}>
              <p style={{ color: t.color, fontSize: 26, fontWeight: 800 }}>{t.hours} hrs</p>
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: 11, marginTop: 3 }}>{t.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
