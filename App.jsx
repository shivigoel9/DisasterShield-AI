
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "disasterShieldReports";

const initialReports = [
  {
    id: 1,
    type: "Flood",
    location: "Kanpur, Uttar Pradesh",
    risk: "Critical",
    status: "Active",
    time: "10:30 AM",
    description: "Heavy rainfall and waterlogging reported.",
  },
  {
    id: 2,
    type: "Fire",
    location: "Lucknow, Uttar Pradesh",
    risk: "High",
    status: "Responding",
    time: "11:15 AM",
    description: "Fire incident reported for assessment.",
  },
  {
    id: 3,
    type: "Earthquake",
    location: "Dehradun, Uttarakhand",
    risk: "Medium",
    status: "Monitoring",
    time: "12:05 PM",
    description: "Reported seismic incident under monitoring.",
  },
  {
    id: 4,
    type: "Landslide",
    location: "Nainital, Uttarakhand",
    risk: "High",
    status: "Resolved",
    time: "01:20 PM",
    description: "Sample resolved incident.",
  },
];

const disasterTypes = [
  "Flood",
  "Fire",
  "Earthquake",
  "Landslide",
  "Cyclone",
  "Drought",
  "Other",
];

const riskLevels = ["Low", "Medium", "High", "Critical"];

const statusOptions = [
  "Active",
  "Responding",
  "Monitoring",
  "Resolved",
];

const riskColors = {
  Critical: "#e34c5c",
  High: "#f59e0b",
  Medium: "#3679ee",
  Low: "#20a879",
};

function loadReports() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load reports:", error);
  }

  return initialReports;
}

function getDisasterIcon(type) {
  const icons = {
    Flood: "🌊",
    Fire: "🔥",
    Earthquake: "🌎",
    Landslide: "⛰️",
    Cyclone: "🌀",
    Drought: "☀️",
    Other: "⚠️",
  };

  return icons[type] || "⚠️";
}

function Analytics({ reports }) {
  const typeStats = useMemo(
    () =>
      disasterTypes
        .filter((type) => type !== "Other")
        .map((type) => ({
          type,
          count: reports.filter((report) => report.type === type).length,
        }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count),
    [reports]
  );

  const riskStats = useMemo(
    () =>
      riskLevels.map((risk) => ({
        risk,
        count: reports.filter((report) => report.risk === risk).length,
      })),
    [reports]
  );

  const maxTypeCount = Math.max(
    1,
    ...typeStats.map((item) => item.count)
  );

  const resolved = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  const active = reports.length - resolved;

  const resolutionRate = reports.length
    ? Math.round((resolved / reports.length) * 100)
    : 0;

  return (
    <section className="analytics-section" id="analytics">
      <div className="analytics-heading">
        <div>
          <span className="analytics-kicker">DATA INSIGHTS</span>
          <h2>Incident Analytics</h2>
          <p>Understand reported incidents and their current risk levels.</p>
        </div>

        <span className="analytics-live">
          <span className="analytics-dot" />
          Based on saved reports
        </span>
      </div>

      <div className="analytics-grid">
        <article className="chart-card disaster-chart">
          <div className="chart-heading">
            <div>
              <h3>Disaster Distribution</h3>
              <p>Reports by disaster type</p>
            </div>
            <span className="chart-icon">▥</span>
          </div>

          {typeStats.length === 0 ? (
            <div className="chart-empty">
              No reports available yet.
            </div>
          ) : (
            <div className="bar-chart">
              {typeStats.map((item) => (
                <div className="bar-row" key={item.type}>
                  <span className="bar-label">
                    {getDisasterIcon(item.type)} {item.type}
                  </span>

                  <div className="bar-track">
                    <div
                      className={`bar-fill bar-${item.type.toLowerCase()}`}
                      style={{
                        width: `${(item.count / maxTypeCount) * 100}%`,
                      }}
                    />
                  </div>

                  <strong className="bar-value">{item.count}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="chart-footnote">
            <span>Total recorded incidents</span>
            <strong>{reports.length}</strong>
          </div>
        </article>

        <article className="chart-card risk-chart">
          <div className="chart-heading">
            <div>
              <h3>Risk Distribution</h3>
              <p>Reports grouped by risk level</p>
            </div>
            <span className="chart-icon">◉</span>
          </div>

          <div className="risk-list">
            {riskStats.map((item) => {
              const percentage = reports.length
                ? Math.round((item.count / reports.length) * 100)
                : 0;

              return (
                <div className="risk-item" key={item.risk}>
                  <div className="risk-label-row">
                    <span>
                      <span
                        className="risk-dot"
                        style={{ background: riskColors[item.risk] }}
                      />
                      {item.risk}
                    </span>
                    <strong>{item.count}</strong>
                  </div>

                  <div className="risk-track">
                    <div
                      className="risk-fill"
                      style={{
                        width: `${percentage}%`,
                        background: riskColors[item.risk],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="chart-note">
            Risk levels are entered manually in this demo.
          </p>
        </article>

        <article className="chart-card response-chart">
          <div className="chart-heading">
            <div>
              <h3>Response Overview</h3>
              <p>Current incident status</p>
            </div>
            <span className="chart-icon">↗</span>
          </div>

          <div className="response-numbers">
            <div>
              <span className="response-number active-number">
                {active}
              </span>
              <span className="response-label">Unresolved</span>
            </div>

            <div>
              <span className="response-number resolved-number">
                {resolved}
              </span>
              <span className="response-label">Resolved</span>
            </div>
          </div>

          <div className="response-track">
            <div
              className="response-active-bar"
              style={{
                width: `${reports.length ? (active / reports.length) * 100 : 0}%`,
              }}
            />
            <div
              className="response-resolved-bar"
              style={{
                width: `${resolutionRate}%`,
              }}
            />
          </div>

          <div className="resolution-summary">
            <div>
              <span className="risk-dot" style={{ background: "#3478f6" }} />
              Unresolved incidents
            </div>
            <strong>{active}</strong>
          </div>

          <div className="resolution-summary">
            <div>
              <span className="risk-dot" style={{ background: "#20a879" }} />
              Resolved incidents
            </div>
            <strong>{resolutionRate}%</strong>
          </div>

          <p className="chart-note">
            Resolution rate = resolved reports divided by all reports.
          </p>
        </article>
      </div>
    </section>
  );
}

function App() {
  const [reports, setReports] = useState(loadReports);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");

  const [form, setForm] = useState({
    type: "Flood",
    location: "",
    risk: "Medium",
    description: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error("Unable to save reports:", error);
      setMessage("Could not save data in this browser.");
    }
  }, [reports]);

  const active = reports.filter(
    (report) => report.status !== "Resolved"
  ).length;

  const critical = reports.filter(
    (report) =>
      report.risk === "Critical" && report.status !== "Resolved"
  ).length;

  const resolved = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  const filteredReports = reports.filter((report) => {
    const searchable = [
      report.type,
      report.location,
      report.description || "",
      report.status,
      report.risk,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchable.includes(search.trim().toLowerCase());
    const matchesRisk =
      riskFilter === "All" || report.risk === riskFilter;
    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  function goToSection(section) {
    setActivePage(section);

    if (section === "Report Disaster") {
      setMessage("");
      setShowForm(true);
      return;
    }

    if (section === "Critical Alerts") {
      setRiskFilter("Critical");
      setStatusFilter("All");
      setSearch("");
      document.getElementById("reports")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    setRiskFilter("All");
    setStatusFilter("All");
    setSearch("");

    document.getElementById(
      section === "Analytics" ? "analytics" : "dashboard"
    )?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function submitReport(event) {
    event.preventDefault();

    const location = form.location.trim();

    if (!location) {
      setMessage("Please enter the disaster location.");
      return;
    }

    const newReport = {
      id: Date.now(),
      type: form.type,
      location,
      risk: form.risk,
      status: "Active",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      description: form.description.trim(),
    };

    setReports((previous) => [newReport, ...previous]);

    setForm({
      type: "Flood",
      location: "",
      risk: "Medium",
      description: "",
    });

    setSearch("");
    setRiskFilter("All");
    setStatusFilter("All");
    setShowForm(false);
    setActivePage("Dashboard");
    setMessage("Incident report added successfully.");

    setTimeout(() => {
      document.getElementById("reports")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function updateStatus(id, newStatus) {
    setReports((previous) =>
      previous.map((report) =>
        report.id === id
          ? { ...report, status: newStatus }
          : report
      )
    );

    setMessage("Incident status updated successfully.");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <h2>DisasterShield</h2>
            <span>AI RESPONSE SYSTEM</span>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>

        <button
          type="button"
          className={`nav-item ${activePage === "Dashboard" ? "selected" : ""}`}
          onClick={() => goToSection("Dashboard")}
        >
          ▦ &nbsp; Dashboard
        </button>

        <button
          type="button"
          className={`nav-item ${activePage === "Analytics" ? "selected" : ""}`}
          onClick={() => goToSection("Analytics")}
        >
          ◫ &nbsp; Analytics
        </button>

        <button
          type="button"
          className={`nav-item ${activePage === "Report Disaster" ? "selected" : ""}`}
          onClick={() => goToSection("Report Disaster")}
        >
          ＋ &nbsp; Report Disaster
        </button>

        <button
          type="button"
          className={`nav-item ${activePage === "Critical Alerts" ? "selected" : ""}`}
          onClick={() => goToSection("Critical Alerts")}
        >
          ◉ &nbsp; Critical Alerts
        </button>

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <div>
            <strong>System Online</strong>
            <span>React frontend demo</span>
          </div>
        </div>
      </aside>

      <main className="main" id="dashboard">
        <header className="topbar">
          <div>
            <span className="breadcrumb">
              Workspace / {activePage}
            </span>
            <h1>Disaster Overview</h1>
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={() => goToSection("Report Disaster")}
          >
            + Report Incident
          </button>
        </header>

        <section className="welcome">
          <div>
            <span className="eyebrow">
              EMERGENCY MANAGEMENT PLATFORM
            </span>
            <h2>Stay alert. Save lives.</h2>
            <p>
              Monitor incidents, track risks and coordinate emergency response.
            </p>
          </div>
          <div className="welcome-symbol">⌁</div>
        </section>

        {message && (
          <div className="message-banner" role="status">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section className="stats">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total Reports</span>
              <span className="stat-icon blue">▤</span>
            </div>
            <h2>{reports.length}</h2>
            <p>All reported incidents</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Active Incidents</span>
              <span className="stat-icon orange">◉</span>
            </div>
            <h2>{active}</h2>
            <p>Require ongoing attention</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Critical Alerts</span>
              <span className="stat-icon red">⚠</span>
            </div>
            <h2>{critical}</h2>
            <p>Unresolved critical reports</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Resolved</span>
              <span className="stat-icon green">✓</span>
            </div>
            <h2>{resolved}</h2>
            <p>Marked as resolved</p>
          </div>
        </section>

        <Analytics reports={reports} />

        <section className="reports-section" id="reports">
          <div className="section-heading">
            <div>
              <h2>Incident Reports</h2>
              <p>Review and manage reported emergencies.</p>
            </div>
            <span className="report-count">
              {filteredReports.length} reports
            </span>
          </div>

          <div className="toolbar">
            <input
              className="search"
              type="search"
              placeholder="⌕ Search location or disaster..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label="Filter by risk level"
              value={riskFilter}
              onChange={(event) => setRiskFilter(event.target.value)}
            >
              <option value="All">All Risks</option>
              {riskLevels.map((risk) => (
                <option value={risk} key={risk}>{risk}</option>
              ))}
            </select>

            <select
              aria-label="Filter by incident status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              {statusOptions.map((status) => (
                <option value={status} key={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>DISASTER</th>
                  <th>LOCATION</th>
                  <th>RISK LEVEL</th>
                  <th>REPORTED</th>
                  <th>STATUS</th>
                  <th>UPDATE</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="disaster-name">
                        <span className="disaster-icon">
                          {getDisasterIcon(report.type)}
                        </span>
                        <strong>{report.type}</strong>
                      </div>
                    </td>

                    <td>{report.location}</td>

                    <td>
                      <span className={`badge ${report.risk.toLowerCase()}`}>
                        {report.risk}
                      </span>
                    </td>

                    <td>{report.time}</td>

                    <td>
                      <span className={`status ${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </td>

                    <td>
                      <select
                        className="status-select"
                        aria-label={`Update ${report.type} status`}
                        value={report.status}
                        onChange={(event) =>
                          updateStatus(report.id, event.target.value)
                        }
                      >
                        {statusOptions.map((status) => (
                          <option value={status} key={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}

                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty">
                      No matching incidents found. Try changing your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="disclaimer">
            Demo data only. Risk levels are illustrative and are not
            AI-generated emergency predictions.
          </p>
        </section>

        {showForm && (
          <div
            className="modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowForm(false);
              }
            }}
          >
            <form className="report-form" onSubmit={submitReport}>
              <div className="form-heading">
                <div>
                  <h2>Report a Disaster</h2>
                  <p>Add a new incident to the dashboard.</p>
                </div>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                  aria-label="Close report form"
                >
                  ×
                </button>
              </div>

              <label htmlFor="disaster-type">Disaster Type</label>
              <select
                id="disaster-type"
                name="type"
                value={form.type}
                onChange={handleFormChange}
              >
                {disasterTypes.map((type) => (
                  <option value={type} key={type}>{type}</option>
                ))}
              </select>

              <label htmlFor="disaster-location">Location</label>
              <input
                id="disaster-location"
                name="location"
                required
                maxLength={150}
                placeholder="Enter city or location"
                value={form.location}
                onChange={handleFormChange}
              />

              <label htmlFor="disaster-risk">Risk Level</label>
              <select
                id="disaster-risk"
                name="risk"
                value={form.risk}
                onChange={handleFormChange}
              >
                {riskLevels.map((risk) => (
                  <option value={risk} key={risk}>{risk}</option>
                ))}
              </select>

              <label htmlFor="disaster-description">Description</label>
              <textarea
                id="disaster-description"
                name="description"
                maxLength={1000}
                placeholder="Describe the incident..."
                value={form.description}
                onChange={handleFormChange}
              />

              <button className="primary-btn submit-btn" type="submit">
                Submit Incident
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
