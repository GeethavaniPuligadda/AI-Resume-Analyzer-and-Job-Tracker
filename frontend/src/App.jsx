import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

function App() {
  return (
    <BrowserRouter>
      <nav
        style={{
          display: "flex",
          gap: "20px",
          padding: "15px",
          backgroundColor: "#1f2937",
        }}
      >
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none" }}
        >
          Home
        </Link>

        <Link
          to="/login"
          style={{ color: "white", textDecoration: "none" }}
        >
          Login
        </Link>

        <Link
          to="/register"
          style={{ color: "white", textDecoration: "none" }}
        >
          Register
        </Link>

        <Link
          to="/profile"
          style={{ color: "white", textDecoration: "none" }}
        >
          Profile
        </Link>

        <Link
          to="/jobs"
          style={{ color: "white", textDecoration: "none" }}
        >
          Jobs
        </Link>
        <Link
          to="/resume-analyzer"
          style={{ color: "white", textDecoration: "none" }}
        >
          Resume Analyzer
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Dashboard />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;