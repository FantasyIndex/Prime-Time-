import { useState } from "react";
import { Link } from "wouter";
import "../styles/prime-time.css";

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

const ANALYSIS = [
  {
    id: "bengals",
    emoji: "🐯",
    team: "Cincinnati Bengals",
    subtitle: "The Ultimate Duo",
    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png",
    body: "If you believe a receiving corps is defined by its top-tier talent, the Bengals are hard to beat. Ja'Marr Chase remains one of the most explosive, game-changing wideouts in the league. Alongside him, Tee Higgins provides an elite physical presence and boundary threat that could easily make him a WR1 on half the teams in the NFL. Their case rests entirely on the fact that no cornerback duo in the league enjoys lining up against these two on Sundays.",
  },
  {
    id: "bears",
    emoji: "🐻",
    team: "Chicago Bears",
    subtitle: "The Deepest Trio?",
    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png",
    body: "The Bears have built an absolute powerhouse of a wide receiver room with three distinct flavors of elite talent: DJ Moore — a proven, physical yardage monster after the catch; Keenan Allen — one of the most reliable, master-level route runners of this generation in the slot; and Rome Odunze — a dynamic young vertical threat with an incredibly high ceiling. If you are voting for sheer variety and matching skill sets, Chicago has a massive argument.",
  },
  {
    id: "rams",
    emoji: "🐏",
    team: "LA Rams",
    subtitle: "Modern Day Production",
    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png",
    body: "The Rams showcase a masterclass in modern route running and visual deception. Puka Nacua shattered rookie records with his aggressive, physical style of play, while veteran Cooper Kupp remains a literal cheat code when healthy, finding space in the middle of the field like nobody else. When Sean McVay has both of these guys firing on all cylinders, they dictate the entire flow of an offensive game plan.",
  },
  {
    id: "cowboys",
    emoji: "🤠",
    team: "Dallas Cowboys",
    subtitle: "Star Power",
    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png",
    body: "The argument for Dallas begins and ends with CeeDee Lamb, who has firmly established himself in the tier of unguardable, elite game-breakers. While the depth behind him faces questions, Lamb's sheer volume, versatility to move all over the formation, and knack for generating explosive plays keep Dallas firmly in the conversation for the league's most dangerous air attack.",
  },
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
  const [submitted, setSubmitted] = useState(false);

  const isOther = selected === "other";
  const canSubmit = selected !== null && (selected !== "other" || otherText.trim().length > 0);

  function handleVote() {
    if (!canSubmit) return;
    setSubmitted(true);
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
      <section
        style={{
          flex: 1,
          padding: "180px 160px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <span style={{ display: "inline-block", width: "32px", height: "3px", background: "var(--gold)" }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em", fontSize: "0.9rem", color: "var(--gold)" }}>
            Fan Poll
          </span>
          <span style={{ display: "inline-block", width: "32px", height: "3px", background: "var(--gold)" }} />
        </div>

        {!submitted ? (
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
                width: "100%",
                maxWidth: "760px",
                marginBottom: "20px",
              }}
            >
              {OPTIONS.map((opt) => {
                const isSelected = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "6px",
                      padding: "28px 28px",
                      background: isSelected ? "var(--ink)" : "white",
                      border: isSelected ? "2.5px solid var(--gold)" : "2.5px solid transparent",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.18s ease",
                      boxShadow: isSelected ? "0 4px 24px rgba(200,168,75,0.18)" : "0 2px 12px rgba(0,0,0,0.07)",
                    }}
                  >
                    <img src={opt.logo} alt={opt.team} style={{ width: "52px", height: "52px", objectFit: "contain" }} />
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.55rem", letterSpacing: "0.06em", color: isSelected ? "var(--gold)" : "var(--ink)", lineHeight: 1 }}>
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
                  alignItems: "flex-start",
                  gap: "6px",
                  padding: "24px 28px",
                  background: isOther ? "var(--ink)" : "white",
                  border: isOther ? "2.5px solid var(--gold)" : "2.5px solid transparent",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.18s ease",
                  boxShadow: isOther ? "0 4px 24px rgba(200,168,75,0.18)" : "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.55rem", letterSpacing: "0.06em", color: isOther ? "var(--gold)" : "var(--ink)", lineHeight: 1 }}>
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
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "8px" }}>
                Vote Recorded
              </div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15, color: "var(--ink)", margin: 0 }}>
                You voted for <span style={{ color: "var(--gold)" }}>{displayName}</span>
              </h2>
            </div>

            {/* Results bar chart */}
            <div
              style={{
                background: "white",
                borderRadius: "6px",
                padding: "32px",
                marginBottom: "52px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--ink)", marginBottom: "24px" }}>
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
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)" }}>The Breakdown</span>
              <span style={{ flex: 1, height: "2px", background: "rgba(0,0,0,0.1)" }} />
            </div>

            {/* Analysis cards */}
            {ANALYSIS.map((a) => (
              <div
                key={a.id}
                style={{
                  background: "white",
                  borderRadius: "6px",
                  padding: "28px 32px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                  borderLeft: a.id === selected ? "4px solid var(--gold)" : "4px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                  <img src={a.logo} alt={a.team} style={{ width: "44px", height: "44px", objectFit: "contain" }} />
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: "var(--ink)", lineHeight: 1 }}>
                      {a.emoji} {a.team}
                    </div>
                    <div style={{ fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginTop: "2px" }}>
                      {a.subtitle}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--mid)", margin: 0 }}>
                  {a.body}
                </p>
              </div>
            ))}

            {/* Crashing Contenders */}
            <div
              style={{
                background: "var(--ink)",
                color: "var(--cream)",
                borderRadius: "6px",
                padding: "28px 32px",
                marginBottom: "48px",
              }}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.12em", color: "var(--gold)", marginBottom: "14px" }}>
                💥 The Crashing Contenders
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "rgba(250,247,242,0.8)", marginBottom: "16px" }}>
                Didn't see your team on the main list? Here are two other groups that could easily claim the crown:
              </p>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "rgba(250,247,242,0.8)", marginBottom: "10px" }}>
                <strong style={{ color: "var(--gold)" }}>Miami Dolphins:</strong> Speed kills, and no one has more of it than Tyreek Hill and Jaylen Waddle. They can turn a simple 5-yard slant into a 75-yard touchdown in the blink of an eye.
              </p>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "rgba(250,247,242,0.8)", margin: 0 }}>
                <strong style={{ color: "var(--gold)" }}>Houston Texans:</strong> A brutally underrated unit featuring Stefon Diggs, Nico Collins, and Tank Dell. They boast a terrifying mix of veteran savvy, size, and lightning-fast agility.
              </p>
            </div>

            {/* Closing question */}
            <p style={{ textAlign: "center", fontSize: "1rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.7, marginBottom: "40px" }}>
              What matters most to you? A single unguardable superstar, a pair of lethal weapons, or a trio where anyone can lead the team in targets on any given week?
            </p>

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
                  fontFamily: "'Bebas Neue', sans-serif",
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
