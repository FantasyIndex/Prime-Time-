import { useState } from "react";
import "../styles/prime-time.css";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    conference: "",
    agree: false,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, overflowX: "hidden" }}>

      {/* TOP BAR */}
      <div className="topbar">
        2026 College Football Preview — On Newsstands &amp; Amazon Now
      </div>

      {/* NAV */}
      <nav className="pts-nav">
        <a href="#" className="nav-logo">Prime Time <span>Sports</span></a>
        <a href="#" className="nav-cta">Get Free Betting Tips</a>
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
          <div className="hero-scroll">Scroll to explore</div>
        </div>
        <div className="hero-right">
          <div className="hero-graphic" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"18px"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.6rem",letterSpacing:"0.18em",color:"var(--ink)",textAlign:"center",lineHeight:1.4}}>
              2026 COLLEGE PREVIEW<br/>
              <span style={{color:"var(--gold)",fontSize:"1.2rem"}}>AVAILABLE ON NEWSSTANDS &amp; AMAZON</span>
            </div>
            <img
              src="/cover.jpg"
              alt="Prime Time Sports – 2026 College Football Preview"
              style={{
                width: "260px",
                boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                border: "1px solid rgba(200,168,75,0.4)",
                animation: "floatCard 4s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <div className="features">
        <div className="feature">
          <div className="feature-num">6</div>
          <div className="feature-label">Conferences</div>
          <p className="feature-desc">Complete coverage of all major college football conferences in one definitive guide.</p>
        </div>
        <div className="feature">
          <div className="feature-num">350+</div>
          <div className="feature-label">Teams Profiled</div>
          <p className="feature-desc">In-depth analysis of every program competing for the national championship this season.</p>
        </div>
        <div className="feature">
          <div className="feature-num">500+</div>
          <div className="feature-label">Players Reviewed</div>
          <p className="feature-desc">Expert scouting reports on the standout athletes you need to watch this season.</p>
        </div>
      </div>

      {/* NEWSLETTER / SUBSCRIBE */}
      <div className="newsletter-wrap" id="subscribe">
        <div className="newsletter-left">
          <div className="nl-tag">Exclusive Access</div>
          <h2 className="nl-headline">Get The <span>Inside Edge</span></h2>
          <p className="nl-body">
            Join thousands of college football fans who rely on Prime Time Sports for the sharpest previews, player breakdowns, and insider coverage all season long.
          </p>
          <ul className="nl-perks">
            <li>Full 2026 season preview delivered to your door</li>
            <li>Conference-by-conference team & player breakdowns</li>
            <li>Exclusive subscriber-only digital content</li>
            <li>Early access to future issues and special editions</li>
          </ul>
        </div>
        <div className="newsletter-right">
          {submitted ? (
            <div className="success-msg visible">
              <div className="success-icon">🏆</div>
              <h3>You're In!</h3>
              <p>Welcome to Prime Time Sports. Your first issue is on its way — enjoy the season.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-title">Order Your Copy</div>
              <div className="form-sub">Available in print and digital editions.</div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={form.firstName}
                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Smith"
                    value={form.lastName}
                    onChange={e => setForm({ ...form, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Favorite Conference</label>
                <select
                  value={form.conference}
                  onChange={e => setForm({ ...form, conference: e.target.value })}
                >
                  <option value="">Select a conference…</option>
                  <option>ACC</option>
                  <option>Big 10</option>
                  <option>Big 12</option>
                  <option>SEC</option>
                  <option>AAC</option>
                  <option>PAC 12</option>
                  <option>Sun Belt</option>
                </select>
              </div>

              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="agree"
                  checked={form.agree}
                  onChange={e => setForm({ ...form, agree: e.target.checked })}
                  required
                />
                <span>
                  I agree to receive updates and promotional emails from Prime Time Sports. Unsubscribe anytime.
                </span>
              </div>

              <button type="submit" className="btn-submit">Order Now — Get the Preview</button>
              <p className="form-note">No spam. No junk. Just football.</p>
            </form>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pts-footer">
        <div className="footer-col">
          <div className="footer-brand">Prime Time <span>Sports</span></div>
          <p className="footer-tagline">
            The definitive college football preview magazine — delivering expert analysis, team profiles, and player spotlights every season.
          </p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">2026 Season Preview</a></li>
            <li><a href="#">Conference Coverage</a></li>
            <li><a href="#">Player Spotlights</a></li>
            <li><a href="#">Subscribe</a></li>
            <li><a href="#">Find on Amazon</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Information</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Advertising</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
          </ul>
        </div>
      </footer>
      <div className="footer-bottom">
        © 2026 <span>Prime Time Sports</span>. All rights reserved.
      </div>

    </div>
  );
}
