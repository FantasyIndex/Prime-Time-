import { useState, useEffect } from "react";
import { Link } from "wouter";
import "../styles/prime-time.css";

type Phase = "vote1" | "results1" | "countdown" | "vote2" | "gate" | "results2";

const Q1_OPTIONS = [
  { id: "mahomes", name: "Patrick Mahomes", tagline: "Four-Time Champion",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
  { id: "lamar",   name: "Lamar Jackson",   tagline: "Back-to-Back MVP",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
  { id: "allen",   name: "Josh Allen",      tagline: "Buffalo's Franchise", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
  { id: "burrow",  name: "Joe Burrow",      tagline: "The Bengals' Ace",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
];

const Q1_RESULTS = [
  { id: "mahomes", name: "Patrick Mahomes", pct: 41, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
  { id: "lamar",   name: "Lamar Jackson",   pct: 29, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
  { id: "allen",   name: "Josh Allen",      pct: 19, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
  { id: "burrow",  name: "Joe Burrow",      pct: 11, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
];

const Q2_OPTIONS = [
  { id: "chiefs",  name: "Kansas City Chiefs",  tagline: "Dynasty Mode",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
  { id: "ravens",  name: "Baltimore Ravens",    tagline: "Lamar's Time",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
  { id: "eagles",  name: "Philadelphia Eagles", tagline: "Back-to-Back?",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
  { id: "niners",  name: "San Francisco 49ers", tagline: "Kyle's System",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
];

const Q2_RESULTS = [
  { id: "chiefs",  name: "Kansas City Chiefs",  pct: 38, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
  { id: "eagles",  name: "Philadelphia Eagles", pct: 27, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
  { id: "ravens",  name: "Baltimore Ravens",    pct: 22, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
  { id: "niners",  name: "San Francisco 49ers", pct: 13, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
];

function ResultBar({ name, pct, logo, isUserPick }: { name: string; pct: number; logo: string; isUserPick: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
      <img src={logo} alt={name} style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: isUserPick ? 700 : 400, letterSpacing: "0.04em", color: "var(--ink)" }}>
            {name}{isUserPick && <span style={{ color: "var(--gold)", marginLeft: "8px", fontSize: "0.75rem" }}>← your vote</span>}
          </span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: isUserPick ? "var(--gold)" : "var(--ink)" }}>{pct}%</span>
        </div>
        <div style={{ height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: isUserPick ? "var(--gold)" : "var(--ink)", borderRadius: "4px", transition: "width 0.8s ease" }} />
        </div>
      </div>
    </div>
  );
}

export default function Poll2() {
  const [phase, setPhase]           = useState<Phase>("vote1");
  const [selected1, setSelected1]   = useState<string | null>(null);
  const [selected2, setSelected2]   = useState<string | null>(null);
  const [countdown, setCountdown]   = useState(5);
  const [gateForm, setGateForm]     = useState({ firstName: "", lastName: "", email: "" });
  const [gateAgree, setGateAgree]   = useState(true);
  const [gateError, setGateError]   = useState("");
  const [gateSubmitting, setGateSubmitting] = useState(false);

  /* ── countdown timer ── */
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdown(5);
    const id = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(id); setTimeout(() => setPhase("vote2"), 200); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  /* ── auto-advance from results1 → countdown after 2 s ── */
  useEffect(() => {
    if (phase !== "results1") return;
    const id = setTimeout(() => setPhase("countdown"), 4000);
    return () => clearTimeout(id);
  }, [phase]);

  function handleVote1(e: React.FormEvent) {
    e.preventDefault();
    if (!selected1) return;
    setPhase("results1");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleVote2(e: React.FormEvent) {
    e.preventDefault();
    if (!selected2) return;
    setPhase("gate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleGate(e: React.FormEvent) {
    e.preventDefault();
    if (!gateForm.email || !gateForm.email.includes("@")) { setGateError("Please enter a valid email address."); return; }
    if (!gateAgree) { setGateError("Please agree to receive emails to continue."); return; }
    setGateError("");
    setGateSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: gateForm.email, firstName: gateForm.firstName, lastName: gateForm.lastName, source: "poll" }),
      });
    } catch { /* fail silently */ }
    setGateSubmitting(false);
    setPhase("results2");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const winner1 = Q1_RESULTS.find(r => r.id === selected1);
  const winner2 = Q2_RESULTS.find(r => r.id === selected2);

  /* ── shared shell ── */
  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, overflowX: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="topbar">2026 College Football Preview — On Newsstands &amp; Amazon Now</div>
      <nav className="pts-nav">
        <Link href="/"><img src="/logo.png" alt="Prime Time Sports" style={{ height: "91px", display: "block" }} /></Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/mailing-list" className="nav-cta">Join Mailing List</Link>
          <Link href="/betting-tips" className="nav-cta">Get Free Betting Tips</Link>
        </div>
      </nav>

      <section className="poll-section">
        {/* ── eyebrow ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <span style={{ display: "inline-block", width: "32px", height: "3px", background: "var(--gold)" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.2em", fontSize: "0.9rem", color: "var(--gold)" }}>Fan Poll</span>
          <span style={{ display: "inline-block", width: "32px", height: "3px", background: "var(--gold)" }} />
        </div>

        {/* ════════════════ PHASE: vote1 ════════════════ */}
        {phase === "vote1" && (
          <form onSubmit={handleVote1} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "760px" }}>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-0.01em", textAlign: "center", lineHeight: 1.2, maxWidth: "780px", marginBottom: "56px", color: "var(--ink)" }}>
              Which NFL quarterback will win <span style={{ color: "var(--gold)" }}>MVP</span> in 2026?
            </h1>
            <div className="poll-grid">
              {Q1_OPTIONS.map(opt => {
                const sel = selected1 === opt.id;
                return (
                  <button key={opt.id} type="button" onClick={() => setSelected1(opt.id)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "28px", background: sel ? "var(--ink)" : "white", border: sel ? "2.5px solid var(--gold)" : "2.5px solid transparent", borderRadius: "4px", cursor: "pointer", textAlign: "center", transition: "all 0.18s ease", boxShadow: sel ? "0 4px 24px rgba(200,168,75,0.18)" : "0 2px 12px rgba(0,0,0,0.07)" }}>
                    <img src={opt.logo} alt={opt.name} style={{ width: "52px", height: "52px", objectFit: "contain" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.04em", color: sel ? "var(--gold)" : "var(--ink)", lineHeight: 1.1 }}>{opt.name}</span>
                    <span style={{ fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: sel ? "rgba(255,255,255,0.65)" : "var(--mid)" }}>{opt.tagline}</span>
                    {sel && <span style={{ marginTop: "8px", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>✓ My Pick</span>}
                  </button>
                );
              })}
            </div>
            <button type="submit" disabled={!selected1}
              style={{ marginTop: "32px", padding: "18px 60px", background: selected1 ? "var(--ink)" : "rgba(0,0,0,0.15)", color: selected1 ? "var(--gold)" : "rgba(0,0,0,0.3)", border: "none", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: selected1 ? "pointer" : "not-allowed", transition: "all 0.2s ease" }}>
              Submit Vote
            </button>
          </form>
        )}

        {/* ════════════════ PHASE: results1 (ungated) ════════════════ */}
        {phase === "results1" && (
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              {winner1 && <img src={winner1.logo} alt={winner1.name} style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "14px" }} />}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "8px" }}>Vote Recorded</div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--ink)", margin: 0 }}>
                You voted for <span style={{ color: "var(--gold)" }}>{winner1?.name}</span>
              </h2>
            </div>
            <div className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--ink)", marginBottom: "20px" }}>Current Results</div>
              {Q1_RESULTS.map(r => <ResultBar key={r.id} name={r.name} pct={r.pct} logo={r.logo} isUserPick={r.id === selected1} />)}
            </div>
            <div style={{ textAlign: "center", padding: "24px", color: "var(--mid)", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
              <span style={{ opacity: 0.6 }}>Next question loading…</span>
            </div>
          </div>
        )}

        {/* ════════════════ PHASE: countdown ════════════════ */}
        {phase === "countdown" && (
          <div style={{ width: "100%", maxWidth: "600px", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "32px" }}>
              Coming Up Next
            </div>
            {/* Countdown number */}
            <div key={countdown} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "clamp(5rem, 20vw, 9rem)", lineHeight: 1, color: "var(--ink)", marginBottom: "40px", animation: "countPop 0.35s ease-out" }}>
              {countdown}
            </div>
            {/* Q2 question teaser */}
            <div className="poll-card" style={{ background: "white", borderRadius: "6px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "14px" }}>
                Next Question
              </div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "var(--ink)", lineHeight: 1.25, margin: 0 }}>
                Which NFL team will win <span style={{ color: "var(--gold)" }}>Super Bowl LX</span>?
              </h2>
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                {Q2_OPTIONS.map(o => (
                  <img key={o.id} src={o.logo} alt={o.name} style={{ width: "36px", height: "36px", objectFit: "contain", opacity: 0.45 }} />
                ))}
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ marginTop: "32px", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "var(--gold)", borderRadius: "2px", width: `${((5 - countdown) / 5) * 100}%`, transition: "width 0.9s linear" }} />
            </div>
          </div>
        )}

        {/* ════════════════ PHASE: vote2 ════════════════ */}
        {phase === "vote2" && (
          <form onSubmit={handleVote2} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "760px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "16px" }}>
              Question 2 of 2
            </div>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-0.01em", textAlign: "center", lineHeight: 1.2, maxWidth: "780px", marginBottom: "56px", color: "var(--ink)" }}>
              Which NFL team will win <span style={{ color: "var(--gold)" }}>Super Bowl LX</span>?
            </h1>
            <div className="poll-grid">
              {Q2_OPTIONS.map(opt => {
                const sel = selected2 === opt.id;
                return (
                  <button key={opt.id} type="button" onClick={() => setSelected2(opt.id)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "28px", background: sel ? "var(--ink)" : "white", border: sel ? "2.5px solid var(--gold)" : "2.5px solid transparent", borderRadius: "4px", cursor: "pointer", textAlign: "center", transition: "all 0.18s ease", boxShadow: sel ? "0 4px 24px rgba(200,168,75,0.18)" : "0 2px 12px rgba(0,0,0,0.07)" }}>
                    <img src={opt.logo} alt={opt.name} style={{ width: "52px", height: "52px", objectFit: "contain" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.04em", color: sel ? "var(--gold)" : "var(--ink)", lineHeight: 1.1 }}>{opt.name}</span>
                    <span style={{ fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: sel ? "rgba(255,255,255,0.65)" : "var(--mid)" }}>{opt.tagline}</span>
                    {sel && <span style={{ marginTop: "8px", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>✓ My Pick</span>}
                  </button>
                );
              })}
            </div>
            <button type="submit" disabled={!selected2}
              style={{ marginTop: "32px", padding: "18px 60px", background: selected2 ? "var(--ink)" : "rgba(0,0,0,0.15)", color: selected2 ? "var(--gold)" : "rgba(0,0,0,0.3)", border: "none", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: selected2 ? "pointer" : "not-allowed", transition: "all 0.2s ease" }}>
              Submit Vote
            </button>
          </form>
        )}

        {/* ════════════════ PHASE: gate ════════════════ */}
        {phase === "gate" && (
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              {winner2 && <img src={winner2.logo} alt={winner2.name} style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "14px" }} />}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "8px" }}>Vote Recorded</div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--ink)", margin: 0 }}>
                You voted for <span style={{ color: "var(--gold)" }}>{winner2?.name}</span>
              </h2>
            </div>

            {/* Teaser with logos visible, percentages blurred */}
            <div className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--ink)", marginBottom: "20px" }}>Current Results</div>
              {Q2_RESULTS.map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                  <img src={r.logo} alt={r.name} style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "0.82rem", color: "var(--ink)", letterSpacing: "0.04em" }}>{r.name}</span>
                      <span style={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.25)", filter: "blur(5px)", userSelect: "none" }}>00%</span>
                    </div>
                    <div style={{ height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${r.pct}%`, background: "rgba(0,0,0,0.12)", borderRadius: "4px" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sign-up form */}
            <form onSubmit={handleGate} className="poll-card" style={{ background: "white", borderRadius: "6px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.12em", color: "var(--ink)", marginBottom: "6px" }}>Unlock the Full Results</div>
              <p style={{ fontSize: "0.85rem", color: "var(--mid)", marginBottom: "20px", lineHeight: 1.6 }}>Sign up free to see which team came out on top and read the full breakdown.</p>
              <div className="poll-name-row">
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "6px" }}>First Name</label>
                  <input type="text" placeholder="Jordan" value={gateForm.firstName} onChange={e => setGateForm({ ...gateForm, firstName: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", border: "2px solid rgba(0,0,0,0.12)", borderRadius: "4px", color: "var(--ink)", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "6px" }}>Last Name</label>
                  <input type="text" placeholder="Mitchell" value={gateForm.lastName} onChange={e => setGateForm({ ...gateForm, lastName: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", border: "2px solid rgba(0,0,0,0.12)", borderRadius: "4px", color: "var(--ink)", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "6px" }}>Email Address *</label>
                <input type="email" placeholder="you@example.com" value={gateForm.email} onChange={e => setGateForm({ ...gateForm, email: e.target.value })}
                  style={{ width: "100%", padding: "12px 14px", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", border: "2px solid rgba(0,0,0,0.12)", borderRadius: "4px", color: "var(--ink)", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "20px" }}>
                <input type="checkbox" id="gate2-agree" checked={gateAgree} onChange={e => setGateAgree(e.target.checked)}
                  style={{ marginTop: "2px", accentColor: "var(--gold)", width: "16px", height: "16px", flexShrink: 0, cursor: "pointer" }} />
                <label htmlFor="gate2-agree" style={{ fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--mid)", cursor: "pointer", lineHeight: 1.5 }}>
                  I agree to receive emails from Prime Time Sports
                </label>
              </div>
              {gateError && <p style={{ fontSize: "0.82rem", color: "#B94B2A", marginBottom: "14px" }}>{gateError}</p>}
              <button type="submit" disabled={gateSubmitting}
                style={{ width: "100%", padding: "16px", background: "var(--ink)", color: "var(--gold)", border: "none", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                {gateSubmitting ? "Just a sec…" : "See Full Results →"}
              </button>
            </form>
          </div>
        )}

        {/* ════════════════ PHASE: results2 (full) ════════════════ */}
        {phase === "results2" && (
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              {winner2 && <img src={winner2.logo} alt={winner2.name} style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "14px" }} />}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "8px" }}>Results Unlocked</div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--ink)", margin: 0 }}>
                You voted for <span style={{ color: "var(--gold)" }}>{winner2?.name}</span>
              </h2>
            </div>

            <div className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "52px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--ink)", marginBottom: "24px" }}>Current Results</div>
              {Q2_RESULTS.map(r => <ResultBar key={r.id} name={r.name} pct={r.pct} logo={r.logo} isUserPick={r.id === selected2} />)}
              <p style={{ fontSize: "0.72rem", color: "var(--mid)", marginTop: "16px", marginBottom: 0, letterSpacing: "0.05em" }}>Based on responses from Prime Time Sports readers</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
              <span style={{ flex: 1, height: "2px", background: "rgba(0,0,0,0.1)" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)" }}>The Breakdown</span>
              <span style={{ flex: 1, height: "2px", background: "rgba(0,0,0,0.1)" }} />
            </div>

            <div className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "48px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1.15rem", letterSpacing: "0.01em", color: "var(--ink)", marginBottom: "14px" }}>
                Editor's Analysis: Kansas City's Dynasty Has No Ceiling
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--mid)", marginBottom: "18px" }}>
                Patrick Mahomes and Andy Reid have built something that transcends any single era of football. Four championships, back-to-back Super Bowl victories, and a franchise that has figured out how to reload without ever truly rebuilding. The Chiefs don't just win games — they win the moments that matter most, repeatedly, and against the best competition the league has to offer.
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--mid)", marginBottom: "24px" }}>
                While the Eagles' back-to-back argument is real and the Ravens' weaponry is undeniable, until someone finds a way to close out Mahomes in January, the smart money stays in Kansas City. The dynasty doesn't end until someone proves it can.
              </p>
              <div style={{ marginTop: "8px" }}>
                <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: "var(--ink)", lineHeight: 1.1, marginBottom: "2px" }}>Chris Kubala</div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)", lineHeight: 1.7 }}>Editor-in-chief</div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)" }}>Prime Time Sports</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── footer ── */}
      <footer style={{ background: "var(--ink)", color: "white", padding: "40px 40px 28px", marginTop: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", maxWidth: "1200px", margin: "0 auto" }}>
          <img src="/logo.png" alt="Prime Time Sports" style={{ height: "52px", opacity: 0.85 }} />
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>© 2026 Prime Time Sports. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes countPop {
          0%   { transform: scale(1.4); opacity: 0.4; }
          100% { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
