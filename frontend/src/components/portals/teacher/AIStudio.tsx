"use client";
import { useState } from "react";
import { useStore } from "@/store";
import { Sparkles, ChevronRight, Copy, Download, Mic, MicOff, Send, Check } from "lucide-react";

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

[...25 more cards at EE, ME, AE levels]`,
  },
  {
    id: "image", icon: "🖼", title: "Image & Diagram Assistant", color: "var(--navy)",
    desc: "Generate labeled diagram descriptions, charts and infographic scripts",
    placeholder: "e.g. Human Digestive System, Grade 8",
    sample: `## Diagram: {{TOPIC}}

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

**Caption:** "Fig 1.1 — {{TOPIC}} as studied in CBC Grade 8"
**Exam Note:** KCSE frequently asks students to label this diagram (3–5 marks).`,
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
1. **Factorisation** — 8 students scored <55%. Re-teach using visual method.
2. **Map Reading** — Only 49% watched the video. Re-assign with shorter clip + quiz.
3. **Essay Structure** — 5 students below 55% in English. Assign podcast + writing exercise.

### ✅ Strengths to Celebrate
- Cynthia A. scored 96% — nominate for Week 7 leaderboard
- Science average ↑ 8% — photosynthesis lesson was highly effective`,
  },
];

const CLASSES = ["Grade 8A", "Grade 8B", "Grade 7A", "Grade 7B", "All Classes"];
const CONTENT_TYPES = ["Lesson Plan", "Presentation Slides", "Test Paper", "Notes / PDF", "Flashcard Set", "Podcast Script"];

const RECENT_PUSHES = [
  { content: "Quadratic Equations — Lesson Plan", target: "Grade 8A", time: "Today 9:15 AM", views: 38, total: 45 },
  { content: "Photosynthesis Notes", target: "Grade 7A + 7B", time: "Yesterday", views: 52, total: 60 },
  { content: "Algebra Flashcards (30 cards)", target: "Grade 8A", time: "Mon Jan 6", views: 31, total: 45 },
  { content: "Forces & Motion Podcast", target: "Grade 8B", time: "Fri Jan 3", views: 27, total: 44 },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const PLANNER_DATA: Record<string, { subject: string; topic: string; type: string; done: boolean }[]> = {
  Mon: [
    { subject: "Maths", topic: "Quadratic Equations", type: "Lesson", done: true },
    { subject: "Science", topic: "Photosynthesis", type: "Lab", done: true },
  ],
  Tue: [
    { subject: "English", topic: "Essay Writing", type: "Workshop", done: true },
    { subject: "Kiswahili", topic: "Insha", type: "Lesson", done: false },
  ],
  Wed: [
    { subject: "Maths", topic: "Factorisation", type: "Test", done: false },
    { subject: "Social Studies", topic: "Map Reading", type: "Lesson", done: false },
  ],
  Thu: [
    { subject: "Science", topic: "Forces & Motion", type: "Lesson", done: false },
    { subject: "English", topic: "Reading Comp.", type: "Quiz", done: false },
  ],
  Fri: [
    { subject: "Maths", topic: "Review Week 7", type: "Review", done: false },
    { subject: "All", topic: "Friday Competition", type: "Competition", done: false },
  ],
};

const VOICE_PROMPTS = [
  "Try: 'How did Grade 8A perform this week?'",
  "Try: 'Suggest a lesson plan for Algebra'",
  "Try: 'Which students need extra help?'",
  "Try: 'Generate a quiz on Forces & Motion'",
];

type TabId = "tools" | "push" | "planner" | "voice";

export default function AIStudio() {
  const { addToast } = useStore();
  const [tab, setTab] = useState<TabId>("tools");
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState("Grade 8A");
  const [selectedContent, setSelectedContent] = useState("Lesson Plan");
  const [pushSchedule, setPushSchedule] = useState("now");
  const [pushNote, setPushNote] = useState("");

  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceResponse, setVoiceResponse] = useState("");
  const [voicePromptIdx] = useState(0);

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

  const handlePush = () => {
    addToast("success", `"${selectedContent}" pushed to ${selectedClass}!`);
    setPushNote("");
  };

  const toggleVoice = () => {
    if (listening) {
      setListening(false);
      const q = "How did Grade 8A perform this week?";
      setVoiceTranscript(q);
      setTimeout(() => {
        setSpeaking(true);
        setVoiceResponse("Grade 8A had a strong week! Average score: 70% (↑ from 66%). 12 students at EE level, 3 at-risk. I recommend re-teaching Factorisation — 8 students scored below 55%. Want me to generate a remedial lesson plan?");
        setTimeout(() => setSpeaking(false), 4000);
      }, 800);
    } else {
      setListening(true);
      setVoiceTranscript("");
      setVoiceResponse("");
    }
  };

  const askVoiceShortcut = (q: string) => {
    setVoiceTranscript(q);
    setSpeaking(true);
    setVoiceResponse(`Here's what I found for "${q}": Grade 8A average is 70% this week. 3 students need extra attention. Factorisation needs re-teaching for 8 students. Want me to generate content or schedule a catch-up session?`);
    setTimeout(() => setSpeaking(false), 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <Sparkles size={22} color="var(--purple)" />
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>🤖 AI Teacher Studio</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Plan, create, push and track — your all-in-one teaching assistant</p>
        </div>
        <span className="badge" style={{ background: "rgba(168,85,247,.1)", color: "var(--purple)", marginLeft: "auto", fontSize: 11 }}>AI Powered</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { id: "tools" as TabId, icon: "🤖", label: "AI Tools" },
          { id: "push" as TabId, icon: "📤", label: "Push to Class" },
          { id: "planner" as TabId, icon: "📅", label: "Lesson Planner" },
          { id: "voice" as TabId, icon: "🎙️", label: "Voice Assistant" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: "8px 18px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              background: tab === t.id ? "var(--navy)" : "transparent",
              color: tab === t.id ? "#fff" : "var(--muted)",
              border: "1.5px solid",
              borderColor: tab === t.id ? "var(--navy)" : "var(--border)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── AI Tools ── */}
      {tab === "tools" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: 10 }}>
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

          <div className="card" style={{ border: `2px solid ${activeTool.color}20`, background: `${activeTool.color}05` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>{activeTool.icon}</span>
              <div>
                <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700 }}>{activeTool.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{activeTool.desc}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder={activeTool.placeholder} className="input" style={{ flex: 1 }} />
              <button onClick={generate} disabled={generating} className="btn btn-navy" style={{ minWidth: 140, justifyContent: "center", gap: 6 }}>
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

          {output && (
            <div className="card" style={{ border: "1.5px solid rgba(34,197,94,.3)", background: "rgba(34,197,94,.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{activeTool.icon}</span>
                  <h3 style={{ color: "var(--green)", fontSize: 14, fontWeight: 700 }}>
                    ✅ {activeTool.title} — {topic || activeTool.placeholder.replace("e.g. ", "")}
                  </h3>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 12px" }} onClick={() => addToast("success", "Copied!")}>
                    <Copy size={11} /> Copy
                  </button>
                  <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 12px" }} onClick={() => addToast("info", "Downloading PDF...")}>
                    <Download size={11} /> PDF
                  </button>
                  <button className="btn btn-navy" style={{ fontSize: 11, padding: "5px 12px" }} onClick={() => setTab("push")}>
                    Push to Class <ChevronRight size={11} />
                  </button>
                </div>
              </div>
              <pre style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", background: "var(--bg)", padding: 16, borderRadius: 10, maxHeight: 480, overflowY: "auto" }}>{output}</pre>
            </div>
          )}

          <div className="card" style={{ background: "var(--navy)", border: "none" }}>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>⏱️ Time Saved This Term</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(150px, 100%), 1fr))", gap: 12 }}>
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
        </>
      )}

      {/* ── Push to Class ── */}
      {tab === "push" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: 16 }}>
          <div className="card">
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📤 Push Content to Students</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ color: "var(--muted)", fontSize: 11, display: "block", marginBottom: 4 }}>Select Class / Group</label>
                <select className="input" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={{ cursor: "pointer" }}>
                  {CLASSES.map((c) => <option key={c}>{c}</option>)}
                  <option>At-Risk Students Only</option>
                  <option>Top Performers Only</option>
                </select>
              </div>
              <div>
                <label style={{ color: "var(--muted)", fontSize: 11, display: "block", marginBottom: 4 }}>Content Type</label>
                <select className="input" value={selectedContent} onChange={(e) => setSelectedContent(e.target.value)} style={{ cursor: "pointer" }}>
                  {CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: "var(--muted)", fontSize: 11, display: "block", marginBottom: 6 }}>Delivery</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ val: "now", label: "Send Now" }, { val: "schedule", label: "Schedule" }].map((o) => (
                    <button key={o.val} onClick={() => setPushSchedule(o.val)}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, border: "1.5px solid",
                        background: pushSchedule === o.val ? "var(--navy)" : "transparent",
                        color: pushSchedule === o.val ? "#fff" : "var(--muted)",
                        borderColor: pushSchedule === o.val ? "var(--navy)" : "var(--border)",
                      }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              {pushSchedule === "schedule" && (
                <div>
                  <label style={{ color: "var(--muted)", fontSize: 11, display: "block", marginBottom: 4 }}>Date & Time</label>
                  <input type="datetime-local" className="input" />
                </div>
              )}
              <div>
                <label style={{ color: "var(--muted)", fontSize: 11, display: "block", marginBottom: 4 }}>Message (optional)</label>
                <textarea className="input" value={pushNote} onChange={(e) => setPushNote(e.target.value)}
                  placeholder="e.g. Complete this before Friday's test!"
                  style={{ resize: "vertical", minHeight: 60 }} />
              </div>
              <button className="btn btn-navy" style={{ justifyContent: "center", gap: 8 }} onClick={handlePush}>
                <Send size={14} /> Push to {selectedClass}
              </button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📊 Delivery Tracker</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RECENT_PUSHES.map((p, i) => (
                <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 700 }}>{p.content}</p>
                      <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 2 }}>→ {p.target} · {p.time}</p>
                    </div>
                    <span className="badge" style={{ background: "rgba(34,197,94,.1)", color: "var(--green)", fontSize: 9 }}>🟢 Live</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${Math.round(p.views / p.total * 100)}%`, background: "var(--navy)" }} />
                    </div>
                    <span style={{ color: "var(--navy)", fontSize: 11, fontWeight: 700, minWidth: 60, textAlign: "right" }}>
                      {p.views}/{p.total} viewed
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
              {[
                { label: "Pushed Today", value: "3", color: "var(--blue)" },
                { label: "Avg View Rate", value: "76%", color: "var(--green)" },
                { label: "Total Pushed", value: "48", color: "var(--purple)" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center", padding: "10px 8px", background: "var(--bg)", borderRadius: 8 }}>
                  <p style={{ color: s.color, fontSize: 18, fontWeight: 800 }}>{s.value}</p>
                  <p style={{ color: "var(--muted)", fontSize: 10, marginTop: 2 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Lesson Planner ── */}
      {tab === "planner" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700 }}>📅 Week 7 Lesson Calendar</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 12px" }}>← Week 6</button>
                <span style={{ color: "var(--muted)", fontSize: 12, padding: "5px 0" }}>Jan 6–10, 2025</span>
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 12px" }}>Week 8 →</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, overflowX: "auto" }}>
              {WEEK_DAYS.map((day) => (
                <div key={day}>
                  <p style={{ color: "var(--muted)", fontSize: 11, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>{day}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {PLANNER_DATA[day]?.map((lesson, i) => (
                      <div key={i} style={{
                        padding: "8px 10px", borderRadius: 8, border: "1.5px solid",
                        background: lesson.done ? "rgba(34,197,94,.06)" : lesson.type === "Competition" ? "rgba(168,85,247,.06)" : "var(--bg)",
                        borderColor: lesson.done ? "rgba(34,197,94,.2)" : lesson.type === "Competition" ? "rgba(168,85,247,.2)" : "var(--border)",
                      }}>
                        <p style={{ color: "var(--navy)", fontSize: 10, fontWeight: 700 }}>{lesson.subject}</p>
                        <p style={{ color: "var(--text)", fontSize: 11, marginTop: 2 }}>{lesson.topic}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                          <span className="badge" style={{ background: "var(--bg2)", color: "var(--muted)", fontSize: 9, padding: "1px 6px" }}>{lesson.type}</span>
                          {lesson.done && <Check size={10} color="var(--green)" />}
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-ghost" style={{ padding: "4px", fontSize: 10, justifyContent: "center", borderStyle: "dashed" }}>
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 16 }}>
            <div className="card">
              <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📚 Syllabus Coverage</h3>
              {[
                { subject: "Mathematics", done: 62, color: "var(--blue)" },
                { subject: "Science", done: 58, color: "var(--green)" },
                { subject: "English", done: 70, color: "#ef4444" },
                { subject: "Kiswahili", done: 55, color: "var(--yellow)" },
                { subject: "Social Studies", done: 67, color: "var(--purple)" },
              ].map((s) => (
                <div key={s.subject} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: "var(--text)", fontSize: 12 }}>{s.subject}</span>
                    <span style={{ color: s.color, fontSize: 12, fontWeight: 700 }}>{s.done}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${s.done}%`, background: s.color }} />
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost" style={{ fontSize: 11, width: "100%", justifyContent: "center", marginTop: 8 }}>
                View Full Syllabus Plan
              </button>
            </div>

            <div className="card">
              <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🏆 Competition Organizer</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { name: "Weekly Class Challenge", class: "Grade 8A vs 8B", date: "Mon Jan 6", status: "live", color: "var(--green)" },
                  { name: "School Championship", class: "All Grade 8", date: "Jan 13", status: "upcoming", color: "var(--yellow)" },
                  { name: "LYSI National League", class: "All Grades", date: "Term End", status: "planned", color: "var(--purple)" },
                ].map((c) => (
                  <div key={c.name} style={{ padding: "10px 12px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 700 }}>{c.name}</p>
                      <span className="badge" style={{ background: "var(--bg2)", color: "var(--muted)", fontSize: 9 }}>
                        {c.status === "live" ? "🟢 Live" : c.status === "upcoming" ? "⏳ Soon" : "📌 Planned"}
                      </span>
                    </div>
                    <p style={{ color: "var(--muted)", fontSize: 11 }}>{c.class} · {c.date}</p>
                  </div>
                ))}
                <button className="btn btn-navy" style={{ justifyContent: "center", fontSize: 11, gap: 6 }}>
                  + Schedule Competition
                </button>
              </div>
            </div>

            <div className="card">
              <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📈 Your Teaching Metrics</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Lessons delivered this term", value: "42", icon: "📋", color: "var(--blue)" },
                  { label: "AI tools used this term", value: "38", icon: "🤖", color: "var(--purple)" },
                  { label: "Content pushed to classes", value: "48", icon: "📤", color: "var(--green)" },
                  { label: "Avg class engagement", value: "76%", icon: "📊", color: "var(--yellow)" },
                  { label: "Students at EE/ME level", value: "74%", icon: "⭐", color: "var(--teal)" },
                  { label: "Tests set & marked", value: "12", icon: "✍️", color: "#ef4444" },
                ].map((m) => (
                  <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: "var(--bg)" }}>
                    <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{m.icon}</span>
                    <span style={{ color: "var(--text)", fontSize: 12, flex: 1 }}>{m.label}</span>
                    <span style={{ color: m.color, fontSize: 14, fontWeight: 800 }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Voice Assistant ── */}
      {tab === "voice" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: 16 }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: 32 }}>
            <div>
              <h3 style={{ color: "var(--navy)", fontSize: 16, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>🎙️ Teaching Voice Assistant</h3>
              <p style={{ color: "var(--muted)", fontSize: 12, textAlign: "center" }}>Ask about your class, get lesson help, or generate content — hands-free</p>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{
                width: 120, height: 120, borderRadius: "50%",
                background: speaking
                  ? "linear-gradient(135deg, var(--navy), var(--blue))"
                  : "linear-gradient(135deg, rgba(26,51,101,.15), rgba(59,130,246,.15))",
                border: `3px solid ${speaking ? "var(--navy)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50,
                animation: speaking ? "pulse 1s ease-in-out infinite" : "none",
                transition: "all 0.4s ease",
              }}>
                🤖
              </div>
              {speaking && (
                <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "3px solid rgba(26,51,101,.2)", animation: "ripple 1.2s linear infinite" }} />
              )}
            </div>

            <div style={{ textAlign: "center", width: "100%" }}>
              <p style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                {speaking ? "Assistant is speaking..." : listening ? "Listening to you..." : "Tap mic to ask"}
              </p>
              {voiceTranscript && (
                <p style={{ color: "var(--purple)", fontSize: 12, fontStyle: "italic", marginBottom: 8 }}>
                  You: &ldquo;{voiceTranscript}&rdquo;
                </p>
              )}
              {voiceResponse ? (
                <div style={{ background: "var(--bg)", borderRadius: 10, padding: "12px 14px", textAlign: "left", fontSize: 12, color: "var(--text)", lineHeight: 1.6, border: "1px solid var(--border)" }}>
                  {voiceResponse}
                </div>
              ) : (
                <p style={{ color: "var(--muted)", fontSize: 12 }}>{VOICE_PROMPTS[voicePromptIdx]}</p>
              )}
            </div>

            {speaking && (
              <div style={{ display: "flex", gap: 4, alignItems: "center", height: 40 }}>
                {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 0.3, 0.8, 0.7].map((h, i) => (
                  <div key={i} style={{ width: 4, height: `${h * 36}px`, borderRadius: 4, background: "var(--navy)", animation: `soundbar 0.${5 + (i % 5)}s ease-in-out infinite alternate` }} />
                ))}
              </div>
            )}

            <button onClick={toggleVoice}
              style={{
                width: 72, height: 72, borderRadius: "50%", border: "none", cursor: "pointer",
                background: listening ? "#ef4444" : "var(--navy)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: listening ? "0 0 0 10px rgba(239,68,68,.2)" : "0 4px 20px rgba(26,51,101,.4)",
                transition: "all 0.3s",
              }}>
              {listening ? <MicOff size={28} color="#fff" /> : <Mic size={28} color="#fff" />}
            </button>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
              {["Class performance", "Lesson plan help", "Generate a quiz", "At-risk students"].map((q) => (
                <button key={q} onClick={() => askVoiceShortcut(q)}
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 100, padding: "5px 12px", color: "var(--muted)", fontSize: 11, cursor: "pointer" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>💡 What you can ask</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "📊", title: "Class Insights", desc: "'How did Grade 8A perform this week?'" },
                { icon: "📋", title: "Lesson Planning", desc: "'Generate a lesson plan for Algebra'" },
                { icon: "✍️", title: "Test Creation", desc: "'Create a 10-question quiz on Forces'" },
                { icon: "⚠️", title: "At-Risk Alerts", desc: "'Which students need extra help?'" },
                { icon: "📅", title: "Scheduling", desc: "'Schedule a competition for Friday'" },
                { icon: "📤", title: "Push Content", desc: "'Send today\'s notes to Grade 8A'" },
                { icon: "🔁", title: "Re-teach", desc: "'What topics should I re-teach?'" },
                { icon: "🏆", title: "Motivation", desc: "'Who are the top students this week?'" },
              ].map((tip) => (
                <div key={tip.title} style={{ display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, background: "var(--bg)" }}>
                  <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{tip.icon}</span>
                  <div>
                    <p style={{ color: "var(--navy)", fontSize: 12, fontWeight: 700 }}>{tip.title}</p>
                    <p style={{ color: "var(--muted)", fontSize: 11 }}>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes soundbar { 0% { transform: scaleY(0.4); } 100% { transform: scaleY(1); } }
      `}</style>
    </div>
  );
}
