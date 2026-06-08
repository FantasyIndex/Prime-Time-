import { useState } from "react";
import { Link } from "wouter";
import "../styles/prime-time.css";

type Comment = { id: number; name: string; text: string; team: string; ts: string };

function loadComments(): Comment[] {
  try { return JSON.parse(localStorage.getItem("poll-comments") || "[]"); } catch { return []; }
}
function saveComments(cs: Comment[]) {
  localStorage.setItem("poll-comments", JSON.stringify(cs));
}

const OPTIONS = [
  {
    id: "bengals",
    team: "Cincinnati Bengals",
    tagline: "Chase & Higgins duo",
    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png",
  },
  {
    id: "cowboys",
    team: "Dallas Cowboys",
    tagline: "CeeDee Lamb dominance",
    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png",
  },
  {
    id: "rams",
    team: "Los Angeles Rams",
    tagline: "Nacua & Kupp tactical depth",
    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png",
  },
  {
    id: "bears",
    team: "Chicago Bears",
    tagline: "Odunze & Burden youth movement",
    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png",
  },
];

const RESULTS = [
  { id: "bengals", team: "Cincinnati Bengals", pct: 34, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
  { id: "cowboys", team: "Dallas Cowboys",     pct: 29, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
  { id: "bears",   team: "Chicago Bears",      pct: 20, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png" },
  { id: "rams",    team: "Los Angeles Rams",   pct: 12, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png" },
  { id: "other",   team: "Other",              pct:  5, logo: null },
];


function ResultBar({ result, isUserPick }: { result: typeof RESULTS[0]; isUserPick: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
      {result.logo ? (
        <img src={result.logo} alt={result.team} style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }} />
      ) : (
        <span style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>🏈</span>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: isUserPick ? 700 : 400, letterSpacing: "0.04em", color: "var(--ink)" }}>
            {result.team}{isUserPick && <span style={{ color: "var(--gold)", marginLeft: "8px", fontSize: "0.75rem" }}>← your vote</span>}
          </span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: isUserPick ? "var(--gold)" : "var(--ink)" }}>{result.pct}%</span>
        </div>
        <div style={{ height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${result.pct}%`,
              background: isUserPick ? "var(--gold)" : "var(--ink)",
              borderRadius: "4px",
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Poll() {
  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [voted, setVoted] = useState(false);       // vote submitted
  const [gated, setGated] = useState(true);        // gate still showing
  const [gateForm, setGateForm] = useState({ firstName: "", lastName: "", email: "" });
  const [gateAgree, setGateAgree] = useState(false);
  const [gateError, setGateError] = useState("");
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>(loadComments);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  const isOther = selected === "other";
  const canSubmit = selected !== null && (selected !== "other" || otherText.trim().length > 0);
  const submitted = voted && !gated;

  function handleVote() {
    if (!canSubmit) return;
    setVoted(true);
    setGated(true);
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
    } catch { /* fail silently — still show results */ }
    setGateSubmitting(false);
    setGated(false);
  }

  function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) { setCommentError("Please write a comment before submitting."); return; }
    const teamLabel = selected === "other" ? otherText.trim() : (OPTIONS.find(o => o.id === selected)?.team ?? "Other");
    const next: Comment[] = [
      { id: Date.now(), name: commentName.trim() || "Anonymous", text: commentText.trim(), team: teamLabel, ts: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
      ...comments,
    ];
    setComments(next);
    saveComments(next);
    setCommentName("");
    setCommentText("");
    setCommentError("");
  }

  const winner = OPTIONS.find((o) => o.id === selected);
  const displayName = isOther ? otherText.trim() : winner?.team;

  return (
    <div
      style={{
        background: "var(--cream)",
        color: "var(--ink)",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        overflowX: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TOP BAR */}
      <div className="topbar">
        2026 College Football Preview — On Newsstands &amp; Amazon Now
      </div>

      {/* NAV */}
      <nav className="pts-nav">
        <Link href="/">
          <img src="/logo.png" alt="Prime Time Sports" style={{ height: "91px", display: "block" }} />
        </Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/mailing-list" className="nav-cta">Join Mailing List</Link>
          <Link href="/betting-tips" className="nav-cta">Get Free Betting Tips</Link>
        </div>
      </nav>

      {/* POLL SECTION */}
      <section className="poll-section">
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <span style={{ display: "inline-block", width: "32px", height: "3px", background: "var(--gold)" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.2em", fontSize: "0.9rem", color: "var(--gold)" }}>
            Fan Poll
          </span>
          <span style={{ display: "inline-block", width: "32px", height: "3px", background: "var(--gold)" }} />
        </div>

        {!voted ? (
          <>
            {/* Question */}
            <h1
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                letterSpacing: "-0.01em",
                textAlign: "center",
                lineHeight: 1.2,
                maxWidth: "780px",
                marginBottom: "56px",
                color: "var(--ink)",
              }}
            >
              Which NFL team has the absolute{" "}
              <span style={{ color: "var(--gold)" }}>best</span> receiving corps entering 2026?
            </h1>

            {/* 4 main options — 2 col grid */}
            <div className="poll-grid">
              {OPTIONS.map((opt) => {
                const isSelected = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      padding: "28px 28px",
                      background: isSelected ? "var(--ink)" : "white",
                      border: isSelected ? "2.5px solid var(--gold)" : "2.5px solid transparent",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.18s ease",
                      boxShadow: isSelected ? "0 4px 24px rgba(200,168,75,0.18)" : "0 2px 12px rgba(0,0,0,0.07)",
                    }}
                  >
                    <img src={opt.logo} alt={opt.team} style={{ width: "52px", height: "52px", objectFit: "contain" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.55rem", letterSpacing: "0.06em", color: isSelected ? "var(--gold)" : "var(--ink)", lineHeight: 1 }}>
                      {opt.team}
                    </span>
                    <span style={{ fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: isSelected ? "rgba(255,255,255,0.65)" : "var(--mid)", lineHeight: 1.3 }}>
                      {opt.tagline}
                    </span>
                    {isSelected && (
                      <span style={{ marginTop: "8px", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>
                        ✓ My Pick
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Other — full width */}
            <div style={{ width: "100%", maxWidth: "760px", marginBottom: "40px" }}>
              <button
                onClick={() => setSelected("other")}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  padding: "24px 28px",
                  background: isOther ? "var(--ink)" : "white",
                  border: isOther ? "2.5px solid var(--gold)" : "2.5px solid transparent",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.18s ease",
                  boxShadow: isOther ? "0 4px 24px rgba(200,168,75,0.18)" : "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.55rem", letterSpacing: "0.06em", color: isOther ? "var(--gold)" : "var(--ink)", lineHeight: 1 }}>
                  Other
                </span>
                <span style={{ fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: isOther ? "rgba(255,255,255,0.65)" : "var(--mid)" }}>
                  Tell us which team you think deserves it
                </span>
              </button>

              {isOther && (
                <div style={{ marginTop: "12px" }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Which team? (e.g. San Francisco 49ers)"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      fontSize: "1rem",
                      fontFamily: "'DM Sans', sans-serif",
                      border: "2px solid var(--ink)",
                      borderRadius: "4px",
                      background: "white",
                      color: "var(--ink)",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleVote}
              disabled={!canSubmit}
              className="btn-submit"
              style={{
                opacity: canSubmit ? 1 : 0.4,
                cursor: canSubmit ? "pointer" : "not-allowed",
                fontSize: "1rem",
                letterSpacing: "0.12em",
                padding: "16px 48px",
              }}
            >
              Submit My Vote →
            </button>
          </>
        ) : gated ? (
          /* ── GATE PAGE ── */
          <div style={{ width: "100%", maxWidth: "760px" }}>

            {/* Vote confirmation — big and clear */}
            <div style={{ textAlign: "center", marginBottom: "44px" }}>
              {winner?.logo ? (
                <img src={winner.logo} alt={winner.team} style={{ width: "80px", height: "80px", objectFit: "contain", marginBottom: "16px" }} />
              ) : (
                <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🏈</div>
              )}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "8px" }}>
                Vote Recorded
              </div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15, color: "var(--ink)", margin: 0 }}>
                You voted for <span style={{ color: "var(--gold)" }}>{displayName}</span>
              </h2>
            </div>

            {/* Teaser results — ? logos, bars visible */}
            <div className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--ink)", marginBottom: "20px" }}>
                Current Results
              </div>
              {RESULTS.map((r) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                  {/* Blurred logo */}
                  {r.logo ? (
                    <img src={r.logo} alt="" style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0, filter: "blur(4px)", opacity: 0.6 }} />
                  ) : (
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--mid)" }}>?</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "0.82rem", color: "var(--mid)", letterSpacing: "0.04em" }}>{RESULTS.indexOf(r) === 4 ? "Other" : `Team ${RESULTS.indexOf(r) + 1}`}</span>
                      <span style={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.2)", filter: "blur(4px)", userSelect: "none" }}>??%</span>
                    </div>
                    <div style={{ height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${r.pct}%`, background: "rgba(0,0,0,0.12)", borderRadius: "4px" }} />
                    </div>
                  </div>
                </div>
              ))}
              <p style={{ fontSize: "0.72rem", color: "var(--mid)", marginTop: "16px", marginBottom: 0, letterSpacing: "0.05em" }}>
                Sign up below to reveal the full breakdown
              </p>
            </div>

            {/* Sign-up form */}
            <form onSubmit={handleGate} className="poll-card" style={{ background: "white", borderRadius: "6px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.12em", color: "var(--ink)", marginBottom: "6px" }}>
                Unlock the Full Results
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--mid)", marginBottom: "20px", lineHeight: 1.6 }}>
                Sign up free to see which team came out on top, read the full breakdown, and join the conversation.
              </p>
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
                <input type="checkbox" id="gate-agree" checked={gateAgree} onChange={e => setGateAgree(e.target.checked)}
                  style={{ width: "16px", height: "16px", minWidth: "16px", marginTop: "2px", cursor: "pointer", accentColor: "var(--gold)" }} />
                <label htmlFor="gate-agree" style={{ fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--mid)", cursor: "pointer", lineHeight: 1.5 }}>
                  I agree to receive emails from Prime Time Sports
                </label>
              </div>
              {gateError && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginBottom: "12px" }}>{gateError}</p>}
              <button type="submit" className="btn-submit" disabled={gateSubmitting} style={{ width: "100%", fontSize: "1rem", padding: "14px", letterSpacing: "0.12em" }}>
                {gateSubmitting ? "Unlocking…" : "Reveal Full Results →"}
              </button>
              <p style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--mid)", marginTop: "12px", marginBottom: 0 }}>🔒 No spam. No sharing your data. Ever.</p>
            </form>
          </div>
        ) : (
          /* ── RESULTS PAGE ── */
          <div style={{ width: "100%", maxWidth: "760px" }}>

            {/* Confirmation header */}
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              {winner?.logo ? (
                <img src={winner.logo} alt={winner.team} style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "16px" }} />
              ) : (
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏈</div>
              )}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "8px" }}>
                Vote Recorded
              </div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15, color: "var(--ink)", margin: 0 }}>
                You voted for <span style={{ color: "var(--gold)" }}>{displayName}</span>
              </h2>
            </div>

            {/* Results bar chart */}
            <div className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "52px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--ink)", marginBottom: "24px" }}>
                Current Results
              </div>
              {RESULTS.map((r) => (
                <ResultBar key={r.id} result={r} isUserPick={r.id === selected} />
              ))}
              <p style={{ fontSize: "0.72rem", color: "var(--mid)", marginTop: "16px", marginBottom: 0, letterSpacing: "0.05em" }}>
                Based on responses from Prime Time Sports readers
              </p>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
              <span style={{ flex: 1, height: "2px", background: "rgba(0,0,0,0.1)" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)" }}>The Breakdown</span>
              <span style={{ flex: 1, height: "2px", background: "rgba(0,0,0,0.1)" }} />
            </div>

            {/* Editor's Analysis */}
            <div className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "48px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1.15rem", letterSpacing: "0.01em", color: "var(--ink)", marginBottom: "14px" }}>
                Editor's Analysis: Miami Dolphins Can't Be Counted Out
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--mid)", marginBottom: "18px" }}>
                In Tyreek Hill and Jaylen Waddle, Miami boasts a duo that completely alters the geometry of a football field. They don't just beat coverages; they force defensive coordinators to play fundamentally different styles of football just to keep a roof on the defense.
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--mid)", marginBottom: "24px" }}>
                When you factor in the lightning-fast acceleration of running back De'Von Achane catching passes out of the backfield and the dynamic shiftiness of young wideout Malik Washington operating underneath, Miami's corps has the unique ability to turn a routine 4-yard slant into a 75-yard touchdown on literally any given snap.
              </p>
              <div style={{ marginTop: "8px" }}>
                <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: "var(--ink)", lineHeight: 1.1, marginBottom: "2px" }}>
                  Chris Kubala
                </div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)", lineHeight: 1.7 }}>
                  Editor-in-chief
                </div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)" }}>
                  Prime Time Sports
                </div>
              </div>
            </div>


            {/* Comments section */}
            <div style={{ marginBottom: "56px" }}>
              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <span style={{ flex: 1, height: "2px", background: "rgba(0,0,0,0.1)" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)" }}>Comments</span>
                <span style={{ flex: 1, height: "2px", background: "rgba(0,0,0,0.1)" }} />
              </div>

              {/* Comment form */}
              <form onSubmit={handleComment} className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.12em", color: "var(--ink)", marginBottom: "20px" }}>
                  Drop Your Thoughts
                </div>
                <div style={{ display: "flex", gap: "14px", marginBottom: "14px" }}>
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={commentName}
                    onChange={e => setCommentName(e.target.value)}
                    style={{ flex: 1, padding: "12px 16px", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", border: "2px solid rgba(0,0,0,0.12)", borderRadius: "4px", background: "var(--cream)", color: "var(--ink)", outline: "none" }}
                  />
                </div>
                <textarea
                  placeholder="Defend your vote or make the case for another team..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  rows={4}
                  style={{ width: "100%", padding: "12px 16px", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", border: "2px solid rgba(0,0,0,0.12)", borderRadius: "4px", background: "var(--cream)", color: "var(--ink)", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: "6px" }}
                />
                {commentError && <p style={{ color: "#c0392b", fontSize: "0.8rem", margin: "0 0 10px" }}>{commentError}</p>}
                <button type="submit" className="btn-submit" style={{ fontSize: "0.9rem", padding: "12px 32px", letterSpacing: "0.1em" }}>
                  Post Comment →
                </button>
              </form>

              {/* Comment list */}
              {comments.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--mid)", fontSize: "0.9rem" }}>No comments yet — be the first to weigh in!</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {comments.map(c => (
                    <div key={c.id} style={{ background: "white", borderRadius: "6px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", flexShrink: 0 }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--ink)" }}>{c.name}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--gold)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Voted: {c.team}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "var(--mid)" }}>{c.ts}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.7, color: "var(--mid)" }}>{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/mailing-list" className="btn-submit" style={{ textDecoration: "none" }}>
                Join the Mailing List
              </Link>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  border: "2px solid var(--ink)",
                  color: "var(--ink)",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  letterSpacing: "0.12em",
                  fontSize: "1rem",
                  textDecoration: "none",
                  borderRadius: "2px",
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="pts-footer">
        <img src="/logo.png" alt="Prime Time Sports" style={{ height: "52px", opacity: 0.85 }} />
      </footer>
    </div>
  );
}
