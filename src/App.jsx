import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './utils/supabase';
import Solutions from './Solutions';
import NotFound from './NotFound';
import Resources from './Resources';
import Documentation from './Documentation';
import SignIn from './SignIn';
import GetStarted from './GetStarted';
import UserDashboard from './UserDashboard';
import Jobs from './Jobs';
import OpenPositions from './OpenPositions';
import LearnerLogin from './LearnerLogin';
import LearnerRegistration from './LearnerRegistration';
import LearnerDashboard from './LearnerDashboard';
import './App.css';
import {
  LayoutDashboard,
  FoldHorizontal,
  LayoutTemplate,
  GraduationCap,
  Wrench,
  Settings,
  HelpCircle,
  MessageSquare,
  Search,
  Plus,
  Bell,
  ArrowRight,
  Terminal,
  Database,
  LineChart,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Star
} from 'lucide-react';

const reviews = [
  {
    name: "Sarah Jenkins",
    role: "CTO, Vanguard Tech",
    rating: 5,
    text: "Console completely transformed the velocity of our deployment pipelines. The architectural simplicity and raw performance are absolutely unmatched.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    name: "Marcus Aurelius",
    role: "Lead Engineer, Delta Systems",
    rating: 5,
    text: "Every developer on our team uses Console. The Data Hub alone saved us months of engineering effort. It is an absolute game-changer for scale.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    name: "Elena Rodriguez",
    role: "Product Manager, InnovateX",
    rating: 4,
    text: "The integrated analytics and performance tracking modules make measuring our success so incredibly straightforward and visually crisp.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d"
  },
  {
    name: "James Chen",
    role: "Founder, StartupGrid",
    rating: 5,
    text: "We scaled from 1,000 to 1M users smoothly, thanks exclusively to Console's managed real-time instances and guard utilities.",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d"
  }
];

const faqs = [
  {
    question: "What makes Console different from other management tools?",
    answer: "Console is built on a proprietary headless architecture that allows seamless integration with your existing stack. It is designed for maximum performance, uncompromising security, and real-time data flow, making it ideal for scaling enterprise operations."
  },
  {
    question: "Do you offer tailored solutions for startups?",
    answer: "Yes, our modular cloud-native service architecture ensures that startups can select specific modules they need right now, and easily expand their infrastructure as their business requirements grow."
  },
  {
    question: "How secure is the data stored on Console?",
    answer: "Security is built into the foundation of Console. Our Guard utility provides end-to-end encryption and automated threat detection for all projects to keep your infrastructure in peak condition."
  },
  {
    question: "Can I integrate my custom APIs with Console?",
    answer: "Absolutely. Data Hub supports high-concurrency data storage and automated sharding, making it trivial to pipe in custom APIs and achieve real-time syncing across your entire stack."
  }
];

function App() {
  const [activePage, _setActivePage] = useState(() => {
    const pageToPathMap = {
      'learnerlogin': '/learner-login',
      'learnerregistration': '/learner-registration',
      'learnerdashboard': '/learner-dashboard',
      'signin': '/signin',
      'getstarted': '/get-started',
      'userdashboard': '/dashboard',
      'documentation': '/documentation',
      'solutions': '/solutions',
      'resources': '/resources',
      'jobs': '/jobs',
      'openpositions': '/open-positions',
    };

    const params = new URLSearchParams(window.location.search);
    const queryPage = params.get('page');
    if (queryPage) {
      if (window.history && window.history.replaceState) {
        const newPath = pageToPathMap[queryPage] || '/';
        window.history.replaceState({}, '', newPath);
      }
      return queryPage;
    }
    const pathMap = {
      '/learner-login':         'learnerlogin',
      '/learner-registration':  'learnerregistration',
      '/learner-dashboard':     'learnerdashboard',
      '/signin':              'signin',
      '/sign-in':             'signin',
      '/get-started':         'getstarted',
      '/dashboard':           'userdashboard',
      '/documentation':       'documentation',
      '/solutions':           'solutions',
      '/resources':           'resources',
      '/jobs':                'jobs',
      '/open-positions':      'openpositions',
      '/':                    'home'
    };
    const fromPath = pathMap[window.location.pathname];
    if (fromPath) return fromPath;
    return sessionStorage.getItem('console_activePage') || 'home';
  });
  const [previousPage, setPreviousPage] = useState(() => sessionStorage.getItem('console_previousPage') || 'home');
  const [authBanner, setAuthBanner] = useState(null);

  const PROTECTED_PAGES = ['jobs', 'resources', 'openpositions'];

  const pageToPath = {
    'learnerlogin': '/learner-login',
    'learnerregistration': '/learner-registration',
    'learnerdashboard': '/learner-dashboard',
    'signin': '/signin',
    'getstarted': '/get-started',
    'userdashboard': '/dashboard',
    'userprojects': '/dashboard',
    'documentation': '/documentation',
    'solutions': '/solutions',
    'resources': '/resources',
    'jobs': '/jobs',
    'openpositions': '/open-positions',
    'home': '/',
  };

  const setActivePage = (pageStr) => {
    // Auth guard — redirect unauthenticated users away from protected pages
    if (PROTECTED_PAGES.includes(pageStr) && !sessionRef.current) {
      setAuthBanner('Please sign in to access this section.');
      setTimeout(() => setAuthBanner(null), 4000);
      _setActivePage('signin');
      sessionStorage.setItem('console_activePage', 'signin');
      window.history.pushState({}, '', '/signin');
      return;
    }
    if (activePage !== 'notfound' && pageStr === 'notfound') {
      setPreviousPage(activePage);
      sessionStorage.setItem('console_previousPage', activePage);
    } else if (activePage !== 'notfound' && activePage !== pageStr) {
      setPreviousPage(activePage);
      sessionStorage.setItem('console_previousPage', activePage);
    }
    _setActivePage(pageStr);
    sessionStorage.setItem('console_activePage', pageStr);

    // Sync URL
    const newPath = pageToPath[pageStr] || '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathMap = {
        '/learner-login':         'learnerlogin',
        '/learner-registration':  'learnerregistration',
        '/learner-dashboard':     'learnerdashboard',
        '/signin':              'signin',
        '/sign-in':             'signin',
        '/get-started':         'getstarted',
        '/dashboard':           'userdashboard',
        '/documentation':       'documentation',
        '/solutions':           'solutions',
        '/resources':           'resources',
        '/jobs':                'jobs',
        '/open-positions':      'openpositions',
        '/':                    'home',
      };
      const page = pathMap[window.location.pathname] || 'home';
      _setActivePage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [todos, setTodos] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isLearningModalOpen, setIsLearningModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const sessionRef = useRef(null);
  const reviewCarouselRef = useRef(null);

  const scrollReviews = (direction) => {
    if (reviewCarouselRef.current) {
      reviewCarouselRef.current.scrollBy({ left: direction * 400, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Commenting out getTodos() since the 'todos' table doesn't exist yet, which throws a 404
    /*
    async function getTodos() {
      const { data: todosData } = await supabase.from('todos').select();
      if (todosData) setTodos(todosData);
    }
    getTodos();
    */

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      sessionRef.current = session;
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      sessionRef.current = session;
    });

    return () => subscription.unsubscribe();
  }, []);

  const carouselRef = useRef(null);

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  const categories = [
    { name: 'Project Development', icon: <FoldHorizontal size={24} />, desc: 'Plan, track and ship projects with precision using structured workflows.' },
    { name: 'Data Flow Management', icon: <Database size={24} />, desc: 'Orchestrate data pipelines and real-time sync across your stack.' },
    { name: 'Language Learning', icon: <GraduationCap size={24} />, desc: 'Structured curriculum to master new programming languages and frameworks.' },
    { name: 'Software Tools', icon: <Terminal size={24} />, desc: 'Integrated developer tools for building, testing and deploying apps.' },
    { name: 'Report Management', icon: <LineChart size={24} />, desc: 'Generate and share rich analytical reports across teams.' },
    { name: 'Software Solutions', icon: <LayoutTemplate size={24} />, desc: 'End-to-end enterprise software delivery from concept to production.' },
    { name: 'System Maintenance', icon: <Wrench size={24} />, desc: 'Monitor, audit and keep your infrastructure in peak condition.' },
    { name: 'Performance Boosting', icon: <ShieldCheck size={24} />, desc: 'Optimise runtime performance and eliminate bottlenecks at scale.' },
  ];

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Projects', icon: <FoldHorizontal size={18} /> },
    { name: 'Web Builder', icon: <LayoutTemplate size={18} /> },
    { name: 'Learning Hub', icon: <GraduationCap size={18} /> },
    { name: 'IT Tools', icon: <Wrench size={18} /> },
    { name: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation - Hidden for now */}
      {false && (
        <aside className="sidebar">
          <div className="brand-header">
            <h1 className="brand-title" style={{ color: '#2f6be8' }}>Console</h1>
            <div className="brand-subtitle-group">
              <div className="brand-subtitle">The Precision Atelier</div>
              <div className="brand-subtitle-mini">Enterprise <span style={{ color: '#2f6be8' }}>Console</span></div>
            </div>
          </div>

          <nav className="nav-links">
            {navItems.map((item) => (
              <li
                key={item.name}
                className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
                onClick={() => setActiveTab(item.name)}
              >
                <div className="icon">{item.icon}</div>
                <span>{item.name}</span>
              </li>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <li className="bottom-link">
              <HelpCircle size={16} className="icon" />
              <span>Support</span>
            </li>
            <li className="bottom-link">
              <MessageSquare size={16} className="icon" />
              <span>Feedback</span>
            </li>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="main-content">

        {/* Top Navigation — hidden on Documentation, SignIn, GetStarted, UserDashboard, OpenPositions, LearnerLogin, and LearnerRegistration pages */}
        {activePage !== 'documentation' && activePage !== 'signin' && activePage !== 'getstarted' && activePage !== 'userdashboard' && activePage !== 'userprojects' && activePage !== 'openpositions' && activePage !== 'learnerlogin' && activePage !== 'learnerregistration' && activePage !== 'learnerdashboard' && (
          <header className="top-nav">
            <div className="header-brand">
              <a href="/" style={{ textDecoration: 'none', color: '#2f6be8' }}>
                <h1 className="brand-title" style={{ margin: 0, color: 'inherit' }}>Console</h1>
              </a>
            </div>

            <div className="top-nav-links">
              <span className={`top-nav-link ${activePage === 'home' ? 'active' : ''}`} onClick={() => setActivePage('home')}>Platform</span>
              <span className={`top-nav-link ${activePage === 'solutions' ? 'active' : ''}`} onClick={() => setActivePage('solutions')}>Solutions</span>
              <span className={`top-nav-link ${activePage === 'resources' ? 'active' : ''}`} onClick={() => setActivePage('resources')}>Resources</span>
            </div>

            {!session ? (
              <div className="top-nav-actions">
                <button className="btn-signin" onClick={() => setActivePage('signin')}>Sign In</button>
                <button className="btn-primary" onClick={() => setActivePage('getstarted')}>Get Started</button>
              </div>
            ) : (
              <div className="top-nav-user-container">
                <div className="top-nav-user-profile">
                  <div className="user-avatar-icon">
                    {session.user?.user_metadata?.first_name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="user-fullname-text">
                    {session.user?.user_metadata?.first_name || session.user?.email?.split('@')[0]} {session.user?.user_metadata?.last_name || ''}
                  </span>
                </div>
                <div className="top-nav-dropdown">
                  <button className="dropdown-item" onClick={() => setActivePage('userdashboard')}>
                    Manage Dashboard
                  </button>
                  <button className="dropdown-item logout" onClick={async () => {
                    await supabase.auth.signOut();
                    setActivePage('home');
                  }}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </header>
        )}

        {activePage === 'home' ? (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              {/* Flex container to place hero text to the left and search bar to the right */}
              <div className="hero-container">
                {/* Hero text content — z-index above all wave layers */}
                <div className="hero-content">
                  <h1 className="hero-title">
                    <span style={{ color: '#2f6be8' }}>Console</span>: Elevating Technology from <span className="highlight">Learners to Entrepreneurs.</span>
                  </h1>
                  <p className="hero-description">
                    The architect's choice for digital production. From fundamental curriculum to enterprise-grade infrastructure, we provide the tools to build the future.
                  </p>
                  <div className="hero-actions">
                    <button className="btn-primary" onClick={() => setActivePage(session ? 'userprojects' : 'getstarted')}>Start Building</button>
                    <button className="btn-secondary" onClick={() => setActivePage('documentation')}>View Platform Docs</button>
                  </div>
                </div>

                {/* Floating Search Bar — now positioned on the right */}
                <div className="floating-search">
                  <div className="search-input-group">
                    <Search size={18} color="#9ca3af" />
                    <input type="text" placeholder="Search you Dreams .........................!" />
                  </div>
                  <div className="floating-actions">
                    <button onClick={() => setActivePage('notfound')}><Plus size={20} color="#2f6be8" /></button>
                    <button onClick={() => setActivePage('notfound')}><Bell size={20} color="#6b7280" /></button>
                    <div className="avatar-small">AM</div>
                  </div>
                </div>
              </div>

              {/* Third wave layer — lightest foreground wave */}
              <div className="hero-wave-top">
                <svg viewBox="0 0 1440 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path
                    fill="#f5f6f8"
                    fillOpacity="0.9"
                    d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,133.3C840,139,960,117,1080,106.7C1200,96,1320,96,1380,96L1440,96L1440,180L1380,180C1320,180,1200,180,1080,180C960,180,840,180,720,180C600,180,480,180,360,180C240,180,120,180,60,180L0,180Z"
                  />
                </svg>
              </div>
            </section>

            {/* Category Carousel Section */}
            <section className="carousel-section">
              <div className="carousel-header">
                <div>
                  <div className="section-label">What We Offer</div>
                  <h2 className="section-title" style={{ marginBottom: 0 }}>Explore by Category</h2>
                </div>
              </div>

              <div className="carousel-track" ref={carouselRef}>
                {categories.map((cat) => (
                  <div key={cat.name} className="carousel-card">
                    <div className="icon-box">{cat.icon}</div>
                    <h3>{cat.name}</h3>
                    <p>{cat.desc}</p>
                    <a href="#" className="card-link" onClick={(e) => { e.preventDefault(); setActivePage('notfound'); }}>
                      Explore <ArrowRight size={14} />
                    </a>
                  </div>
                ))}
              </div>

              <div className="carousel-controls">
                <button className="carousel-btn" onClick={() => scrollCarousel(-1)}>
                  <ChevronLeft size={20} />
                </button>
                <button className="carousel-btn" onClick={() => scrollCarousel(1)}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </section>

            {/* Testimonials / Partners Section */}
            <section className="carousel-section" style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #ebebed', borderBottom: '1px solid #ebebed' }}>
              <div className="carousel-header">
                <div>
                  <div className="section-label" style={{ color: '#2f6be8' }}>What Our Partners Say</div>
                  <h2 className="section-title" style={{ marginBottom: 0 }}>Trusted by Visionaries</h2>
                </div>
              </div>

              <div className="carousel-track" ref={reviewCarouselRef}>
                {reviews.map((rev, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <img src={rev.avatar} alt={rev.name} className="review-avatar" />
                      <div className="review-meta">
                        <h4>{rev.name}</h4>
                        <span>{rev.role}</span>
                      </div>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={16} fill={idx < rev.rating ? "#f59e0b" : "transparent"} color={idx < rev.rating ? "#f59e0b" : "#d1d5db"} />
                      ))}
                    </div>
                    <p className="review-text">"{rev.text}"</p>
                  </div>
                ))}
              </div>

              <div className="carousel-controls">
                <button className="carousel-btn" onClick={() => scrollReviews(-1)}>
                  <ChevronLeft size={20} />
                </button>
                <button className="carousel-btn" onClick={() => scrollReviews(1)}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </section>

            {/* Learning Platform Section */}
            <section className="section-wrapper">
              <div className="section-label red">Learning Platform</div>
              <h2 className="section-title">Active Curriculum</h2>

              <div className="learning-layout">
                <div className="learning-content">
                  <p>Bridge the gap between theory and industry. Our proprietary curriculum tracks your growth in real-time as you master the <span style={{ color: '#2f6be8', fontWeight: 600 }}>Console</span> ecosystem.</p>

                  <div className="progress-card">
                    <div className="progress-header">
                      <span>Cloud Architecture 101</span>
                      <span className="progress-percent">75%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className="progress-card">
                    <div className="progress-header">
                      <span>Data Hub Management</span>
                      <span className="progress-label">Next: Chapter 4</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="video-placeholder">
                  <div className="play-button"></div>
                </div>
              </div>
            </section>

            {/* Productivity Tools Section */}
            <section className="tools-section">
              <h2 className="section-title">Productivity & IT Tools</h2>
              <p>Seamless integration of enterprise-grade utilities for the modern digital workspace.</p>

              <div className="tools-grid">

                <div className="tool-card">
                  <div className="tool-icon">
                    <Terminal size={20} />
                  </div>
                  <h4><span style={{ color: '#2f6be8' }}>Console</span> CLI</h4>
                  <p>Unified command line interface for global deployments and resource management.</p>
                  <div className="tool-footer">
                    <div className="code-snippet">$ <span style={{ color: '#2f6be8' }}>console</span> deploy --prod</div>
                  </div>
                </div>

                <div className="tool-card">
                  <div className="tool-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                    <Database size={20} />
                  </div>
                  <h4>Data Hub</h4>
                  <p>High-concurrency data storage with automated sharding and real-time syncing.</p>
                  <div className="tool-footer">
                    <div className="abstract-shapes">
                      <div className="shape-circle" style={{ backgroundColor: '#c7d2fe' }}></div>
                      <div className="shape-circle" style={{ backgroundColor: '#a5b4fc', marginLeft: '-10px' }}></div>
                      <div className="shape-circle" style={{ backgroundColor: '#6366f1', marginLeft: '-10px' }}></div>
                    </div>
                  </div>
                </div>

                <div className="tool-card">
                  <div className="tool-icon" style={{ backgroundColor: '#fae8ff', color: '#c026d3' }}>
                    <LineChart size={20} />
                  </div>
                  <h4>Analytic</h4>
                  <p>Deeper insights into your traffic patterns and system health metrics.</p>
                  <div className="tool-footer">
                    <div className="abstract-shapes">
                      <div className="shape-bar" style={{ height: '8px' }}></div>
                      <div className="shape-bar" style={{ height: '14px', backgroundColor: '#a5b4fc' }}></div>
                      <div className="shape-bar" style={{ height: '22px', backgroundColor: '#818cf8' }}></div>
                      <div className="shape-bar" style={{ height: '16px', backgroundColor: '#6366f1' }}></div>
                    </div>
                  </div>
                </div>

                <div className="tool-card">
                  <div className="tool-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <h4>Guard</h4>
                  <p>End-to-end encryption and automated threat detection for all projects.</p>
                  <div className="tool-footer">
                    <div className="status-badge">
                      <span className="status-dot"></span> System Secured
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* FAQ Section */}
            <section className="section-wrapper" style={{ backgroundColor: '#ffffff' }}>
              <div className="section-label">Support & Resources</div>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <div className="faq-container">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`faq-item ${openFaq === index ? 'active' : ''}`}
                  >
                    <div
                      className="faq-question"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      {faq.question}
                      <ChevronDown className={`faq-icon ${openFaq === index ? 'rotate' : ''}`} size={20} />
                    </div>
                    {openFaq === index && (
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                <button
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 2rem', fontSize: '1rem', borderRadius: '2rem', boxShadow: '0 4px 14px rgba(47, 107, 232, 0.25)' }}
                  onClick={() => setIsQueryModalOpen(true)}
                >
                  <MessageSquare size={18} /> Ask a Question
                </button>
              </div>
            </section>

            {/* Live Supabase Data Section */}
            {todos.length > 0 && (
              <section className="section-wrapper" style={{ paddingBottom: '2rem' }}>
                <div className="section-label" style={{ color: '#10b981' }}>Live Database Connect</div>
                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Active Tasks</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '800px' }}>
                  {todos.map((todo) => (
                    <div key={todo.id} style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #ebebed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0d0f12' }}>{todo.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : activePage === 'solutions' ? (
          <Solutions setActivePage={setActivePage} />
        ) : activePage === 'resources' ? (
          session ? <Resources setActivePage={setActivePage} /> : <SignIn setActivePage={setActivePage} />
        ) : activePage === 'documentation' ? (
          <Documentation setActivePage={setActivePage} setIsQueryModalOpen={setIsQueryModalOpen} />
        ) : activePage === 'signin' ? (
          <SignIn setActivePage={setActivePage} />
        ) : activePage === 'getstarted' ? (
          <GetStarted setActivePage={setActivePage} />
        ) : activePage === 'jobs' ? (
          session ? <Jobs setActivePage={setActivePage} /> : <SignIn setActivePage={setActivePage} />
        ) : activePage === 'openpositions' ? (
          <OpenPositions setActivePage={setActivePage} session={session} />
        ) : activePage === 'userdashboard' ? (
          <UserDashboard session={session} setActivePage={setActivePage} initialTab="overview" />
        ) : activePage === 'userprojects' ? (
          <UserDashboard session={session} setActivePage={setActivePage} initialTab="projects" />
        ) : activePage === 'learnerlogin' ? (
          <LearnerLogin setActivePage={setActivePage} />
        ) : activePage === 'learnerregistration' ? (
          <LearnerRegistration setActivePage={setActivePage} />
        ) : activePage === 'learnerdashboard' ? (
          <LearnerDashboard setActivePage={setActivePage} />
        ) : (
          <NotFound setActivePage={setActivePage} previousPage={previousPage} setIsQueryModalOpen={setIsQueryModalOpen} />
        )}

        {/* Extended Home Footer */}
        {activePage === 'home' && (
          <footer className="home-large-footer">
            <div className="footer-top-row">
              <div className="footer-brand-col">
                <a href="/" style={{ textDecoration: 'none', color: '#2f6be8' }}>
                  <h2 className="brand-title" style={{ margin: '0 0 1rem 0', color: 'inherit', fontSize: '1.85rem' }}>Console</h2>
                </a>
                <p className="footer-tagline">
                  Precision-engineered IT solutions for the modern digital workspace. Our platform is built on the architecture that powers Fortune 500 Infrastructure.
                </p>
              </div>
              <div className="footer-links-grid">
                <div className="footer-col">
                  <h4>Navigate</h4>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('home'); }}>Platform</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('solutions'); }}>Solutions</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('resources'); }}>Resources</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsLearningModalOpen(true); }}>Learning</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('jobs'); }}>Jobs</a>
                </div>
                <div className="footer-col">
                  <h4>Support</h4>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('documentation'); }}>Documentation</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsQueryModalOpen(true); }}>Contact Support</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('notfound'); }}>Help Center</a>
                </div>
                <div className="footer-col">
                  <h4>Legal</h4>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('notfound'); }}>Privacy Policy</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('notfound'); }}>Terms of Service</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('notfound'); }}>Security</a>
                </div>
              </div>
            </div>
            <div className="footer-bottom-row">
              <div className="footer-copyright">
                © 2024 Console IT. All rights reserved.
              </div>
              <div className="footer-status-links">
                <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('notfound'); }}>System Status</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('notfound'); }}>GitHub</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('notfound'); }}>LinkedIn</a>
              </div>
            </div>
          </footer>
        )}

        {/* Auth Banner Toast */}
        {authBanner && (
          <div style={{
            position: 'fixed',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            background: '#0f172a',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 10px 30px rgba(15,23,42,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'fadeIn 0.2s ease-out',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: '#ef4444',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.8rem',
              flexShrink: 0,
              lineHeight: 1,
            }}>!</span>
            {authBanner}
          </div>
        )}

        {/* Support Query Modal */}
        {isQueryModalOpen && (
          <div className="modal-overlay" onClick={() => setIsQueryModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Submit a Query</h3>
                <button className="modal-close" onClick={() => setIsQueryModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <p>Have a question that's not answered in the FAQ? Send it directly to our support team.</p>
                <form onSubmit={(e) => { e.preventDefault(); setIsQueryModalOpen(false); alert("Your query has been sent to our team!"); }}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="you@company.com" required className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Your Question</label>
                    <textarea placeholder="How can we help?" rows="4" required className="form-input"></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>Send Message</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Learning Redirect Modal */}
        {isLearningModalOpen && (
          <div className="modal-overlay" onClick={() => setIsLearningModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
              <div className="modal-header">
                <h3>Learners Dashboard</h3>
                <button className="modal-close" onClick={() => setIsLearningModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body" style={{ textAlign: 'center', padding: '2.5rem 1.5rem 1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#eff6ff', marginBottom: '1.5rem' }}>
                  <GraduationCap size={36} color="#2f6be8" />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: '#0d0f12', marginBottom: '1rem', fontWeight: 700 }}>Enter Learning Hub</h4>
                <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                  You are about to leave the main Platform console and securely switch over to your dedicated <b>Learners Dashboard</b>. Do you wish to proceed?
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn-secondary" onClick={() => setIsLearningModalOpen(false)} style={{ padding: '0.85rem', flex: 1, borderRadius: '0.5rem' }}>Cancel</button>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setIsLearningModalOpen(false);
                      // Use the actual path for direct navigation
                      window.open('/learner-login', '_blank');
                    }}
                    style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flex: 1, borderRadius: '0.5rem' }}
                  >
                    Proceed <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
