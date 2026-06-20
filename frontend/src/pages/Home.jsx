
import { Link } from "react-router-dom";
import { ScanLine, Target, Briefcase, BarChart3, Lock, TrendingUp } from "lucide-react";

const C = {
  bg: "#0E1117",
  panel: "#151A23",
  panelBorder: "#262E3A",
  text: "#E7ECF3",
  muted: "#7C8898",
  accent: "#4FE3C1",
};

const fontImports = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');
  button:focus, a:focus { outline: 2px solid ${C.accent}; outline-offset: 2px; }
`;

const features = [
  {
    icon: ScanLine,
    title: "Resume scanning",
    text: "Upload your resume and get it read instantly — no manual data entry.",
  },
  {
    icon: Target,
    title: "ATS score analysis",
    text: "Compare your resume against any job description and see exactly where you stand.",
  },
  {
    icon: Briefcase,
    title: "Job tracking",
    text: "Track applied jobs, interviews, offers, and rejections in one place.",
  },
  {
    icon: BarChart3,
    title: "Dashboard analytics",
    text: "View job statistics and monitor your application progress over time.",
  },
  {
    icon: Lock,
    title: "Secure login",
    text: "JWT authentication keeps your data protected and private.",
  },
  {
    icon: TrendingUp,
    title: "Career growth",
    text: "Improve your resume quality and increase your interview chances.",
  },
];

function Home() {
  return (
    <div style={styles.page}>
      <style>{fontImports}</style>

      <section style={styles.hero}>
        <div style={styles.eyebrow}>
          <ScanLine size={14} strokeWidth={2.5} />
          <span>RESUME // JOB SEARCH OS</span>
        </div>

        <h1 style={{ ...styles.title, color: C.text }}>AI Resume Analyzer &amp; Job Tracker</h1>

        <p style={{ ...styles.subtitle, color: C.muted }}>
          Analyze your resume, improve your ATS score, track job applications,
          and manage your whole job search in one place.
        </p>

        <div style={styles.ctaRow}>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <button style={styles.primaryButton}>New here? Register</button>
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={styles.secondaryButton}>Already have an account? Log in</button>
          </Link>
        </div>
      </section>

      <section style={styles.features}>
        <h2 style={{ ...styles.featuresTitle, color: C.muted }}>What you get</h2>
        <div style={styles.grid}>
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} style={styles.card}>
              <Icon size={22} color={C.accent} strokeWidth={1.75} />
              <h3 style={{ ...styles.cardTitle, color: C.text }}>{title}</h3>
              <p style={{ ...styles.cardText, color: C.muted }}>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'Inter', sans-serif",
  },
  hero: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "80px 24px 56px",
    textAlign: "center",
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.12em",
    color: C.accent,
    marginBottom: 18,
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
  },
  subtitle: {
    color: C.muted,
    fontSize: 16,
    lineHeight: 1.6,
    margin: "20px auto 0",
    maxWidth: 540,
  },
  ctaRow: {
    marginTop: 34,
    display: "flex",
    justifyContent: "center",
    gap: 14,
    flexWrap: "wrap",
  },
  primaryButton: {
    background: C.accent,
    color: "#0B0E13",
    border: "none",
    borderRadius: 8,
    padding: "13px 22px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  secondaryButton: {
    background: "transparent",
    color: C.text,
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 8,
    padding: "13px 22px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  features: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "20px 24px 80px",
  },
  featuresTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.1em",
    color: C.muted,
    textAlign: "center",
    marginBottom: 28,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    background: C.panel,
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 10,
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
  },
  cardText: {
    color: C.muted,
    fontSize: 13.5,
    lineHeight: 1.55,
    margin: 0,
  },
};

export default Home;