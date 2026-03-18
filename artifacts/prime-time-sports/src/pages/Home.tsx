import { useState } from "react";
import { Link } from "wouter";
import "../styles/prime-time.css";

export default function Home() {
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
    <div style={{ background: "var(--cream)", color: "var(--ink)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, overflowX: "hidden" }}>

      {/* TOP BAR */}
      <div className="topbar">
        2026 College Football Preview — On Newsstands &amp; Amazon Now
      </div>

      {/* NAV */}
      <nav className="pts-nav">
        <a href="#">
          <img src="/logo.png" alt="Prime Time Sports" style={{ height: "91px", display: "block" }} />
        </a>
        <Link href="/betting-tips" className="nav-cta">Get Free Betting Tips</Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <span className="issue-tag">College Football 2026</span>
          <h1 className="hero-headline">
            Debut<br />Issue<br /><em>Out Now</em>
          </h1>
          <p className="hero-sub">
            Season preview for ACC, Big 10, Big 12, SEC, AAC, PAC 12 &amp; Sun Belt conferences. Get team profiles, player reviews, special features and more.
          </p>
        </div>
        <div className="hero-right">
          <div className="hero-graphic" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "18px" }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem", letterSpacing: "0.18em", color: "var(--ink)", textAlign: "center", lineHeight: 1.4 }}>
              2026 COLLEGE PREVIEW<br />
              <span style={{ color: "var(--gold)", fontSize: "1.2rem" }}>AVAILABLE ON NEWSSTANDS &amp; AMAZON</span>
            </div>
            <img
              src="/cover.jpg"
              alt="Prime Time Sports College Football 2026"
              className="cover-float"
            />
          </div>
        </div>
      </section>


      {/* LOGO STRIP */}
      <section className="logo-strip">
        <img src="/logo-sec.png?v=3"           alt="SEC" />
        <img src="/logo-big10.png?v=2"         alt="Big Ten" />
        <img src="/logo-big12.png?v=3"         alt="Big 12" />
        <img src="/logo-acc.png?v=2"           alt="ACC"    className="logo-lg" />
        <img src="/logo-pac12.png?v=2"         alt="PAC-12" className="logo-lg" />
        <img src="/logo-aac.png?v=2"           alt="AAC" />
        <img src="/logo-mountain-west.png?v=2" alt="Mountain West" className="logo-lg" />
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-wrap" id="newsletter">
        <div className="newsletter-left">
          <h2 className="nl-headline">Free-With-Magazine<br /><span>Betting Tips</span></h2>
          <p className="nl-body">
            Get Editor Chris Kubala's free 2026 college football betting tips in a special PDF download. Emailed to you August 22.
          </p>
          <img src="/player.png" alt="Football player" className="nl-player" />
        </div>

        <div className="newsletter-right">
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
      </section>

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
