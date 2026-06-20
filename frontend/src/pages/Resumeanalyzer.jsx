
import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, XCircle, Loader2, ScanLine } from "lucide-react";

// Point this at your FastAPI server
const API_BASE = "http://localhost:8000";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const handleSubmit = async () => {
    if (!file || !jobDescription.trim()) {
      setError("Add a resume PDF and a job description first.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_description", jobDescription);

      const res = await fetch(`${API_BASE}/resume/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Couldn't reach the analyzer. Check your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page} className="resume-analyzer-page">
      <style>{fontImports}</style>
      <div style={styles.scanlineOverlay} />

      <header style={styles.header}>
        <div style={styles.headerEyebrow}>
          <ScanLine size={14} strokeWidth={2.5} />
          <span>RESUME // ATS SCAN</span>
        </div>
        <h1 style={styles.title}>Resume Analyzer</h1>
        <p style={styles.subtitle}>
          Drop your resume and a job description in. Get a real skill-match
          breakdown back, not a guess.
        </p>
      </header>

      <main style={styles.grid}>
        {/* Input panel */}
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>01 / Input</h2>

          <div
            style={{
              ...styles.dropzone,
              ...(file ? styles.dropzoneFilled : {}),
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {file ? (
              <>
                <FileText size={28} color={C.accent} strokeWidth={1.5} />
                <span style={styles.dropzoneFileName}>{file.name}</span>
                <span style={styles.dropzoneHint}>Click to replace</span>
              </>
            ) : (
              <>
                <Upload size={28} color={C.muted} strokeWidth={1.5} />
                <span style={styles.dropzoneText}>
                  Drop resume PDF here, or click to browse
                </span>
              </>
            )}
          </div>

          <label style={styles.label}>Job description</label>
          <textarea
            style={styles.textarea}
            placeholder="Paste the full job posting here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
          />

          {error && <div style={styles.errorBox}>{error}</div>}

          <button
            style={{
              ...styles.button,
              ...(loading ? styles.buttonLoading : {}),
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" style={{ animation: "spin 1s linear infinite" }} />
                Scanning...
              </>
            ) : (
              "Run analysis"
            )}
          </button>
        </section>

        {/* Results panel */}
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>02 / Results</h2>

          {!result && !loading && (
            <div style={styles.emptyState}>
              <ScanLine size={32} color={C.muted} strokeWidth={1} />
              <p style={styles.emptyText}>
                Results will appear here once you run a scan.
              </p>
            </div>
          )}

          {loading && (
            <div style={styles.emptyState}>
              <div style={styles.scanningBox}>
                <div style={styles.scanningLine} />
              </div>
              <p style={styles.emptyText}>Reading resume and comparing against job description...</p>
            </div>
          )}

          {result && (
            <div style={styles.results}>
              <ScoreGauge score={result.ats_score} />

              <div style={styles.subScores}>
                <SubScore label="Skill match" value={result.skill_match_score} />
                <SubScore label="Semantic similarity" value={result.semantic_similarity_score} />
              </div>

              <div style={styles.suggestionBox}>
                <span style={styles.suggestionLabel}>Suggestion</span>
                <p style={styles.suggestionText}>{result.career_suggestion}</p>
              </div>

              <SkillSection
                title="Matched skills"
                skills={result.matched_skills}
                tone="match"
              />
              <SkillSection
                title="Missing skills"
                skills={result.missing_skills}
                tone="miss"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ScoreGauge({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? C.accent : score >= 40 ? C.amber : C.coral;

  return (
    <div style={styles.gaugeWrap}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke={C.panelBorder} strokeWidth="8" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div style={styles.gaugeCenter}>
        <span style={{ ...styles.gaugeNumber, color }}>{Math.round(score)}</span>
        <span style={styles.gaugeUnit}>ATS SCORE</span>
      </div>
    </div>
  );
}

function SubScore({ label, value }) {
  const color = value >= 70 ? C.accent : value >= 40 ? C.amber : C.coral;
  return (
    <div style={styles.subScoreRow}>
      <div style={styles.subScoreHead}>
        <span style={styles.subScoreLabel}>{label}</span>
        <span style={{ ...styles.subScoreValue, color }}>{Math.round(value)}%</span>
      </div>
      <div style={styles.subScoreTrack}>
        <div
          style={{
            ...styles.subScoreFill,
            width: `${Math.min(value, 100)}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

function SkillSection({ title, skills, tone }) {
  const entries = Object.entries(skills || {});
  const isMatch = tone === "match";
  const color = isMatch ? C.accent : C.coral;
  const Icon = isMatch ? CheckCircle2 : XCircle;

  return (
    <div style={styles.skillSection}>
      <span style={styles.skillSectionTitle}>{title}</span>
      {entries.length === 0 ? (
        <span style={styles.skillEmpty}>
          {isMatch ? "No overlapping skills found." : "Nothing missing — great coverage."}
        </span>
      ) : (
        <div style={styles.chipRow}>
          {entries.map(([skill, category]) => (
            <span key={skill} style={{ ...styles.chip, borderColor: color }}>
              <Icon size={12} color={color} strokeWidth={2.5} />
              <span>{skill}</span>
              <span style={styles.chipCategory}>{category}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- design tokens ----
const C = {
  bg: "#0E1117",
  panel: "#151A23",
  panelBorder: "#262E3A",
  text: "#E7ECF3",
  muted: "#7C8898",
  accent: "#4FE3C1",
  amber: "#F0B43A",
  coral: "#F2654A",
};

const fontImports = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes scanmove { 0% { top: 0%; } 50% { top: 92%; } 100% { top: 0%; } }
  textarea:focus, button:focus { outline: 2px solid ${C.accent}; outline-offset: 2px; }
  .resume-analyzer-page h1,
  .resume-analyzer-page h2,
  .resume-analyzer-page h3,
  .resume-analyzer-page p,
  .resume-analyzer-page span,
  .resume-analyzer-page label {
    color: inherit !important;
  }
  .resume-analyzer-page h1 { color: ${C.text} !important; }
`;

const styles = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'Inter', sans-serif",
    padding: "48px 24px 80px",
    position: "relative",
    overflow: "hidden",
  },
  scanlineOverlay: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
  },
  header: {
    maxWidth: 1000,
    margin: "0 auto 40px",
  },
  headerEyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.12em",
    color: C.accent,
    marginBottom: 14,
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "clamp(32px, 5vw, 44px)",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: C.muted,
    fontSize: 15,
    maxWidth: 520,
    marginTop: 10,
    lineHeight: 1.5,
  },
  grid: {
    maxWidth: 1000,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  panel: {
    background: C.panel,
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 10,
    padding: 24,
    display: "flex",
    flexDirection: "column",
  },
  panelTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.1em",
    color: C.muted,
    margin: "0 0 18px",
    fontWeight: 500,
  },
  dropzone: {
    border: `1.5px dashed ${C.panelBorder}`,
    borderRadius: 8,
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    transition: "border-color 0.2s ease",
    marginBottom: 20,
  },
  dropzoneFilled: {
    borderColor: C.accent,
    borderStyle: "solid",
  },
  dropzoneText: {
    color: C.muted,
    fontSize: 13,
    textAlign: "center",
  },
  dropzoneFileName: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
    color: C.text,
  },
  dropzoneHint: {
    fontSize: 11,
    color: C.muted,
  },
  label: {
    fontSize: 12,
    color: C.muted,
    marginBottom: 8,
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.05em",
  },
  textarea: {
    background: "#0B0E13",
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 8,
    padding: 14,
    color: C.text,
    fontSize: 13,
    fontFamily: "'IBM Plex Mono', monospace",
    resize: "vertical",
    lineHeight: 1.5,
  },
  errorBox: {
    marginTop: 14,
    padding: "10px 14px",
    background: "rgba(242,101,74,0.1)",
    border: `1px solid ${C.coral}`,
    borderRadius: 6,
    color: C.coral,
    fontSize: 13,
  },
  button: {
    marginTop: 18,
    background: C.accent,
    color: "#0B0E13",
    border: "none",
    borderRadius: 8,
    padding: "13px 20px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  buttonLoading: {
    opacity: 0.7,
    cursor: "default",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    minHeight: 280,
    textAlign: "center",
  },
  emptyText: {
    color: C.muted,
    fontSize: 13,
    maxWidth: 220,
  },
  scanningBox: {
    width: 60,
    height: 60,
    border: `1.5px solid ${C.panelBorder}`,
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
  },
  scanningLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    background: C.accent,
    boxShadow: `0 0 8px ${C.accent}`,
    animation: "scanmove 1.4s ease-in-out infinite",
  },
  results: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
  gaugeWrap: {
    position: "relative",
    width: 140,
    height: 140,
    margin: "0 auto",
  },
  gaugeCenter: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeNumber: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1,
  },
  gaugeUnit: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: C.muted,
    letterSpacing: "0.1em",
    marginTop: 4,
  },
  subScores: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  subScoreRow: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  subScoreHead: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
  },
  subScoreLabel: {
    color: C.muted,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  subScoreValue: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 500,
  },
  subScoreTrack: {
    height: 5,
    borderRadius: 3,
    background: "#0B0E13",
    overflow: "hidden",
  },
  subScoreFill: {
    height: "100%",
    borderRadius: 3,
    transition: "width 0.8s ease",
  },
  suggestionBox: {
    background: "#0B0E13",
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 8,
    padding: 14,
  },
  suggestionLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: C.accent,
    letterSpacing: "0.08em",
  },
  suggestionText: {
    fontSize: 13,
    color: C.text,
    margin: "6px 0 0",
    lineHeight: 1.5,
  },
  skillSection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  skillSectionTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    color: C.muted,
    letterSpacing: "0.05em",
  },
  skillEmpty: {
    fontSize: 12,
    color: C.muted,
    fontStyle: "italic",
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: 999,
    border: "1px solid",
    fontSize: 12,
    background: "#0B0E13",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  chipCategory: {
    color: C.muted,
    fontSize: 10,
  },
};