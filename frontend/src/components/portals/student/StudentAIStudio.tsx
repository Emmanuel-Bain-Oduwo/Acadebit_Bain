"use client";
import { useState } from "react";
import { Sparkles, Download, Copy, Share2 } from "lucide-react";
import { useStore } from "@/store";

const TOOLS = [
  { id: "notes",    icon: "📄", title: "Study Notes",     color: "var(--blue)",   desc: "AI notes on any topic — ready to print", placeholder: "e.g. Photosynthesis, Grade 8 Science" },
  { id: "ppt",      icon: "🖼️", title: "Presentation",    color: "var(--purple)", desc: "Revision slides in seconds",              placeholder: "e.g. The Water Cycle" },
  { id: "flash",    icon: "🃏", title: "Flashcards",      color: "var(--teal)",   desc: "Instant flashcard deck to memorise fast", placeholder: "e.g. Cell Biology key terms" },
  { id: "video",    icon: "🎬", title: "Video Script",    color: "#ef4444",       desc: "Turn a topic into a video lesson script", placeholder: "e.g. Algebra — Grade 8" },
  { id: "podcast",  icon: "🎙️", title: "Podcast / Audio", color: "var(--yellow)", desc: "Convert notes into an audio podcast",      placeholder: "e.g. Kenya Geography" },
  { id: "image",    icon: "🖼",  title: "Diagram Guide",  color: "var(--navy)",   desc: "Labeled diagram instructions & tips",     placeholder: "e.g. Human Digestive System" },
  { id: "mindmap",  icon: "🧠", title: "Mind Map",        color: "var(--green)",  desc: "Visual mind map structure for any topic", placeholder: "e.g. Forces & Motion" },
  { id: "summary",  icon: "📝", title: "Lesson Summary",  color: "var(--orange)", desc: "Bullet-point summary of any lesson",      placeholder: "e.g. Quadratic Equations Week 7" },
  { id: "exam",     icon: "✍️", title: "Practice Exam",   color: "#f97316",       desc: "Questions + full marking scheme",         placeholder: "e.g. Mathematics KCSE topics" },
  { id: "plan",     icon: "📅", title: "7-Day Study Plan",color: "var(--indigo)", desc: "Personal AI study schedule for the week", placeholder: "e.g. Prepare for Maths test Friday" },
];

const SAMPLES: Record<string, string> = {
  notes: `## Study Notes: {{TOPIC}}

**Subject:** Science · **CBC Strand:** Living Things & Their Environment

---
### 1. What is {{TOPIC}}?
{{TOPIC}} is a fundamental process where...

### 2. Five Key Points to Remember
✅ Point 1 — The core concept (most exam-tested)
✅ Point 2 — Link to real-world examples
✅ Point 3 — The formula or equation involved
✅ Point 4 — How it connects to other topics
✅ Point 5 — Common examiner question areas

### 3. Key Definitions
| Term         | Simple Meaning         |
|---|---|
| Term A       | Clear, one-line definition |
| Term B       | Explanation in plain English |
| Term C       | With a Kenyan example |

### 4. Worked Example
Given: [problem]
Step 1: Identify what is being asked
Step 2: Apply the concept of {{TOPIC}}
Step 3: Show working clearly
Answer: [result with units if needed]

### 5. Quick Self-Test
Q1: Define {{TOPIC}} in one sentence.
Q2: Name 3 key components or stages.
Q3: Give one real-world example in Kenya.`,

  ppt: `## Presentation Slides: {{TOPIC}}

**Slide 1 — Title**
📌 {{TOPIC}} | Grade 8 | Term 2, Week 7

**Slide 2 — Learning Objectives**
By end of this lesson, I will be able to:
• Define {{TOPIC}} correctly
• Explain the process step-by-step
• Connect it to real-world Kenya

**Slide 3 — What is {{TOPIC}}?**
Definition: "{{TOPIC}} is the process by which..."
🖼️ [Diagram goes here]

**Slide 4 — How It Works (Step-by-Step)**
① Step one → ② Step two → ③ Step three → ✅ Outcome
Real-world example from Kenya: [...]

**Slide 5 — Fun Fact!**
Did you know? {{TOPIC}} is responsible for...

**Slide 6 — Exam Practice Questions**
1. (Easy) What is {{TOPIC}}?
2. (Medium) Explain how {{TOPIC}} occurs.
3. (Hard) Evaluate the importance of {{TOPIC}}.

**Slide 7 — Summary + Homework**
Key takeaways: [3 bullet points]
📚 Homework: Complete the Acadebit flashcard deck on {{TOPIC}}`,

  flash: `## Flashcard Deck: {{TOPIC}} — 20 Cards

**Card 1**
❓ Define {{TOPIC}} in one sentence.
✅ [Exam-ready definition]

**Card 2**
❓ Name the 3 main stages of {{TOPIC}}.
✅ Stage 1 · Stage 2 · Stage 3

**Card 3**
❓ Where does {{TOPIC}} take place in the body/nature?
✅ [Location + explanation]

**Card 4**
❓ What are the INPUTS required for {{TOPIC}}?
✅ [List with arrows: A + B + C →]

**Card 5**
❓ What are the OUTPUTS or products of {{TOPIC}}?
✅ [List outputs + significance]

**Card 6**
❓ Give a real-world Kenyan example of {{TOPIC}}.
✅ [Specific, relatable local example]

**Card 7**
❓ KCSE exam style: "Explain the process of {{TOPIC}}."
✅ [Model 3-sentence answer, examiners love this]

**Card 8**
❓ What is the difference between {{TOPIC}} and [similar concept]?
✅ [Clear comparison — 2 key differences]

[...12 more cards covering formulas, cross-subject links, exam tips, and application questions]

💡 Study tip: Do 10 cards in the morning, 10 in the evening. Review any wrong ones the next day.`,

  video: `## Video Script: {{TOPIC}}
Duration: ~8 min | Grade 8 | CBC-aligned

---
[INTRO — 30 seconds]
"Hey learners! Welcome back to Acadebit Learning. Today we're covering {{TOPIC}} — one of the most important topics in Grade 8. By the end of this video, you'll totally get it. Let's go!"

[SECTION 1 — Definition (2 min)]
"So what exactly is {{TOPIC}}? Simple — it's the process where..."
[Show: text definition + simple diagram on screen]
"Here in Kenya, you see this every single day when you..."
[Real-world Kenyan analogy to hook learners]

[SECTION 2 — Step-by-Step Process (3 min)]
"Now let's break down HOW {{TOPIC}} works. Follow these steps:"
Step 1: [Show animation or diagram] → explain
Step 2: [Continue] → explain
Step 3: [Final outcome] → explain
"See how that works? Let me show you one more time..."

[SECTION 3 — KCSE Exam Connection (2 min)]
"This topic appears in 80% of KCSE papers. Here's what examiners want:"
[Show real past paper question]
"Model answer: Start by stating the definition, then describe the process in 3 steps, then give an example. Done!"

[OUTRO — 30 seconds]
"Today's 3 key takeaways: [Point 1], [Point 2], [Point 3]
Go do your flashcard deck right now while it's fresh. See you next lesson — keep learning!"`,

  podcast: `## Podcast Script: {{TOPIC}}
Duration: ~12 min | Offline-ready | AI Voice

---
[INTRO JINGLE — 5 sec]

HOST: "Welcome to your Acadebit Study Podcast! I'm your AI tutor. Today's topic: {{TOPIC}}. Whether you're on a matatu or walking home — this episode will make you an expert. Let's go!"

[SEGMENT 1 — 3 min: What is it?]
"Let's start simply. {{TOPIC}} is... Think of it like this..."
[Conversational, no jargon, with a Kenyan analogy]
"Here's a memory trick: [mnemonic or shortcut]"

[SEGMENT 2 — 4 min: How it works]
"Now, here's the part most students get confused about in exams..."
"The key thing to understand is..."
[Walk through a worked example, slowly and clearly]
"Pause me here if you need to write this down."

[SEGMENT 3 — Exam Tips — 3 min]
"KCSE examiners love asking about {{TOPIC}}. Here are the 3 things you MUST include in your answer:"
"1. Always define the term first."
"2. Describe the process in steps."
"3. Give a real-world example."

[OUTRO — 2 min]
"Today's summary: [3 takeaways].
Open Acadebit, complete the flashcards, then try the practice exam. You've got this — see you next episode!"`,

  image: `## Diagram Guide: {{TOPIC}}

**Title:** {{TOPIC}} — Complete Labeled Diagram
**Format:** A4 Portrait | For print or digital display

---
### Step-by-Step Drawing Instructions:
1. Start: Draw the outer container (oval/rectangle/circle)
2. Add: Main internal structures from largest to smallest
3. Label: Draw arrows pointing outward from each part
4. Caption: Add "Fig 1.1 — {{TOPIC}}" at the bottom

### Required Labels (aim for 8+):
🔵 Label 1: [Part name] → Function: [what it does]
🔵 Label 2: [Part name] → Function: [what it does]
🔵 Label 3: [Part name] → Function: [what it does]
🔵 Label 4: [Part name] → Function: [what it does]
🔵 Label 5: [Part name] → Function: [what it does]
🔵 Label 6: [Part name] → Function: [what it does]
🔵 Label 7: [Part name] → Function: [what it does]
🔵 Label 8: [Part name] → Function: [what it does]

### KCSE Exam Tip:
Examiners award 1 mark per correct label.
Drawing question: "Draw a well-labeled diagram of {{TOPIC}}. (6 marks)"
Always use a ruler for arrow lines. Write labels clearly outside the diagram.`,

  mindmap: `## Mind Map: {{TOPIC}}

🧠 CENTRAL NODE: **{{TOPIC}}**

━━ 🔵 BRANCH 1: Definition
  ├─ Core meaning
  ├─ Key vocabulary
  └─ CBC strand it belongs to

━━ 🟢 BRANCH 2: How It Works
  ├─ Step 1 →
  ├─ Step 2 →
  └─ Step 3 → outcome

━━ 🟡 BRANCH 3: Real Examples
  ├─ Kenyan everyday example
  ├─ School lab example
  └─ Global significance

━━ 🔴 BRANCH 4: Why It Matters
  ├─ Importance in nature/society
  ├─ Connection to other topics
  └─ CBC competency: EE requires...

━━ 🟣 BRANCH 5: Exam Strategy
  ├─ Common question types
  ├─ Keywords examiners want
  └─ Marks allocation guide

━━ 🟠 BRANCH 6: Connected Topics
  ├─ Related Strand topic
  ├─ Cross-subject link (Maths/Science)
  └─ Real-world application

💡 Colour each branch differently. Add small icons or sketches to each node.
Print and stick on your bedroom wall for daily revision!`,

  summary: `## Lesson Summary: {{TOPIC}}
**Today's Date** | Grade 8 | Week 7

---
### ⚡ In 3 Sentences:
{{TOPIC}} is... It works by... This matters because...

### 📌 5 Must-Know Points:
1. [Most critical concept — this is always tested]
2. [Second key idea with explanation]
3. [The formula, equation, or rule]
4. [Real-world connection to Kenya]
5. [Common exam trick or pitfall]

### 🔑 Key Terms:
• **Term A** — [simple definition]
• **Term B** — [simple definition]
• **Term C** — [simple definition]

### ✅ After this lesson, I can:
- ☐ Define {{TOPIC}} without looking at notes
- ☐ Explain the process in 3 steps
- ☐ Label a diagram correctly
- ☐ Answer a KCSE-style question

### ⚠️ Common Mistakes Students Make:
- Confusing [Term A] with [Term B]
- Forgetting to include [specific detail] in answers
- Missing units when writing formulae

### 📚 Next Step:
Complete the flashcard deck → then take the Practice Exam on Acadebit`,

  exam: `## Practice Exam: {{TOPIC}}
⏱ Time: 45 minutes | 📝 Total: 40 marks

---
### SECTION A — Multiple Choice (10 marks, 1 each)

1. Which statement BEST describes {{TOPIC}}?
   A) ...   B) ...   C) ...   D) ...

2. During {{TOPIC}}, the primary output is:
   A) ...   B) ...   C) ...   D) ...

3. Which organ/location is MOST associated with {{TOPIC}}?
   A) ...   B) ...   C) ...   D) ...

[...7 more MCQ questions at AE to EE level]

---
### SECTION B — Short Answer (18 marks)

Q11. (3 marks) Define {{TOPIC}} and state ONE reason it is important.

Q12. (6 marks) Describe the process of {{TOPIC}} in 4 steps. Include a simple labeled diagram.

Q13. (4 marks) Compare {{TOPIC}} with [related process]. Give 2 similarities and 2 differences.

Q14. (5 marks) "{{TOPIC}} only occurs under certain conditions." Is this correct? Explain using evidence.

---
### SECTION C — Extended Response (12 marks)

Q15. (12 marks) Discuss the importance of {{TOPIC}} in everyday Kenyan life. Use specific examples and explain the significance to society and the environment.

---
## ✅ MARKING SCHEME
Q1–10: [Answers: 1-D, 2-A, 3-C ...]
Q11: Definition (1mk) + reason (2mk) = 3 marks
Q12: Each correct step = 1mk (×4) + diagram labels = 2mk
Q13: Each similarity = 1mk, each difference = 1mk = 4 marks
Q15: Content (6mk) + examples (3mk) + expression (3mk) = 12 marks`,

  plan: `## Your 7-Day Study Plan: {{TOPIC}}
🎯 Goal: Master {{TOPIC}} before your next test | AI-Generated

---
### 📅 DAY 1 — Monday (30 min)
🎬 Watch: "{{TOPIC}} Introduction" video (14 min)
📄 Read: Your AI Study Notes (10 min)
🃏 Do: First 5 flashcards (6 min)
Goal: Understand WHAT {{TOPIC}} is

### 📅 DAY 2 — Tuesday (25 min)
🎙️ Listen: {{TOPIC}} Podcast on the way to school (15 min)
🃏 Do: Next 5 flashcards (10 min)
Goal: Lock in the vocabulary

### 📅 DAY 3 — Wednesday (40 min)
🖼 Draw: Labeled diagram from memory — no peeking (15 min)
🧠 Complete: Mind map on paper (15 min)
✅ Quick Quiz: 5 questions with a timer (10 min)
Goal: Visual understanding locked in

### 📅 DAY 4 — Thursday (35 min)
📄 Try: Section A (MCQ) from Practice Exam (20 min)
💬 Review: Wrong answers with AI Tutor Chat (15 min)
Goal: Exam technique + identify weak spots

### 📅 DAY 5 — Friday (45 min)
✍️ Full Timed Practice Exam — 45 minutes (45 min)
📝 Check the marking scheme after
Goal: Real exam simulation

### 📅 DAY 6 — Saturday (20 min)
🔁 Redo: Any flashcards you got wrong this week
💬 Ask AI Tutor: 2-3 questions about your weak area
Goal: Fill every gap

### 📅 DAY 7 — Sunday (15 min)
📝 Quick read: Lesson Summary (5 min)
🃏 Speed round: All 20 flashcards (10 min)
Goal: Confident and exam-ready! 🏆

---
⭐ Completing this plan earns you +150 XP and the "Study Warrior" badge!
📊 Track your progress in your Learning Dashboard.`,
};

const MY_CREATIONS = [
  { icon: "📄", title: "Study Notes — Photosynthesis", date: "Today", xp: "+5 XP" },
  { icon: "🃏", title: "Flashcards — Quadratic Equations", date: "Yesterday", xp: "+5 XP" },
  { icon: "✍️", title: "Practice Exam — Mathematics Week 6", date: "Mon", xp: "+5 XP" },
];

export default function StudentAIStudio() {
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
      setOutput((SAMPLES[activeTool.id] ?? SAMPLES.notes).replace(/{{TOPIC}}/g, t));
      addToast("success", `${activeTool.title} generated for "${t}"`);
    }, 1600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>✨ Your AI Studio</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Generate notes, slides, flashcards, exams, mind maps and more — instantly</p>
        </div>
        <span className="badge" style={{ background: "rgba(168,85,247,.1)", color: "var(--purple)", fontSize: 11 }}>🤖 AI Powered · Free</span>
      </div>

      {/* Tool Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(150px, 100%), 1fr))", gap: 10 }}>
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => { setActiveTool(t); setOutput(null); setTopic(""); }}
            style={{
              padding: "12px 10px", borderRadius: 12, textAlign: "center", cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.18s",
              background: activeTool.id === t.id ? "var(--navy)" : "#fff",
              border: `1.5px solid ${activeTool.id === t.id ? "var(--navy)" : "var(--border)"}`,
              boxShadow: activeTool.id === t.id ? "0 4px 16px rgba(26,51,101,.2)" : "none",
            }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
            <p style={{ color: activeTool.id === t.id ? "#fff" : "var(--navy)", fontSize: 11, fontWeight: 700 }}>{t.title}</p>
          </button>
        ))}
      </div>

      {/* Active Tool Panel */}
      <div className="card" style={{ border: `2px solid ${activeTool.color}25`, background: `${activeTool.color}04` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span style={{ fontSize: 28 }}>{activeTool.icon}</span>
          <div>
            <h3 style={{ color: "var(--navy)", fontSize: 15, fontWeight: 700 }}>{activeTool.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{activeTool.desc}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder={activeTool.placeholder}
            className="input"
            style={{ flex: 1, minWidth: 200 }}
          />
          <button onClick={generate} disabled={generating} className="btn btn-navy"
            style={{ minWidth: 130, justifyContent: "center", gap: 6, flexShrink: 0 }}>
            {generating ? (
              <>
                <span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                Creating...
              </>
            ) : <><Sparkles size={13} /> Create</>}
          </button>
        </div>
      </div>

      {/* Output */}
      {output && (
        <div className="card" style={{ border: "1.5px solid rgba(34,197,94,.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{activeTool.icon}</span>
              <h3 style={{ color: "var(--green)", fontSize: 14, fontWeight: 700 }}>
                ✅ {activeTool.title} — {topic || activeTool.placeholder.replace("e.g. ", "")}
              </h3>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }}
                onClick={() => addToast("success", "Copied!")}>
                <Copy size={11} /> Copy
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }}
                onClick={() => addToast("info", "Downloading PDF...")}>
                <Download size={11} /> PDF
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }}
                onClick={() => addToast("success", "Shared with class!")}>
                <Share2 size={11} /> Share
              </button>
              <button className="btn btn-navy" style={{ fontSize: 11, padding: "5px 12px" }}
                onClick={() => addToast("success", "Saved to My Creations! +5 XP")}>
                💾 Save
              </button>
            </div>
          </div>
          <pre style={{
            color: "var(--text)", fontSize: 12, lineHeight: 1.75,
            whiteSpace: "pre-wrap", fontFamily: "inherit",
            background: "var(--bg)", padding: 16, borderRadius: 10,
            maxHeight: 400, overflowY: "auto",
          }}>{output}</pre>
        </div>
      )}

      {/* My Creations */}
      <div className="card">
        <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🗂️ My Recent Creations</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MY_CREATIONS.map((c) => (
            <div key={c.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 20 }}>{c.icon}</span>
              <span style={{ color: "var(--text)", fontSize: 13, flex: 1, fontWeight: 500 }}>{c.title}</span>
              <span style={{ color: "var(--muted)", fontSize: 11 }}>{c.date}</span>
              <span className="badge" style={{ background: "rgba(245,158,11,.1)", color: "var(--yellow)", fontSize: 10 }}>{c.xp}</span>
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }}>Open</button>
            </div>
          ))}
        </div>
        <p style={{ color: "var(--muted2)", fontSize: 11, marginTop: 10, textAlign: "center" }}>
          Each creation earns +5 XP · Saved to your library forever
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
