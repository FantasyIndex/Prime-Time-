import { useState } from "react";
import { Link } from "wouter";
import "../styles/prime-time.css";

export default function MailingList() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "" });

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
        body: JSON.stringify({ email, firstName: form.firstName, lastName: form.lastName }),
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
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/mailing-list" className="nav-cta">Join Mailing List</Link>
          <Link href="/betting-tips" className="nav-cta">Get Free Betting Tips</Link>
        </div>
      </nav>

      {/* MAILING LIST HERO */}
      <section className="ml-hero">
        <div className="ml-hero-inner">
          <span className="issue-tag">Prime Time Sports</span>
          <h1 className="ml-title">Join Our<br /><em>Mailing List</em></h1>
          <p className="ml-sub">
            Be first to get team previews, player rankings, betting insights, and exclusive content from Editor Chris Kubala — delivered straight to your inbox.
          </p>
        </div>
        <div className="ml-form-wrap">
          {submitted ? (
            <div className="success-msg visible">
              <div className="success-icon">🏆</div>
              <h3>You're on the list!</h3>
              <p>Thanks for joining the Prime Time Sports mailing list. Watch your inbox for exclusive college football content.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ml-form">
              <div className="form-title">Sign Up For Free</div>

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
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={emailError ? { border: "2px solid #c0392b" } : {}}
                />
                {emailError && <span style={{ color: "#c0392b", fontSize: "0.82rem" }}>Please enter a valid email.</span>}
              </div>

              <div className="form-group form-check">
                <label style={agreeError ? { color: "#c0392b" } : {}}>
                  <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                  I agree to receive emails from Prime Time Sports
                </label>
              </div>

              <button type="submit" className="form-submit">Join the List</button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pts-footer">
        <img src="/logo.png" alt="Prime Time Sports" style={{ height: "52px", opacity: 0.85 }} />
      </footer>
    </div>
  );
}
