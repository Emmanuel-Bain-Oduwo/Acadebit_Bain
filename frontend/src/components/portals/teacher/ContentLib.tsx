"use client";
import { useState } from "react";
import { Play, Headphones, FileText, Layers, Upload, Send, Download, Eye } from "lucide-react";

const LIBRARY: {
  id: string; subject: string; title: string; type: "video" | "podcast" | "notes" | "flashcards";
  duration: string; ai: boolean; published: boolean; views: number;
}[] = [
  { id: "l1", subject: "Mathematics", title: "Quadratic Equations — Full Lesson", type: "video", duration: "14 min", ai: false, published: true, views: 38 },
  { id: "l2", subject: "Mathematics", title: "Linear Equations Podcast", type: "podcast", duration: "18 min", ai: true, published: true, views: 31 },
  { id: "l3", subject: "Science", title: "Photosynthesis — Diagrams & Notes", type: "notes", duration: "8 pages", ai: true, published: true, views: 40 },
  { id: "l4", subject: "Science", title: "Cell Biology Flashcards (42 cards)", type: "flashcards", duration: "42 cards", ai: true, published: false, views: 0 },
  { id: "l5", subject: "English", title: "Reading Comprehension Strategies", type: "video", duration: "11 min", ai: false, published: true, views: 29 },
  { id: "l6", subject: "English", title: "Essay Writing Guide — Notes", type: "notes", duration: "12 pages", ai: true, published: true, views: 22 },
  { id: "l7", subject: "Kiswahili", title: "Insha — AI Voice Lesson", type: "podcast", duration: "22 min", ai: true, published: false, views: 0 },
  { id: "l8", subject: "Social Studies", title: "Map Reading & Interpretation", type: "video", duration: "9 min", ai: false, published: true, views: 22 },
  { id: "l9", subject: "Mathematics", title: "Algebra Key Terms Flashcards", type: "flashcards", duration: "30 cards", ai: true, published: true, views: 35 },
  { id: "l10", subject: "Science", title: "Forces & Motion Podcast", type: "podcast", duration: "15 min", ai: true, published: false, views: 0 },
];

const SUBJECTS = ["All", "Mathematics", "Science", "English", "Kiswahili", "Social Studies"];

const TYPE_META: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  video:      { icon: <Play size={13} />, label: "Video", color: "#ef4444", bg: "rgba(239,68,68,.1)" },
  podcast:    { icon: <Headphones size={13} />, label: "Podcast", color: "var(--yellow)", bg: "rgba(245,158,11,.1)" },
  notes:      { icon: <FileText size={13} />, label: "Notes", color: "var(--blue)", bg: "rgba(59,130,246,.1)" },
  flashcards: { icon: <Layers size={13} />, label: "Flashcards", color: "var(--purple)", bg: "rgba(168,85,247,.1)" },
};

const CLASSES = ["Grade 8A", "Grade 8B", "Grade 7A", "Grade 7B", "All Grades"];

export default function ContentLib() {
  const [subject, setSubject] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [published, setPublished] = useState<Record<string, boolean>>(
    Object.fromEntries(LIBRARY.map((l) => [l.id, l.published]))
  );
  const [assignClass, setAssignClass] = useState<string | null>(null);
  const [assignItem, setAssignItem] = useState<string | null>(null);

  const filtered = LIBRARY.filter((l) => subject === "All" || l.subject === subject);

  const togglePublish = (id: string) => setPublished((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>📦 Content Library</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Manage, publish and assign learning content to your classes</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }} onClick={() => setShowUpload(!showUpload)}>
            <Upload size={13} /> Upload Content
          </button>
          <button className="btn btn-navy" style={{ fontSize: 12, padding: "8px 14px" }}>
            <Send size={13} /> Assign to Class
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {[
          { icon: "🎬", label: "Videos", value: LIBRARY.filter((l) => l.type === "video").length.toString(), color: "#ef4444" },
          { icon: "🎧", label: "Podcasts", value: LIBRARY.filter((l) => l.type === "podcast").length.toString(), color: "var(--yellow)" },
          { icon: "📄", label: "Notes/PDFs", value: LIBRARY.filter((l) => l.type === "notes").length.toString(), color: "var(--blue)" },
          { icon: "🃏", label: "Flashcard Decks", value: LIBRARY.filter((l) => l.type === "flashcards").length.toString(), color: "var(--purple)" },
          { icon: "✅", label: "Published", value: LIBRARY.filter((l) => l.published).length.toString(), color: "var(--green)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <div>
              <p style={{ color: s.color, fontSize: 20, fontWeight: 800 }}>{s.value}</p>
              <p style={{ color: "var(--muted)", fontSize: 11 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Panel */}
      {showUpload && (
        <div className="card" style={{ border: "2px dashed var(--border)", background: "var(--bg)" }}>
          <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📤 Upload New Content</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ color: "var(--muted)", fontSize: 11, display: "block", marginBottom: 4 }}>Title</label>
              <input className="input" placeholder="e.g. Algebra — Grade 8 Notes" />
            </div>
            <div>
              <label style={{ color: "var(--muted)", fontSize: 11, display: "block", marginBottom: 4 }}>Subject</label>
              <select className="input" style={{ cursor: "pointer" }}>
                {SUBJECTS.filter((s) => s !== "All").map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: "var(--muted)", fontSize: 11, display: "block", marginBottom: 4 }}>Content Type</label>
              <select className="input" style={{ cursor: "pointer" }}>
                <option>Video</option><option>Podcast</option><option>Notes/PDF</option><option>Flashcards</option>
              </select>
            </div>
            <div>
              <label style={{ color: "var(--muted)", fontSize: 11, display: "block", marginBottom: 4 }}>Assign to Class</label>
              <select className="input" style={{ cursor: "pointer" }}>
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{
            marginTop: 14, padding: "24px", border: "2px dashed var(--border)", borderRadius: 10,
            textAlign: "center", background: "#fff",
          }}>
            <Upload size={24} color="var(--muted)" style={{ margin: "0 auto 8px" }} />
            <p style={{ color: "var(--muted)", fontSize: 12 }}>Drag & drop file here, or click to browse</p>
            <p style={{ color: "var(--muted2)", fontSize: 10, marginTop: 4 }}>Supports MP4, MP3, PDF, PPTX — max 500MB</p>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="btn btn-navy" style={{ fontSize: 12 }}>Upload & Publish</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setShowUpload(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignItem && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setAssignItem(null)}>
          <div className="card" style={{ width: 360, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
              Assign to Class
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 14 }}>
              {LIBRARY.find((l) => l.id === assignItem)?.title}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {CLASSES.map((c) => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="radio" name="class" value={c} checked={assignClass === c}
                    onChange={() => setAssignClass(c)}
                    style={{ accentColor: "var(--navy)" }} />
                  <span style={{ color: "var(--text)", fontSize: 13 }}>{c}</span>
                </label>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-navy" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}
                onClick={() => { setAssignItem(null); setAssignClass(null); }}>
                Assign Now
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setAssignItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {SUBJECTS.map((s) => (
          <button key={s} onClick={() => setSubject(s)}
            style={{
              padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", border: "1.5px solid",
              background: subject === s ? "var(--navy)" : "transparent",
              color: subject === s ? "#fff" : "var(--muted)",
              borderColor: subject === s ? "var(--navy)" : "var(--border)",
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {filtered.map((item) => {
          const meta = TYPE_META[item.type];
          const isPub = published[item.id];
          return (
            <div key={item.id} className="card card-hover" style={{ position: "relative" }}>
              {/* Type + badges */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: meta.bg, color: meta.color, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                  {meta.icon} {meta.label}
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {item.ai && <span className="badge" style={{ background: "rgba(168,85,247,.1)", color: "var(--purple)", fontSize: 9 }}>🤖 AI</span>}
                  <span className="badge" style={{
                    background: isPub ? "rgba(34,197,94,.1)" : "var(--bg)",
                    color: isPub ? "var(--green)" : "var(--muted)", fontSize: 9,
                  }}>{isPub ? "✅ Published" : "Draft"}</span>
                </div>
              </div>

              <p style={{ color: "var(--navy)", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{item.title}</p>
              <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 10 }}>{item.subject} · {item.duration}</p>

              {/* View count */}
              {isPub && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                  <Eye size={11} color="var(--muted)" />
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>{item.views} students viewed</span>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${Math.round(item.views / 45 * 100)}%`, background: "var(--navy)" }} />
                  </div>
                  <span style={{ color: "var(--navy)", fontSize: 11, fontWeight: 700 }}>{Math.round(item.views / 45 * 100)}%</span>
                </div>
              )}

              <div style={{ display: "flex", gap: 7 }}>
                <button className="btn btn-navy" style={{ flex: 1, justifyContent: "center", padding: "7px 10px", fontSize: 11 }}
                  onClick={() => setAssignItem(item.id)}>
                  <Send size={11} /> Assign to Class
                </button>
                <button className="btn btn-ghost" style={{ padding: "7px 10px", fontSize: 11 }}
                  onClick={() => togglePublish(item.id)}>
                  {isPub ? "Unpublish" : "Publish"}
                </button>
                <button className="btn btn-ghost" style={{ padding: "7px 10px" }}>
                  <Download size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
