
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, ScanLine, LogOut } from "lucide-react";

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
  button:focus { outline: 2px solid ${C.accent}; outline-offset: 2px; }
`;

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        alert("Server Error");
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <style>{fontImports}</style>

      <div style={styles.container}>
        <div style={styles.eyebrow}>
          <ScanLine size={14} strokeWidth={2.5} />
          <span>PROFILE</span>
        </div>
        <h1 style={styles.title}>User information</h1>

        {user ? (
          <div style={styles.card}>
            <div style={styles.avatar}>
              {user.name?.charAt(0)?.toUpperCase() || "?"}
            </div>

            <div style={styles.infoRow}>
              <User size={16} color={C.muted} strokeWidth={1.75} />
              <div>
                <span style={styles.infoLabel}>Name</span>
                <p style={styles.infoValue}>{user.name}</p>
              </div>
            </div>

            <div style={styles.infoRow}>
              <Mail size={16} color={C.muted} strokeWidth={1.75} />
              <div>
                <span style={styles.infoLabel}>Email</span>
                <p style={styles.infoValue}>{user.email}</p>
              </div>
            </div>

            <button onClick={handleLogout} style={styles.logoutButton}>
              <LogOut size={14} />
              Log out
            </button>
          </div>
        ) : (
          <p style={styles.loadingText}>Loading user details...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'Inter', sans-serif",
    padding: "48px 24px 80px",
  },
  container: {
    maxWidth: 420,
    margin: "0 auto",
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.12em",
    color: C.accent,
    marginBottom: 12,
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: C.text,
    margin: "0 0 28px",
    letterSpacing: "-0.01em",
  },
  card: {
    background: C.panel,
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 12,
    padding: 26,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "rgba(79,227,193,0.12)",
    border: `1px solid ${C.accent}`,
    color: C.accent,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 22,
    fontWeight: 700,
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  infoLabel: {
    display: "block",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: C.muted,
    letterSpacing: "0.05em",
  },
  infoValue: {
    fontSize: 15,
    color: C.text,
    margin: "4px 0 0",
  },
  logoutButton: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "transparent",
    border: `1px solid ${C.coral}`,
    color: C.coral,
    borderRadius: 7,
    padding: "11px",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  loadingText: {
    color: C.muted,
    fontSize: 14,
  },
};

export default Dashboard;