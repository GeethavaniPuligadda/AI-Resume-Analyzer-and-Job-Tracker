
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ScanLine, CheckCircle2, XCircle } from "lucide-react";

const C = {
  bg: "#0E1117",
  panel: "#151A23",
  panelBorder: "#262E3A",
  text: "#E7ECF3",
  muted: "#7C8898",
  accent: "#4FE3C1",
  coral: "#F2654A",
};

const fontImports = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');
  input:focus, button:focus { outline: 2px solid ${C.accent}; outline-offset: 2px; }
  ::placeholder { color: ${C.muted}; opacity: 1; }
`;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // status: { type: "success" | "error", text: string } | null
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append("username", formData.email);
      formBody.append("password", formData.password);

      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: formBody,
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "token",
          data.access_token
        );

        setStatus({ type: "success", text: "Login successful. Redirecting..." });

        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setStatus({ type: "error", text: data.detail || "Login failed." });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{fontImports}</style>

      <div style={styles.card}>
        <div style={styles.eyebrow}>
          <ScanLine size={14} strokeWidth={2.5} />
          <span>SIGN IN</span>
        </div>
        <h2 style={styles.title}>Login</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {status && (
            <div
              style={{
                ...styles.statusBox,
                borderColor: status.type === "success" ? C.accent : C.coral,
                color: status.type === "success" ? C.accent : C.coral,
                background:
                  status.type === "success"
                    ? "rgba(79,227,193,0.08)"
                    : "rgba(242,101,74,0.08)",
              }}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={16} strokeWidth={2} />
              ) : (
                <XCircle size={16} strokeWidth={2} />
              )}
              <span>{status.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <LogIn size={15} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: C.panel,
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 12,
    padding: 28,
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11.5,
    letterSpacing: "0.12em",
    color: C.accent,
    marginBottom: 10,
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 26,
    fontWeight: 700,
    color: C.text,
    margin: "0 0 22px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    width: "100%",
    padding: "12px 13px",
    background: "#0B0E13",
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 7,
    color: C.text,
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  },
  statusBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 7,
    border: "1px solid",
    fontSize: 13,
  },
  button: {
    marginTop: 4,
    width: "100%",
    padding: "12px",
    background: C.accent,
    color: "#0B0E13",
    border: "none",
    borderRadius: 7,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
};

export default Login;