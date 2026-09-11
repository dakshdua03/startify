import { useState, useEffect, useRef } from "react";
import logoImg from "./assets/startify-wordmark-full.png";
import { dbService, isFirebaseConfigured as isSupabaseConfigured, authService } from "./lib/firebase";

/* ==========================================================================
   PRE-CREATED TEST ACCOUNTS & DEMO DATA FOR EASY TESTING
   ========================================================================== */

export const ROLE_META = {
  founder: { label: "Founder", icon: "", accent: "#111111", dot: "bg-emerald-500" },
  talent: { label: "Builder", icon: "", accent: "#3b82f6", dot: "bg-sky-500" },
  backer: { label: "Backer", icon: "", accent: "#7c3aed", dot: "bg-violet-500" },
  admin: { label: "Admin", icon: "", accent: "#0f172a", dot: "bg-amber-500" },
};

export const DEMO_USERS = [
  {
    id: "user_priya",
    name: "Priya Sharma",
    email: "priya@uohyd.ac.in",
    role: "founder",
    studentId: "UOH-2023-CS042",
    bio: "Final year CS student building CampusKart, a peer-to-peer campus marketplace.",
    avatar: "PS",
  },
  {
    id: "user_vikram",
    name: "Vikram Singh",
    email: "vikram@uohyd.ac.in",
    role: "talent",
    studentId: "UOH-2022-CS110",
    roleTitle: "Full-Stack Engineer",
    skills: "React, Node.js, Python, PostgreSQL",
    bio: "Passionate developer looking to join exciting campus AI & SaaS startups.",
    avatar: "VS",
  },
  {
    id: "user_backer",
    name: "Campus Angel Network",
    email: "angels@startify.net",
    role: "backer",
    ticketSize: "Pre-Seed & Micro-Capital",
    focus: "EdTech, AI & Consumer Apps",
    bio: "Alumni angel syndicate funding pre-seed student ideas from prototype to MVP.",
    avatar: "CA",
  },
  {
    id: "user_admin",
    name: "Startify Admin",
    email: "admin@startify.net",
    role: "admin",
    bio: "Community administrator for Startify. Reviews ideas, manages events, and keeps the ecosystem healthy.",
    avatar: "SA",
  }
];

export const INITIAL_IDEAS = [
  {
    id: "idea_1",
    title: "CampusKart",
    category: "E-Commerce / Logistics",
    founderId: "user_priya",
    founder: "Priya Sharma",
    verifiedStudent: true,
    studentId: "UOH-2023-CS042",
    desc: "Peer-to-peer campus marketplace for buying, selling, and renting hostel essentials and textbooks effortlessly.",
    seeking: "Tech Co-Founder (React & Node.js)",
    status: "Validation Phase",
    createdDate: "2 days ago"
  },
  {
    id: "idea_2",
    title: "HostelX Food Tech",
    category: "Food & Services",
    founderId: "user_aarav",
    founder: "Aarav Patel",
    verifiedStudent: true,
    studentId: "UOH-2022-EC118",
    desc: "Late-night campus food delivery network delivering directly to hostel rooms within 15 minutes.",
    seeking: "Growth & Operations Lead",
    status: "MVP Live",
    createdDate: "3 days ago"
  },
  {
    id: "idea_3",
    title: "StudyBuddy AI",
    category: "EdTech / AI",
    founderId: "user_rohan",
    founder: "Rohan Verma",
    verifiedStudent: true,
    studentId: "UOH-2024-AI009",
    desc: "AI agent that synthesizes course lecture notes into personalized revision guides and interactive practice tests.",
    seeking: "UI/UX Product Designer",
    status: "Prototype Ready",
    createdDate: "Just now"
  }
];

export const INITIAL_FUNDERS = [
  {
    id: "user_backer",
    name: "Campus Angel Network",
    role: "Early-Stage Micro Angel Syndicate",
    focus: "EdTech, AI & Consumer SaaS",
    bio: "Alumni-backed micro syndicate funding pre-seed student ideas from concept to MVP stage.",
    ticketSize: "Pre-Seed & Seed Focus"
  },
  {
    id: "backer_2",
    name: "Venture Catalyst Circle",
    role: "Pre-Seed & Seed Backer",
    focus: "B2B SaaS, Logistics & E-Commerce",
    bio: "Supporting student founders with initial micro-capital, pilot launch credits, and industry mentorship.",
    ticketSize: "Idea & Prototype Funding"
  }
];

export const INITIAL_BUILDERS = [
  {
    id: "user_vikram",
    name: "Vikram Singh",
    role: "Full-Stack Engineer",
    skills: "React, Node.js, Python, PostgreSQL",
    year: "4th Year Computer Science",
    verifiedStudent: true,
    status: "Looking for AI / SaaS Co-Founder"
  },
  {
    id: "builder_2",
    name: "Sneha Reddy",
    role: "UI/UX Product Designer",
    skills: "Figma, Framer, Prototyping, User Research",
    year: "3rd Year Design & Arts",
    verifiedStudent: true,
    status: "Available for MVP Collaborations"
  }
];

export const INITIAL_EVENTS = [
  {
    id: "e1",
    title: "Campus Demo Day & Idea Showcase",
    date: "Saturday, Sep 12",
    time: "5:00 PM - 7:30 PM",
    venue: "Main Innovation Auditorium & Online Stage",
    category: "Pitch Night",
    desc: "Student founders pitch their raw startup ideas to angel backers, mentors, and fellow student builders looking for co-founders."
  },
  {
    id: "e2",
    title: "Co-Founder & Builder Speed Networking",
    date: "Wednesday, Sep 16",
    time: "6:30 PM - 8:00 PM",
    venue: "Student Hub Lounge",
    category: "Networking",
    desc: "Interactive speed-matching session connecting idea creators with top developers, UI/UX designers, and growth marketers."
  }
];

// Initial Requests connecting Vikram & Campus Angel to Priya's CampusKart
export const INITIAL_REQUESTS = [
  {
    id: "req_1",
    senderId: "user_vikram",
    senderName: "Vikram Singh",
    senderRole: "talent",
    receiverId: "user_priya",
    receiverName: "Priya Sharma",
    targetTitle: "CampusKart",
    message: "Hi Priya! I am a full-stack dev experienced with React & Node. I'd love to join CampusKart as a tech co-founder.",
    status: "accepted", // Accepted connection ready for messaging!
    createdAt: "Yesterday"
  },
  {
    id: "req_2",
    senderId: "user_backer",
    senderName: "Campus Angel Network",
    senderRole: "backer",
    receiverId: "user_priya",
    receiverName: "Priya Sharma",
    targetTitle: "CampusKart",
    message: "Greetings Priya! We like the peer-to-peer campus marketplace model of CampusKart. We would like to discuss micro-funding.",
    status: "pending", // Pending request for testing accept/reject!
    createdAt: "2 hours ago"
  }
];

// Initial Messages between Vikram & Priya
export const INITIAL_MESSAGES = [
  {
    id: "msg_1",
    requestId: "req_1",
    senderId: "user_vikram",
    senderName: "Vikram Singh",
    text: "Hey Priya, thanks for accepting my connection request! Have you already setup the database schema for CampusKart?",
    createdAt: "10:30 AM"
  },
  {
    id: "msg_2",
    requestId: "req_1",
    senderId: "user_priya",
    senderName: "Priya Sharma",
    text: "Hi Vikram! Great to connect. Yes, we have a basic mockup ready. Let's discuss building the React frontend & API this weekend!",
    createdAt: "10:35 AM"
  }
];

export const MAIN_WHATSAPP_LINK = "https://chat.whatsapp.com/BOgivVivG5ZLQ1OqoIl3wi?s=cl&p=a&mlu=4";

/* ==========================================================================
   MAIN APPLICATION COMPONENT
   ========================================================================== */

export default function App() {
  // Visitors begin at the role-selection page. The workspace only opens after sign-in.
  const [currentUser, setCurrentUser] = useState(null);

  // Data Collections — hide demo if flag set (for manual testing) + respect admin tombstones for deletable demos
  const hideDemoFlag = typeof window !== "undefined" && localStorage.getItem("startify_hide_demo") === "true";
  const getDeletedSet = (key) => { try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); } catch { return new Set(); } };
  const deletedBuilders = typeof window !== "undefined" ? getDeletedSet("startify_deleted_builders") : new Set();
  const deletedFunders = typeof window !== "undefined" ? getDeletedSet("startify_deleted_funders") : new Set();
  const deletedIdeaIds = typeof window !== "undefined" ? new Set((()=>{ try { return JSON.parse(localStorage.getItem("startify_submitted_ideas")||"[]").filter(x=>x.deleted).map(x=>x.id); } catch { return []; } })()) : new Set();
  const [ideas, setIdeas] = useState(hideDemoFlag ? [] : INITIAL_IDEAS.filter(i=> !deletedIdeaIds.has(i.id)));
  const [funders, setFunders] = useState(hideDemoFlag ? [] : INITIAL_FUNDERS.filter(f=> !deletedFunders.has(f.id)));
  const [builders, setBuilders] = useState(hideDemoFlag ? [] : INITIAL_BUILDERS.filter(b=> !deletedBuilders.has(b.id)));
  const [events, setEvents] = useState(hideDemoFlag ? [] : INITIAL_EVENTS);
  const [requests, setRequests] = useState(hideDemoFlag ? [] : INITIAL_REQUESTS);
  const [messages, setMessages] = useState(hideDemoFlag ? [] : INITIAL_MESSAGES);

  // Active Tab & Filters
  const [activeTab, setActiveTab] = useState("home"); // "home" | "ideas" | "talent" | "backers" | "events" | "dashboard" | "chats"
  const [ideaCategoryFilter, setIdeaCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Motivation quotes — pick one per session so it feels fresh each login
  const motivationalQuotes = [
    { text: "The best time to start was yesterday. The next best time is now.", author: "Every UoH founder who shipped" },
    { text: "You don't need permission to build something great.", author: "The startup mindset" },
    { text: "Self-reliance is the currency of builders.", author: "Startify" },
    { text: "An idea without execution is just a daydream. Ship it.", author: "Campus founders" },
    { text: "Your first version won't be perfect — and that's exactly the point.", author: "Lean startup wisdom" },
    { text: "Every large company started as two people with a whiteboard.", author: "UoHStartup" },
    { text: "Don't wait for the right team. Be the right person and attract them.", author: "Founder truth" },
    { text: "Constraints breed creativity. You have everything you need to start.", author: "Student builders" },
    { text: "A campus idea today is a real company tomorrow — if you act on it.", author: "Daksh Accelerator" },
    { text: "The only difference between a dreamer and a founder is the first commit.", author: "Startify" },
    { text: "Your network is your net worth — build both deliberately.", author: "Campus hustle" },
    { text: "Fail fast, learn faster, build forever.", author: "Startup DNA" },
    { text: "Independence isn't given — it's built, one decision at a time.", author: "Self-made founders" },
    { text: "The world rewards those who solve real problems, not those who wait for perfect plans.", author: "Builder's creed" },
    { text: "Start small. Stay consistent. The compound effect will do the rest.", author: "UoH startup culture" },
  ];
  const [dailyQuote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "register"
  const [selectedRegisterRole, setSelectedRegisterRole] = useState("founder"); // "founder" | "talent" | "backer"
  const [ideaModalOpen, setIdeaModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventAddModalOpen, setEventAddModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [profileAboutDraft, setProfileAboutDraft] = useState("");
  const [profileSkillsEditOpen, setProfileSkillsEditOpen] = useState(false);
  const [profileSkillsDraft, setProfileSkillsDraft] = useState("");
  const [profileRoleTitleDraft, setProfileRoleTitleDraft] = useState("");
  const [profileFocusDraft, setProfileFocusDraft] = useState("");
  const [showAllBuilders, setShowAllBuilders] = useState(false);
  const [showAllFunders, setShowAllFunders] = useState(false);
  const [showAllIdeas, setShowAllIdeas] = useState(false);
  const ideasScrollRef = useRef(null);
  const ideasScrollRefSignedIn = useRef(null);
  const [profileNameEditOpen, setProfileNameEditOpen] = useState(false);
  const [profileNameDraft, setProfileNameDraft] = useState("");
  // Profile popup (quick switch, no extra screen)
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [popupEditId, setPopupEditId] = useState(null);
  const [popupNameDraft, setPopupNameDraft] = useState("");
  const [popupAboutDraft, setPopupAboutDraft] = useState("");
  const [popupExtraDraft, setPopupExtraDraft] = useState("");
  const getDefaultAccount = () => {
    try { return JSON.parse(localStorage.getItem("startify_default_account") || "null"); } catch { return null; }
  };
  const setDefaultAccount = (email, role, id) => {
    try { localStorage.setItem("startify_default_account", JSON.stringify({ email: email.toLowerCase(), role, id })); } catch {}
  };
  const getSameEmailProfiles = (email) => {
    if (!email) return [];
    const lower = email.toLowerCase();
    try {
      const profiles = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
      const regs = JSON.parse(localStorage.getItem("startify_registrations") || "[]");
      const fromRegs = regs.filter(r=> (r.email||"").toLowerCase()===lower).map(r=>({ id: r.email, name: r.name, email: r.email, role: r.role==="builder"?"talent":r.role==="funder"?"backer":r.role, bio: r.ideaOrSkills || "", createdAt: r.registeredAt }));
      const combined = [...profiles.filter(p=> (p.email||"").toLowerCase()===lower), ...fromRegs];
      // dedupe by role, keep earliest created
      const byRole = new Map();
      [...combined, ...DEMO_USERS.filter(u=> (u.email||"").toLowerCase()===lower)].forEach(p=> {
        if (!byRole.has(p.role)) byRole.set(p.role, p);
      });
      return Array.from(byRole.values());
    } catch { return []; }
  };
  const savePopupProfileEdits = (profile) => {
    const name = popupNameDraft.trim() || profile.name;
    const about = popupAboutDraft.trim();
    try {
      const arr = JSON.parse(localStorage.getItem("startify_user_profiles")||"[]");
      const idx = arr.findIndex(p=> p.email.toLowerCase()===profile.email.toLowerCase() && p.role===profile.role);
      if (idx >= 0) {
        arr[idx].name = name;
        arr[idx].bio = about || arr[idx].bio || "";
        if (profile.role === "talent") arr[idx].skills = popupExtraDraft.trim() || arr[idx].skills || "";
        if (profile.role === "backer") arr[idx].focus = popupExtraDraft.trim() || arr[idx].focus || "";
        if (profile.role === "talent" && popupExtraDraft.trim()) arr[idx].roleTitle = popupExtraDraft.trim();
        localStorage.setItem("startify_user_profiles", JSON.stringify(arr));
      } else {
        arr.unshift({ id: profile.id || profile.email, name, email: profile.email.toLowerCase(), role: profile.role, bio: about, skills: profile.role==="talent"?popupExtraDraft.trim():"", focus: profile.role==="backer"?popupExtraDraft.trim():"", createdAt: new Date().toISOString() });
        localStorage.setItem("startify_user_profiles", JSON.stringify(arr));
      }
    } catch {}
    try {
      localStorage.setItem(getProfileAboutKey(profile.email), about);
    } catch {}
    if (currentUser && currentUser.email.toLowerCase()===profile.email.toLowerCase() && currentUser.role===profile.role) {
      setCurrentUser({ ...currentUser, name, bio: about || currentUser.bio, skills: profile.role==="talent" ? (popupExtraDraft.trim()||currentUser.skills) : currentUser.skills, focus: profile.role==="backer" ? (popupExtraDraft.trim()||currentUser.focus) : currentUser.focus });
    }
    setPopupEditId(null);
    showToast("✓ Profile updated");
  };
  const getProfileImageKey = (email) => `startify_profile_img_${email.toLowerCase()}`;
  const getProfileAboutKey = (email) => `startify_profile_about_${email.toLowerCase()}`;
  const getProfileImage = (email) => { try { return localStorage.getItem(getProfileImageKey(email)) || ""; } catch { return ""; } };
  const getProfileAbout = (email) => { try { return localStorage.getItem(getProfileAboutKey(email)) || ""; } catch { return ""; } };

  // Targets for Modals
  const [targetConnectItem, setTargetConnectItem] = useState(null);
  const [activeChatRequest, setActiveChatRequest] = useState(null);
  const [targetEvent, setTargetEvent] = useState(null);

  // Password + email link auth (Firebase)
  const [showPassword, setShowPassword] = useState(false);
  const [pendingBackers, setPendingBackers] = useState(() => {
    try { return JSON.parse(localStorage.getItem("startify_pending_backers") || "[]"); } catch { return []; }
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  // Form States
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    roleTitle: "",
    skills: "",
    focus: "",
    bio: ""
  });

  const [newIdeaForm, setNewIdeaForm] = useState({
    title: "",
    category: "Tech / AI",
    desc: "",
    seeking: "Tech Co-Founder"
  });

  const [connectForm, setConnectForm] = useState({ message: "" });
  const [chatInputText, setChatInputText] = useState("");
  const [eventRegisterForm, setEventRegisterForm] = useState({ name: "", email: "", contact: "" });
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    category: "Pitch Night",
    desc: "",
    thumbnail: "",
    organizer: "",
    capacity: "",
    eventType: "Offline",
    tags: "",
    link: ""
  });

  useEffect(() => {
    const hide = localStorage.getItem("startify_hide_demo")==="true";
    const loadIdeas = () => dbService.getIdeas(hide ? [] : INITIAL_IDEAS).then((data) => {
      if (data && data.length > 0) setIdeas(data);
    });
    loadIdeas();
    // Load admin-persisted talent/backers/events for launch
    try {
      const b = JSON.parse(localStorage.getItem("startify_admin_builders") || "null");
      if (b && Array.isArray(b) && b.length) setBuilders((prev) => [...b, ...prev]);
      const f = JSON.parse(localStorage.getItem("startify_admin_funders") || "null");
      if (f && Array.isArray(f) && f.length) setFunders((prev) => [...f, ...prev]);
      const ev = JSON.parse(localStorage.getItem("startify_events") || "null");
      if (ev && Array.isArray(ev) && ev.length) {
        const deletedIds = new Set(ev.filter(x=>x.deleted).map(x=>x.id));
        const filtered = ev.filter(x=>!x.deleted);
        setEvents((prev) => [...filtered, ...prev.filter(p=>!deletedIds.has(p.id))]);
      }
      const req = JSON.parse(localStorage.getItem("startify_requests") || "null");
      if (req && Array.isArray(req) && req.length) setRequests((prev) => [...req, ...prev]);
      const msgs = JSON.parse(localStorage.getItem("startify_messages") || "null");
      if (msgs && Array.isArray(msgs) && msgs.length) setMessages((prev) => [...msgs, ...prev]);
      const pb = JSON.parse(localStorage.getItem("startify_pending_backers") || "null");
      if (pb && Array.isArray(pb) && pb.length) setPendingBackers(pb);
    } catch {}
    // Live update when admin approves in another tab
    const onStorage = (e) => {
      if (!e.key || e.key === "startify_submitted_ideas" || e.key === "startify_events" || e.key === "startify_deleted_demos") {
        loadIdeas();
        try {
          const ev = JSON.parse(localStorage.getItem("startify_events") || "null");
          if (ev && Array.isArray(ev)) {
            const deletedIds = new Set(ev.filter(x=>x.deleted).map(x=>x.id));
            const filtered = ev.filter(x=>!x.deleted);
            setEvents((prev) => {
              const base = hide ? [] : INITIAL_EVENTS;
              const merged = [...filtered, ...base.filter(p=>!deletedIds.has(p.id))];
              const map = new Map(); merged.forEach(x=> map.set(x.id, x)); return Array.from(map.values());
            });
          }
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    const onVisible = () => { if (!document.hidden) loadIdeas(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { window.removeEventListener("storage", onStorage); document.removeEventListener("visibilitychange", onVisible); };
  }, []);

  useEffect(() => {
    try { localStorage.setItem("startify_pending_backers", JSON.stringify(pendingBackers)); } catch {}
  }, [pendingBackers]);

  // --- Password auth helpers (localStorage) ---
  const getCredentials = () => {
    try { return JSON.parse(localStorage.getItem("startify_credentials") || "{}"); } catch { return {}; }
  };
  const saveCredential = (email, password) => {
    try {
      const map = getCredentials();
      map[email.toLowerCase()] = password; // plain for demo — replace with hash if needed
      localStorage.setItem("startify_credentials", JSON.stringify(map));
    } catch {}
  };
  const checkCredential = (email, password) => {
    const map = getCredentials();
    return map[email.toLowerCase()] === password;
  };

  // --- Email helpers (Firebase password + link) ---
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const handleResendLink = async () => {
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password.trim();
    if (!isValidEmail(email)) { showToast("Enter a valid email first."); return; }
    if (!isSupabaseConfigured) { showToast("Email service not configured — set VITE_FIREBASE_* in Cloudflare Pages."); return; }
    if (!password || password.length < 6) { showToast("Enter your password (6+ chars) to resend link."); return; }
    setAuthLoading(true);
    try {
      await authService.resendVerification(email, password);
      showToast(`✓ Verification link resent to ${email} — check inbox & spam.`);
    } catch (err) { showToast(err?.message || "Failed to resend link."); }
    finally { setAuthLoading(false); }
  };
  const handleForgotPassword = async () => {
    const email = authForm.email.trim().toLowerCase();
    if (!isValidEmail(email)) { showToast("Enter your email above first."); return; }
    if (!isSupabaseConfigured) { showToast("Email service not configured."); return; }
    setAuthLoading(true);
    try {
      await authService.sendPasswordReset(email);
      showToast(`✓ Password reset link sent to ${email} — check inbox.`);
      setResetMode(false);
    } catch (err) { showToast(err?.message || "Failed to send reset link."); }
    finally { setAuthLoading(false); }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Helper: Require Login check
  const requireAuth = (callback) => {
    if (!currentUser) {
      showToast("Please sign in or register an account first!");
      setAuthModalOpen(true);
      return false;
    }
    return callback();
  };

  // Switch Current User (Demo Account Switcher)
  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    setActiveTab("home");
    showToast(`Logged in as ${user.name} (${user.role.toUpperCase()})`);
  };

  // Sign In / Registration Handler — UoH students must use @uohyd.ac.in (backer open to outside) + password (no OTP)
  const isUoHEmail = (email) => email.trim().toLowerCase().endsWith("@uohyd.ac.in");
  const completeRegistration = (newUser, targetRole) => {
    // Persist to unified profile store so same-email switching works
    try {
      const key="startify_user_profiles";
      const existing=JSON.parse(localStorage.getItem(key)||"[]");
      const derivedSid = newUser.email.split("@")[0].toUpperCase();
      const normalized={ id:newUser.id, name:newUser.name, email:newUser.email.toLowerCase(), role:newUser.role, studentId: derivedSid, roleTitle:newUser.roleTitle||"", skills:newUser.skills||"", focus:newUser.focus||"", bio:newUser.bio||"", createdAt:new Date().toISOString() };
      const filtered=existing.filter(p=> !(p.email.toLowerCase()===normalized.email.toLowerCase() && p.role===normalized.role));
      localStorage.setItem(key, JSON.stringify([normalized, ...filtered]));
    } catch {}
    // Save password for this email
    if (authForm.password) saveCredential(newUser.email, authForm.password);
    if (targetRole === "backer") {
      const pending = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        roleTitle: newUser.roleTitle,
        focus: newUser.focus,
        bio: newUser.bio,
        studentId: newUser.studentId,
        status: "pending_admin_approval",
        createdAt: new Date().toISOString(),
      };
      setPendingBackers((prev) => [pending, ...prev]);
      dbService.saveRegistration({ name: newUser.name, email: newUser.email, role: "funder", ideaOrSkills: newUser.focus || newUser.bio || "Backer", contact: "", registeredAt: new Date().toISOString().slice(0,10), status: "pending_admin_approval" });
      showToast(`Backer account "${newUser.name}" is pending admin approval. You'll be visible after approval.`);
      const pendingUser = { ...newUser, _backerPending: true };
      setCurrentUser(pendingUser);
      setActiveTab("home");
    } else {
      if (targetRole === "talent") {
        const newBuilder = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email.toLowerCase(),
            role: authForm.roleTitle || "Builder",
            skills: authForm.skills || "Development & Design",
            year: "Campus Builder",
            verifiedStudent: true,
            status: "Available for Collaboration"
          };
        setBuilders(prev=> [newBuilder, ...prev]);
        try {
          const existingB = JSON.parse(localStorage.getItem("startify_admin_builders")||"[]");
          localStorage.setItem("startify_admin_builders", JSON.stringify([newBuilder, ...existingB]));
        } catch {}
      }
      dbService.saveRegistration({ name: newUser.name, email: newUser.email, role: targetRole==="talent"?"builder":"founder", ideaOrSkills: targetRole==="talent"? (authForm.skills||"Talent") : "Founder", contact:"", registeredAt: new Date().toISOString().slice(0,10), status:"verified" });
      setCurrentUser(newUser);
      setActiveTab("home");
      showToast(`Registered as ${targetRole.toUpperCase()}! Welcome, ${newUser.name}.`);
    }
    setAuthModalOpen(false);
    setAuthForm({ name: "", email: "", password: "", roleTitle: "", skills: "", focus: "", bio: "" });
    setResetMode(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const targetRole = selectedRegisterRole;
    const email = authForm.email.trim();
    const password = authForm.password.trim();
    if (!password || password.length < 6) {
      showToast("Password must be at least 6 characters.");
      return;
    }
    if (authMode === "register" && (targetRole === "founder" || targetRole === "talent") && !isUoHEmail(email)) {
      showToast("Use your University of Hyderabad email ending in @uohyd.ac.in for Founder/Builder accounts. Backers can use any email.");
      return;
    }
    // Firebase password+link flow
    if (isSupabaseConfigured) {
      setAuthLoading(true);
      try {
        if (authMode === "register") {
          if (!authForm.name.trim()) { showToast("Please enter your full name."); return; }
          if ((targetRole === "founder" || targetRole === "talent") && !isUoHEmail(email)) {
            showToast("Founder/Builder requires @uohyd.ac.in. Use Backer for Gmail.");
            return;
          }
          try {
            const profiles = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
            if (profiles.some(p => p.email.toLowerCase()===email.toLowerCase() && p.role===targetRole)) {
              showToast("An account with this email and role already exists. Please Sign In.");
              return;
            }
          } catch {}
          try {
            await authService.signUp(email, password);
          } catch (signUpErr) {
            const signUpMsg = signUpErr?.message || "";
            // Same email, different role: Firebase Auth is email-unique, so reuse existing Firebase user
            if (signUpMsg.includes("email-already-in-use") || signUpMsg.includes("already-in-use")) {
              try {
                await authService.signIn(email, password);
                // Password matches existing Firebase account — allow adding second role locally
                try { await authService.signOut?.(); } catch {}
              } catch (signInErr) {
                const inMsg = signInErr?.message || "";
                if (inMsg.includes("verify your email")) {
                  // Email exists but unverified — allow adding role, user must still verify
                } else {
                  showToast("This email is already registered with a different password. Sign In first, then add another role from the name popup.");
                  return;
                }
              }
            } else {
              throw signUpErr;
            }
          }
          const pendingUser = {
            id: `user_${Date.now()}`,
            name: authForm.name.trim(),
            email,
            role: targetRole,
            studentId: email.split("@")[0].toUpperCase(),
            roleTitle: authForm.roleTitle,
            skills: authForm.skills,
            focus: authForm.focus,
            bio: authForm.bio
          };
          completeRegistration(pendingUser, targetRole);
          showToast(`✓ Verification link sent to ${email} — click it to activate, then Sign In.`);
          setAuthMode("signin");
          return;
        } else {
          // signin — demo accounts bypass Firebase verification for manual testing
          const demoUserEarly = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
          if (demoUserEarly) {
            const creds = getCredentials();
            const hasStored = !!creds[email.toLowerCase()];
            if (hasStored && !checkCredential(email, password)) { showToast("Incorrect password for demo account."); return; }
            if (!hasStored) saveCredential(email, password);
            setCurrentUser(demoUserEarly);
            setActiveTab("home");
            showToast(`Welcome back, ${demoUserEarly.name}! (Demo)`);
            setAuthModalOpen(false);
            setAuthForm({ name: "", email: "", password: "", roleTitle: "", skills: "", focus: "", bio: "" });
            setResetMode(false);
            return;
          }
          // pre-check: if email not in any local store, treat as wrong email (not wrong password)
          try {
            const profilesCheck = JSON.parse(localStorage.getItem("startify_user_profiles")||"[]");
            const regsCheck = JSON.parse(localStorage.getItem("startify_registrations")||"[]");
            const credsCheck = getCredentials();
            const existsLocally = DEMO_USERS.some(u=>u.email.toLowerCase()===email.toLowerCase()) || profilesCheck.some(p=>p.email.toLowerCase()===email.toLowerCase()) || regsCheck.some(r=>r.email.toLowerCase()===email.toLowerCase()) || !!credsCheck[email.toLowerCase()];
            if (!existsLocally) {
              // Still try Firebase, but if it fails with invalid-credential we will show wrong email below
              // To avoid Firebase quota, we can early return with correct message
              // Check if Firebase would know this email? We can't know without calling, so we let it try but map error correctly below
            }
          } catch {}
          // real Firebase signin — verify via emailVerified
          await authService.signIn(email, password);
          let existingProfile = null;
          try {
            const profiles = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
            const matches = profiles.filter(p => p.email.toLowerCase() === email.toLowerCase());
            // Default account first (user's chosen default), else first-created, else requested role
            const def = getDefaultAccount();
            if (def && def.email.toLowerCase() === email.toLowerCase()) {
              existingProfile = matches.find(p => p.role === def.role) || null;
            }
            if (!existingProfile) {
              existingProfile = matches.sort((a,b)=> new Date(a.createdAt||0) - new Date(b.createdAt||0))[0] || null;
            }
            if (!existingProfile) {
              existingProfile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase() && p.role === targetRole) || null;
            }
            if (!existingProfile) {
              const regsLocal = JSON.parse(localStorage.getItem("startify_registrations") || "[]");
              const r = regsLocal.find(r => r.email.toLowerCase() === email.toLowerCase());
              if (r) existingProfile = { id: r.email, name: r.name, email: r.email, role: r.role==="builder"?"talent":r.role==="funder"?"backer":r.role, bio: "" };
            }
          } catch {}
          if (existingProfile) {
            const reuseUser = { id: existingProfile.id, name: existingProfile.name || email.split("@")[0], email: existingProfile.email, role: existingProfile.role || targetRole, bio: existingProfile.bio || "", roleTitle: existingProfile.roleTitle, skills: existingProfile.skills, focus: existingProfile.focus };
            setCurrentUser(reuseUser);
            setActiveTab("home");
            showToast(`Welcome back, ${reuseUser.name}!`);
            setAuthModalOpen(false);
            setAuthForm({ name: "", email: "", password: "", roleTitle: "", skills: "", focus: "", bio: "" });
            setResetMode(false);
            return;
          }
          // Firebase verified but no local profile — create one from email
          const fbUser = { id: email, name: authForm.name || email.split("@")[0], email, role: targetRole, bio: "" };
          setCurrentUser(fbUser);
          setActiveTab("home");
          showToast(`Welcome, ${email}!`);
          setAuthModalOpen(false);
          setAuthForm({ name: "", email: "", password: "", roleTitle: "", skills: "", focus: "", bio: "" });
          return;
        }
      } catch (err) {
        const msg = err?.message || "Auth failed";
        if (msg.includes("email-already-in-use")) showToast("Email already registered — please Sign In or reset password.");
        else if (msg.includes("wrong-password") || msg.includes("invalid-credential") || msg.includes("INVALID_LOGIN_CREDENTIALS")) {
          let existsLocally = false;
          try {
            const pcs = JSON.parse(localStorage.getItem("startify_user_profiles")||"[]");
            const rcs = JSON.parse(localStorage.getItem("startify_registrations")||"[]");
            const ccs = getCredentials();
            existsLocally = DEMO_USERS.some(u=>u.email.toLowerCase()===email.toLowerCase()) || pcs.some(p=>p.email.toLowerCase()===email.toLowerCase()) || rcs.some(r=>r.email.toLowerCase()===email.toLowerCase()) || !!ccs[email.toLowerCase()];
          } catch {}
          if (!existsLocally) showToast("No account with this email — check spelling or Create Account.");
          else showToast("Incorrect password for this email. Use Forgot password?");
        }
        else if (msg.includes("verify your email")) showToast(msg);
        else if (msg.toLowerCase().includes("user-not-found") || msg.toLowerCase().includes("email not found")) showToast("No account with this email — check spelling or Create Account.");
        else showToast(msg);
        return;
      } finally { setAuthLoading(false); }
    }
    // Fallback local (no Firebase)
    const creds = getCredentials();
    const hasStoredPassword = !!creds[email.toLowerCase()];
    const demoUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (authMode === "signin") {
      if (demoUser) {
        if (hasStoredPassword && !checkCredential(email, password)) { showToast("Incorrect password."); return; }
        if (!hasStoredPassword) saveCredential(email, password);
        setCurrentUser(demoUser); setActiveTab("home"); showToast(`Welcome back, ${demoUser.name}!`);
        setAuthModalOpen(false); setAuthForm({ name: "", email: "", password: "", roleTitle: "", skills: "", focus: "", bio: "" }); setResetMode(false); return;
      }
      let existingProfile = null;
      try {
        const profiles = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
        existingProfile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase() && p.role === targetRole) || profiles.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
      } catch {}
      if (existingProfile) {
        if (hasStoredPassword && !checkCredential(email, password)) { showToast("Incorrect password. Click Forgot password?"); return; }
        if (!hasStoredPassword) saveCredential(email, password);
        const reuseUser = { id: existingProfile.id, name: existingProfile.name || email.split("@")[0], email: existingProfile.email, role: existingProfile.role || targetRole, bio: existingProfile.bio || "" };
        setCurrentUser(reuseUser); setActiveTab("home"); showToast(`Welcome back, ${reuseUser.name}!`);
        setAuthModalOpen(false); setAuthForm({ name: "", email: "", password: "", roleTitle: "", skills: "", focus: "", bio: "" }); setResetMode(false); return;
      }
      showToast("No account found for this email. Switch to Create Account."); return;
    }
    if (authMode === "register") {
      if (!authForm.name.trim()) { showToast("Please enter your full name."); return; }
      try {
        const profiles = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
        if (profiles.some(p => p.email.toLowerCase()===email.toLowerCase() && p.role===targetRole)) { showToast("An account with this email and role already exists. Please Sign In."); return; }
      } catch {}
      if (hasStoredPassword && !checkCredential(email, password)) { showToast("An account with this email already uses a different password."); return; }
      const derivedStudentId = email.split("@")[0].toUpperCase();
      const pendingUser = { id: `user_${Date.now()}`, name: authForm.name.trim(), email, role: targetRole, studentId: derivedStudentId, roleTitle: authForm.roleTitle, skills: authForm.skills, focus: authForm.focus, bio: authForm.bio };
      if ((pendingUser.role === "founder" || pendingUser.role === "talent") && !isUoHEmail(pendingUser.email)) { showToast("Founder/Builder requires @uohyd.ac.in."); return; }
      completeRegistration(pendingUser, targetRole);
    }
  };

  // Submit New Idea (Requires Login & Founder Role)
  const handleIdeaSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (currentUser.role !== "founder") {
      showToast("Only Founder accounts can post ideas.");
      setIdeaModalOpen(false);
      return;
    }

    const nowStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const newIdea = {
      id: `idea_${Date.now()}`,
      title: newIdeaForm.title,
      category: newIdeaForm.category,
      founderId: currentUser.id,
      founder: currentUser.name,
      email: currentUser.email.toLowerCase(),
      verifiedStudent: true,
      studentId: currentUser.email.split("@")[0].toUpperCase(),
      desc: newIdeaForm.desc,
      seeking: newIdeaForm.seeking,
      status: "Pending Review",
      createdDate: nowStr
    };

    dbService.saveIdea(newIdea);
    setIdeas([newIdea, ...ideas]);
    setIdeaModalOpen(false);
    showToast(`✓ Idea "${newIdeaForm.title}" sent for admin review.`);
    setNewIdeaForm({ title: "", category: "Tech / AI", desc: "", seeking: "Tech Co-Founder" });
  };

  const handleApproveIdea = (ideaId) => {
    const nowStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    setIdeas(
      ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, status: "Approved & Live", createdDate: nowStr } : idea
      )
    );
    try {
      const stored = JSON.parse(localStorage.getItem("startify_submitted_ideas")||"[]");
      const updated = stored.map(i=> i.id===ideaId ? {...i, status:"Approved & Live", createdDate: nowStr} : i);
      localStorage.setItem("startify_submitted_ideas", JSON.stringify(updated));
    } catch {}
    showToast("Idea approved and published to the board.");
  };

  const handleRejectIdea = (ideaId) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, status: "Rejected", createdDate: "Rejected" } : idea
      )
    );
    showToast("Idea rejected and removed from the public board.");
  };

  // Send Connection Request
  const handleConnectSubmit = (e) => {
    e.preventDefault();
    if (!currentUser || !targetConnectItem) return;

    const recipientId = targetConnectItem.founderId || targetConnectItem.id;
    const recipientName = targetConnectItem.founder || targetConnectItem.name;

    const newReq = {
      id: `req_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: recipientId,
      receiverName: recipientName,
      targetTitle: targetConnectItem.title || targetConnectItem.name,
      message: connectForm.message,
      status: "pending",
      createdAt: "Just now"
    };

    setRequests([newReq, ...requests]);
    setConnectModalOpen(false);
    showToast(`✓ Connection request sent to ${recipientName}!`);
    setConnectForm({ message: "" });
  };

  // Accept Connection Request
  const handleAcceptRequest = (reqId) => {
    setRequests(
      requests.map((r) => (r.id === reqId ? { ...r, status: "accepted" } : r))
    );
    showToast("Request accepted! You can now talk and message directly.");
  };

  // Reject Connection Request
  const handleRejectRequest = (reqId) => {
    setRequests(
      requests.map((r) => (r.id === reqId ? { ...r, status: "rejected" } : r))
    );
    showToast("Request declined.");
  };

  // Send Chat Message
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInputText.trim() || !activeChatRequest || !currentUser) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      requestId: activeChatRequest.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: chatInputText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setChatInputText("");
  };

  // Helpers to hide own profiles across same email (different role with same email should not see own other profile)
  const currentEmail = currentUser?.email?.toLowerCase() || "";
  const sameEmailIds = (() => {
    if (!currentEmail) return new Set();
    try {
      const profiles = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
      const ids = profiles.filter(p => p.email && p.email.toLowerCase() === currentEmail).map(p => p.id);
      const buildersLocal = JSON.parse(localStorage.getItem("startify_admin_builders") || "[]");
      buildersLocal.forEach(b => { if ((b.email||"").toLowerCase() === currentEmail) ids.push(b.id); });
      const fundersLocal = JSON.parse(localStorage.getItem("startify_admin_funders") || "[]");
      fundersLocal.forEach(f => { if ((f.email||"").toLowerCase() === currentEmail) ids.push(f.id); });
      const regsLocal = JSON.parse(localStorage.getItem("startify_registrations") || "[]");
      regsLocal.forEach(r => { if ((r.email||"").toLowerCase() === currentEmail) ids.push(r.email); ids.push(r.id || r.email); });
      // handle fake email user_...@uohyd.ac.in where id is local part
      if (currentEmail.startsWith("user_") && currentEmail.endsWith("@uohyd.ac.in")) {
        const fakeId = currentEmail.split("@")[0];
        ids.push(fakeId);
        const bFake = buildersLocal.find(b => b.id === fakeId);
        if (bFake && bFake.email) {
          const realEmail = bFake.email.toLowerCase();
          profiles.filter(p => p.email.toLowerCase() === realEmail).forEach(p=> ids.push(p.id));
          buildersLocal.filter(b=> (b.email||"").toLowerCase()===realEmail).forEach(b=> ids.push(b.id));
        }
      }
      if (currentUser?.id) ids.push(currentUser.id);
      ids.push(currentEmail);
      return new Set(ids);
    } catch { return new Set(currentUser?.id ? [currentUser.id, currentEmail] : []); }
  })();
  const isOwnIdea = (idea) => {
    if (!currentUser) return false;
    if (idea.founderId === currentUser.id) return true;
    if (idea.email && idea.email.toLowerCase() === currentEmail) return true;
    if (sameEmailIds.has(idea.founderId)) return true;
    return false;
  };
  const isOwnBuilder = (b) => {
    if (!currentUser) return false;
    if (b.id === currentUser.id) return true;
    if (b.email && b.email.toLowerCase() === currentEmail) return true;
    if (sameEmailIds.has(b.id)) return true;
    // legacy builders without email: match by name + same email profile name
    if (b.name === currentUser.name && currentEmail) {
      try {
        const profiles = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
        if (profiles.some(p => p.email.toLowerCase() === currentEmail && p.name === b.name && p.role === "talent")) return true;
      } catch {}
    }
    return false;
  };
  const isOwnFunder = (f) => {
    if (!currentUser) return false;
    if (f.id === currentUser.id) return true;
    if (f.email && f.email.toLowerCase() === currentEmail) return true;
    if (sameEmailIds.has(f.id)) return true;
    return false;
  };

  // Filtered Ideas — also hide own ideas from the public board (you see them in Dashboard)
  const filteredIdeas = ideas.filter((idea) => {
    if (idea.status === "Pending Review" || idea.status === "Rejected") return false;
    if (isOwnIdea(idea)) return false;
    const matchesCategory =
      ideaCategoryFilter === "All" || idea.category.toLowerCase().includes(ideaCategoryFilter.toLowerCase());
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.seeking.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.founder.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Self-filtered directories — deduped and never show own profile (same email across roles hidden)
  const dedupeByEmail = (arr) => {
    const seen = new Set();
    return arr.filter(item => {
      const key = (item.email || item.id || "").toString().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  const visibleBuilders = dedupeByEmail(builders.filter((b) => !isOwnBuilder(b)));
  const visibleFunders = dedupeByEmail(funders.filter((f) => !isOwnFunder(f)));

  // Role-based connection permissions
  // founder -> talent/backer | talent -> idea only | backer -> idea + talent | admin -> all
  const canConnect = (senderRole, targetKind) => {
    if (senderRole === "admin") return true;
    if (targetKind === "idea") return senderRole === "talent" || senderRole === "backer";
    if (targetKind === "builder") return senderRole === "founder" || senderRole === "backer";
    if (targetKind === "backer") return senderRole === "founder";
    return false;
  };

  // Role-based nav visibility: hide same-role hubs
  const showIdeasTab = !currentUser || currentUser.role === "admin" || currentUser.role === "talent" || currentUser.role === "backer";
  const showTalentTab = !currentUser || currentUser.role === "admin" || currentUser.role === "founder" || currentUser.role === "backer";
  const showBackersTab = !currentUser || currentUser.role === "admin" || currentUser.role === "founder";
  // Events visible to all logged-in roles
  const showEventsTab = !!currentUser;

  // User Dashboard Filtered Data
  const myIncomingRequests = requests.filter((r) => r.receiverId === currentUser?.id || sameEmailIds.has(r.receiverId));
  const myOutgoingRequests = requests.filter((r) => r.senderId === currentUser?.id || sameEmailIds.has(r.senderId));
  const myAcceptedConnections = requests.filter(
    (r) => (sameEmailIds.has(r.senderId) || sameEmailIds.has(r.receiverId) || r.senderId === currentUser?.id || r.receiverId === currentUser?.id) && r.status === "accepted"
  );
  const myIdeas = ideas.filter((i) => isOwnIdea(i));
  // Events: split into Upcoming / Past so past events stay visible but separate
  // parseEventDate handles "Saturday, Sep 12" (assumes current year) + ISO dates
  const parseEventDate = (ev) => {
    try {
      if (!ev?.date) return null;
      const m = String(ev.date).match(/([A-Za-z]+)\s+(\d{1,2})/);
      if (m) {
        const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
        const mon = monthMap[m[1].slice(0, 3).toLowerCase()];
        const day = parseInt(m[2], 10);
        if (mon !== undefined && !isNaN(day)) {
          const year = new Date().getFullYear();
          return new Date(year, mon, day);
        }
      }
      const d = new Date(ev.date);
      if (!isNaN(d.getTime())) return d;
    } catch {}
    return null;
  };
  const todayStart = (() => { const n = new Date(); n.setHours(0, 0, 0, 0); return n; })();
  const upcomingEvents = events
    .filter((ev) => { const d = parseEventDate(ev); return !d || d >= todayStart; })
    .sort((a, b) => {
      const da = parseEventDate(a), db = parseEventDate(b);
      if (da && db) return da - db;
      return 0;
    });
  const pastEvents = events
    .filter((ev) => { const d = parseEventDate(ev); return d && d < todayStart; })
    .sort((a, b) => parseEventDate(b) - parseEventDate(a));
  const dashboardGroups = currentUser?.role === "founder"
    ? [{ title: "Skilled talent", subtitle: "People ready to build alongside you", items: visibleBuilders, kind: "builder" }, { title: "Backers & mentors", subtitle: "People who can fund and guide you", items: visibleFunders, kind: "backer" }]
    : currentUser?.role === "backer"
      ? [{ title: "Founders & ideas", subtitle: "Early-stage opportunities to explore", items: ideas.filter((i) => !isOwnIdea(i)), kind: "idea" }, { title: "Talent & skills", subtitle: "People with capabilities behind strong teams", items: visibleBuilders, kind: "builder" }]
      : currentUser?.role === "talent"
        ? [{ title: "Founders & ideas", subtitle: "Teams looking for a builder like you", items: ideas.filter((i) => !isOwnIdea(i)), kind: "idea" }]
        : currentUser?.role === "admin"
          ? [{ title: "Founders & ideas", subtitle: "All live ideas", items: ideas, kind: "idea" }, { title: "Talent & skills", subtitle: "All builders", items: builders, kind: "builder" }]
          : [{ title: "Founders & ideas", subtitle: "Teams looking for collaborators", items: ideas, kind: "idea" }, { title: "Backers", subtitle: "Backers and mentors in the network", items: funders, kind: "backer" }];

  return (
    <div className="min-h-screen flex flex-col bg-[#202728] text-zinc-100 selection:bg-white selection:text-black">
      {/* Toast Notification — white on black, high contrast, no blur */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[70] bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-3 border border-white/10" style={{backdropFilter:"none", WebkitBackdropFilter:"none"}}>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0"></span>
          <span className="leading-5 text-white">{toastMessage}</span>
        </div>
      )}

      {/* NAVIGATION HEADER — light glass, not sticky on chats/profile, no overlap */}
      <nav className={`${activeTab==="chats" || activeTab==="profile" ? "relative" : "sticky top-0"} z-40 backdrop-blur-xl bg-white/75 border-b border-slate-200`}>
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 min-h-[72px] py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab(currentUser ? "dashboard" : "home")}>
            <img
              src={logoImg}
              alt="Startify Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-slate-500 whitespace-nowrap leading-none">
              <span className="font-bold tracking-widest uppercase">University of Hyderabad</span>
            </div>
          </div>

          {/* Header Action — Profile adjacent to Sign out on top, tab bar moved to bottom */}

          <div className="hidden md:flex items-center gap-3 shrink-0">
            {!currentUser ? (
              <button
                onClick={() => { setAuthMode("signin"); setAuthModalOpen(true); }}
                className="h-10 px-5 rounded-full border border-slate-200 bg-white text-slate-700 font-semibold text-[12.5px] hover:bg-slate-50 shadow-sm transition whitespace-nowrap"
              >
                Sign in
              </button>
            ) : (
              <div className="flex items-center gap-2 whitespace-nowrap">
                <button
                  onClick={() => { setPopupEditId(null); setProfilePopupOpen(true); }}
                  title="Switch profile / quick edit"
                  className="hidden lg:flex items-center gap-2.5 bg-white border border-slate-200 rounded-full pl-1 pr-3 py-1 shadow-sm hover:border-slate-400 hover:bg-slate-50 transition text-left"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 grid place-items-center text-[14px] shrink-0">👤</div>
                  <div className="min-w-0 text-left leading-none">
                    <div className="text-xs font-bold text-slate-800 truncate max-w-[90px]">{currentUser.name.split(" ")[0]}</div>
                    <div className="text-[11px] text-slate-500 truncate">{ROLE_META[currentUser.role]?.label || currentUser.role}</div>
                  </div>
                </button>
                <button
                  onClick={() => { setCurrentUser(null); setActiveTab("home"); showToast("Signed out"); }}
                  className="h-9 px-4 rounded-full bg-slate-900 text-white font-semibold text-xs hover:bg-black whitespace-nowrap shrink-0 shadow"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Mobile: name itself is profile button + Sign out on top */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
            {currentUser && <><button onClick={() => { setPopupEditId(null); setProfilePopupOpen(true); }} title="Switch profile / quick edit" className="h-9 px-3 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold whitespace-nowrap max-w-[110px] truncate">{currentUser.name.split(" ")[0]}</button><button onClick={() => { setCurrentUser(null); setActiveTab("home"); showToast("Signed out"); }} className="h-9 px-3 rounded-full bg-slate-900 text-white text-xs font-bold whitespace-nowrap">Sign out</button></>}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-10 w-10 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-700 shadow-sm shrink-0"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/90 backdrop-blur p-5 space-y-1 text-[14px]">
            <button onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === "home" ? "bg-slate-900 text-white" : "text-slate-700"}`}>Home</button>
            {currentUser && <>
              {showIdeasTab && <button onClick={() => { setActiveTab("ideas"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === "ideas" ? "bg-slate-900 text-white" : "text-slate-700"}`}>Ideas Board</button>}
              {showTalentTab && <button onClick={() => { setActiveTab("talent"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === "talent" ? "bg-slate-900 text-white" : "text-slate-700"}`}>Skilled Talent</button>}
              {showBackersTab && <button onClick={() => { setActiveTab("backers"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === "backers" ? "bg-slate-900 text-white" : "text-slate-700"}`}>Backers Hub</button>}
              {showEventsTab && <button onClick={() => { setActiveTab("events"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === "events" ? "bg-slate-900 text-white" : "text-slate-700"}`}>Events & Meetups</button>}
              <button onClick={() => { setActiveTab("chats"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-3 rounded-xl font-bold ${activeTab === "chats" ? "bg-slate-900 text-white" : "text-slate-700"}`}>Chats {myIncomingRequests.filter(r=>r.status==="pending").length>0 && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>} {myAcceptedConnections.length>0 && <span className="ml-1 text-xs bg-slate-200 px-1.5 py-0.5 rounded-full">{myAcceptedConnections.length}</span>}</button>
              <button onClick={() => { setActiveTab("profile"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === "profile" ? "bg-slate-900 text-white" : "text-slate-700"}`}>Profile</button>
            </>}
            {!currentUser && <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded-xl bg-slate-900 text-white font-bold">Join Startify →</button>}
          </div>
        )}
      </nav>

      {/* PUBLIC ENTRY: intentionally no ideas feed until the visitor chooses a role and joins. */}
      {activeTab === "home" && !currentUser && (
        <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-8 md:py-12 lg:py-16">
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6 md:gap-10 items-start lg:items-stretch">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs text-indigo-700 font-bold shadow-sm">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" /> Connect • Build • Launch
              </div>
              <h1 className="font-heading mt-5 max-w-[720px] text-[42px] leading-[1.02] font-extrabold tracking-tight md:text-[58px] text-slate-900">
                Find the people who can <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">move your idea forward.</span>
              </h1>
              <p className="mt-5 max-w-[620px] text-[16px] leading-7 text-slate-600">
                A space where ideas are validated, teams find their builders, and every skill finds a mission. Startify connects people, gives your ideas a team, and turns thoughts into real ventures.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
                <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">✓ Verified UoH community</span>
                <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">✓ Direct founder → talent connect</span>
                <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">✓ Chat after acceptance</span>
              </div>
              {/* Our belief — directly under hero as requested */}
              <div className="mt-8 rounded-[20px] bg-slate-900 p-5 md:p-6 border border-slate-800 shadow-md overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/20 to-fuchsia-600/20 pointer-events-none" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-bold tracking-widest text-white">OUR BELIEF</div>
                  <blockquote className="font-heading mt-3 text-[22px] md:text-[26px] font-extrabold leading-tight tracking-tight text-white">“If you can think it, you can build it.”</blockquote>
                  <p className="mt-2 text-[13px] leading-6 text-white">A platform that connects ideas with people, and people with purpose — where every idea gets space to be built, tested, and launched.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-full overflow-hidden">
              <div className="role-choice-panel rounded-[28px] border border-slate-200 bg-white p-5 sm:p-7 shadow-sm flex flex-col w-full max-w-full overflow-hidden">
                <div className="mb-4">
                  <div className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Choose how you participate</div>
                </div>
                <div className="space-y-4">
                  {[
                    ["Founder", "Post and manage ideas", "Meet verified UoH builders and campus backers.", "founder", "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm"],
                    ["Builder", "Build with ambitious teams", "Discover UoH founder ideas that need your skills.", "talent", "bg-white border-slate-200 hover:border-sky-300 hover:shadow-md shadow-sm"],
                    ["Backer", "Back promising people", "Browse UoH ideas and the talent behind them.", "backer", "bg-white border-slate-200 hover:border-violet-300 hover:shadow-md shadow-sm"],
                  ].map(([title, label, detail, role, cls]) => (
                    <button key={role} onClick={() => { setSelectedRegisterRole(role); setAuthMode("register"); setAuthModalOpen(true); }} className={`group w-full rounded-2xl border p-5 text-left transition ${cls}`}>
                      <div className="min-w-0"><div className="font-heading text-[16px] font-bold text-slate-800">{title} <span className="ml-1 text-[12px] font-medium text-slate-500">— {label}</span></div><p className="mt-1 text-[13px] leading-5 text-slate-600">{detail}</p></div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Ecosystem workflow — separate card: compact & horizontal */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5 shadow-sm w-full max-w-full overflow-hidden">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Ecosystem workflow</div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    ["→", "Create account", "Pick a role — Founder, Builder or Backer."],
                    ["→", "Send a request", "Pitch an idea or offer your skills."],
                    ["→", "Get accepted & chat", "Chat unlocks after acceptance."],
                  ].map(([n, t, d]) => (
                    <div key={t} className="flex gap-2.5 text-xs sm:text-[13px] items-start"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold text-black bg-white border border-slate-200 shadow-sm">{n}</span><div className="min-w-0"><div className="font-semibold text-slate-800 leading-tight">{t}</div><div className="text-slate-500 leading-4 text-[11px] sm:text-xs mt-0.5">{d}</div></div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Ideas on home — why Startify started — swipeable, placed high */}
          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading mt-1 text-[25px] font-extrabold text-slate-900">Ideas gaining momentum</h2>
                <p className="text-[13px] text-slate-600 mt-1">Real UoH student ideas looking for co-founders — swipe to explore, join to connect.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <button onClick={()=> ideasScrollRef.current?.scrollBy({left:-320, behavior:'smooth'})} className="h-9 w-9 rounded-full bg-white border border-slate-200 grid place-items-center text-slate-700 hover:bg-slate-900 hover:text-white transition" aria-label="Previous">‹</button>
                <button onClick={()=> ideasScrollRef.current?.scrollBy({left:320, behavior:'smooth'})} className="h-9 w-9 rounded-full bg-slate-900 text-white grid place-items-center hover:bg-black transition" aria-label="Next">›</button>
                <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }} className="h-9 px-4 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-black hidden lg:inline-flex items-center">Join to connect →</button>
              </div>
            </div>
            <div className="flex items-center justify-between sm:hidden mb-3 gap-2">
              <div className="flex gap-2">
                <button onClick={()=> ideasScrollRef.current?.scrollBy({left:-320, behavior:'smooth'})} className="h-8 w-8 rounded-full bg-white border border-slate-200 grid place-items-center text-slate-700">‹</button>
                <button onClick={()=> ideasScrollRef.current?.scrollBy({left:320, behavior:'smooth'})} className="h-8 w-8 rounded-full bg-slate-900 text-white grid place-items-center">›</button>
              </div>
              <span className="text-[11px] text-slate-500">Swipe →</span>
            </div>
            <div ref={ideasScrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide scroll-smooth" style={{scrollbarWidth:'none'}}>
              {[...ideas].filter(i=> i.status !== "Rejected").sort((a,b)=> {
                const getTime = (x)=> x.created_at?.seconds ? x.created_at.seconds*1000 : (x.created_at?.toMillis ? x.created_at.toMillis() : Date.parse(x.createdDate||0) || Number((x.id||'').split('_')[1]||0));
                return getTime(b) - getTime(a);
              }).slice(0,12).map((idea) => (
                <article key={idea.id} className="snap-start shrink-0 w-[300px] md:w-[360px] rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">{idea.category}</span>
                  </div>
                  <h3 className="font-heading mt-3 text-[18px] font-extrabold text-slate-800">{idea.title}</h3>
                  <p className="mt-1 text-[12px] font-medium text-slate-500">By {idea.founder}</p>
                  <p className="mt-3 text-[13px] leading-5 text-slate-600 line-clamp-3">{idea.desc}</p>
                  <div className="mt-3 text-[11px] font-semibold text-slate-600">Seeking: {idea.seeking}</div>
                </article>
              ))}
            </div>
            {ideas.length === 0 && <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-500">No ideas yet — be the first to post!</div>}
          </section>
        </main>
      )}

      {/* Signed-in Home is the shared community overview for every role. */}
      {activeTab === "home" && currentUser && (
        <main className="mx-auto max-w-[1200px] px-5 py-10 md:px-8 md:py-12">
          <div className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-200 p-7 shadow-sm md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-end"><div><div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-700">University of Hyderabad • An initiative for UoH students</div><h1 className="font-heading home-calligraphy mt-3 text-[34px] font-extrabold tracking-tight text-slate-800 md:text-[46px]">Good to see you, {currentUser.name.split(" ")[0]}.</h1><p className="mt-3 max-w-[650px] text-[15px] leading-6 text-slate-600">Your UoH community is actively connecting ideas, talent and support. Explore your dashboard for role-specific matches, or open Chats to continue a conversation.</p></div><div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm"><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">MOTIVATION OF THE DAY</div><blockquote className="font-heading mt-3 text-[22px] font-bold leading-tight text-slate-800">“{dailyQuote.text}”</blockquote><div className="mt-2 text-[11px] text-slate-500 italic">— {dailyQuote.author}</div><div className="mt-3 h-1 w-12 rounded-full bg-slate-700" /></div></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl border border-slate-200 bg-white/80 p-5"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Live ideas</div><div className="font-heading mt-2 text-3xl font-extrabold text-slate-800">{ideas.length}</div><p className="mt-1 text-[11px] text-slate-500">Projects looking for momentum</p></div><div className="rounded-2xl border border-slate-200 bg-white/80 p-5"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Active people</div><div className="font-heading mt-2 text-3xl font-extrabold text-slate-800">{builders.length + funders.length + ideas.length}</div><p className="mt-1 text-[11px] text-slate-500">Founders, talent, and funders</p></div><div className="rounded-2xl border border-slate-200 bg-white/80 p-5"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Connections made</div><div className="font-heading mt-2 text-3xl font-extrabold text-slate-800">{requests.filter((request) => request.status === "accepted").length}</div><p className="mt-1 text-[11px] text-slate-500">Conversations unlocked</p></div><div className="rounded-2xl border border-slate-200 bg-white/80 p-5"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Upcoming events</div><div className="font-heading mt-2 text-3xl font-extrabold text-slate-800">{events.length}</div><p className="mt-1 text-[11px] text-slate-500">Ways to meet the community</p></div></div>
          </div>
          <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">MARK YOUR CALENDAR</div><h2 className="font-heading mt-1 text-[25px] font-extrabold text-slate-800" style={{color: '#0f172a'}}>Upcoming community events</h2></div><button onClick={() => setActiveTab("home")} className="text-xs font-bold text-slate-700 hover:underline">Go to Chats →</button></div><div className="grid gap-5 md:grid-cols-2">{events.map((event) => <article key={event.id} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm" style={{background: 'rgba(255,255,255,0.92)'}}><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">{event.category}</span><span className="text-xs font-semibold text-slate-500">{event.date}</span></div><h3 className="font-heading mt-4 text-[19px] font-extrabold" style={{color: '#0f172a'}}>{event.title}</h3><p className="mt-2 text-[13px]" style={{color: '#475569'}}>{event.time} · {event.venue}</p><p className="mt-3 text-[13px] leading-5" style={{color: '#334155'}}>{event.desc}</p></article>)}</div></section>
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">IDEAS GAINING MOMENTUM</div>
                <h2 className="font-heading mt-1 text-[25px] font-extrabold text-slate-800">What the community is building</h2>
                <p className="text-[13px] text-slate-600 mt-1">Swipe to explore — founder or not, ideas need eyes.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <button onClick={()=> ideasScrollRefSignedIn.current?.scrollBy({left:-320, behavior:'smooth'})} className="h-9 w-9 rounded-full bg-white border border-slate-200 grid place-items-center text-slate-700 hover:bg-slate-900 hover:text-white" aria-label="Prev">‹</button>
                <button onClick={()=> ideasScrollRefSignedIn.current?.scrollBy({left:320, behavior:'smooth'})} className="h-9 w-9 rounded-full bg-slate-900 text-white grid place-items-center hover:bg-black" aria-label="Next">›</button>
                <button onClick={() => setActiveTab("home")} className="h-9 px-4 rounded-full bg-white border border-slate-200 text-xs font-bold hover:bg-slate-50">Dashboard →</button>
              </div>
            </div>
            <div className="flex sm:hidden items-center gap-2 mb-3">
              <button onClick={()=> ideasScrollRefSignedIn.current?.scrollBy({left:-320, behavior:'smooth'})} className="h-8 w-8 rounded-full bg-white border border-slate-200 grid place-items-center">‹</button>
              <button onClick={()=> ideasScrollRefSignedIn.current?.scrollBy({left:320, behavior:'smooth'})} className="h-8 w-8 rounded-full bg-slate-900 text-white grid place-items-center">›</button>
              <span className="text-[11px] text-slate-500">Swipe →</span>
            </div>
            <div ref={ideasScrollRefSignedIn} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth" style={{scrollbarWidth:'none'}}>
              {[...ideas].filter(i=> i.status !== "Rejected").sort((a,b)=> {
                const getTime = (x)=> x.created_at?.seconds ? x.created_at.seconds*1000 : (x.created_at?.toMillis ? x.created_at.toMillis() : Date.parse(x.createdDate||0) || Number((x.id||'').split('_')[1]||0));
                return getTime(b) - getTime(a);
              }).slice(0,12).map((idea) => (
                <article key={idea.id} className="snap-start shrink-0 w-[300px] md:w-[360px] rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">{idea.category}</span></div>
                  <h3 className="font-heading mt-4 text-[20px] font-extrabold text-slate-800">{idea.title}</h3>
                  <p className="mt-1 text-[12px] font-medium text-slate-500">By {idea.founder}</p>
                  <p className="mt-3 text-[13px] leading-5 text-slate-600 line-clamp-3">{idea.desc}</p>
                  <div className="mt-4 border-t border-slate-200 pt-3 text-[11px] font-semibold text-slate-600">Seeking: {idea.seeking}</div>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* HERO BANNER — only for Ideas board, not for Talent/Backers (those details live in Profile) */}
      {activeTab === "ideas" && (
        <section className="mx-auto max-w-[1200px] px-5 md:px-8 pt-8 pb-6">
          <div className="max-w-[760px] rounded-[24px] bg-white border border-slate-200 p-6 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              University of Hyderabad • Students Only Community
            </div>
            <h1 className="font-heading text-[30px] sm:text-[38px] md:text-[44px] font-extrabold leading-[1.08] tracking-tight mt-4 text-slate-900">
              Campus Ideas Board
            </h1>
            <p className="text-[14.5px] md:text-[15px] leading-[1.65] text-slate-600 mt-3 max-w-[620px]">
              Browse UoH student ideas — founder, builder and backer details live in your Profile. Connect directly after acceptance.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {currentUser?.role === "founder" && <button onClick={() => setIdeaModalOpen(true)} className="h-10 px-5 rounded-full bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow transition">Post Your Idea</button>}
              {currentUser && <button onClick={() => setActiveTab("home")} className="h-10 px-5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[13px] hover:bg-slate-50 shadow-sm transition">Open Chats</button>}
              {!currentUser && <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }} className="h-10 px-5 rounded-full bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow transition">Get Started</button>}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================================================
         TAB 1: IDEAS BOARD (FRONT PAGE SHOWCASE)
         ========================================================================== */}
      {activeTab === "ideas" && currentUser && (
        <section id="ideas" className="mx-auto max-w-[1200px] px-5 md:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                FEATURED STARTUP IDEAS
              </div>
              <h2 className="font-heading text-[28px] md:text-[36px] font-extrabold mt-1">
                Campus Ideas Board
              </h2>
              <p className="text-[13.5px] text-zinc-400 mt-1 max-w-[600px]">
                Browse raw and active startup ideas. Sign in to send connection requests and collaborate.
              </p>
            </div>

            {currentUser?.role === "founder" && <button
              onClick={() => setIdeaModalOpen(true)}
              className="h-10 px-5 rounded-full bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow transition shrink-0"
            >
              + Post Idea
            </button>}
          </div>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {["All", "Tech", "E-Commerce", "Food", "EdTech"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setIdeaCategoryFilter(cat)}
                  className={`h-9 px-4 rounded-full text-[12.5px] font-semibold transition border ${
                    ideaCategoryFilter === cat
                      ? "bg-white text-black border-white"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-[280px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ideas..."
                className="w-full h-10 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* Ideas Grid — filtered per role (never shows own ideas) */}
          {filteredIdeas.length === 0 ? (
            <div className="mt-8 rounded-[24px] border border-dashed border-slate-200 bg-white/70 py-10 text-center text-sm text-slate-500">
              {currentUser?.role === "founder"
                ? "Founders don't browse other founders here — your ideas live in Dashboard. Switch to Talent/Backer preview to see ideas."
                : "No ideas match your search right now."}
            </div>
          ) : (
          <>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {(showAllIdeas ? filteredIdeas : filteredIdeas.slice(0,6)).map((idea) => {
              const allowed = canConnect(currentUser.role, "idea");
              return (
              <div
                key={idea.id}
                className="rounded-[24px] border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-slate-300 transition border-glow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      {idea.category}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                      ✓ ID VERIFIED
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-[22px] mt-4 text-slate-900">
                    {idea.title}
                  </h3>

                  <div className="text-[12px] text-slate-500 mt-1 font-medium">
                    Founder: {idea.founder}
                  </div>

                  <p className="text-[14px] text-slate-600 leading-[1.6] mt-4">
                    {idea.desc}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[12px] text-slate-600">
                    <span className="font-semibold text-slate-900">Seeking:</span>{" "}
                    <span className="text-slate-800">{idea.seeking}</span>
                  </div>

                  {allowed ? (
                    <button
                      onClick={() =>
                        requireAuth(() => {
                          setTargetConnectItem(idea);
                          setConnectModalOpen(true);
                        })
                      }
                      className="h-10 px-5 rounded-full bg-slate-900 text-white text-[12.5px] font-bold hover:bg-black transition shrink-0"
                    >
                      Connect / Pitch →
                    </button>
                  ) : (
                    <span className="text-[11px] px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500">Connect available to Talent & Backers</span>
                  )}
                </div>
              </div>
            );})}
          </div>
          {filteredIdeas.length > 6 && (
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowAllIdeas(!showAllIdeas)} className="h-10 px-6 rounded-full bg-white border border-slate-200 text-sm font-semibold hover:bg-slate-50 shadow-sm">
                {showAllIdeas ? "Show less" : `Show all ${filteredIdeas.length} ideas →`}
              </button>
            </div>
          )}
          </>
          )}
        </section>
      )}

      {/* ==========================================================================
         TAB 2: SKILLED TALENT DIRECTORY
         ========================================================================== */}
      {activeTab === "talent" && currentUser && (
        <section id="talent" className="mx-auto max-w-[1200px] px-5 md:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                SKILLED BUILDERS DIRECTORY
              </div>
              <h2 className="font-heading text-[28px] md:text-[36px] font-extrabold mt-1">
                Campus Coders & Designers
              </h2>
              <p className="text-[13.5px] text-zinc-400 mt-1 max-w-[600px]">
                Connect with developers and designers looking to join startup teams.
              </p>
            </div>

            <button
              onClick={() => {
                setAuthMode("register");
                setSelectedRegisterRole("talent");
                setAuthModalOpen(true);
              }}
              className="h-10 px-5 rounded-full border border-slate-900 bg-slate-900 text-white font-semibold text-[13px] hover:bg-black transition shadow"
            >
              + Register as Skilled Talent
            </button>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleBuilders.length === 0 ? (
              <div className="col-span-full rounded-[22px] border border-dashed border-slate-200 bg-white/60 py-10 text-center text-sm text-slate-500">No other builders to show — you’re the only builder here (switch to Founder/Backer to see talent).</div>
            ) : (showAllBuilders ? visibleBuilders : visibleBuilders.slice(0,8)).map((b) => {
              const allowed = canConnect(currentUser.role, "builder");
              return (
              <div
                key={b.id}
                className="rounded-[22px] border border-slate-200 bg-white p-5 flex flex-col justify-between hover:border-slate-300 transition border-glow"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 grid place-items-center text-[20px] shrink-0">👤</div>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      ✓ STUDENT ID
                    </span>
                  </div>

                  <div className="font-heading font-bold text-[18px] mt-4 text-slate-900">
                    {b.name}
                  </div>
                  <div className="text-[12px] font-semibold text-slate-600 mt-0.5">
                    {b.role}
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[12px]">
                    <div className="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider">
                      Skills
                    </div>
                    <div className="text-slate-800 mt-1 font-medium">{b.skills}</div>
                  </div>
                </div>

                {allowed ? (
                  <button
                    onClick={() =>
                      requireAuth(() => {
                        setTargetConnectItem(b);
                        setConnectModalOpen(true);
                      })
                    }
                    className="mt-5 w-full h-9 rounded-full border border-slate-900 bg-slate-900 text-white text-[12px] font-semibold hover:bg-black transition"
                  >
                    Invite to Team →
                  </button>
                ) : (
                  <span className="mt-5 w-full h-9 grid place-items-center rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-500">Builders connect via Founders & Backers</span>
                )}
              </div>
            );})}
          </div>
          {visibleBuilders.length > 8 && (
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowAllBuilders(!showAllBuilders)} className="h-10 px-6 rounded-full bg-white border border-slate-200 text-sm font-semibold hover:bg-slate-50 shadow-sm">
                {showAllBuilders ? "Show less" : `Show all ${visibleBuilders.length} builders →`}
              </button>
            </div>
          )}
        </section>
      )}

      {/* ==========================================================================
         TAB 3: BACKERS HUB
         ========================================================================== */}
      {activeTab === "backers" && currentUser && (
        <section id="backers" className="mx-auto max-w-[1200px] px-5 md:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                BACKERS & MENTORS HUB
              </div>
              <h2 className="font-heading text-[28px] md:text-[36px] font-extrabold mt-1">
                Backers Directory
              </h2>
              <p className="text-[13.5px] text-zinc-400 mt-1 max-w-[600px]">
                Investors and alumni looking to back and mentor early stage ideas.
              </p>
            </div>

            <button
              onClick={() => {
                setAuthMode("register");
                setSelectedRegisterRole("backer");
                setAuthModalOpen(true);
              }}
              className="h-10 px-5 rounded-full border border-slate-900 bg-slate-900 text-white font-semibold text-[13px] hover:bg-black transition shadow"
            >
              + Register as Backer
            </button>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {visibleFunders.length === 0 ? (
              <div className="col-span-full rounded-[24px] border border-dashed border-slate-200 bg-white/60 py-10 text-center text-sm text-slate-500">No other backers to show — pitch flows founder → backer. Builders connect to backers via ideas, not directly.</div>
            ) : (showAllFunders ? visibleFunders : visibleFunders.slice(0,6)).map((f) => {
              const allowed = canConnect(currentUser.role, "backer");
              return (
              <div
                key={f.id}
                className="rounded-[24px] border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-slate-300 transition border-glow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 grid place-items-center text-[18px] shrink-0">👤</div>
                    <span className="text-[10.5px] font-bold px-3 py-1 rounded-full bg-slate-900 text-white">
                      {f.ticketSize}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-[20px] mt-4 text-slate-900">
                    {f.name}
                  </h3>
                  <div className="text-[12px] text-slate-500 font-medium">
                    {f.role}
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[12px]">
                    <span className="text-slate-500 font-semibold">Focus Areas:</span>{" "}
                    <span className="text-slate-800">{f.focus}</span>
                  </div>

                  <p className="text-[13.5px] text-slate-600 leading-[1.55] mt-4">
                    {f.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  {allowed ? (
                    <button
                      onClick={() =>
                        requireAuth(() => {
                          setTargetConnectItem(f);
                          setConnectModalOpen(true);
                        })
                      }
                      className="w-full h-10 rounded-full bg-slate-900 text-white text-[12.5px] font-bold hover:bg-black transition"
                    >
                      Pitch Idea to Backer →
                    </button>
                  ) : (
                    <span className="w-full h-10 grid place-items-center rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-500">Builders connect via ideas — backers review pitches from founders</span>
                  )}
                </div>
              </div>
            );})}
          </div>
          {visibleFunders.length > 6 && (
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowAllFunders(!showAllFunders)} className="h-10 px-6 rounded-full bg-white border border-slate-200 text-sm font-semibold hover:bg-slate-50 shadow-sm">
                {showAllFunders ? "Show less" : `Show all ${visibleFunders.length} backers →`}
              </button>
            </div>
          )}
        </section>
      )}

      {/* ==========================================================================
         TAB 4: EVENTS & MEETUPS
         ========================================================================== */}
      {activeTab === "events" && (
        <section id="events" className="mx-auto max-w-[1200px] px-5 md:px-8 py-12">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                MEETUPS & PITCH DAYS
              </div>
              <h2 className="font-heading text-[22px] sm:text-[26px] md:text-[32px] lg:text-[36px] font-extrabold mt-1 leading-tight text-balance">
                Community Events
              </h2>
              <p className="text-[13.5px] text-zinc-400 mt-1 max-w-[600px]">
                Present your idea or meet co-founders — in person, online, or hybrid.
              </p>
            </div>
            {currentUser?.role === "admin" && (
              <button
                onClick={() => setEventAddModalOpen(true)}
                className="h-10 px-5 rounded-full bg-white text-black font-bold text-[12.5px] hover:bg-zinc-200 transition"
              >
                + Add Event
              </button>
            )}
          </div>

          <div className="mt-8">
            <h3 className="font-heading font-extrabold text-lg text-slate-800 flex items-center gap-2">Upcoming <span className="text-xs font-normal text-slate-500">({upcomingEvents.length})</span></h3>
            {upcomingEvents.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-500">No upcoming events — create one!</div>
            ) : (
              <div className="mt-4 grid md:grid-cols-2 gap-6">
                {upcomingEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-[24px] border border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:border-slate-300 transition shadow-sm"
                    style={{color: '#0f172a'}}
                  >
                    {ev.thumbnail && <img src={ev.thumbnail} alt={ev.title} className="h-40 w-full object-cover" />}
                    <div className="p-6 flex-1 flex flex-col">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10.5px] font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 uppercase">{ev.category}</span>
                          <span className="text-[10.5px] font-bold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase">{ev.eventType || "Offline"}</span>
                        </div>
                        <div className="mt-2 text-[11px] text-slate-500 font-medium">{ev.date}</div>
                        <h3 className="font-heading font-extrabold text-[20px] mt-2" style={{color: '#0f172a'}}>{ev.title}</h3>
                        <div className="mt-3 space-y-1.5 text-[12.5px] text-slate-600">
                          <div>🕒 <strong>Time:</strong> {ev.time}</div>
                          {(!ev.eventType || ev.eventType === "Offline") && <div>📍 <strong>Venue:</strong> {ev.venue}</div>}
                          {ev.eventType === "Online" && (
                            <div>🔗 <strong>Join:</strong> {ev.link ? <a href={ev.link} target="_blank" rel="noreferrer" className="underline text-indigo-600 hover:text-indigo-800 break-all">{ev.link}</a> : "Online — link to be shared"}</div>
                          )}
                          {ev.eventType === "Hybrid" && (
                            <>
                              <div>📍 <strong>Venue:</strong> {ev.venue}</div>
                              {ev.link && <div>🔗 <strong>Online:</strong> <a href={ev.link} target="_blank" rel="noreferrer" className="underline text-indigo-600 break-all">{ev.link}</a></div>}
                            </>
                          )}
                          {ev.organizer && <div>👤 <strong>Organizer:</strong> {ev.organizer}</div>}
                          {ev.capacity && <div>👥 <strong>Capacity:</strong> {ev.capacity}</div>}
                          {ev.tags && <div>🔖 <strong>Tags:</strong> {ev.tags}</div>}
                        </div>
                        <p className="text-[13.5px] leading-[1.55] mt-4" style={{color: '#334155'}}>{ev.desc}</p>
                        {ev.link && ev.eventType !== "Offline" && (
                          <div className="mt-3 flex gap-2">
                            <a href={ev.link} target="_blank" rel="noreferrer" className="flex-1 h-9 grid place-items-center rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100">Join Online →</a>
                            <button onClick={()=>{ navigator.clipboard?.writeText(ev.link); showToast("Link copied"); }} className="h-9 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold">Copy</button>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
                        <button onClick={() => { requireAuth(() => { setTargetEvent(ev); setEventModalOpen(true); }); }} className="w-full h-10 rounded-full bg-slate-900 text-white text-[12.5px] font-bold hover:bg-slate-800 transition">RSVP for Event →</button>
                        {currentUser?.role==="admin" && (
                          <div className="flex gap-2">
                            <button onClick={()=>{
                              setEventForm({ title: ev.title, date: ev.date, time: ev.time, venue: ev.venue, category: ev.category, desc: ev.desc, thumbnail: ev.thumbnail||"", organizer: ev.organizer||"", capacity: ev.capacity||"", eventType: ev.eventType||"Offline", tags: ev.tags||"", link: ev.link||"" });
                              const next=events.filter(x=>x.id!==ev.id);
                              setEvents(next);
                              try{ localStorage.setItem("startify_events", JSON.stringify(next)); }catch{}
                              setEventAddModalOpen(true);
                            }} className="flex-1 h-8 rounded-full bg-white border border-slate-200 text-xs font-bold hover:bg-slate-50">Edit</button>
                            <button onClick={()=>{
                              if(!confirm(`Delete event ${ev.title}?`)) return;
                              const isSeed = INITIAL_EVENTS.some(s=>s.id===ev.id);
                              const next=events.filter(x=>x.id!==ev.id);
                              setEvents(next);
                              try{
                                const stored = JSON.parse(localStorage.getItem("startify_events")||"[]");
                                const filteredStored = stored.filter(x=>x.id!==ev.id);
                                if(isSeed) {
                                  localStorage.setItem("startify_events", JSON.stringify([{id:ev.id, deleted:true}, ...filteredStored]));
                                } else {
                                  localStorage.setItem("startify_events", JSON.stringify(next.filter(x=>INITIAL_EVENTS.every(s=>s.id!==x.id))));
                                }
                              }catch{}
                              showToast("Event deleted");
                            }} className="flex-1 h-8 rounded-full bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10">
            <h3 className="font-heading font-extrabold text-lg text-slate-800 flex items-center gap-2">Past Events <span className="text-xs font-normal text-slate-500">({pastEvents.length})</span></h3>
            {pastEvents.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white/50 py-6 text-center text-sm text-slate-500">No past events yet</div>
            ) : (
              <div className="mt-4 grid md:grid-cols-2 gap-6 opacity-90">
                {pastEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-[24px] border border-slate-200 bg-white overflow-hidden flex flex-col justify-between shadow-sm"
                    style={{color: '#0f172a'}}
                  >
                    {ev.thumbnail && <img src={ev.thumbnail} alt={ev.title} className="h-32 w-full object-cover grayscale-[30%]" />}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10.5px] font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 uppercase">{ev.category}</span>
                        <span className="text-[10.5px] font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 uppercase">Past • {ev.eventType || "Offline"}</span>
                      </div>
                      <h3 className="font-heading font-extrabold text-[18px] mt-2" style={{color: '#0f172a'}}>{ev.title}</h3>
                      <div className="mt-2 text-[12px] text-slate-500">{ev.date} • {ev.time} • {ev.eventType === "Online" ? "Online" : ev.venue}</div>
                      <p className="text-[13px] leading-[1.55] mt-3 line-clamp-2" style={{color: '#334155'}}>{ev.desc}</p>
                      {ev.link && ev.eventType !== "Offline" && (
                        <a href={ev.link} target="_blank" rel="noreferrer" className="mt-3 text-xs underline text-indigo-600 break-all">Recording / Link: {ev.link}</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* A separate inbox keeps interest-based conversations away from discovery. */}
      {activeTab === "chats" && currentUser && (
        <section className="mx-auto max-w-[1200px] px-5 py-10 md:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-700">University of Hyderabad • Private</div><h1 className="font-heading mt-3 text-[32px] font-extrabold text-slate-800">Your interest-based chats</h1><p className="mt-1 text-[13.5px] text-slate-500">Only accepted connections can start a conversation. Keep it respectful — this is a UoH student community.</p></div><div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-[11px] leading-4 text-amber-800 max-w-[320px]"><strong>Community note:</strong> Misuse of chat can lead to removal. Conversations are interest-based and require acceptance.</div></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myAcceptedConnections.map((req) => {
                const partnerName = req.senderId === currentUser.id ? req.receiverName : req.senderName;
                const partnerRole = req.senderId === currentUser.id ? req.receiverRole || "partner" : req.senderRole;
                const latest = messages.filter((m) => m.requestId === req.id).slice(-1)[0];
                return <button key={req.id} onClick={() => { setActiveChatRequest(req); setChatModalOpen(true); }} className="rounded-[22px] border border-slate-200 bg-white/80 p-5 text-left shadow-sm transition hover:border-slate-300"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 font-heading font-bold text-slate-700">{partnerName[0]}</div><div><div className="font-heading font-bold text-slate-800">{partnerName}</div><div className="text-[11px] uppercase tracking-wide text-slate-500">{partnerRole}</div></div></div><div className="mt-5 border-t border-slate-200 pt-4"><div className="text-[11px] font-semibold text-slate-500">Shared interest: {req.targetTitle}</div><p className="mt-2 line-clamp-2 text-[13px] text-slate-600">{latest ? latest.text : "Your connection is ready — send the first message."}</p></div></button>;
              })}
            </div>
            {myAcceptedConnections.length === 0 && <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center text-sm text-slate-500">No chats yet. Connect with a person whose work interests you, then chat once they accept.</div>}
            {/* Connection requests — received */}
            <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading font-extrabold text-lg text-slate-800">Requests received ({myIncomingRequests.length})</h3>
              <p className="text-xs text-slate-500 mt-1">People who sent you a connection request</p>
              <div className="mt-4 space-y-3">
                {myIncomingRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{req.senderName} <span className="text-xs font-normal text-slate-500">({req.senderRole})</span> → {req.targetTitle}</div>
                      <div className="text-xs text-slate-500 mt-1">{req.message}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {req.status === "pending" ? (
                        <>
                          <button onClick={()=> handleAcceptRequest(req.id)} className="h-8 px-4 rounded-full bg-slate-900 text-white text-xs font-bold">Accept</button>
                          <button onClick={()=> handleRejectRequest(req.id)} className="h-8 px-4 rounded-full bg-white border border-slate-200 text-xs font-bold">Decline</button>
                        </>
                      ) : req.status === "accepted" ? (
                        <button onClick={() => { setActiveChatRequest(req); setChatModalOpen(true); }} className="h-8 px-4 rounded-full bg-emerald-500 text-white text-xs font-bold">Chat →</button>
                      ) : (
                        <span className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200">{req.status}</span>
                      )}
                    </div>
                  </div>
                ))}
                {myIncomingRequests.length===0 && <div className="text-center py-6 text-xs text-slate-500">No received requests</div>}
              </div>
            </div>
            {/* Connection requests — sent */}
            <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading font-extrabold text-lg text-slate-800">Requests sent ({myOutgoingRequests.length})</h3>
              <p className="text-xs text-slate-500 mt-1">Requests you sent — chat unlocks after acceptance</p>
              <div className="mt-4 space-y-3">
                {myOutgoingRequests.map((req) => (
                  <div key={req.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">To: {req.receiverName}</div>
                      <div className="text-[11px] text-slate-500">Re: {req.targetTitle}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-1 rounded-full bg-white border">{req.status}</span>
                      {req.status === "accepted" && (
                        <button onClick={() => { setActiveChatRequest(req); setChatModalOpen(true); }} className="h-8 px-3 rounded-full bg-slate-900 text-white text-[11px] font-bold">Chat</button>
                      )}
                    </div>
                  </div>
                ))}
                {myOutgoingRequests.length===0 && <div className="text-center py-6 text-xs text-slate-500">No sent requests yet</div>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================================================
         TAB 5: ROLE-SPECIFIC DASHBOARD (FOR LOGGED IN USER)
         ========================================================================== */}
      {activeTab === "dashboard" && currentUser && (
        <section className="dashboard-surface mx-auto max-w-[1200px] px-5 md:px-8 py-10">
          {/* Manual test helpers — hide/show demo data */}
          {currentUser.role === "admin" && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button onClick={()=>{
                localStorage.setItem("startify_hide_demo","true");
                // remove demo ids from current state
                const demoIdeaIds = new Set(INITIAL_IDEAS.map(i=>i.id));
                const demoBuilderIds = new Set(INITIAL_BUILDERS.map(b=>b.id));
                const demoFunderIds = new Set(INITIAL_FUNDERS.map(f=>f.id));
                setIdeas(prev=>prev.filter(i=>!demoIdeaIds.has(i.id)));
                setBuilders(prev=>prev.filter(b=>!demoBuilderIds.has(b.id)));
                setFunders(prev=>prev.filter(f=>!demoFunderIds.has(f.id)));
                showToast("Demo data hidden — new accounts you create at /admin.html will remain. Reload to persist.");
              }} className="h-8 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">Hide demo data</button>
              <button onClick={()=>{
                localStorage.removeItem("startify_hide_demo");
                showToast("Demo hide cleared — reload page to restore demos");
                setTimeout(()=>window.location.reload(),800);
              }} className="h-8 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">Show demos again</button>
              <a href="/admin.html" target="_blank" className="h-8 px-3 rounded-full bg-slate-900 text-white text-xs font-bold grid place-items-center hover:bg-black">Open /admin.html → create test accounts</a>
            </div>
          )}
                    {/* Profile moved to Profile tab — dashboard now focuses on activity */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-extrabold text-slate-800">Dashboard</h2>
              <p className="text-sm text-slate-500">Track your ideas, incoming requests and chats. Edit your profile in the <button onClick={()=>setActiveTab("profile")} className="underline font-semibold text-slate-700 hover:text-slate-900">Profile</button> tab.</p>
            </div>
            {currentUser?.role === "founder" && (
              <button onClick={()=> setIdeaModalOpen(true)} className="h-10 px-5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-black shadow shrink-0">+ Post Idea</button>
            )}
          </div>

          {currentUser?._backerPending && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-500 text-white grid place-items-center font-bold shrink-0">!</div>
              <div>
                <div className="font-bold text-sm text-amber-900">Backer registration complete — pending admin approval</div>
                <div className="text-xs text-amber-800 mt-1">Admin will approve your backer ID shortly. You can browse ideas, but pitching & visibility in the Backers Hub will unlock after approval. For urgent approval, contact admin.</div>
              </div>
            </div>
          )}
          {currentUser.role !== "admin" && <div className={`mt-8 grid gap-6 ${dashboardGroups.length === 1 ? "lg:grid-cols-1 max-w-[640px]" : "lg:grid-cols-2"}`}>
            {dashboardGroups.map((group) => {
              const allowed = canConnect(currentUser.role, group.kind);
              return <section key={group.title} className="rounded-[24px] border border-slate-200 bg-white p-6">
              <div className="border-b border-slate-200 pb-4"><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">DISCOVER</div><h2 className="font-heading mt-1 text-[26px] font-extrabold text-slate-800">{group.title}</h2><p className="mt-1 text-[12px] text-slate-500">{group.subtitle} {group.kind === "backer" && currentUser.role === "talent" ? "· not needed for builders" : ""}</p></div>
              <div className="mt-4 space-y-3">{group.items.length === 0 ? <div className="py-6 text-center text-sm text-slate-500">Nothing to show here for your role right now.</div> : (group.kind === "builder" ? (showAllBuilders ? group.items : group.items.slice(0,3)) : group.kind === "backer" ? (showAllFunders ? group.items : group.items.slice(0,3)) : (showAllIdeas ? group.items : group.items.slice(0,3))).map((person) => { const isIdea = Boolean(person.title); const name = person.name || person.title; const detail = isIdea ? `${person.category} · ${person.founder}` : person.role || person.focus; return <div key={person.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="min-w-0 flex-1"><div className="truncate font-heading font-bold text-slate-800">{name}</div><div className="mt-0.5 truncate text-[11.5px] text-slate-500">{detail}</div></div>{allowed ? <button onClick={() => { setTargetConnectItem(person); setConnectModalOpen(true); }} className="w-full sm:w-auto shrink-0 rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-[11px] font-bold text-white hover:bg-slate-800 transition text-center">Connect</button> : <span className="shrink-0 text-[11px] text-slate-400 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-center">Via ideas</span>}</div>; })}</div>
              {group.items.length > 3 && (
                <div className="mt-3 flex justify-center">
                  <button onClick={() => {
                    if (group.kind === "builder") setShowAllBuilders(!showAllBuilders);
                    else if (group.kind === "backer") setShowAllFunders(!showAllFunders);
                    else setShowAllIdeas(!showAllIdeas);
                  }} className="h-8 px-4 rounded-full bg-white border border-slate-200 text-xs font-semibold hover:bg-slate-50">
                    {(group.kind === "builder" ? showAllBuilders : group.kind === "backer" ? showAllFunders : showAllIdeas) ? "Show less" : `Show all ${group.items.length} →`}
                  </button>
                </div>
              )}
            </section>;})}
          </div>}

          {currentUser.role === "admin" && <div className="mt-8 grid gap-5 sm:grid-cols-4"><div className="rounded-[22px] border border-white/10 bg-zinc-950 p-6"><div className="text-xs text-zinc-400">Ideas under review</div><div className="font-heading mt-2 text-3xl font-extrabold">{ideas.filter((idea) => idea.status === "Pending Review").length}</div></div><div className="rounded-[22px] border border-white/10 bg-zinc-950 p-6"><div className="text-xs text-zinc-400">Talent profiles</div><div className="font-heading mt-2 text-3xl font-extrabold">{builders.length}</div></div><div className="rounded-[22px] border border-white/10 bg-zinc-950 p-6"><div className="text-xs text-zinc-400">Funders (approved)</div><div className="font-heading mt-2 text-3xl font-extrabold">{funders.length}</div></div><div className="rounded-[22px] border border-amber-200 bg-amber-500 p-6 text-white"><div className="text-xs text-white/80">Backers pending approval</div><div className="font-heading mt-2 text-3xl font-extrabold">{pendingBackers.length}</div></div></div>}

          {currentUser.role === "admin" && (
            <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className="font-heading font-extrabold text-[24px] text-slate-800">Pending idea approvals</h3>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">{ideas.filter((idea) => idea.status === "Pending Review").length} pending</span>
              </div>
              <div className="mt-4 space-y-3">
                {ideas.filter((idea) => idea.status === "Pending Review").length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-500">No ideas waiting for review.</div>
                ) : (
                  ideas.filter((idea) => idea.status === "Pending Review").map((idea) => (
                    <div key={idea.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-heading text-[20px] font-bold text-slate-800">{idea.title}</div>
                        <div className="mt-1 text-[12px] text-slate-500">By {idea.founder} • {idea.category}</div>
                        <p className="mt-2 text-[13px] text-slate-600">{idea.desc}</p>
                      </div>
                      <div className="flex gap-2 md:flex-col">
                        <button onClick={() => handleApproveIdea(idea.id)} className="h-9 rounded-full bg-slate-100 border border-slate-200 px-4 text-[11px] font-bold text-slate-700 hover:bg-slate-200">Approve</button>
                        <button onClick={() => handleRejectIdea(idea.id)} className="h-9 rounded-full border border-slate-200 px-4 text-[11px] font-bold text-slate-600 hover:bg-slate-100">Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {currentUser.role === "admin" && (
            <div className="mt-8 rounded-[24px] border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-center justify-between border-b border-amber-200 pb-4">
                <h3 className="font-heading font-extrabold text-[24px] text-amber-900">Backers pending approval</h3>
                <span className="rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-bold">{pendingBackers.length} pending</span>
              </div>
              <p className="text-xs text-amber-800 mt-2">Backer IDs require your approval before they appear in the Backers Hub.</p>
              <div className="mt-4 space-y-3">
                {pendingBackers.length === 0 ? (
                  <div className="py-6 text-center text-sm text-amber-700">No backers pending — all verified.</div>
                ) : (
                  pendingBackers.map((b) => (
                    <div key={b.id} className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-heading text-[16px] font-bold text-slate-800">{b.name} <span className="text-xs font-normal text-slate-500">• {b.email}</span></div>
                        <div className="mt-1 text-[12px] text-slate-500">Focus: {b.focus || b.bio || "—"}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setFunders([{ id: b.id, name: b.name, email: b.email.toLowerCase(), role: b.roleTitle || "Angel Backer", focus: b.focus || "Tech & AI", bio: b.bio || "Approved backer.", ticketSize: "Pre-Seed & Seed" }, ...funders]);
                          setPendingBackers(pendingBackers.filter(x=>x.id!==b.id));
                          showToast(`✓ Approved backer: ${b.name}`);
                        }} className="h-9 rounded-full bg-slate-900 text-white px-4 text-[11px] font-bold hover:bg-slate-800">Approve →</button>
                        <button onClick={() => { setPendingBackers(pendingBackers.filter(x=>x.id!==b.id)); showToast("Rejected backer"); }} className="h-9 rounded-full border border-slate-200 px-4 text-[11px] font-bold text-slate-600">Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* DASHBOARD GRID */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {/* COLUMN 1: INCOMING REQUESTS (Accept / Decline Flow) */}
            <div className="space-y-6">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="min-w-0">
                    <h3 className="font-heading font-extrabold text-[20px] sm:text-[24px] text-slate-800">
                      {currentUser.role === "founder" ? "Requests for you & your startup ideas" : "Incoming connection requests"}
                    </h3>
                    <div className="text-[12px] text-slate-500">
                      {currentUser.role === "founder" ? "Requests sent directly to you or one of your startup ideas." : "People who would like to connect with your profile."}
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs shrink-0 self-start sm:self-auto">
                    {myIncomingRequests.length}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {myIncomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 text-[13.5px]">
                            {req.senderName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[10px] text-slate-700 uppercase font-bold border border-slate-200">
                            {req.senderRole}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-slate-500 mt-0.5">
                          Re: <strong>{req.targetTitle}</strong> • {req.createdAt}
                        </div>
                        <p className="text-[13px] text-slate-600 mt-2 bg-white p-3 rounded-xl border border-slate-200">
                          "{req.message}"
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                        {req.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleRejectRequest(req.id)}
                              className="h-8 px-3 rounded-full border border-slate-200 text-[11.5px] font-semibold text-slate-600 hover:bg-slate-100"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptRequest(req.id)}
                              className="h-8 px-4 rounded-full bg-slate-100 text-slate-700 text-[11.5px] font-bold hover:bg-slate-200"
                            >
                              ✓ Accept Request
                            </button>
                          </>
                        ) : req.status === "accepted" ? (
                          <span className="text-[11.5px] font-bold text-slate-700 flex items-center gap-2">
                            <span>✓ Accepted</span>
                            <button
                              onClick={() => {
                                setActiveChatRequest(req);
                                setChatModalOpen(true);
                              }}
                              className="h-8 px-4 rounded-full bg-slate-100 text-slate-700 text-[11.5px] font-bold hover:bg-slate-200"
                            >
                              Open Live Chat
                            </button>
                          </span>
                        ) : (
                          <span className="text-[11.5px] text-slate-500 font-medium">Declined</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {myIncomingRequests.length === 0 && (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No incoming connection requests yet. Switch demo accounts to test sending requests!
                    </div>
                  )}
                </div>
              </div>

              {/* OUTGOING REQUESTS */}
              <div className="rounded-[24px] border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h3 className="font-heading font-extrabold text-[24px] text-slate-800">
                    My Sent Requests
                  </h3>
                  <span className="text-xs text-slate-500">{myOutgoingRequests.length} total</span>
                </div>

                <div className="mt-4 space-y-3">
                  {myOutgoingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">To: {req.receiverName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Re: {req.targetTitle}</div>
                      </div>
                      <div>
                        {req.status === "accepted" ? (
                          <button
                            onClick={() => {
                              setActiveChatRequest(req);
                              setChatModalOpen(true);
                            }}
                            className="h-8 px-3.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] hover:bg-slate-200"
                          >
                            Chat Now
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10.5px] capitalize font-medium border border-slate-200">
                            {req.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {myOutgoingRequests.length === 0 && (
                    <div className="text-center py-6 text-zinc-500 text-xs">
                      You haven't sent any connection requests yet. Browse the Ideas or Backers directory to connect!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 2: ACTIVE CONNECTIONS & DIRECT CHATS */}
            <div className="space-y-6">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="min-w-0">
                    <h3 className="font-heading font-extrabold text-[20px] sm:text-[24px] text-slate-800">
                      Active Connections & Direct Chats
                    </h3>
                    <div className="text-[12px] text-slate-500">
                      Unlocked messaging with accepted partners.
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs shrink-0 self-start sm:self-auto">
                    {myAcceptedConnections.length} Active
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {myAcceptedConnections.map((req) => {
                    const partnerName =
                      req.senderId === currentUser.id ? req.receiverName : req.senderName;
                    const partnerRole =
                      req.senderId === currentUser.id ? req.receiverRole || "partner" : req.senderRole;

                      return (
                        <div
                          key={req.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition cursor-pointer"
                          onClick={() => {
                            setActiveChatRequest(req);
                            setChatModalOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 grid place-items-center text-[18px] shrink-0">👤</div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-800 text-[14px] truncate">
                                {partnerName}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                Topic: {req.targetTitle} • {partnerRole.toUpperCase()}
                              </div>
                            </div>
                          </div>

                          <button className="w-full sm:w-auto h-9 px-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[11.5px] border border-slate-200 hover:bg-slate-200 shrink-0">
                            Open Chat
                          </button>
                        </div>
                      );
                  })}

                  {myAcceptedConnections.length === 0 && (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No accepted connections yet. Accept an incoming request or send a request to start chatting!
                    </div>
                  )}
                </div>
              </div>

              {/* ROLE CONTENT (MY IDEAS FOR FOUNDER) */}
              {currentUser.role === "founder" && (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h3 className="font-heading font-extrabold text-[24px] text-slate-800">
                      My Posted Ideas ({myIdeas.length})
                    </h3>
                    <button
                      onClick={() => setIdeaModalOpen(true)}
                      className="text-xs text-slate-700 font-bold hover:underline"
                    >
                      + Add Idea
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {myIdeas.map((idea) => (
                      <div
                        key={idea.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 text-[14px]">{idea.title}</div>
                          <div className="text-[11.5px] text-slate-500 mt-0.5">
                            Category: {idea.category} • Seeking: {idea.seeking}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10.5px] text-slate-600 font-medium">
                          {idea.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PROFILE TAB — dedicated profile for any logged-in user */}
      {activeTab === "profile" && currentUser && (
        <section className="mx-auto max-w-[1200px] px-5 md:px-8 py-10">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-6 md:p-7">
            <div className="flex gap-3 sm:gap-4 items-start">
              {(() => {
                const img = getProfileImage(currentUser.email);
                return (
                  <div className="relative shrink-0">
                    {img ? (
                      <img src={img} alt={currentUser.name} className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                    ) : (
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-slate-100 border border-slate-200 grid place-items-center text-2xl sm:text-3xl">👤</div>
                    )}
                    <label className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white border border-slate-200 shadow-sm grid place-items-center text-[10px] font-bold text-slate-600 cursor-pointer hover:bg-slate-50" title="Upload photo">
                      Edit
                      <input type="file" accept="image/*" className="hidden" onChange={(e)=>{
                        const file=e.target.files[0];
                        if(!file) return;
                        if(file.size > 2*1024*1024){ showToast("Image max 2MB"); return; }
                        const reader=new FileReader();
                        reader.onload=()=>{
                          try{
                            localStorage.setItem(getProfileImageKey(currentUser.email), reader.result);
                            try{
                              const arr=JSON.parse(localStorage.getItem("startify_user_profiles")||"[]");
                              const idx=arr.findIndex(p=> p.email.toLowerCase()===currentUser.email.toLowerCase() && p.role===currentUser.role);
                              if(idx>=0){ arr[idx].profileImage=reader.result; localStorage.setItem("startify_user_profiles", JSON.stringify(arr)); }
                            }catch{}
                            showToast("✓ Photo updated");
                            setProfileSwitcherOpen(v=>v);
                          }catch{ showToast("Failed to save"); }
                        };
                        reader.readAsDataURL(file);
                      }}/>
                    </label>
                  </div>
                );
              })()}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-[22px] sm:text-[28px] font-extrabold leading-none text-slate-900">{currentUser.name}</h1>
                  <button onClick={()=>{ setProfileNameDraft(currentUser.name); setProfileNameEditOpen(true); }} className="h-7 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">Edit name</button>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${currentUser.role==="founder"?"bg-indigo-50 border-indigo-200 text-indigo-700":currentUser.role==="talent"?"bg-sky-50 border-sky-200 text-sky-700":currentUser.role==="backer"?"bg-violet-50 border-violet-200 text-violet-700":"bg-amber-50 border-amber-200 text-amber-700"}`}>{ROLE_META[currentUser.role]?.label || currentUser.role}</span>
                </div>
                <div className="mt-2 text-sm text-slate-600 break-all">{currentUser.email}</div>
                <div className="mt-1 text-xs text-slate-500">Student ID: <strong className="text-slate-700">{currentUser.email.split("@")[0].toUpperCase()}</strong> • {currentUser.role==="backer"?"Any email allowed":"@uohyd.ac.in verified"}</div>
                {(() => {
                  const about = getProfileAbout(currentUser.email) || currentUser.bio || "";
                  return (
                    <div className="mt-4">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-500">About</div>
                      {about ? <p className="mt-1 text-sm text-slate-700 leading-5 bg-slate-50 border border-slate-200 rounded-xl p-3">{about}</p> : <p className="text-sm text-slate-400 italic mt-1">No about yet</p>}
                      <button onClick={()=>{ setProfileAboutDraft(about); setProfileEditOpen(true); }} className="mt-2 h-8 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">{about ? "Edit about" : "Add about"}</button>
                    </div>
                  );
                })()}
                {currentUser.role === "talent" && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Skills & Role</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{currentUser.roleTitle || "Builder"}</div>
                    <div className="text-sm text-slate-600 mt-1 break-words">{currentUser.skills || "No skills added"}</div>
                    <button onClick={()=>{ setProfileRoleTitleDraft(currentUser.roleTitle||""); setProfileSkillsDraft(currentUser.skills||""); setProfileSkillsEditOpen(true); }} className="mt-3 h-8 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold">Edit skills</button>
                  </div>
                )}
                {currentUser.role === "backer" && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Focus</div>
                    <div className="text-sm text-slate-600 mt-1 break-words">{currentUser.focus || "No focus set"}</div>
                    <button onClick={()=>{ setProfileFocusDraft(currentUser.focus||""); setProfileSkillsEditOpen(true); }} className="mt-3 h-8 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold">Edit focus</button>
                  </div>
                )}
                {currentUser.role === "founder" && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Founder</div>
                    <p className="text-sm text-slate-600 mt-1">You can post ideas from Dashboard → Post New Idea. Your ideas appear in Ideas Board after approval.</p>
                  </div>
                )}
              </div>
            </div>
            {profileNameEditOpen && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-bold">Edit name</div>
                <input value={profileNameDraft} onChange={e=> setProfileNameDraft(e.target.value)} className="mt-2 w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none" />
                <div className="mt-3 flex justify-end gap-2">
                  <button onClick={()=> setProfileNameEditOpen(false)} className="h-9 px-4 rounded-full border border-slate-200 text-sm font-semibold">Cancel</button>
                  <button onClick={()=>{
                    const t=profileNameDraft.trim(); if(!t){ showToast("Name cannot be empty"); return; }
                    try{
                      const arr=JSON.parse(localStorage.getItem("startify_user_profiles")||"[]");
                      const idx=arr.findIndex(p=> p.email.toLowerCase()===currentUser.email.toLowerCase() && p.role===currentUser.role);
                      if(idx>=0){ arr[idx].name=t; localStorage.setItem("startify_user_profiles", JSON.stringify(arr)); }
                      try{
                        const regs=JSON.parse(localStorage.getItem("startify_registrations")||"[]");
                        const rIdx=regs.findIndex(r=> r.email.toLowerCase()===currentUser.email.toLowerCase());
                        if(rIdx>=0){ regs[rIdx].name=t; localStorage.setItem("startify_registrations", JSON.stringify(regs)); }
                      }catch{}
                      setCurrentUser({...currentUser, name:t});
                      setProfileNameEditOpen(false);
                      showToast("✓ Name updated");
                    }catch{ showToast("Failed"); }
                  }} className="h-9 px-5 rounded-full bg-slate-900 text-white text-sm font-bold">Save</button>
                </div>
              </div>
            )}
            {profileEditOpen && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-bold">Edit about</div>
                <textarea value={profileAboutDraft} onChange={e=> setProfileAboutDraft(e.target.value)} className="mt-2 w-full min-h-[100px] rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none" />
                <div className="mt-3 flex justify-end gap-2">
                  <button onClick={()=> setProfileEditOpen(false)} className="h-9 px-4 rounded-full border border-slate-200 text-sm">Cancel</button>
                  <button onClick={()=>{
                    try{
                      localStorage.setItem(getProfileAboutKey(currentUser.email), profileAboutDraft);
                      const arr=JSON.parse(localStorage.getItem("startify_user_profiles")||"[]");
                      const idx=arr.findIndex(p=> p.email.toLowerCase()===currentUser.email.toLowerCase() && p.role===currentUser.role);
                      if(idx>=0){ arr[idx].bio=profileAboutDraft; localStorage.setItem("startify_user_profiles", JSON.stringify(arr)); }
                      setCurrentUser({...currentUser, bio: profileAboutDraft});
                      setProfileEditOpen(false);
                      showToast("✓ About updated");
                    }catch{ showToast("Failed"); }
                  }} className="h-9 px-5 rounded-full bg-slate-900 text-white text-sm font-bold">Save</button>
                </div>
              </div>
            )}
            {profileSkillsEditOpen && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                {currentUser.role === "talent" ? (
                  <>
                    <div className="text-sm font-bold">Edit skills</div>
                    <input value={profileRoleTitleDraft} onChange={e=> setProfileRoleTitleDraft(e.target.value)} placeholder="Role title" className="mt-2 w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                    <input value={profileSkillsDraft} onChange={e=> setProfileSkillsDraft(e.target.value)} placeholder="Skills" className="mt-2 w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                    <div className="mt-3 flex justify-end gap-2">
                      <button onClick={()=> setProfileSkillsEditOpen(false)} className="h-9 px-4 rounded-full border">Cancel</button>
                      <button onClick={()=>{
                        try{
                          const emailLower=currentUser.email.toLowerCase();
                          setBuilders(prev=> prev.map(b=> (b.id===currentUser.id || (b.email && b.email.toLowerCase()===emailLower)) ? {...b, role: profileRoleTitleDraft.trim()||b.role, skills: profileSkillsDraft.trim()||b.skills } : b));
                          try{
                            const buildersLS=JSON.parse(localStorage.getItem("startify_admin_builders")||"[]");
                            const idx=buildersLS.findIndex(b=> b.id===currentUser.id || (b.email && b.email.toLowerCase()===emailLower));
                            if(idx>=0){ buildersLS[idx].role=profileRoleTitleDraft.trim()||buildersLS[idx].role; buildersLS[idx].skills=profileSkillsDraft.trim()||buildersLS[idx].skills; localStorage.setItem("startify_admin_builders", JSON.stringify(buildersLS)); }
                          }catch{}
                          const arr=JSON.parse(localStorage.getItem("startify_user_profiles")||"[]");
                          const pIdx=arr.findIndex(p=> p.email.toLowerCase()===emailLower && p.role===currentUser.role);
                          if(pIdx>=0){ arr[pIdx].roleTitle=profileRoleTitleDraft.trim(); arr[pIdx].skills=profileSkillsDraft.trim(); localStorage.setItem("startify_user_profiles", JSON.stringify(arr)); }
                          setCurrentUser({...currentUser, roleTitle: profileRoleTitleDraft.trim(), skills: profileSkillsDraft.trim()});
                          setProfileSkillsEditOpen(false);
                          showToast("✓ Skills updated");
                        }catch{ showToast("Failed"); }
                      }} className="h-9 px-5 rounded-full bg-slate-900 text-white text-sm font-bold">Save</button>
                    </div>
                  </>
                ) : currentUser.role === "backer" ? (
                  <>
                    <div className="text-sm font-bold">Edit focus</div>
                    <input value={profileFocusDraft} onChange={e=> setProfileFocusDraft(e.target.value)} className="mt-2 w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                    <div className="mt-3 flex justify-end gap-2">
                      <button onClick={()=> setProfileSkillsEditOpen(false)} className="h-9 px-4 rounded-full border">Cancel</button>
                      <button onClick={()=>{
                        try{
                          const arr=JSON.parse(localStorage.getItem("startify_user_profiles")||"[]");
                          const idx=arr.findIndex(p=> p.email.toLowerCase()===currentUser.email.toLowerCase() && p.role===currentUser.role);
                          if(idx>=0){ arr[idx].focus=profileFocusDraft.trim(); localStorage.setItem("startify_user_profiles", JSON.stringify(arr)); }
                          setCurrentUser({...currentUser, focus: profileFocusDraft.trim()});
                          setProfileSkillsEditOpen(false);
                          showToast("✓ Focus updated");
                        }catch{ showToast("Failed"); }
                      }} className="h-9 px-5 rounded-full bg-slate-900 text-white text-sm font-bold">Save</button>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </section>
      )}

      {/* PROFILE POPUP — quick switch + default + per-profile edit, no extra screen */}
      {profilePopupOpen && currentUser && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProfilePopupOpen(false)} />
          <div className="relative w-full max-w-[480px] rounded-[24px] bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 text-slate-800 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-heading font-extrabold text-[18px]">Switch profile</div>
                <div className="text-[12px] text-slate-500 mt-0.5 break-all">{currentUser.email}</div>
              </div>
              <button onClick={() => setProfilePopupOpen(false)} className="h-8 w-8 rounded-full border border-slate-200 grid place-items-center text-slate-500 hover:text-slate-800">✕</button>
            </div>
            <div className="mt-4 space-y-3">
              {getSameEmailProfiles(currentUser.email).map((p) => {
                const isActive = currentUser.role === p.role;
                const def = getDefaultAccount();
                const isDefault = def && def.email.toLowerCase() === p.email.toLowerCase() && def.role === p.role;
                const about = getProfileAbout(p.email) || p.bio || "";
                const editing = popupEditId === `${p.email}|${p.role}`;
                return (
                  <div key={`${p.email}|${p.role}`} className={`rounded-2xl border p-4 ${isActive ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{p.name || p.email.split("@")[0]} {isDefault && <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white">DEFAULT</span>}</div>
                        <div className="text-[11px] text-slate-500">{ROLE_META[p.role]?.label || p.role} • {p.email}</div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {!isActive && (
                          <button onClick={() => {
                            const full = { id: p.id || p.email, name: p.name || p.email.split("@")[0], email: p.email, role: p.role, bio: about, roleTitle: p.roleTitle, skills: p.skills, focus: p.focus };
                            setCurrentUser(full);
                            setProfilePopupOpen(false);
                            showToast(`Switched to ${ROLE_META[p.role]?.label || p.role}`);
                          }} className="h-8 px-3 rounded-full bg-slate-900 text-white text-xs font-bold">Switch</button>
                        )}
                        {!isDefault && (
                          <button onClick={() => { setDefaultAccount(p.email, p.role, p.id); showToast(`✓ Default set to ${ROLE_META[p.role]?.label || p.role} — logs in first`); }} className="h-8 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold">Default</button>
                        )}
                      </div>
                    </div>
                    {!editing ? (
                      <div className="mt-2">
                        {about ? <p className="text-xs text-slate-600 leading-4 line-clamp-2">{about}</p> : <p className="text-xs text-slate-400 italic">No about yet</p>}
                        {p.role === "talent" && <p className="text-[11px] text-slate-500 mt-1">Skills: {p.skills || p.roleTitle || "—"}</p>}
                        {p.role === "backer" && <p className="text-[11px] text-slate-500 mt-1">Focus: {p.focus || "—"}</p>}
                        <button onClick={() => { setPopupEditId(`${p.email}|${p.role}`); setPopupNameDraft(p.name || ""); setPopupAboutDraft(about); setPopupExtraDraft(p.role === "talent" ? (p.skills || "") : p.role === "backer" ? (p.focus || "") : ""); }} className="mt-2 h-7 px-3 rounded-full bg-white border border-slate-200 text-[11px] font-bold">Edit {ROLE_META[p.role]?.label || p.role}</button>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        <input value={popupNameDraft} onChange={e=> setPopupNameDraft(e.target.value)} placeholder="Full name" className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none" />
                        <textarea value={popupAboutDraft} onChange={e=> setPopupAboutDraft(e.target.value)} placeholder={p.role === "founder" ? "What do you build?" : p.role === "talent" ? "About you + stack" : "What do you fund?"} className="w-full min-h-[64px] rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none" />
                        {p.role === "talent" && <input value={popupExtraDraft} onChange={e=> setPopupExtraDraft(e.target.value)} placeholder="Skills e.g. React, Node.js" className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none" />}
                        {p.role === "backer" && <input value={popupExtraDraft} onChange={e=> setPopupExtraDraft(e.target.value)} placeholder="Focus e.g. EdTech, AI" className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none" />}
                        <div className="flex justify-end gap-2">
                          <button onClick={()=> setPopupEditId(null)} className="h-8 px-3 rounded-full border border-slate-200 text-xs">Cancel</button>
                          <button onClick={()=> savePopupProfileEdits(p)} className="h-8 px-4 rounded-full bg-slate-900 text-white text-xs font-bold">Save</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-center text-[11px] text-slate-400">Full profile lives in the bottom Profile tab</p>
          </div>
        </div>
      )}

      {/* BOTTOM TAB BAR — text only, no emojis, for logged-in users */}
      {currentUser && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="mx-auto max-w-[1200px] px-2 sm:px-6 h-[60px] flex items-center justify-around sm:justify-center gap-1 sm:gap-2 overflow-x-auto">
            <button onClick={() => setActiveTab("home")} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${activeTab === "home" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
              Home
            </button>
            {showIdeasTab && (
              <button onClick={() => setActiveTab("ideas")} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${activeTab === "ideas" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                Ideas
              </button>
            )}
            {showTalentTab && (
              <button onClick={() => setActiveTab("talent")} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${activeTab === "talent" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                Talent
              </button>
            )}
            {showBackersTab && (
              <button onClick={() => setActiveTab("backers")} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${activeTab === "backers" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                Backers
              </button>
            )}
            {showEventsTab && (
              <button onClick={() => setActiveTab("events")} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${activeTab === "events" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                Events
              </button>
            )}
            <button onClick={() => setActiveTab("chats")} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition relative ${activeTab === "chats" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
              Chats
              {myIncomingRequests.filter(r=>r.status==="pending").length>0 && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>}
            </button>
            <button onClick={() => setActiveTab("profile")} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${activeTab === "profile" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
              Profile
            </button>
          </div>
        </nav>
      )}
      {/* Spacer for bottom nav so footer stays visible when scrolling up */}
      {currentUser && <div className="h-[76px] shrink-0" />}

      {/* FOOTER — only for logged-out visitors, hidden when logged in */}
      {!currentUser && (
      <footer className="border-t border-slate-200 bg-white text-slate-500 py-10">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[12.5px]">
          <div className="flex items-center gap-3.5">
            <img
              src={logoImg}
              alt="Startify Logo"
              className="h-9 w-auto object-contain"
            />
            <div>
              <span className="text-zinc-500">© {new Date().getFullYear()}</span>
            </div>
          </div>

          <div className="text-zinc-500 text-center md:text-left text-[11.5px]">
            An initiative for <strong className="text-slate-600">University of Hyderabad</strong> students • <a href="/admin.html" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">Admin</a>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={MAIN_WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-4 grid place-items-center rounded-full bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition whitespace-nowrap"
            >
              WhatsApp Group
            </a>
          </div>
        </div>
      </footer>
      )}

      {/* ==========================================================================
         MODALS
         ========================================================================== */}

      {/* MODAL 1: AUTH / SIGN IN / SINGLE ROLE REGISTRATION */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setAuthModalOpen(false)}
          />
          <div className="relative w-full max-w-[560px] rounded-[28px] overflow-hidden bg-white border border-slate-200 shadow-2xl text-slate-800 my-4 max-h-[90vh] overflow-y-auto">
            {/* Clean header — no color background */}
            <div className="bg-white p-6 sm:p-7 border-b border-slate-200 relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <img src={logoImg} alt="Startify" className="h-8 w-auto object-contain" />
                  <div className="font-heading font-extrabold text-[22px] sm:text-[24px] mt-3 leading-tight text-slate-900">
                    {authMode === "signin" ? "Welcome back to Startify" : "Join the builders"}
                  </div>
                  <p className="text-[12.5px] text-slate-600 mt-1.5 leading-5 max-w-[380px]">
                    {authMode === "signin" ? "Sign in and continue where you left off." : "A space to connect, build, and launch — where every idea finds its team."}
                  </p>
                </div>
                <button
                  onClick={() => setAuthModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 grid place-items-center text-slate-600 hover:bg-slate-200 shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-7">
            {/* Mode Switcher Buttons */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-semibold text-center">
              <button
                onClick={() => setAuthMode("signin")}
                className={`py-2 rounded-full transition ${
                  authMode === "signin" ? "bg-white text-slate-900 font-bold shadow-sm border border-slate-200" : "text-slate-500"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`py-2 rounded-full transition ${
                  authMode === "register" ? "bg-slate-900 text-white font-bold shadow-sm border border-slate-900" : "text-slate-500"
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-5 space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                    Choose your role — <span className="font-normal text-slate-500">one role per student</span> *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {[
                      ["founder", "Founder", "Post ideas"],
                      ["talent", "Builder", "Build teams"],
                      ["backer", "Backer", "Fund people"],
                    ].map(([role, label, sub]) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRegisterRole(role)}
                        className={`p-2.5 sm:p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 min-h-[68px] sm:min-h-[74px] w-full max-w-full overflow-hidden ${
                          selectedRegisterRole === role
                            ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02]"
                            : "bg-slate-50 text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-white shadow-sm"
                        }`}
                      >
                        <span className={`text-[11px] sm:text-[13px] font-bold leading-none break-words ${selectedRegisterRole === role ? "text-white" : "text-slate-900"}`}>{label}</span>
                        <span className={`text-[9px] sm:text-[11px] leading-none break-words font-medium ${selectedRegisterRole === role ? "text-white/80" : "text-slate-600"}`}>{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {authMode === "register" && (
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="Your Full Name"
                    className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                  Email Address * {selectedRegisterRole === "backer" ? <span className="font-normal text-slate-500">— any email</span> : <span className="font-normal text-indigo-600">— @uohyd.ac.in</span>}
                </label>
                <input
                  required
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder={selectedRegisterRole === "backer" ? "name@company.com (any domain)" : "name@uohyd.ac.in"}
                  className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
                <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                  {selectedRegisterRole === "backer"
                    ? "Backers may be outside UoH — any verified email works."
                    : "Founder & Builder accounts are UoH-only."}
                </p>
              </div>



              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                  {resetMode ? "New Password * — min 6 characters" : <>Password * <span className="font-normal text-slate-400">— min 6 characters</span></>}
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    placeholder={resetMode ? "Enter new password" : authMode === "signin" ? "Enter your password" : "Create a password"}
                    className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 pr-12 text-[13px] text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button type="button" onClick={()=> setShowPassword(!showPassword)} className="absolute right-1.5 top-1.5 h-8 px-3 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {authMode==="signin" && (
                  <button type="button" onClick={handleForgotPassword} className="mt-1.5 text-[11px] text-indigo-600 hover:underline font-semibold">Forgot password? Send reset link →</button>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-12 rounded-full bg-slate-900 text-white font-bold text-[14px] hover:bg-black transition shadow-md disabled:opacity-50"
              >
                {authLoading ? "Please wait..." : authMode === "signin" ? "Sign In & Continue →" : `Create ${selectedRegisterRole.toUpperCase()} Account →`}
              </button>
              <div className="rounded-2xl border border-slate-900 bg-white p-3 flex items-start gap-2.5 shadow-sm">
                <span className="h-6 w-6 rounded-full bg-emerald-500 text-white grid place-items-center text-[11px] shrink-0">✓</span>
                <div className="text-[11px] leading-4 text-slate-900"><strong className="text-black">Verified community</strong> — connect and collaborate with confidence.</div>
              </div>
              <p className="text-center text-[11px] text-slate-400">Be respectful — misuse leads to removal. Ecosystem workflow guides every collaboration.</p>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: POST STARTUP IDEA */}
      {ideaModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setIdeaModalOpen(false)}
          />
          <div className="relative w-full max-w-[480px] rounded-[28px] bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="font-heading font-extrabold text-[22px]">
                  Post Startup Idea
                </div>
                <div className="text-[12px] text-slate-500 mt-0.5">
                  Posting as <strong>{currentUser?.name}</strong> • No ID needed — just your vision
                </div>
              </div>
              <button
                onClick={() => setIdeaModalOpen(false)}
                className="h-8 w-8 rounded-full border border-slate-200 grid place-items-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIdeaSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                  Idea / Project Title *
                </label>
                <input
                  required
                  value={newIdeaForm.title}
                  onChange={(e) => setNewIdeaForm({ ...newIdeaForm, title: e.target.value })}
                  placeholder="e.g. CampusKart, StudyBuddy AI..."
                  className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={newIdeaForm.category}
                    onChange={(e) => setNewIdeaForm({ ...newIdeaForm, category: e.target.value })}
                    className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400"
                  >
                    <option>Tech / AI</option>
                    <option>E-Commerce / D2C</option>
                    <option>Food & Services</option>
                    <option>EdTech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                    Seeking Role
                  </label>
                  <select
                    value={newIdeaForm.seeking}
                    onChange={(e) => setNewIdeaForm({ ...newIdeaForm, seeking: e.target.value })}
                    className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400"
                  >
                    <option>Tech Co-Founder</option>
                    <option>UI/UX Designer</option>
                    <option>Growth Lead</option>
                    <option>Pre-Seed Backer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                  Idea Description & Vision *
                </label>
                <textarea
                  required
                  value={newIdeaForm.desc}
                  onChange={(e) => setNewIdeaForm({ ...newIdeaForm, desc: e.target.value })}
                  placeholder="Describe your startup idea in 2-3 clear sentences..."
                  className="w-full min-h-[90px] rounded-[20px] bg-slate-50 border border-slate-200 p-4 text-[13px] text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-slate-900 text-white font-bold text-[14px] hover:bg-slate-800 transition"
              >
                Publish Idea to Board →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SEND CONNECTION REQUEST */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setConnectModalOpen(false)}
          />
          <div className="relative w-full max-w-[440px] rounded-[28px] bg-zinc-950 border border-white/20 shadow-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="font-heading font-extrabold text-[20px]">
                  Send Connection Request
                </div>
                <div className="text-[12px] text-slate-500 mt-0.5">
                  To: <strong>{targetConnectItem?.founder || targetConnectItem?.name}</strong> ({targetConnectItem?.title || targetConnectItem?.role})
                </div>
              </div>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="h-8 w-8 rounded-full border border-slate-200 grid place-items-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                  Introduction / Proposal Message *
                </label>
                <textarea
                  required
                  value={connectForm.message}
                  onChange={(e) => setConnectForm({ ...connectForm, message: e.target.value })}
                  placeholder={`Hi! I am logged in as ${currentUser?.name} (${currentUser?.role.toUpperCase()}). I'd love to connect regarding ${targetConnectItem?.title || targetConnectItem?.name}...`}
                  className="w-full min-h-[110px] rounded-[20px] bg-zinc-900 border border-white/15 p-4 text-[13px] text-white outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-slate-900 text-white font-bold text-[14px] hover:bg-slate-800 transition"
              >
                Send Request →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DIRECT CHAT / LIVE MESSAGING MODAL — light theme, UoH misuse note */}
      {chatModalOpen && activeChatRequest && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setChatModalOpen(false)}
          />
          <div className="relative w-full max-w-[540px] h-[560px] rounded-[28px] bg-white border border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden text-slate-800">
            {/* Chat Top Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 grid place-items-center text-[18px] shrink-0">👤</div>
                <div>
                  <div className="font-heading font-bold text-[16px] text-slate-800">
                    {activeChatRequest.senderId === currentUser.id
                      ? activeChatRequest.receiverName
                      : activeChatRequest.senderName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Topic: {activeChatRequest.targetTitle} • Connection Accepted ✓ • UoH community
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatModalOpen(false)}
                className="h-8 w-8 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:text-slate-800 hover:border-slate-300"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3 bg-slate-50/70">
              {messages
                .filter((m) => m.requestId === activeChatRequest.id)
                .map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className="text-[10px] text-slate-400 mb-1 px-1">
                        {isMe ? "You" : msg.senderName} • {msg.createdAt}
                      </div>
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-[1.5] shadow-sm ${
                          isMe
                            ? "bg-slate-900 text-white font-medium"
                            : "bg-white text-slate-800 border border-slate-200"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

              {messages.filter((m) => m.requestId === activeChatRequest.id).length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs text-slate-500">Only accepted connections can chat</div>
                  <p className="mt-3 text-xs text-slate-500 px-6 leading-5">Be respectful. This is a University of Hyderabad student community — misuse can lead to removal. Start with a clear intro!</p>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
            >
              <input
                required
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Type a respectful message..."
                className="flex-1 h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-slate-300 focus:bg-white"
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-full bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 transition shadow"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD EVENT */}
      {eventAddModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setEventAddModalOpen(false)}
          />
          <div className="relative w-full max-w-[480px] rounded-[28px] bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="font-heading font-extrabold text-[22px]">Add Community Event</div>
                <div className="text-[12px] text-slate-500 mt-0.5">Create a new public meetup or pitch event.</div>
              </div>
              <button onClick={() => setEventAddModalOpen(false)} className="h-8 w-8 rounded-full border border-slate-200 grid place-items-center text-slate-500 hover:text-slate-800">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newEvent = {
                  id: `e_${Date.now()}`,
                  title: eventForm.title,
                  date: eventForm.date,
                  time: eventForm.time,
                  venue: eventForm.venue,
                  category: eventForm.category,
                  desc: eventForm.desc,
                  thumbnail: eventForm.thumbnail,
                  organizer: eventForm.organizer,
                  capacity: eventForm.capacity,
                  eventType: eventForm.eventType,
                  tags: eventForm.tags,
                  link: eventForm.link
                };
                const updated = [newEvent, ...events];
                setEvents(updated);
                try { localStorage.setItem("startify_events", JSON.stringify(updated)); } catch {}
                setEventAddModalOpen(false);
                setEventForm({ title: "", date: "", time: "", venue: "", category: "Pitch Night", desc: "", thumbnail: "", organizer: "", capacity: "", eventType: "Offline", tags: "", link: "" });
                showToast("Event created and published.");
              }}
              className="mt-5 space-y-4 max-h-[65vh] overflow-y-auto pr-1"
            >
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Event Title *</label>
                <input required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Launch Week Meetup" className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">Date *</label>
                  <input required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="Saturday, Sep 12" className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">Time *</label>
                  <input required value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} placeholder="5:00 PM - 7:30 PM" className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Venue {eventForm.eventType === "Online" ? "(optional for online)" : "*"}</label>
                <input required={eventForm.eventType !== "Online"} value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} placeholder={eventForm.eventType === "Online" ? "Online — no venue needed" : "Main Innovation Auditorium"} className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Category</label>
                <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400">
                  <option>Pitch Night</option>
                  <option>Networking</option>
                  <option>Workshop</option>
                  <option>Demo Day</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Description *</label>
                <textarea required value={eventForm.desc} onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })} placeholder="Give a short description of the event." className="w-full min-h-[90px] rounded-[20px] bg-slate-50 border border-slate-200 p-4 text-[13px] text-slate-800 outline-none focus:border-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">Organizer</label>
                  <input value={eventForm.organizer} onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })} placeholder="Daksh Dua / Startify Team" className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">Capacity</label>
                  <input value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })} placeholder="e.g. 80 seats" className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">Event Type</label>
                  <select value={eventForm.eventType} onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })} className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none">
                    <option>Offline</option><option>Online</option><option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">Event Link {eventForm.eventType !== "Offline" ? "*" : "(Meet / Zoom / Registration)"}</label>
                  <input required={eventForm.eventType !== "Offline"} value={eventForm.link} onChange={(e) => setEventForm({ ...eventForm, link: e.target.value })} placeholder="https://meet.google.com/... or registration URL" className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none" />
                  <p className="mt-1 text-[11px] text-slate-500">Shown on event page as Join Online + Copy. Past events keep it as Recording / Link.</p>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Tags (comma separated)</label>
                <input value={eventForm.tags} onChange={(e) => setEventForm({ ...eventForm, tags: e.target.value })} placeholder="AI, Pitch, Networking" className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Thumbnail Image</label>
                <input type="file" accept="image/*" onChange={(e)=>{
                  const file=e.target.files[0]; if(!file) return;
                  if(file.size>2*1024*1024){ showToast("Image max 2MB"); return; }
                  const r=new FileReader(); r.onload=()=>setEventForm({...eventForm, thumbnail:r.result}); r.readAsDataURL(file);
                }} className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none file:mr-2 file:rounded-full file:border-0 file:bg-slate-900 file:text-white file:px-3 file:py-1 file:text-xs" />
                {eventForm.thumbnail && <img src={eventForm.thumbnail} alt="preview" className="mt-2 h-24 w-full object-cover rounded-xl border border-slate-200" />}
              </div>
              <button type="submit" className="w-full h-12 rounded-full bg-slate-900 text-white font-bold text-[14px] hover:bg-slate-800 transition">Publish Event →</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EVENT REGISTRATION */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setEventModalOpen(false)}
          />
          <div className="relative w-full max-w-[440px] rounded-[28px] bg-zinc-950 border border-white/20 shadow-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="font-heading font-extrabold text-[20px]">
                  RSVP: {targetEvent?.title}
                </div>
                <div className="text-[12px] text-slate-500 mt-0.5">
                  {targetEvent?.date} • {targetEvent?.venue}
                </div>
              </div>
              <button
                onClick={() => setEventModalOpen(false)}
                className="h-8 w-8 rounded-full border border-slate-200 grid place-items-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEventModalOpen(false);
                showToast(`✓ Registered for ${targetEvent?.title}!`);
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={eventRegisterForm.name || currentUser?.name || ""}
                  onChange={(e) =>
                    setEventRegisterForm({ ...eventRegisterForm, name: e.target.value })
                  }
                  placeholder="Your Name"
                  className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={eventRegisterForm.email || currentUser?.email || ""}
                  onChange={(e) =>
                    setEventRegisterForm({ ...eventRegisterForm, email: e.target.value })
                  }
                  placeholder="name@domain.com"
                  className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-slate-900 text-white font-bold text-[14px] hover:bg-slate-800 transition"
              >
                Confirm Event Registration →
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
