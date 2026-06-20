
import { useEffect, useState } from "react";
import { Briefcase, Search, Trash2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

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

const STATUS_COLOR = {
  Applied: C.accent,
  Interview: C.amber,
  Offer: C.accent,
  Rejected: C.coral,
};

const fontImports = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');
  input:focus, select:focus, button:focus { outline: 2px solid ${C.accent}; outline-offset: 2px; }
  ::placeholder { color: ${C.muted}; opacity: 1; }
`;

function Jobs() {
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);

  const [searchCompany, setSearchCompany] = useState("");

  const [dashboard, setDashboard] = useState({
    total_jobs: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    job_url: "",
    job_status: "Applied",
    applied_date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/jobs/?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setJobs(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/jobs/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDashboard(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchJobs = async () => {
    if (!searchCompany.trim()) {
      fetchJobs();
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/jobs/search?company_name=${searchCompany}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setJobs(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addJob = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/jobs/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Job Added Successfully");

        setFormData({
          job_title: "",
          company_name: "",
          job_url: "",
          job_status: "Applied",
          applied_date: "",
        });

        fetchJobs();
        fetchDashboard();
      } else {
        const error = await response.json();
        alert(JSON.stringify(error));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteJob = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/jobs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Job Deleted Successfully");
        fetchJobs();
        fetchDashboard();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div style={styles.page}>
      <style>{fontImports}</style>

      <div style={styles.container}>
        <div style={styles.eyebrow}>
          <Briefcase size={14} strokeWidth={2.5} />
          <span>JOB TRACKER</span>
        </div>
        <h1 style={styles.title}>Job Tracker</h1>

        {/* Dashboard */}
        <div style={styles.statGrid}>
          <StatCard label="Total Jobs" value={dashboard.total_jobs} color={C.text} />
          <StatCard label="Applied" value={dashboard.applied} color={STATUS_COLOR.Applied} />
          <StatCard label="Interview" value={dashboard.interview} color={STATUS_COLOR.Interview} />
          <StatCard label="Offer" value={dashboard.offer} color={STATUS_COLOR.Offer} />
          <StatCard label="Rejected" value={dashboard.rejected} color={STATUS_COLOR.Rejected} />
        </div>

        {/* Add Job Form */}
        <form onSubmit={addJob} style={styles.panel}>
          <h2 style={styles.panelTitle}>Add a job</h2>

          <input
            type="text"
            name="job_title"
            placeholder="Job title"
            value={formData.job_title}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="text"
            name="company_name"
            placeholder="Company name"
            value={formData.company_name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="text"
            name="job_url"
            placeholder="Job URL"
            value={formData.job_url}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <select
            name="job_status"
            value={formData.job_status}
            onChange={handleChange}
            style={styles.input}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <input
            type="datetime-local"
            name="applied_date"
            value={formData.applied_date}
            onChange={handleChange}
            required
            style={{ ...styles.input, colorScheme: "dark" }}
          />

          <button type="submit" style={styles.primaryButton}>
            Add job
          </button>
        </form>

        {/* Search */}
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search by company name"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            style={{ ...styles.input, marginBottom: 0, flex: 1 }}
          />

          <button onClick={searchJobs} style={styles.secondaryButton}>
            <Search size={15} />
            Search
          </button>
        </div>

        <h2 style={styles.sectionTitle}>My jobs</h2>

        {jobs.length === 0 ? (
          <p style={{ color: C.muted, fontSize: 14 }}>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.job_id} style={styles.jobCard}>
              <div style={styles.jobCardHead}>
                <h3 style={styles.jobTitle}>{job.job_title}</h3>
                <span
                  style={{
                    ...styles.statusBadge,
                    borderColor: STATUS_COLOR[job.job_status] || C.muted,
                    color: STATUS_COLOR[job.job_status] || C.muted,
                  }}
                >
                  {job.job_status}
                </span>
              </div>

              <p style={styles.jobMeta}>
                <span style={styles.jobMetaLabel}>Company</span> {job.company_name}
              </p>

              <p style={styles.jobMeta}>
                <span style={styles.jobMetaLabel}>Applied</span>{" "}
                {new Date(job.applied_date).toLocaleString()}
              </p>

              <div style={styles.jobCardFooter}>
                {job.job_url !== "string" && (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.viewLink}
                  >
                    <ExternalLink size={13} />
                    View job
                  </a>
                )}

                <button
                  onClick={() => deleteJob(job.job_id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <div style={styles.pagination}>
          <button
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
            style={styles.pageButton}
          >
            <ChevronLeft size={15} />
            Previous
          </button>

          <span style={styles.pageLabel}>Page {page}</span>

          <button onClick={() => setPage(page + 1)} style={styles.pageButton}>
            Next
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <span style={{ ...styles.statValue, color }}>{value}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'Inter', sans-serif",
    padding: "40px 24px 80px",
  },
  container: {
    maxWidth: 760,
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
    fontSize: 32,
    fontWeight: 700,
    color: C.text,
    margin: "0 0 28px",
    letterSpacing: "-0.01em",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
    gap: 10,
    marginBottom: 32,
  },
  statCard: {
    background: C.panel,
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 8,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  statLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    color: C.muted,
    letterSpacing: "0.05em",
  },
  statValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 24,
    fontWeight: 700,
  },
  panel: {
    background: C.panel,
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 10,
    padding: 22,
    marginBottom: 28,
    display: "flex",
    flexDirection: "column",
  },
  panelTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 17,
    fontWeight: 600,
    color: C.text,
    margin: "0 0 16px",
  },
  input: {
    width: "100%",
    padding: "11px 12px",
    marginBottom: 10,
    background: "#0B0E13",
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 6,
    color: C.text,
    fontSize: 13.5,
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  },
  primaryButton: {
    marginTop: 4,
    background: C.accent,
    color: "#0B0E13",
    border: "none",
    borderRadius: 6,
    padding: "11px 18px",
    fontWeight: 600,
    fontSize: 13.5,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  searchRow: {
    display: "flex",
    gap: 10,
    marginBottom: 24,
  },
  secondaryButton: {
    background: "transparent",
    color: C.text,
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 6,
    padding: "0 16px",
    fontWeight: 600,
    fontSize: 13.5,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.1em",
    color: C.muted,
    margin: "0 0 14px",
  },
  jobCard: {
    background: C.panel,
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
  },
  jobCardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  jobTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    color: C.text,
    margin: 0,
  },
  statusBadge: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    padding: "3px 9px",
    borderRadius: 999,
    border: "1px solid",
    whiteSpace: "nowrap",
  },
  jobMeta: {
    fontSize: 13.5,
    color: C.text,
    margin: "4px 0",
  },
  jobMetaLabel: {
    color: C.muted,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    marginRight: 6,
  },
  jobCardFooter: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginTop: 12,
  },
  viewLink: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: C.accent,
    fontSize: 13,
    textDecoration: "none",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "transparent",
    border: `1px solid ${C.coral}`,
    color: C.coral,
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 12.5,
    cursor: "pointer",
    fontFamily: "'IBM Plex Mono', monospace",
    marginLeft: "auto",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    marginTop: 28,
  },
  pageButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "transparent",
    border: `1px solid ${C.panelBorder}`,
    color: C.text,
    borderRadius: 6,
    padding: "9px 16px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  pageLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
    color: C.muted,
  },
};

export default Jobs;