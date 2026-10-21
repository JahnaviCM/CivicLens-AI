
import { useEffect, useMemo, useState } from "react";
import Globe from "react-globe.gl";
import "./App.css";

const API = "http://127.0.0.1:8000";

const CATEGORIES = [
  "Waste Management", "Drainage", "Water Pollution", "Air Pollution",
  "Roads & Infrastructure", "Street Lighting", "Parks & Green Spaces", "Other",
];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "Waste Management",
  location: "",
  priority: "Medium",
};

function Icon({ name }) {
  const paths = {
    dashboard: "▦",
    issues: "▤",
    report: "＋",
    insights: "◈",
    assistant: "✳",
    location: "⌖",
    search: "⌕",
    refresh: "⟳",
    arrow: "↗",
    check: "✓",
    menu: "☰",
  };
  return <span className="cl-icon" aria-hidden="true">{paths[name] || "•"}</span>;
}

function Brand({ compact = false }) {
  return (
    <div className={`cl-brand ${compact ? "cl-brand-compact" : ""}`}>
      <div className="cl-brand-mark"><span>C</span><i /></div>
      <div>
        <div className="cl-brand-name">Civic<span>Lens</span> AI</div>
        <div className="cl-brand-subtitle">SMARTER CITIES · BETTER TOMORROWS</div>
      </div>
    </div>
  );
}

function ParticleField() {
  const particles = useMemo(
    () => Array.from({ length: 44 }, (_, i) => ({
      id: i,
      x: (i * 37 + 7) % 100,
      y: (i * 53 + 11) % 100,
      delay: -(i % 11),
      duration: 7 + (i % 9),
      size: i % 5 === 0 ? 4 : 2,
    })),
    []
  );

  return (
    <div className="cl-particles" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="cl-particle"
          style={{
            "--x": `${p.x}%`,
            "--y": `${p.y}%`,
            "--delay": `${p.delay}s`,
            "--duration": `${p.duration}s`,
            "--size": `${p.size}px`,
          }}
        />
      ))}
    </div>
  );
}

function EarthGlobe({ expanded = false }) {
  const [width, setWidth] = useState(420);

  useEffect(() => {
    const resize = () => {
      setWidth(Math.min(440, Math.max(260, window.innerWidth * (window.innerWidth < 760 ? 0.85 : 0.39))));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const cities = useMemo(() => [
    { lat: 12.9716, lng: 77.5946, size: 0.7, color: "#62f0ff", label: "Bengaluru · CivicLens" },
    { lat: 19.076, lng: 72.8777, size: 0.45, color: "#4eabff", label: "Mumbai" },
    { lat: 28.6139, lng: 77.209, size: 0.5, color: "#9b9bff", label: "New Delhi" },
    { lat: 13.0827, lng: 80.2707, size: 0.4, color: "#5eeaff", label: "Chennai" },
    { lat: 17.385, lng: 78.4867, size: 0.4, color: "#68b2ff", label: "Hyderabad" },
    { lat: 51.5072, lng: -0.1276, size: 0.4, color: "#5eeaff", label: "London" },
    { lat: 40.7128, lng: -74.006, size: 0.4, color: "#9d9bff", label: "New York" },
    { lat: 35.6762, lng: 139.6503, size: 0.4, color: "#5eeaff", label: "Tokyo" },
    { lat: -33.8688, lng: 151.2093, size: 0.4, color: "#7b9eff", label: "Sydney" },
  ], []);

  const arcs = useMemo(() => [
    { startLat: 12.9716, startLng: 77.5946, endLat: 19.076, endLng: 72.8777, color: "#50dcff" },
    { startLat: 12.9716, startLng: 77.5946, endLat: 28.6139, endLng: 77.209, color: "#438dff" },
    { startLat: 12.9716, startLng: 77.5946, endLat: 51.5072, endLng: -0.1276, color: "#8c9cff" },
    { startLat: 12.9716, startLng: 77.5946, endLat: 35.6762, endLng: 139.6503, color: "#4edfff" },
    { startLat: 19.076, startLng: 72.8777, endLat: 40.7128, endLng: -74.006, color: "#438dff" },
    { startLat: 13.0827, startLng: 80.2707, endLat: -33.8688, endLng: 151.2093, color: "#8c9cff" },
  ], []);

  return (
    <div className={`cl-earth ${expanded ? "cl-earth-expanded" : ""}`}>
      <div className="cl-earth-halo" />
      <div className="cl-earth-ring cl-earth-ring-a" />
      <div className="cl-earth-ring cl-earth-ring-b" />
      <div className="cl-earth-ring cl-earth-ring-c" />
      <div className="cl-earth-canvas">
        <Globe
          width={width}
          height={width}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          showAtmosphere
          atmosphereColor="#319dff"
          atmosphereAltitude={0.19}
          animateIn
          enablePointerInteraction
          pointsData={cities}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointRadius="size"
          pointAltitude={0.025}
          pointLabel="label"
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcAltitudeAutoScale={0.42}
          arcStroke={0.55}
          arcDashLength={0.42}
          arcDashGap={0.25}
          arcDashInitialGap="random"
          arcDashAnimateTime={1600}
          arcsTransitionDuration={500}
        />
      </div>
      <div className="cl-earth-tag cl-earth-tag-top">
        <span className="cl-live-dot" />
        <div><small>COMMUNITY FOCUS</small><strong>Bengaluru, India</strong></div>
      </div>
      <div className="cl-earth-tag cl-earth-tag-bottom">
        <span className="cl-earth-tag-symbol">✳</span>
        <div><small>CONNECTED WORLD</small><strong>Local action. Global impact.</strong></div>
      </div>
    </div>
  );
}

function Welcome({ onEnter }) {
  const [activated, setActivated] = useState(false);

  return (
    <main className="cl-welcome">
      <div className="cl-welcome-background" />
      <div className="cl-welcome-grid" />
      <ParticleField />

      <nav className="cl-welcome-nav">
        <Brand />
        <div className="cl-welcome-links">
          <a href="#cl-features">Features</a>
          <a href="#cl-how">How it works</a>
          <a href="#cl-impact">Impact</a>
        </div>
        <button className="cl-button cl-button-small" onClick={onEnter}>
          Get started <span>↗</span>
        </button>
      </nav>

      <section className="cl-hero">
        <div className="cl-hero-copy">
          <div className="cl-eyebrow"><span /> SMARTER CITIES · CLEANER COMMUNITIES</div>
          <h1>See issues.<br />Shape <span className="cl-gradient-text">change.</span></h1>
          <p>
            An AI-powered civic platform to report local problems,
            explore community insights, and help build cleaner,
            safer and more sustainable cities.
          </p>
          <div className="cl-hero-actions">
            <button className="cl-button cl-button-primary" onClick={onEnter}>
              Enter CivicLens <span>↗</span>
            </button>
            <button className="cl-button cl-button-outline" onClick={() => setActivated(v => !v)}>
              <span className="cl-play-icon">{activated ? "✦" : "◎"}</span>
              {activated ? "Connections active" : "Explore the Earth"}
            </button>
          </div>

          <div className="cl-hero-proof">
            <span className="cl-proof-symbol">✳</span>
            <div>
              <strong>Every report can make a difference.</strong>
              <small>Powered by community participation and data-driven insights.</small>
            </div>
          </div>

          <div className="cl-hero-metrics" id="cl-impact">
            <div><strong>01</strong><span>Report</span></div><i />
            <div><strong>02</strong><span>Understand</span></div><i />
            <div><strong>03</strong><span>Improve</span></div>
          </div>
        </div>

        <div className={`cl-hero-visual ${activated ? "cl-hero-activated" : ""}`}>
          <div className="cl-visual-status"><span className="cl-live-dot" /> GLOBAL CIVIC VIEW <span className="cl-status-divider" /> LIVE MOTION</div>
          <EarthGlobe expanded={activated} />
          <div className="cl-orbit-caption"><span>✦</span> A more connected world starts locally</div>
        </div>
      </section>

      <section className="cl-welcome-strip" id="cl-features">
        <div className="cl-welcome-feature"><span className="cl-feature-icon">⌖</span><div><strong>Report local issues</strong><small>Give community problems visibility</small></div></div>
        <div className="cl-strip-divider" />
        <div className="cl-welcome-feature"><span className="cl-feature-icon">◈</span><div><strong>Discover patterns</strong><small>Turn reports into useful insights</small></div></div>
        <div className="cl-strip-divider" />
        <div className="cl-welcome-feature"><span className="cl-feature-icon">✳</span><div><strong>Support sustainability</strong><small>Help create a better tomorrow</small></div></div>
      </section>

      <section className="cl-how-section" id="cl-how">
        <div><span className="cl-section-eyebrow">A SMALL STEP. A BIGGER IMPACT.</span><h2>Better cities begin with <span className="cl-gradient-text">you.</span></h2></div>
        <button className="cl-text-button" onClick={onEnter}>Explore the platform <span>↗</span></button>
      </section>
    </main>
  );
}

function StatCard({ title, value, note, symbol, color, delay = 0 }) {
  return (
    <article className={`cl-stat-card cl-stat-${color}`} style={{ "--delay": `${delay}ms` }}>
      <div className="cl-stat-head"><span>{title}</span><span className="cl-stat-icon">{symbol}</span></div>
      <div className="cl-stat-value">{value ?? 0}</div>
      <div className="cl-stat-note"><i />{note}</div>
      <span className="cl-stat-glow" />
    </article>
  );
}

function BarList({ data, emptyText = "No data available yet." }) {
  const entries = Object.entries(data || {});
  if (!entries.length) return <p className="cl-muted">{emptyText}</p>;
  const max = Math.max(...entries.map(([, n]) => Number(n) || 0), 1);

  return (
    <div className="cl-bar-list">
      {entries.map(([label, value], index) => (
        <div className="cl-bar-row" key={label} style={{ "--bar-delay": `${index * 100}ms` }}>
          <div><span>{label}</span><strong>{value}</strong></div>
          <div className="cl-bar-track"><span style={{ width: `${Math.max(0, Number(value) / max * 100)}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

function IssueList({ issues, loading, onUpdate }) {
  if (loading && !issues.length) {
    return <div className="cl-empty"><span className="cl-spinner" />Loading civic reports…</div>;
  }

  if (!issues.length) {
    return <div className="cl-empty"><span className="cl-empty-symbol">◈</span><strong>No reports found</strong><span>Submit a civic issue or adjust your filters.</span></div>;
  }

  return (
    <div className="cl-issue-list">
      {issues.map((issue, index) => {
        const status = issue.status || "Open";
        const priority = String(issue.priority || "Medium").toLowerCase();
        return (
          <article className="cl-issue-row" key={issue.id ?? issue.issue_id ?? `${issue.title}-${index}`} style={{ "--row-delay": `${index * 45}ms` }}>
            <div className={`cl-issue-symbol cl-priority-${priority}`}>{priority === "high" ? "!" : priority === "low" ? "↓" : "◈"}</div>
            <div className="cl-issue-details">
              <strong>{issue.title || issue.description || "Civic issue"}</strong>
              <div><span>{issue.category || "Other"}</span><i>·</i><span>⌖ {issue.location || "Location not specified"}</span></div>
            </div>
            <span className={`cl-priority-badge cl-priority-badge-${priority}`}>{issue.priority || "Medium"}</span>
            <span className={`cl-status-badge cl-status-${String(status).toLowerCase().replace(/\s+/g, "-")}`}>{status}</span>
            <button className="cl-issue-action" onClick={() => onUpdate(issue)}>
              {String(status).toLowerCase() === "resolved" ? "Reopen ↺" : "Resolve ✓"}
            </button>
          </article>
        );
      })}
    </div>
  );
}

function Dashboard() {
  const [page, setPage] = useState("Overview");
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({});
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [form, setForm] = useState(INITIAL_FORM);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [assistantBusy, setAssistantBusy] = useState(false);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [issueResponse, statsResponse, insightsResponse] = await Promise.all([
        fetch(`${API}/api/issues`),
        fetch(`${API}/api/stats`),
        fetch(`${API}/api/insights`),
      ]);

      if (!issueResponse.ok || !statsResponse.ok) {
        throw new Error("The backend returned an error while loading dashboard data.");
      }

      const issueData = await issueResponse.json();
      const statsData = await statsResponse.json();
      const insightsData = insightsResponse.ok ? await insightsResponse.json() : {};

      setIssues(Array.isArray(issueData) ? issueData : issueData.issues || issueData.items || []);
      setStats(statsData || {});
      setInsights(insightsData || {});
    } catch {
      setError("Can't connect to FastAPI. Start the backend on port 8000, then retry.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function toast(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  async function submitIssue(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API}/api/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "Unable to submit this report.");
      setForm(INITIAL_FORM);
      toast("Your civic report was submitted.");
      setPage("Issues");
      await loadData();
    } catch (err) {
      toast(err.message || "Unable to submit the report.");
    }
  }

  async function updateStatus(issue) {
    const id = issue.id ?? issue.issue_id;
    if (id == null) {
      toast("This report has no usable issue ID.");
      return;
    }
    const status = String(issue.status || "").toLowerCase() === "resolved" ? "Open" : "Resolved";
    try {
      const response = await fetch(`${API}/api/issues/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Unable to update the issue status.");
      }
      toast(`Issue marked ${status.toLowerCase()}.`);
      await loadData();
    } catch (err) {
      toast(err.message);
    }
  }

  async function askAssistant(event) {
    event.preventDefault();
    if (!assistantInput.trim()) return;
    setAssistantBusy(true);
    setAssistantAnswer("");
    try {
      const response = await fetch(`${API}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: assistantInput, message: assistantInput }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Assistant request failed.");
      setAssistantAnswer(data.answer || data.response || data.message || JSON.stringify(data, null, 2));
    } catch (err) {
      setAssistantAnswer(`${err.message} Please check that the backend is running.`);
    } finally {
      setAssistantBusy(false);
    }
  }

  const total = stats.total_issues ?? stats.total ?? issues.length;
  const resolved = stats.resolved_issues ?? stats.resolved ?? issues.filter(i => String(i.status).toLowerCase() === "resolved").length;
  const open = stats.open_issues ?? stats.open ?? Math.max(0, total - resolved);
  const rate = stats.resolution_rate ?? (total ? Math.round(resolved / total * 100) : 0);
  const categoryData = insights.category_breakdown || insights.categories || {};
  const priorityData = insights.priority_breakdown || insights.priorities || {};

  const filteredIssues = issues.filter(issue => {
    const text = `${issue.title || ""} ${issue.description || ""} ${issue.location || ""} ${issue.category || ""}`.toLowerCase();
    const status = String(issue.status || "Open").toLowerCase();
    const statusMatches = statusFilter === "All" || status === statusFilter.toLowerCase();
    const categoryMatches = categoryFilter === "All categories" || issue.category === categoryFilter;
    return text.includes(query.toLowerCase()) && statusMatches && categoryMatches;
  });

  const nav = [
    ["Overview", "dashboard"],
    ["Issues", "issues"],
    ["Report an Issue", "report"],
    ["Sustainability", "insights"],
    ["AI Assistant", "assistant"],
  ];

  return (
    <main className="cl-dashboard">
      <aside className="cl-sidebar">
        <button className="cl-sidebar-brand" onClick={() => setPage("Overview")}><Brand compact /></button>
        <div className="cl-nav-label">WORKSPACE</div>
        <nav className="cl-side-nav">
          {nav.map(([name, icon]) => (
            <button key={name} className={`cl-nav-item ${page === name ? "cl-nav-active" : ""}`} onClick={() => setPage(name)}>
              <Icon name={icon} /><span>{name}</span>
              {name === "Issues" && <span className="cl-nav-count">{issues.length}</span>}
            </button>
          ))}
        </nav>
        <div className="cl-sidebar-spacer" />
        <div className="cl-sidebar-promo">
          <div className="cl-promo-icon">✳</div>
          <strong>Your city. Your impact.</strong>
          <p>Every civic report is a step toward a more sustainable community.</p>
          <button onClick={() => setPage("Report an Issue")}>Make an impact <span>↗</span></button>
        </div>
        <div className="cl-sidebar-user"><span>CL</span><div><strong>CivicLens User</strong><small>Community member</small></div><i>•••</i></div>
      </aside>

      <section className="cl-dashboard-main">
        <header className="cl-topbar">
          <div className="cl-breadcrumb"><span>Workspace</span><i>/</i><strong>{page}</strong></div>
          <div className="cl-top-actions"><span className="cl-system-online"><i /> SYSTEM ONLINE</span><button className="cl-refresh" title="Refresh data" onClick={loadData}>⟳</button><span className="cl-user-avatar">CL</span></div>
        </header>

        <div className="cl-dashboard-content">
          <div className="cl-page-heading">
            <div>
              <div className="cl-eyebrow"><span /> CIVIC INTELLIGENCE PLATFORM</div>
              <h1>{page === "Overview" ? <>Your city, in <span className="cl-gradient-text">focus.</span></> : page}</h1>
              <p>Explore civic activity, discover trends, and turn community insights into meaningful action.</p>
            </div>
            <button className="cl-button cl-button-primary" onClick={() => setPage("Report an Issue")}><Icon name="report" /> Report an issue <span>↗</span></button>
          </div>

          {error && <div className="cl-error">{error}<button onClick={loadData}>Retry ↻</button></div>}
          {notice && <div className="cl-toast"><span>✦</span>{notice}<button onClick={() => setNotice("")}>×</button></div>}

          {page === "Overview" && <>
            <section className="cl-dashboard-hero">
              <div className="cl-dashboard-hero-copy">
                <div className="cl-hero-badge"><i /> YOUR COMMUNITY DASHBOARD</div>
                <h2>Better cities begin<br />with <span>better insights.</span></h2>
                <p>Track community concerns and discover where positive change can start.</p>
                <button className="cl-button cl-button-hero" onClick={() => setPage("Sustainability")}>Explore insights <span>↗</span></button>
              </div>
              <div className="cl-dashboard-earth"><EarthGlobe /></div>
              <span className="cl-hero-code">CIVICLENS / 01</span>
            </section>

            <div className="cl-section-heading"><div><small>AT A GLANCE</small><h2>Community overview</h2></div><span className="cl-live-label"><i /> Latest data</span></div>
            <section className="cl-stats-grid">
              <StatCard title="Total reports" value={total} note="All submitted issues" symbol="▤" color="blue" delay={0} />
              <StatCard title="Open issues" value={open} note="Awaiting resolution" symbol="◷" color="cyan" delay={80} />
              <StatCard title="Resolved issues" value={resolved} note="Marked as resolved" symbol="✓" color="violet" delay={160} />
              <StatCard title="Resolution rate" value={`${rate}%`} note="Resolved / total reports" symbol="↗" color="indigo" delay={240} />
            </section>

            <section className="cl-content-grid">
              <article className="cl-panel">
                <div className="cl-panel-heading"><div><small>ISSUE DISTRIBUTION</small><h3>What's happening in your city?</h3></div><span className="cl-panel-symbol">◈</span></div>
                <p className="cl-panel-description">Reported issues grouped by category.</p>
                <BarList data={categoryData} emptyText={loading ? "Loading category data…" : "Category insights appear here when available."} />
                <button className="cl-text-button cl-panel-link" onClick={() => setPage("Issues")}>View all reports <span>→</span></button>
              </article>
              <article className="cl-panel">
                <div className="cl-panel-heading"><div><small>PRIORITY MONITOR</small><h3>Attention required</h3></div><span className="cl-panel-symbol">⌁</span></div>
                <p className="cl-panel-description">Understand the urgency of community reports.</p>
                <BarList data={priorityData} emptyText={loading ? "Loading priorities…" : "Priority data appears here when available."} />
                <div className="cl-panel-note"><span>✦</span> Review high-priority reports and keep their status updated.</div>
              </article>
            </section>

            <article className="cl-panel cl-recent-panel">
              <div className="cl-panel-heading"><div><small>COMMUNITY ACTIVITY</small><h3>Recent reports</h3></div><button className="cl-text-button" onClick={() => setPage("Issues")}>View all <span>→</span></button></div>
              <IssueList issues={issues.slice(0, 4)} loading={loading} onUpdate={updateStatus} />
            </article>
          </>}

          {page === "Issues" && <article className="cl-panel cl-issue-manager">
            <div className="cl-panel-heading"><div><small>COMMUNITY TRACKER</small><h3>All reported issues</h3></div><span className="cl-count-chip">{filteredIssues.length} reports</span></div>
            <div className="cl-toolbar">
              <div className="cl-search"><Icon name="search" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search reports and locations…" /></div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All</option><option>Open</option><option>Resolved</option><option>In Progress</option></select>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option>All categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            </div>
            <IssueList issues={filteredIssues} loading={loading} onUpdate={updateStatus} />
          </article>}

          {page === "Report an Issue" && <section className="cl-report-layout">
            <article className="cl-panel">
              <div className="cl-panel-heading"><div><small>COMMUNITY CONTRIBUTION</small><h3>Report a civic issue</h3></div><span className="cl-panel-symbol">＋</span></div>
              <p className="cl-panel-description">Describe what you noticed so your community can take action.</p>
              <form className="cl-report-form" onSubmit={submitIssue}>
                <label>Issue title<input required minLength={3} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Overflowing garbage bin" /></label>
                <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
                <label>Location<input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Street, area or landmark" /></label>
                <label>Priority<select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label>
                <label className="cl-full-field">Description<textarea required minLength={8} rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Explain the problem and its impact on the community…" /></label>
                <button className="cl-button cl-button-primary cl-submit" type="submit">Submit report <span>↗</span></button>
              </form>
            </article>
            <aside className="cl-panel cl-report-aside"><div className="cl-aside-orb">✳</div><small>YOUR IMPACT STARTS HERE</small><h3>See it.<br /><span className="cl-gradient-text">Report it.</span></h3><p>Clear reports help communities identify local problems and prioritise action.</p>{["Describe the issue", "Add the location", "Track its status"].map((s, i) => <div className="cl-aside-step" key={s}><span>0{i + 1}</span><div><strong>{s}</strong><small>{["Include useful details.", "Help others locate the problem.", "Follow updates on your report."][i]}</small></div></div>)}</aside>
          </section>}

          {page === "Sustainability" && <section className="cl-insights-page">
            <div className="cl-insights-hero"><span>✳</span><div><small>DATA-DRIVEN SUSTAINABILITY</small><h2>Insight into <span className="cl-gradient-text">impact.</span></h2><p>Explore patterns in the reports submitted by your community.</p></div></div>
            <section className="cl-stats-grid">
              <StatCard title="Total reports" value={total} note="Recorded reports" symbol="▤" color="blue" />
              <StatCard title="Open issues" value={open} note="Need attention" symbol="◷" color="cyan" />
              <StatCard title="Resolved" value={resolved} note="Completed reports" symbol="✓" color="violet" />
              <StatCard title="Resolution rate" value={`${rate}%`} note="Current rate" symbol="↗" color="indigo" />
            </section>
            <section className="cl-content-grid">
              <article className="cl-panel"><div className="cl-panel-heading"><div><small>CATEGORY ANALYSIS</small><h3>Issues by category</h3></div></div><BarList data={categoryData} /></article>
              <article className="cl-panel"><div className="cl-panel-heading"><div><small>PRIORITY ANALYSIS</small><h3>Urgency breakdown</h3></div></div><BarList data={priorityData} /></article>
            </section>
            <article className="cl-panel"><div className="cl-panel-heading"><div><small>SUGGESTED AREAS OF ACTION</small><h3>Community recommendations</h3></div></div><div className="cl-recommendations">{[["01", "Prioritise urgent reports", "Review high-priority issues and ensure they receive appropriate attention."], ["02", "Identify recurring problems", "Use category patterns to identify areas that may need longer-term solutions."], ["03", "Track resolution progress", "Keep issue statuses current so the community can understand progress."]].map(([n, title, desc]) => <div key={n}><span>{n}</span><h4>{title}</h4><p>{desc}</p></div>)}</div><p className="cl-method-note">Recommendations are rule-based guidance, not predictions from a trained machine-learning model.</p></article>
          </section>}

          {page === "AI Assistant" && <section className="cl-assistant-layout">
            <article className="cl-panel cl-assistant-panel">
              <div className="cl-assistant-heading"><span>✳</span><div><small>CIVICLENS INTELLIGENCE</small><h3>Your civic AI assistant</h3><p>Ask a question about civic issues and sustainability.</p></div></div>
              <div className="cl-assistant-welcome"><span>✦</span><h2>How can I help your <span className="cl-gradient-text">city today?</span></h2><p>Explore waste management, drainage, civic priorities, and sustainable actions.</p></div>
              <div className="cl-prompt-chips">{["How can we reduce waste?", "What should be prioritised?", "Suggest sustainable city actions"].map(q => <button key={q} onClick={() => setAssistantInput(q)}>{q} <span>↗</span></button>)}</div>
              <form className="cl-assistant-form" onSubmit={askAssistant}><textarea value={assistantInput} onChange={e => setAssistantInput(e.target.value)} rows={3} placeholder="Ask your civic question…" /><button className="cl-button cl-button-primary" disabled={assistantBusy}>{assistantBusy ? "Thinking…" : "Ask assistant"} <span>↗</span></button></form>
              {assistantAnswer && <div className="cl-answer"><small>✳ CIVICLENS RESPONSE</small><p>{assistantAnswer}</p></div>}
            </article>
            <aside className="cl-panel cl-report-aside"><div className="cl-aside-orb">✧</div><small>BUILT FOR COMMUNITIES</small><h3>Better questions.<br /><span className="cl-gradient-text">Better outcomes.</span></h3><p>Explore practical approaches to everyday civic challenges.</p>{["Sustainability guidance", "Civic issue discussion", "Community action ideas"].map((s, i) => <div className="cl-aside-step" key={s}><span>0{i + 1}</span><div><strong>{s}</strong></div></div>)}<p className="cl-method-note">Responses depend on the assistant implementation in your backend.</p></aside>
          </section>}

          <footer className="cl-footer"><div><span>C</span> CivicLens AI <i>/</i> AI for Sustainability</div><span>DESIGNED FOR A BETTER TOMORROW <b>✦</b></span></footer>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  return entered ? <Dashboard /> : <Welcome onEnter={() => setEntered(true)} />;
}
