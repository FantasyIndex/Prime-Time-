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
          <img
            src="/logo.png"
            alt="Prime Time Sports"
            style={{ height: "91px", display: "block" }}
          />
        </Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/mailing-list" className="nav-cta">
            Join Mailing List
          </Link>
          <Link href="/betting-tips" className="nav-cta">
            Get Free Betting Tips
          </Link>
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
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
              Which team has the absolute{" "}
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
                      boxShadow: isSelected
                        ? "0 4px 24px rgba(200,168,75,0.18)"
                        : "0 2px 12px rgba(0,0,0,0.07)",
                    }}
                  >
                    <img
                      src={opt.logo}
                      alt={opt.team}
                      style={{ width: "52px", height: "52px", objectFit: "contain" }}
                    />
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.55rem",
                        letterSpacing: "0.06em",
                        color: isSelected ? "var(--gold)" : "var(--ink)",
                        lineHeight: 1,
                      }}
                    >
                      {opt.team}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: isSelected ? "rgba(255,255,255,0.65)" : "var(--mid)",
                        lineHeight: 1.3,
                      }}
                    >
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
                  boxShadow: isOther
                    ? "0 4px 24px rgba(200,168,75,0.18)"
                    : "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.55rem",
                    letterSpacing: "0.06em",
                    color: isOther ? "var(--gold)" : "var(--ink)",
                    lineHeight: 1,
                  }}
                >
                  Other
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isOther ? "rgba(255,255,255,0.65)" : "var(--mid)",
                  }}
                >
                  Tell us which team you think deserves it
                </span>
              </button>

              {/* Text input — slides in when Other is selected */}
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
          /* Thank-you state */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: "600px",
              padding: "40px 0",
            }}
          >
            {winner?.logo ? (
              <div style={{ marginBottom: "20px" }}>
                <img src={winner.logo} alt={winner.team} style={{ width: "80px", height: "80px", objectFit: "contain" }} />
              </div>
            ) : (
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🏈</div>
            )}
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1rem, 3vw, 1.3rem)",
                letterSpacing: "0.2em",
                color: "var(--gold)",
                marginBottom: "10px",
              }}
            >
              Vote Recorded
            </div>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                letterSpacing: "0.05em",
                lineHeight: 1.1,
                color: "var(--ink)",
                marginBottom: "20px",
              }}
            >
              {displayName} Getting{" "}
              <span style={{ color: "var(--gold)" }}>Your Vote!</span>
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--mid)", lineHeight: 1.7, marginBottom: "40px" }}>
              Thanks for weighing in. Follow Prime Time Sports for the latest
              NFL &amp; college football coverage heading into 2026.
            </p>
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
        <img
          src="/logo.png"
          alt="Prime Time Sports"
          style={{ height: "52px", opacity: 0.85 }}
        />
      </footer>
    </div>
  );
}
