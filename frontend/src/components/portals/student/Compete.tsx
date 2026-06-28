"use client";
import { useState } from "react";
import { Zap, Star, Award, Clock } from "lucide-react";

const LEADERBOARD = [
  { rank: 1, name: "Cynthia Auma", score: 96, xp: 1840, streak: 14, badge: "🥇" },
  { rank: 2, name: "Esther Wambua", score: 88, xp: 1720, streak: 10, badge: "🥈" },
  { rank: 3, name: "Amina Njoroge", score: 82, xp: 1650, streak: 8, badge: "🥉" },
  { rank: 4, name: "Brian Omondi (You)", score: 74, xp: 1480, streak: 7, badge: "4" },
  { rank: 5, name: "Baraka Otieno", score: 61, xp: 1210, streak: 3, badge: "5" },
  { rank: 6, name: "James Mutua", score: 58, xp: 1090, streak: 2, badge: "6" },
];

const NATIONAL = [
  { rank: 1, name: "Wanjiru School", county: "Nairobi", score: 91 },
  { rank: 2, name: "Kisumu Boys", county: "Kisumu", score: 88 },
  { rank: 3, name: "Mwangaza Junior (Your School)", county: "Kiambu", score: 85, me: true },
  { rank: 4, name: "Nakuru Academy", county: "Nakuru", score: 82 },
  { rank: 5, name: "Mombasa Prep", county: "Mombasa", score: 79 },
];

const BADGES_EARNED = [
  { icon: "🔥", label: "7-Day Streak", desc: "Study 7 days in a row", color: "var(--yellow)", earned: true },
  { icon: "🏅", label: "Top in Science", desc: "Scored #1 in class on Science", color: "var(--green)", earned: true },
  { icon: "✅", label: "First 100%", desc: "Scored 100% on any test", color: "var(--purple)", earned: true },
  { icon: "🃏", label: "Flash Master", desc: "Complete 5 flashcard decks", color: "var(--blue)", earned: false },
  { icon: "📜", label: "Paper Champion", desc: "Complete 10 past papers", color: "var(--teal)", earned: false },
  { icon: "🏆", label: "Top in School", desc: "Rank #1 school-wide", color: "var(--yellow)", earned: false },
];

const COMPETITIONS = [
  { type: "Weekly Class Challenge", icon: "🔵", color: "#3b82f6", desc: "Every Monday — 10 questions, class vs class", status: "Live now", prize: "+200 XP" },
  { type: "School Championship", icon: "🟠", color: "#f97316", desc: "Monthly — Grade 8A vs 8B vs 8C. Same AI test.", status: "Starts Jan 6", prize: "Certificate + 500 XP" },
  { type: "National LYSI League", icon: "🟣", color: "#a855f7", desc: "Term-end — all Acadebit schools, ranked nationally", status: "Term end", prize: "National rank + Certificate" },
  { type: "Solo Speed Round", icon: "🟢", color: "#22c55e", desc: "60-second rapid fire. Beat your own record. Offline.", status: "Always open", prize: "+15 XP per round" },
];

export default function Compete() {
  const [tab, setTab] = useState<"class" | "school" | "national">("class");
  const [challenging, setChallenging] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startChallenge = () => {
    setChallenging(true);
    setCountdown(3);
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c === null || c <= 1) { clearInterval(iv); setChallenging(false); setCountdown(null); return null; }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>🏆 Competitions & Challenges</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Compete weekly. Earn XP. Climb the leaderboard. Win certificates.</p>
        </div>
        <div className="badge" style={{ background: "rgba(168,85,247,.1)", color: "var(--purple)", border: "1px solid rgba(168,85,247,.3)", fontSize: 12, fontWeight: 700 }}>
          ⭐ 1,480 XP · Level 6 Scholar
        </div>
      </div>

      {/* Competition types */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
        {COMPETITIONS.map((c) => (
          <div key={c.type} className="card" style={{ borderLeft: `4px solid ${c.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <p style={{ color: "var(--navy)", fontSize: 13, fontWeight: 700 }}>{c.type}</p>
              </div>
              <span className="badge" style={{ background: c.status === "Live now" ? "rgba(34,197,94,.1)" : "var(--bg2)", color: c.status === "Live now" ? "var(--green)" : "var(--muted)", fontSize: 9 }}>
                {c.status === "Live now" ? "🟢 " : "⏳ "}{c.status}
              </span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{c.desc}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="badge" style={{ background: "rgba(245,158,11,.1)", color: "var(--yellow)", fontSize: 10 }}>
                <Zap size={10} /> {c.prize}
              </span>
              {c.status === "Live now" || c.type === "Solo Speed Round" ? (
                <button className="btn btn-navy" style={{ padding: "6px 14px", fontSize: 12 }} onClick={startChallenge}>
                  {challenging ? `Starting in ${countdown}…` : "Join →"}
                </button>
              ) : (
                <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 12 }}>Remind me</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard tabs */}
      <div className="card">
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["class", "school", "national"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: "7px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                background: tab === t ? "var(--navy)" : "transparent",
                color: tab === t ? "#fff" : "var(--muted)",
                border: "1.5px solid",
                borderColor: tab === t ? "var(--navy)" : "var(--border)",
              }}>
              {t === "class" ? "🔵 Class" : t === "school" ? "🟠 School" : "🟣 National"}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={13} style={{ color: "var(--muted)" }} />
            <span style={{ color: "var(--muted)", fontSize: 12 }}>Maths · Week 7</span>
          </div>
        </div>

        {tab !== "national" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {LEADERBOARD.map((l) => (
              <div key={l.rank} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10,
                background: l.name.includes("You") ? "var(--navy)" : "var(--bg)",
                border: l.name.includes("You") ? "none" : "1px solid var(--border)",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: l.name.includes("You") ? "rgba(255,255,255,.15)" : "var(--bg2)",
                  fontSize: 13, fontWeight: 700,
                  color: l.name.includes("You") ? "#fff" : l.rank <= 3 ? "var(--yellow)" : "var(--muted)",
                }}>
                  {l.badge}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: l.name.includes("You") ? "#fff" : "var(--text)", fontSize: 13, fontWeight: l.name.includes("You") ? 700 : 500 }}>{l.name}</p>
                  <p style={{ color: l.name.includes("You") ? "rgba(255,255,255,.6)" : "var(--muted2)", fontSize: 11 }}>
                    🔥 {l.streak}-day streak · {l.xp.toLocaleString()} XP
                  </p>
                </div>
                <div className="progress-bar" style={{ width: 80, marginRight: 8 }}>
                  <div className="progress-fill" style={{ width: `${l.score}%`, background: l.name.includes("You") ? "var(--yellow)" : "var(--navy)" }} />
                </div>
                <p style={{ color: l.name.includes("You") ? "var(--yellow)" : "var(--navy)", fontWeight: 700, fontSize: 14, minWidth: 36, textAlign: "right" }}>{l.score}%</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {NATIONAL.map((n) => (
              <div key={n.rank} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10,
                background: n.me ? "var(--navy)" : "var(--bg)",
                border: n.me ? "none" : "1px solid var(--border)",
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: n.me ? "rgba(255,255,255,.15)" : "var(--bg2)", fontSize: 13, fontWeight: 700, color: n.me ? "#fff" : n.rank <= 3 ? "var(--yellow)" : "var(--muted)" }}>
                  {n.rank <= 3 ? ["🥇","🥈","🥉"][n.rank-1] : `#${n.rank}`}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: n.me ? "#fff" : "var(--text)", fontSize: 13, fontWeight: n.me ? 700 : 500 }}>{n.name}</p>
                  <p style={{ color: n.me ? "rgba(255,255,255,.6)" : "var(--muted2)", fontSize: 11 }}>{n.county} County</p>
                </div>
                <p style={{ color: n.me ? "var(--yellow)" : "var(--navy)", fontWeight: 700, fontSize: 14 }}>{n.score}%</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges & Gamification */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        <div className="card">
          <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🏅 Badges & Achievements</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {BADGES_EARNED.map((b) => (
              <div key={b.label} style={{
                padding: "10px 12px", borderRadius: 10,
                background: b.earned ? `${b.color}10` : "var(--bg2)",
                border: `1.5px solid ${b.earned ? `${b.color}30` : "var(--border)"}`,
                opacity: b.earned ? 1 : 0.5,
              }}>
                <span style={{ fontSize: 22 }}>{b.icon}</span>
                <p style={{ color: b.earned ? b.color : "var(--muted)", fontSize: 12, fontWeight: 700, marginTop: 6 }}>{b.label}</p>
                <p style={{ color: "var(--muted2)", fontSize: 10, marginTop: 2 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>⭐ XP & Points System</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { action: "Watch a video lesson", xp: "+10 XP", icon: "🎬" },
              { action: "Complete flashcard deck", xp: "+15 XP", icon: "🃏" },
              { action: "Pass a weekly test", xp: "+50 XP", icon: "✍️" },
              { action: "Win class challenge", xp: "+200 XP", icon: "🏆" },
              { action: "7-day study streak", xp: "+100 XP", icon: "🔥" },
              { action: "Score 100% on test", xp: "+150 XP", icon: "💯" },
            ].map((a) => (
              <div key={a.action} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "var(--bg)" }}>
                <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{a.icon}</span>
                <span style={{ color: "var(--text)", fontSize: 12, flex: 1 }}>{a.action}</span>
                <span className="badge" style={{ background: "rgba(245,158,11,.12)", color: "var(--yellow)", fontWeight: 700 }}>
                  <Star size={9} /> {a.xp}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: "var(--navy)", border: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Award size={18} color="var(--yellow)" />
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Digital Certificates</h3>
          </div>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
            Win a challenge to earn an auto-generated PDF certificate — Acadebit-branded, principal-signed. Parents can download and print.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {["Top in Science — Week 5", "7-Day Streak Champion"].map((cert) => (
              <div key={cert} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,.08)" }}>
                <span style={{ fontSize: 16 }}>📜</span>
                <span style={{ color: "#fff", fontSize: 12, flex: 1 }}>{cert}</span>
                <button className="btn" style={{ background: "var(--yellow)", color: "#fff", padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>Download</button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
