import { useState } from "react";
import { Link } from "wouter";
import "../styles/prime-time.css";

export default function BettingTips() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", conference: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    if (!email || !email.includes("@")) { setEmailError(true); valid = false; setTimeout(() => setEmailError(false), 2000); }
    if (!agree) { setAgreeError(true); valid = false; setTimeout(() => setAgreeError(false), 2000); }
    if (!valid) return;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName: form.firstName, lastName: form.lastName, conference: form.conference }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  }

  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, overflowX: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* TOP BAR */}
      <div className="topbar">
        2026 College Football Preview — On Newsstands &amp; Amazon Now
      </div>

      {/* NAV */}
      <nav className="pts-nav">
        <Link href="/">
          <img src="/logo.png" alt="Prime Time Sports" style={{ height: "91px", display: "block" }} />
        </Link>
        <Link href="/betting-tips" className="nav-cta">Get Free Betting Tips</Link>
      </nav>

      {/* BETTING TIPS PAGE CONTENT */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "160px", paddingBottom: "80px" }}>

        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div className="nl-tag" style={{ display: "inline-block", marginBottom: "16px" }}>Free Betting Tips — 2026 Season</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", lineHeight: 1, marginBottom: "16px" }}>
            Free<br /><span style={{ color: "var(--gold)" }}>Betting Tips</span>
          </h1>
          <p style={{ maxWidth: "520px", margin: "0 auto", color: "var(--mid)", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Get Editor Chris Kubala's free 2026 college football betting tips in a special PDF download. Get the inside line before the season kicks off on August 22.
          </p>
        </div>

        <div className="newsletter-right" style={{ width: "100%", maxWidth: "520px" }}>
          {submitted ? (
            <div className="success-msg visible">
              <div className="success-icon">🏆</div>
              <h3>Your Tips Are On The Way!</h3>
              <p>Thanks for signing up! Editor Chris Kubala's free 2026 college football betting tips will be in your inbox shortly — check your spam folder just in case.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-title">Claim Your Free Betting Tips</div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="Jordan" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Mitchell" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={emailError ? { borderColor: "#B94B2A" } : {}}
                />
              </div>

              <div className="form-group">
                <label>Favorite Conference</label>
                <select value={form.conference} onChange={e => setForm({ ...form, conference: e.target.value })}>
                  <option value="">Select a conference…</option>
                  <option>SEC</option>
                  <option>Big Ten</option>
                  <option>Big 12</option>
                  <option>ACC</option>
                  <option>Pac-12</option>
                  <option>American Athletic</option>
                  <option>Independent (Notre Dame, etc.)</option>
                  <option>All of the above 🏈</option>
                </select>
              </div>

              <div className="checkbox-row">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                  style={agreeError ? { outline: "2px solid #B94B2A" } : {}}
                />
                <span>I agree to receive free betting tips and updates from Prime Time Sports. I can unsubscribe at any time.</span>
              </div>

              <button type="submit" className="btn-submit">Get My Free Betting Tips →</button>
              <p className="form-note">🔒 No spam. No sharing your data. Ever.</p>
            </form>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="pts-footer">
        <img src="/logo.png" alt="Prime Time Sports" style={{ height: "64px", display: "block", filter: "brightness(0) invert(1)" }} />
      </footer>
      <div className="footer-bottom">
        © 2025 <span>Prime Time Sports</span> · All Rights Reserved · College Football's Premier Publication
      </div>

    </div>
  );
}
