import React, { useState } from 'react';
import { 
  Flame, 
  Zap, 
  Target, 
  Users, 
  Calendar, 
  Keyboard, 
  FileCode,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  StickyNote,
  HelpCircle,
  Video,
  CheckSquare,
  Star,
  Layers,
  Settings,
  LogOut,
  Search,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  X,
  ChevronRight,
  Play,
  SlidersHorizontal,
  User,
  Plus,
  Code,
  Database,
  UserPlus,
  UploadCloud,
  CheckCircle2,
  Clock,
  Menu,
  Bookmark,
  Share2,
  Lock,
  ChevronDown,
  Sparkles,
  PlayCircle,
  Clipboard
} from 'lucide-react';
import './LearnerDashboard.css';

const LearnerDashboard = ({ setActivePage }) => {
  // Read learner data stored by LearnerRegistration on success
  const firstName = sessionStorage.getItem('ld_firstName') || 'Learner';
  const email = sessionStorage.getItem('ld_email') || '';
  const goal = sessionStorage.getItem('ld_goal') || 'skills';
  const areas = JSON.parse(sessionStorage.getItem('ld_areas') || '[]');

  const initials = firstName.slice(0, 1).toUpperCase() +
    (sessionStorage.getItem('ld_lastName') || '').slice(0, 1).toUpperCase();

  const [activeNav, setActiveNav] = useState('dashboard');
  const [resourceIdx, setResourceIdx] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [courseFilter, setCourseFilter] = useState('all');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleUploadSubmit = () => {
    if (!uploadUrl) {
      setUploadError('Please enter a link.');
      return;
    }
    const lowerUrl = uploadUrl.toLowerCase();
    const isValid = lowerUrl.includes('github.com') ||
                    lowerUrl.includes('docs.google.com') ||
                    lowerUrl.includes('vercel.app') ||
                    lowerUrl.includes('netlify.app');
    
    if (!isValid) {
      setUploadError('Only GitHub, Google Docs, Vercel, or Netlify links are permitted.');
      return;
    }
    
    // Success scenario
    setUploadError('');
    setShowUploadModal(false);
    setUploadUrl('');
    
    // Show success popup
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  const COURSES = [
    {
      id: 1,
      level: 'INTERMEDIATE',
      title: 'Mastering React 18 & Ecosystem',
      instructor: 'Sarah Drasner',
      module: 4,
      progress: 68,
      img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
      status: 'progress',
    },
    {
      id: 2,
      level: 'ADVANCED',
      title: 'System Architecture Design',
      instructor: 'Marcus Holloway',
      module: 2,
      progress: 24,
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
      status: 'progress',
    },
    {
      id: 3,
      level: 'FOUNDATIONS',
      title: 'UI/UX Fundamentals',
      instructor: 'Elena Rodriguez',
      module: 12,
      progress: 92,
      img: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&q=80',
      status: 'completed',
    },
    {
      id: 4,
      level: 'INTERMEDIATE',
      title: 'Modern Node.js Backend',
      instructor: 'Tom Preston',
      module: 1,
      progress: 5,
      img: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80',
      status: 'progress',
    },
  ];

  const handleLogout = () => {
    // Wipe all learner-related identity items from sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('ld_')) {
        sessionStorage.removeItem(key);
      }
    });
    // Redirect back to login scene
    setActivePage('learnerlogin');
  };

  const TASKS = [
    { icon: <Calendar size={14} />, title: 'Complete HTML/CSS Module 4', due: 'Due Today, 5:00 PM', color: '#ef4444' },
    { icon: <Keyboard size={14} />, title: 'Git Fundamentals Quiz', due: 'Due Tomorrow', color: '#f59e0b' },
    { icon: <FileCode size={14} />, title: 'Submit Portfolio V1', due: 'Due Friday', color: '#8b5cf6' },
  ];

  const MILESTONES = [
    { icon: <Flame size={18} />, name: '7-Day Streak', sub: 'Consistency King', done: true, color: '#f97316' },
    { icon: <Zap size={18} />, name: 'First Commit', sub: 'Hello World Moment', done: true, color: '#eab308' },
    { icon: <Target size={18} />, name: 'Fast Learner', sub: '20 Hours This Week', done: true, color: '#3b5fe2' },
    { icon: <Users size={18} />, name: 'Community Ally', sub: '5 Peer Reviews Done', done: false, color: '#0d9488' },
  ];

  const RESOURCES = [
    {
      tag: 'ARTICLE',
      tagColor: '#1e293b',
      img: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&q=70',
      title: 'Modern CSS Tricks for Beginners',
      desc: 'Learn how to use Container Queries and Subgrid to build...',
      cta: 'Read More →',
      time: '8 min read',
    },
    {
      tag: 'VIDEO',
      tagColor: '#3b5fe2',
      img: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&q=70',
      title: 'Git Fundamentals: Step-by-Step',
      desc: 'Master the command line basics, branching strategies, and how to...',
      cta: 'Watch Now →',
      time: '15 min video',
    },
    {
      tag: 'GUIDE',
      tagColor: '#0d9488',
      img: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&q=70',
      title: 'Roadmap: The 2024 Developer',
      desc: 'A curated pathway from absolute beginner to junior developer with...',
      cta: 'Explore →',
      time: 'Interactive Tool',
    },
  ];

  const visibleResources = [
    RESOURCES[resourceIdx % RESOURCES.length],
    RESOURCES[(resourceIdx + 1) % RESOURCES.length],
    RESOURCES[(resourceIdx + 2) % RESOURCES.length],
  ];

  return (
    <div className="ld-root">

      {/* ══ Full-width Header (not clipped by sidebar) ══ */}
      <header className="ld-header">
        <div className="ld-header-brand">
          <span className="ld-header-dot" />
          <span className="ld-header-logo">Console Learn</span>
        </div>
        <nav className="ld-header-nav">
          <a className="ld-header-link">Explore</a>
          <a className="ld-header-link">Pathways</a>
          <a className="ld-header-link">Community</a>
        </nav>
        <div className="ld-header-right">
          <div className="ld-header-search">
            <Search size={14} color="#94a3b8" />
            <input placeholder="Search resources..." className="ld-header-search-input" />
          </div>
          <button className="ld-header-icon-btn" title="Notifications">
            <Bell size={17} />
          </button>
          <button className="ld-header-icon-btn" title="Help">
            <HelpCircle size={17} />
          </button>
          <div className="ld-header-avatar">{initials || 'CL'}</div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside className={`ld-sidebar ${sidebarCollapsed ? 'ld-sidebar--collapsed' : ''}`}>

        {/* Toggle button */}
        <button
          className="ld-sidebar-toggle"
          onClick={() => setSidebarCollapsed(c => !c)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        {/* Nav */}
        <nav className="ld-nav">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { key: 'courses', label: 'My Courses', icon: <BookOpen size={18} /> },
            { key: 'assignments', label: 'Assignments', icon: <ClipboardList size={18} /> },
            { key: 'notes', label: 'Notes', icon: <StickyNote size={18} /> },
            { key: 'support', label: 'Support', icon: <HelpCircle size={18} /> },
            { key: 'live', label: 'Live Sessions', icon: <Video size={18} /> },
            { key: 'quizzes', label: 'Quiz', icon: <CheckSquare size={18} /> },
            { key: 'new', label: 'New to you', icon: <Star size={18} /> },
            { key: 'projects', label: 'Projects', icon: <Layers size={18} /> },
            { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
          ].map(n => (
            <button
              key={n.key}
              className={`ld-nav-item ${activeNav === n.key ? 'ld-nav-item--active' : ''}`}
              onClick={() => setActiveNav(n.key)}
            >
              <span className="ld-nav-icon">{n.icon}</span>
              <span className="ld-nav-label">{n.label}</span>
            </button>
          ))}
        </nav>

        <button className="ld-logout-btn" onClick={handleLogout}>
          <LogOut size={14} strokeWidth={2.5} />
          <span className="ld-nav-label">Logout</span>
        </button>

        <button className="ld-help">
          <HelpCircle size={16} />
          Help Center
        </button>
      </aside>

      {/* ── Main wrapper ── */}
      <div className={`ld-main-wrap ${sidebarCollapsed ? 'ld-main-wrap--collapsed' : ''}`}>

        {/* ── Content ── */}
        <main className="ld-content">

          {/* ═══════════════════════════════
               MY COURSES VIEW
          ═══════════════════════════════ */}
          {activeNav === 'courses' && (() => {
            const filtered = COURSES.filter(c => {
              if (courseFilter === 'progress') return c.status === 'progress';
              if (courseFilter === 'completed') return c.status === 'completed';
              return true;
            });
            return (
              <div className="mc-page">
                {/* Page Header */}
                <div className="mc-header">
                  <div>
                    <h1 className="mc-title">My Courses</h1>
                    <p className="mc-subtitle">Continue where you left off. You have 3 active modules today.</p>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="mc-filter-bar">
                  <div className="mc-tabs">
                    {[['all', 'All Courses'], ['progress', 'In Progress'], ['completed', 'Completed']].map(([key, label]) => (
                      <button
                        key={key}
                        className={`mc-tab ${courseFilter === key ? 'mc-tab--active' : ''}`}
                        onClick={() => setCourseFilter(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button className="mc-sort-btn">
                    <SlidersHorizontal size={14} />
                    Sort by: Recent
                  </button>
                </div>

                {/* Courses Grid */}
                <div className="mc-grid">
                  {filtered.map(course => (
                    <div key={course.id} className="mc-card">
                      {/* Thumbnail */}
                      <div className="mc-card-img-wrap">
                        <img src={course.img} alt={course.title} className="mc-card-img" />
                        <span className="mc-level-badge">{course.level}</span>
                      </div>

                      {/* Body */}
                      <div className="mc-card-body">
                        {/* Title row */}
                        <div className="mc-card-title-row">
                          <h3 className="mc-card-title">{course.title}</h3>
                          <span className="mc-module-badge">Module<br />{course.module}</span>
                        </div>

                        {/* Instructor */}
                        <div className="mc-instructor">
                          <User size={12} />
                          <span>{course.instructor}</span>
                        </div>

                        {/* Progress */}
                        <div className="mc-progress-wrap">
                          <div className="mc-progress-label-row">
                            <span className="mc-progress-label">Progress</span>
                            <span className="mc-progress-pct" style={{ color: course.progress >= 80 ? '#10b981' : '#3b5fe2' }}>{course.progress}%</span>
                          </div>
                          <div className="mc-progress-track">
                            <div className="mc-progress-fill" style={{ width: `${course.progress}%`, background: course.progress >= 80 ? '#10b981' : '#3b5fe2' }} />
                          </div>
                        </div>

                        {/* CTA */}
                        <button className="mc-continue-btn" onClick={() => setActiveNav('module_view')}>
                          Continue Module <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Enroll CTA card */}
                  <div className="mc-enroll-card">
                    <div className="mc-enroll-icon">
                      <Plus size={28} />
                    </div>
                    <h4 className="mc-enroll-title">Enroll in New Course</h4>
                    <p className="mc-enroll-sub">Explore 200+ technical modules in our catalog.</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ═══════════════════════════════
               DASHBOARD VIEW
          ═══════════════════════════════ */}
          {activeNav === 'dashboard' && (
          <>
          {/* Greeting row */}
          <div className="ld-greeting-row">
            <div className="ld-greeting-text">
              <h1 className="ld-greeting">Hello, {sessionStorage.getItem('ld_firstName') || 'Learner'}! Ready to build today?</h1>
              <p className="ld-greeting-sub">You're making great progress. Stick to the plan!</p>
            </div>
            {/* Milestone progress */}
            <div className="ld-milestone-progress">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle cx="28" cy="28" r="24" fill="none" stroke="#3b5fe2" strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24 * 0.45} ${2 * Math.PI * 24 * 0.55}`}
                  transform="rotate(-90 28 28)"
                />
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">45%</text>
              </svg>
              <div className="ld-ms-text">
                <span className="ld-ms-label">Milestone Progress</span>
                <span className="ld-ms-sub">45% of the way to the first milestone</span>
              </div>
            </div>
          </div>

          {/* Hero + right panel */}
          <div className="ld-hero-row">
            {/* Active course card */}
            <div className="ld-course-card">
              <div className="ld-course-badges">
                <span className="ld-course-pill">ACTIVE COURSE</span>
                <span className="ld-course-modules">+12 Modules Remaining</span>
              </div>
              <div className="ld-course-body">
                <h2 className="ld-course-title">Introduction to Web Development</h2>
                <p className="ld-course-mastering">Currently Mastering: <strong>CSS Flexbox</strong></p>
                <button className="ld-resume-btn">
                  <Play size={14} fill="currentColor" />
                  Resume Learning
                </button>
              </div>
              <div className="ld-course-progress-bar-wrap">
                <span className="ld-course-progress-label">MODULE 4 OF 12 • 65% COMPLETE</span>
                <div className="ld-course-progress-track">
                  <div className="ld-course-progress-fill" style={{ width: '65%' }} />
                </div>
              </div>
            </div>

            {/* Next Up + Pro Tip */}
            <div className="ld-right-panel">
              <div className="ld-next-up-header">
                <span className="ld-next-up-title">Next Up</span>
                <span className="ld-next-up-viewall">View All</span>
              </div>
              {TASKS.map((t, i) => (
                <div key={i} className="ld-task">
                  <div className="ld-task-icon" style={{ color: t.color }}>{t.icon}</div>
                  <div className="ld-task-info">
                    <span className="ld-task-name">{t.title}</span>
                    <span className="ld-task-due">{t.due}</span>
                  </div>
                </div>
              ))}
              <div className="ld-pro-tip">
                <span className="ld-pro-tip-label">PRO TIP</span>
                <p className="ld-pro-tip-text">"Consistency is the key to mastering code. Even 15 minutes a day makes a difference."</p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="ld-section">
            <h3 className="ld-section-title">Your Milestones</h3>
            <div className="ld-milestones">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`ld-milestone ${m.done ? 'ld-milestone--done' : ''}`}>
                  <span className="ld-milestone-icon" style={{ color: m.color }}>{m.icon}</span>
                  <span className="ld-milestone-name">{m.name}</span>
                  <span className="ld-milestone-sub">{m.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Handpicked */}
          <div className="ld-section">
            <div className="ld-section-header">
              <h3 className="ld-section-title">Handpicked for You</h3>
              <div className="ld-carousel-arrows">
                <button className="ld-arrow" onClick={() => setResourceIdx((i) => (i - 1 + RESOURCES.length) % RESOURCES.length)}>
                  <ChevronLeft size={14} strokeWidth={2.5} />
                </button>
                <button className="ld-arrow" onClick={() => setResourceIdx((i) => (i + 1) % RESOURCES.length)}>
                  <ChevronRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            <div className="ld-resources">
              {visibleResources.map((r, i) => (
                <div key={i} className="ld-resource-card">
                  <div className="ld-resource-img-wrap">
                    <img src={r.img} alt={r.title} className="ld-resource-img" />
                    <span className="ld-resource-tag" style={{ background: r.tagColor }}>{r.tag}</span>
                  </div>
                  <div className="ld-resource-body">
                    <h4 className="ld-resource-title">{r.title}</h4>
                    <p className="ld-resource-desc">{r.desc}</p>
                    <div className="ld-resource-footer">
                      <span className="ld-resource-time">{r.time}</span>
                      <span className="ld-resource-cta">{r.cta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          </>
          )}

          {/* ═══════════════════════════════
               ASSIGNMENTS VIEW
          ═══════════════════════════════ */}
          {activeNav === 'assignments' && (
            <div className="am-page">
              {/* Header */}
              <div className="am-header">
                <h1 className="am-title">Assignments Management</h1>
                <p className="am-subtitle">
                  Streamline your academic progress. Manage active tasks, track real-time feedback, and maintain your submission workflow in one precision workspace.
                </p>
              </div>

              {/* Active Assignments Section */}
              <div className="am-section">
                <div className="am-section-header">
                  <h2 className="am-section-title">Active Assignments</h2>
                  <a href="#" className="am-view-all">View All Schedule</a>
                </div>
                
                <div className="am-assignments-grid">
                  {/* Card 1 */}
                  <div className="am-card">
                    <div className="am-card-header">
                      <div className="am-card-icon-box am-icon-code">
                        <Code size={16} strokeWidth={2.5} />
                      </div>
                      <span className="am-badge am-badge-high">HIGH PRIORITY</span>
                    </div>
                    <div className="am-card-body">
                      <h3 className="am-card-title">Neural Networks Lab</h3>
                      <p className="am-card-subtitle">CS 402 • Dr. Aris Thorne</p>
                      
                      <div className="am-progress-container">
                        <div className="am-progress-text">
                          <span>Progress</span>
                          <span className="am-progress-value am-val-high">65%</span>
                        </div>
                        <div className="am-progress-bar">
                          <div className="am-progress-fill am-fill-high" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="am-card-footer">
                      <Clock size={12} className="am-footer-icon" />
                      <span>Due in 2 days (Oct 24, 11:59 PM)</span>
                    </div>
                    <div className="am-card-actions">
                      <button className="am-btn-action am-btn-view" onClick={() => setShowPdfModal(true)}>View</button>
                      <button className="am-btn-action am-btn-upload" onClick={() => setShowUploadModal(true)}>Upload</button>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="am-card">
                    <div className="am-card-header">
                      <div className="am-card-icon-box am-icon-db">
                        <Database size={16} strokeWidth={2.5} />
                      </div>
                      <span className="am-badge am-badge-std">STANDARD</span>
                    </div>
                    <div className="am-card-body">
                      <h3 className="am-card-title">Database Sharding</h3>
                      <p className="am-card-subtitle">CS 305 • Prof. Liao</p>
                      
                      <div className="am-progress-container">
                        <div className="am-progress-text">
                          <span>Progress</span>
                          <span className="am-progress-value am-val-std">20%</span>
                        </div>
                        <div className="am-progress-bar">
                          <div className="am-progress-fill am-fill-std" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="am-card-footer">
                      <Clock size={12} className="am-footer-icon" />
                      <span>Due in 5 days (Oct 27, 09:00 AM)</span>
                    </div>
                    <div className="am-card-actions">
                      <button className="am-btn-action am-btn-view" onClick={() => setShowPdfModal(true)}>View</button>
                      <button className="am-btn-action am-btn-upload" onClick={() => setShowUploadModal(true)}>Upload</button>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="am-card">
                    <div className="am-card-header">
                      <div className="am-card-icon-box am-icon-code">
                        <FileCode size={16} strokeWidth={2.5} />
                      </div>
                      <span className="am-badge am-badge-std">STANDARD</span>
                    </div>
                    <div className="am-card-body">
                      <h3 className="am-card-title">Frontend Architecture</h3>
                      <p className="am-card-subtitle">CS 210 • Dr. Roberts</p>
                      
                      <div className="am-progress-container">
                        <div className="am-progress-text">
                          <span>Progress</span>
                          <span className="am-progress-value am-val-std">85%</span>
                        </div>
                        <div className="am-progress-bar">
                          <div className="am-progress-fill am-fill-std" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="am-card-footer">
                      <Clock size={12} className="am-footer-icon" />
                      <span>Due tomorrow</span>
                    </div>
                    <div className="am-card-actions">
                      <button className="am-btn-action am-btn-view" onClick={() => setShowPdfModal(true)}>View</button>
                      <button className="am-btn-action am-btn-upload" onClick={() => setShowUploadModal(true)}>Upload</button>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="am-card">
                    <div className="am-card-header">
                      <div className="am-card-icon-box am-icon-db">
                        <Database size={16} strokeWidth={2.5} />
                      </div>
                      <span className="am-badge am-badge-high">HIGH</span>
                    </div>
                    <div className="am-card-body">
                      <h3 className="am-card-title">Distributed Systems</h3>
                      <p className="am-card-subtitle">CS 501 • Prof. Kim</p>
                      
                      <div className="am-progress-container">
                        <div className="am-progress-text">
                          <span>Progress</span>
                          <span className="am-progress-value am-val-high">0%</span>
                        </div>
                        <div className="am-progress-bar">
                          <div className="am-progress-fill am-fill-high" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="am-card-footer">
                      <Clock size={12} className="am-footer-icon" />
                      <span>Due in 3 days</span>
                    </div>
                    <div className="am-card-actions">
                      <button className="am-btn-action am-btn-view" onClick={() => setShowPdfModal(true)}>View</button>
                      <button className="am-btn-action am-btn-upload">Upload</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment PDF Modal */}
              {showPdfModal && (
                <div className="am-pdf-modal-overlay" onClick={() => setShowPdfModal(false)}>
                  <div className="am-pdf-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="am-pdf-modal-header">
                      <h3 className="am-pdf-modal-title">Assignment Details (PDF)</h3>
                      <button className="am-pdf-modal-close" onClick={() => setShowPdfModal(false)}>
                        <X size={20} />
                      </button>
                    </div>
                    <div className="am-pdf-modal-body">
                      {/* Generic dummy PDF embedding */}
                      <iframe 
                        src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
                        title="Assignment Details" 
                        className="am-pdf-iframe"
                        style={{ border: 'none', width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Assignment Upload Modal */}
              {showUploadModal && (
                <div className="am-pdf-modal-overlay" onClick={() => setShowUploadModal(false)}>
                  <div className="am-upload-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="am-pdf-modal-header">
                      <h3 className="am-pdf-modal-title">Submit Link</h3>
                      <button className="am-pdf-modal-close" onClick={() => setShowUploadModal(false)}>
                        <X size={20} />
                      </button>
                    </div>
                    <div className="am-upload-modal-body">
                      <p className="am-upload-desc">Please provide a link to your assignment. Accepted domains: <strong>github.com, docs.google.com, vercel.app, netlify.app</strong>.</p>
                      <input 
                        type="url" 
                        placeholder="https://..." 
                        className="am-upload-input"
                        value={uploadUrl}
                        onChange={(e) => {
                          setUploadUrl(e.target.value);
                          setUploadError('');
                        }}
                      />
                      {uploadError && <div className="am-upload-error">{uploadError}</div>}
                      <button className="am-upload-submit-btn" onClick={handleUploadSubmit}>Submit Assignment</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* ═══════════════════════════════
               MODULE VIEW
          ═══════════════════════════════ */}
          {activeNav === 'module_view' && (
            <div className="mv-page">
              <div className="mv-left">
                {/* Video Player */}
                <div className="mv-video-wrapper">
                  <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Video Placeholder" className="mv-video-img" />
                  <button className="mv-play-btn"><Play fill="currentColor" size={32} /></button>
                  <div className="mv-video-progress"></div>
                </div>

                {/* Info Block */}
                <div className="mv-info">
                  <div className="mv-info-header">
                    <div>
                      <span className="mv-badge">INTERMEDIATE LEVEL</span>
                      <h1 className="mv-title">Advanced Systems Architecture & Scalability: Distributed Databases</h1>
                    </div>
                    <div className="mv-actions">
                      <button className="mv-btn-save"><Bookmark size={14} /> Save</button>
                      <button className="mv-btn-share"><Share2 size={16} color="#475569" /></button>
                    </div>
                  </div>

                  <div className="mv-meta-row">
                    <div className="mv-instructor">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Instructor" className="mv-instructor-img" />
                      <div>
                        <div className="mv-instructor-name">Elena Petrova</div>
                        <div className="mv-instructor-title">Senior Architect • 12k students</div>
                      </div>
                    </div>
                    <div className="mv-meta-divider"></div>
                    <div className="mv-meta-item">
                      <div className="mv-meta-label">Published</div>
                      <div className="mv-meta-val">Oct 14, 2023</div>
                    </div>
                    <div className="mv-meta-item">
                      <div className="mv-meta-label">Progress</div>
                      <div className="mv-meta-val mv-val-blue">75% Complete</div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="mv-tabs">
                    <button className="mv-tab mv-tab-active">Description</button>
                    <button className="mv-tab">Resources</button>
                    <button className="mv-tab">Assignments (1)</button>
                    <button className="mv-tab">Discussion (42)</button>
                  </div>

                  {/* Content */}
                  <div className="mv-desc">
                    <p>In this module, we dive deep into the trade-offs of distributed storage systems. We'll explore the CAP theorem, eventual consistency vs. strong consistency, and how modern databases like Cassandra and DynamoDB handle massive scale.</p>
                    <h4>What you'll learn:</h4>
                    <ul>
                      <li>Partitioning strategies and consistent hashing</li>
                      <li>Quorum-based replication protocols</li>
                      <li>Handling network partitions and conflict resolution</li>
                    </ul>
                  </div>

                  {/* Ask AI */}
                  <div className="mv-ask-ai">
                    <Sparkles size={16} className="mv-ai-icon" />
                    <input type="text" placeholder="Ask AI about this lesson..." className="mv-ai-input" />
                    <button className="mv-ai-btn">ASK</button>
                  </div>
                </div>
              </div>

              <div className="mv-right">
                {/* Curriculum */}
                <div className="mv-curriculum">
                  <div className="mv-curr-header">
                    <h3>Course Curriculum</h3>
                    <span className="mv-curr-progress">14 / 20 Lessons</span>
                  </div>

                  {/* Week 1 */}
                  <div className="mv-week">
                    <div className="mv-week-header mv-week-header-collapsed">
                      <span>WEEK 1: FUNDAMENTALS</span>
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  {/* Week 2 */}
                  <div className="mv-week">
                    <div className="mv-week-header mv-week-header-active">
                      <span>WEEK 2: DISTRIBUTED DATABASES</span>
                    </div>
                    <div className="mv-week-content">
                      {/* Sub-item 1 */}
                      <div className="mv-lesson mv-lesson-active">
                        <div className="mv-lesson-thumb">
                          <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Lesson" />
                          <div className="mv-lesson-play"><Play fill="currentColor" size={10} /></div>
                        </div>
                        <div className="mv-lesson-info">
                          <span className="mv-lesson-label">LESSON 2.1</span>
                          <h4 className="mv-lesson-title">Introduction to CAP Theorem</h4>
                          <span className="mv-lesson-meta">45 mins • In Progress</span>
                        </div>
                      </div>
                      
                      {/* Sub-item 2 */}
                      <div className="mv-lesson">
                        <div className="mv-lesson-icon-box">
                          <HelpCircle size={16} />
                        </div>
                        <div className="mv-lesson-info">
                          <span className="mv-lesson-label">QUIZ</span>
                          <h4 className="mv-lesson-title">Database Consistency Patterns</h4>
                          <span className="mv-lesson-meta"><Lock size={10}/> Locked</span>
                        </div>
                      </div>

                      {/* Sub-item 3 */}
                      <div className="mv-lesson">
                        <div className="mv-lesson-icon-box">
                          <Clipboard size={16} />
                        </div>
                        <div className="mv-lesson-info">
                          <span className="mv-lesson-label">ASSIGNMENT</span>
                          <h4 className="mv-lesson-title">Fault-Tolerant System Design</h4>
                          <span className="mv-lesson-meta mv-meta-red">Due: Friday</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Week 3 */}
                  <div className="mv-week">
                    <div className="mv-week-header mv-week-header-collapsed">
                      <span>WEEK 3: MICROSERVICES</span>
                      <Lock size={14} />
                    </div>
                  </div>
                </div>

                {/* Live Session */}
                <div className="mv-live-card">
                  <div className="mv-live-badge">LIVE SESSION <div className="mv-live-dot"></div></div>
                  <h3 className="mv-live-title">Q&A: Architecture Review</h3>
                  <p className="mv-live-time">Tomorrow at 10:00 AM</p>
                  <button className="mv-live-btn">ADD TO CALENDAR</button>
                </div>

                {/* Recent Recordings */}
                <div className="mv-recordings">
                  <h3 className="mv-rec-head">Recent Recordings</h3>
                  <div className="mv-recording-card">
                    <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Recording" />
                    <span className="mv-rec-time">1:12:05</span>
                  </div>
                  <h4 className="mv-rec-title">NoSQL vs Relational Storage</h4>
                  <span className="mv-rec-meta">1 week ago • 1.2k views</span>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* ── Footer ── */}
        <footer className="ld-footer">
          <div className="ld-footer-left">
            <span className="ld-footer-brand">Console Learn</span>
            <span className="ld-footer-copy">© 2024 Precision Atelier Learning Systems</span>
          </div>
          <div className="ld-footer-links">
            {['Privacy', 'Terms', 'Support', 'Academic Integrity'].map(l => (
              <a key={l} className="ld-footer-link">{l}</a>
            ))}
          </div>
        </footer>
      </div>
      
      {/* ── Success Toast ── */}
      {showSuccessPopup && (
        <div className="ld-toast-success">
          <CheckCircle2 size={18} />
          <span>Link submitted successfully!</span>
        </div>
      )}
    </div>
  );
};

export default LearnerDashboard;
