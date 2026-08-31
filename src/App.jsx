import { useState, useEffect } from "react";
import logoImg from "./assets/startify-wordmark-full.png";
import { dbService } from "./lib/supabase";

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

export const MAIN_WHATSAPP_LINK = "https://chat.whatsapp.com/StartifyMainCommunity";

/* ==========================================================================
   MAIN APPLICATION COMPONENT
   ========================================================================== */

export default function App() {
  // Visitors begin at the role-selection page. The workspace only opens after sign-in.
  const [currentUser, setCurrentUser] = useState(null);

  // Data Collections
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const [funders, setFunders] = useState(INITIAL_FUNDERS);
  const [builders, setBuilders] = useState(INITIAL_BUILDERS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

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
  const getProfileImageKey = (email) => `startify_profile_img_${email.toLowerCase()}`;
  const getProfileAboutKey = (email) => `startify_profile_about_${email.toLowerCase()}`;
  const getProfileImage = (email) => { try { return localStorage.getItem(getProfileImageKey(email)) || ""; } catch { return ""; } };
  const getProfileAbout = (email) => { try { return localStorage.getItem(getProfileAboutKey(email)) || ""; } catch { return ""; } };

  // Targets for Modals
  const [targetConnectItem, setTargetConnectItem] = useState(null);
  const [activeChatRequest, setActiveChatRequest] = useState(null);
  const [targetEvent, setTargetEvent] = useState(null);

  // Password auth (local — no Supabase OTP)
  const [showPassword, setShowPassword] = useState(false);
  const [pendingBackers, setPendingBackers] = useState(() => {
    try { return JSON.parse(localStorage.getItem("startify_pending_backers") || "[]"); } catch { return []; }
  });

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  // Form States
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    roleTitle: "",
    skills: "",
    focus: "",
    bio: ""
  });

  const [newIdeaForm, setNewIdeaForm] = useState({
    title: "",
    category: "Tech / AI",
    studentId: "",
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
    desc: ""
  });

  useEffect(() => {
    dbService.getIdeas(INITIAL_IDEAS).then((data) => {
      if (data && data.length > 0) setIdeas(data);
    });
    // Load admin-persisted talent/backers/events for launch
    try {
      const b = JSON.parse(localStorage.getItem("startify_admin_builders") || "null");
      if (b && Array.isArray(b) && b.length) setBuilders((prev) => [...b, ...prev]);
      const f = JSON.parse(localStorage.getItem("startify_admin_funders") || "null");
      if (f && Array.isArray(f) && f.length) setFunders((prev) => [...f, ...prev]);
      const ev = JSON.parse(localStorage.getItem("startify_events") || "null");
      if (ev && Array.isArray(ev) && ev.length) setEvents((prev) => [...ev, ...prev]);
      const req = JSON.parse(localStorage.getItem("startify_requests") || "null");
      if (req && Array.isArray(req) && req.length) setRequests((prev) => [...req, ...prev]);
      const msgs = JSON.parse(localStorage.getItem("startify_messages") || "null");
      if (msgs && Array.isArray(msgs) && msgs.length) setMessages((prev) => [...msgs, ...prev]);
      const pb = JSON.parse(localStorage.getItem("startify_pending_backers") || "null");
      if (pb && Array.isArray(pb) && pb.length) setPendingBackers(pb);
    } catch {}
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
    setActiveTab("dashboard");
    showToast(`Logged in as ${user.name} (${user.role.toUpperCase()})`);
  };

  // Sign In / Registration Handler — UoH students must use @uohyd.ac.in (backer open to outside) + password (no OTP)
  const isUoHEmail = (email) => email.trim().toLowerCase().endsWith("@uohyd.ac.in");
  const completeRegistration = (newUser, targetRole) => {
    // Persist to unified profile store so same-email switching works
    try {
      const key="startify_user_profiles";
      const existing=JSON.parse(localStorage.getItem(key)||"[]");
      const normalized={ id:newUser.id, name:newUser.name, email:newUser.email.toLowerCase(), role:newUser.role, studentId:newUser.studentId||"", roleTitle:newUser.roleTitle||"", skills:newUser.skills||"", focus:newUser.focus||"", bio:newUser.bio||"", createdAt:new Date().toISOString() };
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
      setActiveTab("dashboard");
    } else {
      if (targetRole === "talent") {
        setBuilders([
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email.toLowerCase(),
            role: authForm.roleTitle || "Builder",
            skills: authForm.skills || "Development & Design",
            year: "Campus Builder",
            verifiedStudent: true,
            status: "Available for Collaboration"
          },
          ...builders
        ]);
      }
      dbService.saveRegistration({ name: newUser.name, email: newUser.email, role: targetRole==="talent"?"builder":"founder", ideaOrSkills: targetRole==="talent"? (authForm.skills||"Talent") : "Founder", contact:"", registeredAt: new Date().toISOString().slice(0,10), status:"verified" });
      setCurrentUser(newUser);
      setActiveTab("dashboard");
      showToast(`Registered as ${targetRole.toUpperCase()}! Welcome, ${newUser.name}.`);
    }
    setAuthModalOpen(false);
    setAuthForm({ name: "", email: "", password: "", studentId: "", roleTitle: "", skills: "", focus: "", bio: "" });
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
    if ((targetRole === "founder" || targetRole === "talent") && !isUoHEmail(email)) {
      showToast("Use your University of Hyderabad email ending in @uohyd.ac.in for Founder/Builder accounts. Backers can use any email.");
      return;
    }
    const creds = getCredentials();
    const hasStoredPassword = !!creds[email.toLowerCase()];
    // Demo accounts: allow sign-in with any 6+ char password if no stored credential yet
    const demoUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (authMode === "signin") {
      if (demoUser) {
        if (hasStoredPassword && !checkCredential(email, password)) {
          showToast("Incorrect password for this account.");
          return;
        }
        if (!hasStoredPassword) saveCredential(email, password);
        setCurrentUser(demoUser);
        setActiveTab("dashboard");
        showToast(`Welcome back, ${demoUser.name}!`);
        setAuthModalOpen(false);
        setAuthForm({ name: "", email: "", password: "", studentId: "", roleTitle: "", skills: "", focus: "", bio: "" });
        return;
      }
      // Existing profile sign-in
      let existingProfile = null;
      try {
        const profiles = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
        existingProfile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase() && p.role === targetRole) || profiles.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
        if (!existingProfile) {
          const buildersLocal = JSON.parse(localStorage.getItem("startify_admin_builders") || "[]");
          const b = buildersLocal.find(b => (b.email||"").toLowerCase() === email.toLowerCase());
          if (b) existingProfile = { id: b.id, name: b.name, email: b.email, role: targetRole, roleTitle: b.roleTitle || b.role, skills: b.skills, bio: b.bio || "" };
        }
        if (!existingProfile) {
          const regsLocal = JSON.parse(localStorage.getItem("startify_registrations") || "[]");
          const r = regsLocal.find(r => r.email.toLowerCase() === email.toLowerCase());
          if (r) existingProfile = { id: r.email, name: r.name, email: r.email, role: r.role==="builder"?"talent":r.role==="funder"?"backer":r.role, bio: "" };
        }
        if (!existingProfile && email.toLowerCase().endsWith("@uohyd.ac.in") && email.toLowerCase().startsWith("user_")) {
          const fakeId = email.split("@")[0];
          const buildersLocal2 = JSON.parse(localStorage.getItem("startify_admin_builders") || "[]");
          const b2 = buildersLocal2.find(b => b.id === fakeId);
          if (b2) existingProfile = { id: b2.id, name: b2.name, email: b2.email || email, role: targetRole, roleTitle: b2.roleTitle || b2.role, skills: b2.skills, bio: b2.bio || "" };
        }
      } catch {}
      if (existingProfile) {
        if (hasStoredPassword && !checkCredential(email, password)) {
          showToast("Incorrect password. Try again.");
          return;
        }
        if (!hasStoredPassword) saveCredential(email, password);
        const reuseUser = {
          id: existingProfile.id,
          name: existingProfile.name || authForm.name || email.split("@")[0],
          email: existingProfile.email,
          role: existingProfile.role || targetRole,
          studentId: existingProfile.studentId || authForm.studentId,
          bio: existingProfile.bio || authForm.bio || "",
          roleTitle: existingProfile.roleTitle || authForm.roleTitle,
          skills: existingProfile.skills || authForm.skills,
          focus: existingProfile.focus || authForm.focus,
        };
        setCurrentUser(reuseUser);
        setActiveTab("dashboard");
        showToast(`Welcome back, ${reuseUser.name}!`);
        setAuthModalOpen(false);
        setAuthForm({ name: "", email: "", password: "", studentId: "", roleTitle: "", skills: "", focus: "", bio: "" });
        return;
      }
      // No existing account — prompt to create
      showToast("No account found for this email. Switch to Create Account.");
      return;
    }
    // Register mode
    if (authMode === "register") {
      if (!authForm.name.trim()) { showToast("Please enter your full name."); return; }
      // prevent duplicate same email+role
      try {
        const profiles = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
        if (profiles.some(p => p.email.toLowerCase()===email.toLowerCase() && p.role===targetRole)) {
          showToast("An account with this email and role already exists. Please Sign In.");
          return;
        }
      } catch {}
      if (hasStoredPassword && !checkCredential(email, password)) {
        showToast("An account with this email already uses a different password. Use that password to Sign In, or use a different email.");
        return;
      }
      const pendingUser = {
        id: `user_${Date.now()}`,
        name: authForm.name.trim(),
        email,
        role: targetRole,
        studentId: authForm.studentId,
        roleTitle: authForm.roleTitle,
        skills: authForm.skills,
        focus: authForm.focus,
        bio: authForm.bio
      };
      if ((pendingUser.role === "founder" || pendingUser.role === "talent") && !isUoHEmail(pendingUser.email)) {
        showToast("Founder/Builder requires @uohyd.ac.in. Switch to Backer for external email.");
        return;
      }
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

    const newIdea = {
      id: `idea_${Date.now()}`,
      title: newIdeaForm.title,
      category: newIdeaForm.category,
      founderId: currentUser.id,
      founder: currentUser.name,
      email: currentUser.email.toLowerCase(),
      verifiedStudent: true,
      studentId: currentUser.studentId || "UOH",
      desc: newIdeaForm.desc,
      seeking: newIdeaForm.seeking,
      status: "Pending Review",
      createdDate: "Pending admin review"
    };

    dbService.saveIdea(newIdea);
    setIdeas([newIdea, ...ideas]);
    setIdeaModalOpen(false);
    showToast(`✓ Idea "${newIdeaForm.title}" sent for admin review.`);
    setNewIdeaForm({ title: "", category: "Tech / AI", studentId: "", desc: "", seeking: "Tech Co-Founder" });
  };

  const handleApproveIdea = (ideaId) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, status: "Approved & Live", createdDate: "Just now" } : idea
      )
    );
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

      {/* UoH launch banner — hidden after sign-in, profile badge moves to dashboard */}
      {!currentUser && (
        <div className="bg-indigo-600 text-white text-center text-[11px] font-semibold py-2 px-4">
          An initiative for <strong>University of Hyderabad</strong> students • Founder / Builder (@uohyd.ac.in) + Backer (open)
        </div>
      )}

      {/* NAVIGATION HEADER — light glass, not sticky on dashboard/chats, no overlap */}
      <nav className={`${activeTab==="dashboard" || activeTab==="chats" ? "relative" : "sticky top-0"} z-40 backdrop-blur-xl bg-white/75 border-b border-slate-200`}>
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 min-h-[72px] py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab(currentUser ? "dashboard" : "home")}>
            <img
              src={logoImg}
              alt="Startify Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-slate-500 whitespace-nowrap leading-none">
              <span className="font-bold tracking-widest uppercase">University of Hyderabad</span>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span>A student initiative • Connect • Build</span>
            </div>
          </div>

          {/* Navigation Tabs — hidden when signed-out (no need), only for logged-in */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-1 text-[12px] font-medium bg-black/[0.04] p-1 rounded-full border border-black/10 flex-nowrap overflow-visible shrink-0">
              <button
                onClick={() => setActiveTab("home")}
                className={`px-3 py-1.5 rounded-full transition whitespace-nowrap shrink-0 ${activeTab === "home" ? "bg-slate-900 text-white font-bold shadow" : "text-slate-600 hover:text-slate-900"}`}
              >
                Home
              </button>
              {showIdeasTab && (
                <button
                  onClick={() => setActiveTab("ideas")}
                  className={`px-3 py-1.5 rounded-full transition whitespace-nowrap shrink-0 ${activeTab === "ideas" ? "bg-slate-900 text-white font-bold shadow" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Ideas Board
                </button>
              )}
              {showTalentTab && (
                <button
                  onClick={() => setActiveTab("talent")}
                  className={`px-3 py-1.5 rounded-full transition whitespace-nowrap shrink-0 ${activeTab === "talent" ? "bg-slate-900 text-white font-bold shadow" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Skilled Talent
                </button>
              )}
              {showBackersTab && (
                <button
                  onClick={() => setActiveTab("backers")}
                  className={`px-3 py-1.5 rounded-full transition whitespace-nowrap shrink-0 ${activeTab === "backers" ? "bg-slate-900 text-white font-bold shadow" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Backers Hub
                </button>
              )}
              {showEventsTab && (
                <button
                  onClick={() => setActiveTab("events")}
                  className={`px-3 py-1.5 rounded-full transition whitespace-nowrap shrink-0 ${activeTab === "events" ? "bg-slate-900 text-white font-bold shadow" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Events
                </button>
              )}
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 rounded-full transition relative whitespace-nowrap shrink-0 ${activeTab === "dashboard" ? "bg-slate-900 text-white font-bold shadow" : "text-slate-600 hover:text-slate-900"}`}
              >
                {currentUser.role === "admin" ? "Admin workspace" : "My Dashboard"}
                {myIncomingRequests.filter((r) => r.status === "pending").length > 0 && (
                  <span className="ml-1.5 h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("chats")}
                className={`px-3 py-1.5 rounded-full transition whitespace-nowrap shrink-0 ${activeTab === "chats" ? "bg-slate-900 text-white font-bold shadow" : "text-slate-600 hover:text-slate-900"}`}
              >
                Chats
                {myAcceptedConnections.length > 0 && <span className="ml-1.5 inline-grid h-5 min-w-[20px] place-items-center rounded-full bg-white text-[10px] font-bold text-slate-900 px-1 border border-slate-200">{myAcceptedConnections.length}</span>}
              </button>
            </div>
          )}

          {/* Header Action — one line, polished after login */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {!currentUser ? (
              <button
                onClick={() => { setAuthMode("signin"); setAuthModalOpen(true); }}
                className="h-10 px-5 rounded-full border border-slate-200 bg-white text-slate-700 font-semibold text-[12.5px] hover:bg-slate-50 shadow-sm transition whitespace-nowrap"
              >
                Sign in
              </button>
            ) : (
              <div className="flex items-center gap-3 whitespace-nowrap">
                <div className="hidden lg:flex items-center gap-2.5 bg-white border border-slate-200 rounded-full pl-1 pr-3 py-1 shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 grid place-items-center text-[14px] shrink-0">👤</div>
                  <div className="min-w-0 text-left leading-none">
                    <div className="text-xs font-bold text-slate-800 truncate max-w-[90px]">{currentUser.name.split(" ")[0]}</div>
                    <div className="text-[11px] text-slate-500 truncate">{ROLE_META[currentUser.role]?.label || currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => { setCurrentUser(null); setActiveTab("home"); showToast("Signed out"); }}
                  className="h-9 px-4 rounded-full bg-slate-900 text-white font-semibold text-xs hover:bg-black whitespace-nowrap shrink-0 shadow"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button + one-line Sign out */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
            {currentUser && <button onClick={() => { setCurrentUser(null); setActiveTab("home"); showToast("Signed out"); }} className="h-9 px-3 rounded-full bg-slate-900 text-white text-xs font-bold whitespace-nowrap">Sign out</button>}
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
              <button onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-3 rounded-xl font-bold ${activeTab === "dashboard" ? "bg-slate-900 text-white" : "text-slate-700"}`}>{currentUser.role === "admin" ? "Admin workspace" : "My Dashboard"} ({currentUser.role.toUpperCase()})</button>
              <button onClick={() => { setActiveTab("chats"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === "chats" ? "bg-slate-900 text-white" : "text-slate-700"}`}>Chats</button>
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
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Choose how you participate</div>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 shrink-0 self-start sm:self-auto">3 roles • One ecosystem</span>
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
                    ["1", "Create account", "Pick a role — Founder, Builder or Backer.", "bg-indigo-600"],
                    ["2", "Send a request", "Pitch an idea or offer your skills.", "bg-violet-600"],
                    ["3", "Get accepted & chat", "Chat unlocks after acceptance.", "bg-emerald-600"],
                  ].map(([n, t, d, bg]) => (
                    <div key={t} className="flex gap-2.5 text-xs sm:text-[13px] items-start"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-bold text-white ${bg}`}>{n}</span><div className="min-w-0"><div className="font-semibold text-slate-800 leading-tight">{t}</div><div className="text-slate-500 leading-4 text-[11px] sm:text-xs mt-0.5">{d}</div></div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Signed-in Home is the shared community overview for every role. */}
      {activeTab === "home" && currentUser && (
        <main className="mx-auto max-w-[1200px] px-5 py-10 md:px-8 md:py-12">
          <div className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-200 p-7 shadow-sm md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-end"><div><div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-700">University of Hyderabad • An initiative for UoH students</div><h1 className="font-heading home-calligraphy mt-3 text-[34px] font-extrabold tracking-tight text-slate-800 md:text-[46px]">Good to see you, {currentUser.name.split(" ")[0]}.</h1><p className="mt-3 max-w-[650px] text-[15px] leading-6 text-slate-600">Your UoH community is actively connecting ideas, talent and support. Explore your dashboard for role-specific matches, or open Chats to continue a conversation.</p></div><div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm"><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">MOTIVATION OF THE DAY</div><blockquote className="font-heading mt-3 text-[22px] font-bold leading-tight text-slate-800">“{dailyQuote.text}”</blockquote><div className="mt-2 text-[11px] text-slate-500 italic">— {dailyQuote.author}</div><div className="mt-3 h-1 w-12 rounded-full bg-slate-700" /></div></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl border border-slate-200 bg-white/80 p-5"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Live ideas</div><div className="font-heading mt-2 text-3xl font-extrabold text-slate-800">{ideas.length}</div><p className="mt-1 text-[11px] text-slate-500">Projects looking for momentum</p></div><div className="rounded-2xl border border-slate-200 bg-white/80 p-5"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Active people</div><div className="font-heading mt-2 text-3xl font-extrabold text-slate-800">{builders.length + funders.length + ideas.length}</div><p className="mt-1 text-[11px] text-slate-500">Founders, talent, and funders</p></div><div className="rounded-2xl border border-slate-200 bg-white/80 p-5"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Connections made</div><div className="font-heading mt-2 text-3xl font-extrabold text-slate-800">{requests.filter((request) => request.status === "accepted").length}</div><p className="mt-1 text-[11px] text-slate-500">Conversations unlocked</p></div><div className="rounded-2xl border border-slate-200 bg-white/80 p-5"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Upcoming events</div><div className="font-heading mt-2 text-3xl font-extrabold text-slate-800">{events.length}</div><p className="mt-1 text-[11px] text-slate-500">Ways to meet the community</p></div></div>
          </div>
          <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">MARK YOUR CALENDAR</div><h2 className="font-heading mt-1 text-[25px] font-extrabold text-slate-800" style={{color: '#0f172a'}}>Upcoming community events</h2></div><button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-700 hover:underline">Go to my dashboard →</button></div><div className="grid gap-5 md:grid-cols-2">{events.map((event) => <article key={event.id} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm" style={{background: 'rgba(255,255,255,0.92)'}}><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">{event.category}</span><span className="text-xs font-semibold text-slate-500">{event.date}</span></div><h3 className="font-heading mt-4 text-[19px] font-extrabold" style={{color: '#0f172a'}}>{event.title}</h3><p className="mt-2 text-[13px]" style={{color: '#475569'}}>{event.time} · {event.venue}</p><p className="mt-3 text-[13px] leading-5" style={{color: '#334155'}}>{event.desc}</p></article>)}</div></section>
          <section className="mt-10"><div className="mb-4 flex items-end justify-between"><div><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">IDEAS GAINING MOMENTUM</div><h2 className="font-heading mt-1 text-[25px] font-extrabold text-slate-800">What the community is building</h2></div><button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-700 hover:underline">Find your matches in Dashboard →</button></div><div className="grid gap-5 md:grid-cols-3">{ideas.slice(0, 3).map((idea) => <article key={idea.id} className="rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">{idea.category}</span><span className="text-[10px] font-semibold text-slate-500">{idea.createdDate}</span></div><h3 className="font-heading mt-4 text-[20px] font-extrabold text-slate-800">{idea.title}</h3><p className="mt-1 text-[12px] font-medium text-slate-500">By {idea.founder}</p><p className="mt-3 text-[13px] leading-5 text-slate-600">{idea.desc}</p><div className="mt-4 border-t border-slate-200 pt-3 text-[11px] font-semibold text-slate-600">Seeking: {idea.seeking}</div></article>)}</div></section>
        </main>
      )}

      {/* HERO BANNER — kept minimal for signed-in users; workflow lives only on signed-out home */}
      {activeTab !== "dashboard" && activeTab !== "home" && activeTab !== "chats" && (
        <section className="mx-auto max-w-[1200px] px-5 md:px-8 pt-8 pb-6">
          <div className="max-w-[760px]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 font-semibold shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              University of Hyderabad • Students Only Community
            </div>
            <h1 className="font-heading text-[30px] sm:text-[38px] md:text-[44px] font-extrabold leading-[1.08] tracking-tight mt-4 text-slate-900">
              {currentUser?.role === "founder" && "Share your idea. Find your builders and backers."}
              {currentUser?.role === "talent" && "Discover UoH ideas to build with."}
              {currentUser?.role === "backer" && "Discover UoH ideas to support."}
              {currentUser?.role === "admin" && "Admin overview — ideas, talent & backers."}
              {!currentUser && <>Connect on <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Startup Ideas</span>. Chat directly after acceptance.</>}
            </h1>
            <p className="text-[14.5px] md:text-[15px] leading-[1.65] text-slate-600 mt-3 max-w-[620px]">
              {currentUser?.role === "founder" && "An initiative for University of Hyderabad students — post ideas, meet verified campus talent, and pitch campus backers."}
              {currentUser?.role === "talent" && "An initiative for University of Hyderabad students — browse founder ideas and send a request to collaborate."}
              {currentUser?.role === "backer" && "An initiative for University of Hyderabad students — browse founder ideas and skilled talent, then connect with promising teams."}
              {currentUser?.role === "admin" && "University of Hyderabad — Startify internal review. You have all data; no public admin signup."}
              {!currentUser && "For University of Hyderabad students. Sign in as Founder, Builder, or Backer to connect and chat after acceptance."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {currentUser?.role === "founder" && <button onClick={() => setIdeaModalOpen(true)} className="h-10 px-5 rounded-full bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow transition">Post Your Idea</button>}
              {currentUser && <button onClick={() => setActiveTab("dashboard")} className="h-10 px-5 rounded-full bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow transition">Open My Dashboard</button>}
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

                  <div className="text-[12px] text-slate-500 mt-1 font-medium flex items-center gap-2">
                    <span>Founder: {idea.founder}</span>
                    {idea.studentId && (
                      <span className="text-[10.5px] text-slate-500 font-mono">
                        ({idea.studentId})
                      </span>
                    )}
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
                Upcoming Community Events
              </h2>
              <p className="text-[13.5px] text-zinc-400 mt-1 max-w-[600px]">
                Present your idea or meet co-founders in person & online.
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

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-[24px] border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-slate-300 transition shadow-sm"
                style={{color: '#0f172a'}}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 uppercase">
                      {ev.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {ev.date}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-[20px] mt-4" style={{color: '#0f172a'}}>
                    {ev.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-[12.5px] text-slate-600">
                    <div>🕒 <strong>Time:</strong> {ev.time}</div>
                    <div>📍 <strong>Venue:</strong> {ev.venue}</div>
                  </div>

                  <p className="text-[13.5px] leading-[1.55] mt-4" style={{color: '#334155'}}>
                    {ev.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      requireAuth(() => {
                        setTargetEvent(ev);
                        setEventModalOpen(true);
                      });
                    }}
                    className="w-full h-10 rounded-full bg-slate-900 text-white text-[12.5px] font-bold hover:bg-slate-800 transition"
                  >
                    RSVP for Event →
                  </button>
                </div>
              </div>
            ))}
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
            {myAcceptedConnections.length === 0 && <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 py-14 text-center text-sm text-slate-500">No chats yet. Connect with a person whose work interests you, then chat once they accept.</div>}
          </div>
        </section>
      )}

      {/* ==========================================================================
         TAB 5: ROLE-SPECIFIC DASHBOARD (FOR LOGGED IN USER)
         ========================================================================== */}
      {activeTab === "dashboard" && currentUser && (
        <section className="dashboard-surface mx-auto max-w-[1200px] px-5 md:px-8 py-10">
          {/* Profile Card — shows who you are + same-email role switcher */}
          {(() => {
            const initials = currentUser.name.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase();
            const creds = (()=>{ try{ return JSON.parse(localStorage.getItem("startify_credentials")||"{}"); }catch{return {};}})();
            const isVerified = !!creds[currentUser.email.toLowerCase()] || DEMO_USERS.some(u=>u.email.toLowerCase()===currentUser.email.toLowerCase());
            const profilesKey = "startify_user_profiles";
            const allProfiles = (()=>{ try{
              const a=JSON.parse(localStorage.getItem(profilesKey)||"[]");
              const regs=JSON.parse(localStorage.getItem("startify_registrations")||"[]");
              const fromRegs=regs.map(r=>({id:r.email, name:r.name, email:r.email, role: r.role==="builder"?"talent": r.role==="funder"?"backer": r.role}));
              const pb=JSON.parse(localStorage.getItem("startify_pending_backers")||"[]");
              const fromPb=pb.map(p=>({id:p.id, name:p.name, email:p.email, role:"backer"}));
              const ab=JSON.parse(localStorage.getItem("startify_admin_builders")||"[]");
              const fromAb=ab.map(b=>({id:b.id, name:b.name, email:(b.email||b.id+"@uohyd.ac.in"), role:"talent"}));
              const af=JSON.parse(localStorage.getItem("startify_admin_funders")||"[]");
              const fromAf=af.map(f=>({id:f.id, name:f.name, email:(f.email||f.id+"@startify.net"), role:"backer"}));
              return [...a, ...fromRegs, ...fromPb, ...fromAb, ...fromAf, ...DEMO_USERS];
            }catch{ return [...DEMO_USERS]; }})();
            const sameEmailProfiles = allProfiles.filter(p=> p.email && p.email.toLowerCase()===currentUser.email.toLowerCase());
            const roleOptions = [
              {role:"founder", label:"Founder", desc:"Post ideas", needUoH:true},
              {role:"talent", label:"Builder", desc:"Join teams", needUoH:true},
              {role:"backer", label:"Backer", desc:"Fund ideas", needUoH:false},
            ];
            const hasRole = (r) => sameEmailProfiles.some(p=>p.role===r) || currentUser.role===r;
            const isSameEmailRolePending = (r) => r==="backer" && pendingBackers.some(p=>p.email.toLowerCase()===currentUser.email.toLowerCase());
            return (
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-6 md:p-7">
                <div className="flex gap-3 sm:gap-4 items-start">
                  {(() => {
                    const img = getProfileImage(currentUser.email);
                    return (
                      <div className="relative shrink-0">
                        {img ? (
                          <img src={img} alt={currentUser.name} className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                        ) : (
                          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-slate-100 border border-slate-200 grid place-items-center text-2xl sm:text-3xl">👤</div>
                        )}
                        <label className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white border border-slate-200 shadow-sm grid place-items-center text-[9px] sm:text-[10px] font-bold text-slate-600 cursor-pointer hover:bg-slate-50" title="Upload profile image">
                          Edit
                          <input type="file" accept="image/*" className="hidden" onChange={(e)=>{
                            const file=e.target.files[0];
                            if(!file) return;
                            if(file.size > 2*1024*1024){ showToast("Image too large — max 2MB"); return; }
                            const reader=new FileReader();
                            reader.onload=()=>{
                              try{
                                localStorage.setItem(getProfileImageKey(currentUser.email), reader.result);
                                // also update unified profile store
                                try{
                                  const key2="startify_user_profiles";
                                  const arr=JSON.parse(localStorage.getItem(key2)||"[]");
                                  const idx=arr.findIndex(p=> p.email.toLowerCase()===currentUser.email.toLowerCase() && p.role===currentUser.role);
                                  if(idx>=0){ arr[idx].profileImage=reader.result; localStorage.setItem(key2, JSON.stringify(arr)); }
                                }catch{}
                                showToast("✓ Profile image updated");
                                // force re-render
                                setProfileSwitcherOpen(v=>v);
                              }catch{ showToast("Failed to save image"); }
                            };
                            reader.readAsDataURL(file);
                          }}/>
                        </label>
                      </div>
                    );
                  })()}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h1 className="font-heading text-[18px] sm:text-[24px] md:text-[28px] font-extrabold leading-none text-slate-900">Welcome, {currentUser.name}</h1>
                      <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold border ${currentUser.role==="founder"?"bg-indigo-50 border-indigo-200 text-indigo-700":currentUser.role==="talent"?"bg-sky-50 border-sky-200 text-sky-700":currentUser.role==="backer"?"bg-violet-50 border-violet-200 text-violet-700":"bg-amber-50 border-amber-200 text-amber-700"}`}>{ROLE_META[currentUser.role]?.label || currentUser.role.toUpperCase()}</span>
                      {isVerified ? <span className="inline-flex items-center px-2 py-0.5 sm:px-2 sm:py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-[11px] font-bold whitespace-nowrap">✓ Verified</span> : <span className="px-2 py-0.5 sm:py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-bold">Unverified</span>}
                      {currentUser._backerPending && <span className="px-2 py-0.5 sm:py-1 rounded-full bg-amber-500 text-white text-[10px] sm:text-[11px] font-bold">Pending admin</span>}
                    </div>
                    <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 truncate">{currentUser.email}</div>
                    {(() => {
                      const about = getProfileAbout(currentUser.email) || currentUser.bio || "";
                      return (
                        <div className="mt-2 sm:mt-3">
                          {about ? <p className="text-xs sm:text-sm text-slate-700 leading-4 sm:leading-5 bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 line-clamp-3">{about}</p> : <p className="text-xs sm:text-sm text-slate-400 italic">No about yet — tell others what you build or fund.</p>}
                          <button onClick={()=>{ setProfileAboutDraft(about); setProfileEditOpen(true); }} className="mt-2 h-7 sm:h-8 px-2.5 sm:px-3 rounded-full bg-white border border-slate-200 text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50">{about ? "Edit about" : "Add about"}</button>
                        </div>
                      );
                    })()}
                    {currentUser.role === "talent" && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Your skills</div>
                        <div className="mt-1 text-sm text-slate-800 font-semibold">{currentUser.roleTitle || "Builder"}</div>
                        <div className="text-xs text-slate-600 mt-1 break-words">{currentUser.skills || "No skills added yet — add your stack to attract founders."}</div>
                        <button onClick={()=>{ setProfileRoleTitleDraft(currentUser.roleTitle||""); setProfileSkillsDraft(currentUser.skills||""); setProfileSkillsEditOpen(true); }} className="mt-2 h-7 px-3 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50">Edit skills</button>
                      </div>
                    )}
                    {currentUser.role === "backer" && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Your focus</div>
                        <div className="text-xs text-slate-600 mt-1 break-words">{currentUser.focus || "No focus set — add what you fund."}</div>
                        <button onClick={()=>{ setProfileFocusDraft(currentUser.focus||""); setProfileSkillsEditOpen(true); }} className="mt-2 h-7 px-3 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50">Edit focus</button>
                      </div>
                    )}
                    <p className="hidden sm:block text-[13px] text-slate-600 mt-3 leading-5">
                      {currentUser.role === "founder" && "Manage your posted startup ideas, view incoming talent & backer requests, and chat directly."}
                      {currentUser.role === "talent" && "View your builder profile, track incoming team invites, and talk to founders."}
                      {currentUser.role === "backer" && "View founder pitches, manage dealflow inquiries, and chat directly with student startups."}
                      {currentUser.role === "admin" && "Sole admin — you have all data. Manage ideas, backers, and accounts at /admin.html."}
                    </p>
                    {currentUser.role==="founder" && <div className="mt-2 sm:mt-3"><button onClick={()=> setIdeaModalOpen(true)} className="h-8 sm:h-9 px-3 sm:px-4 rounded-full bg-slate-900 text-white text-[11px] sm:text-xs font-bold hover:bg-slate-800">+ Post New Idea</button></div>}
                  </div>
                  <button onClick={()=> setProfileSwitcherOpen(!profileSwitcherOpen)} className="shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-slate-200 bg-slate-50 grid place-items-center text-slate-700 hover:bg-white hover:border-slate-300 shadow-sm" title="Switch profile (same email)">
                    <span className={`transition-transform text-base sm:text-lg ${profileSwitcherOpen?"rotate-180":""}`}>⌄</span>
                  </button>
                </div>
                {profileSwitcherOpen && (
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid md:grid-cols-3 gap-3">
                      {roleOptions.map(o=>{
                        const active = currentUser.role===o.role;
                        const exists = hasRole(o.role);
                        const pending = isSameEmailRolePending(o.role);
                        const needUoHFail = o.needUoH && !currentUser.email.toLowerCase().endsWith("@uohyd.ac.in");
                        return (
                          <div key={o.role} className={`flex flex-col p-3 rounded-xl border ${active?"bg-slate-900 border-slate-900 text-white":"bg-white border-slate-200"}`}>
                            <div className="flex items-center gap-2">
                              <div className={`text-sm font-bold ${active?"text-white":"text-slate-800"}`}>{o.label}</div>
                              {pending ? <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white">pending</span>: exists && !active ? <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">ready</span>: null}
                            </div>
                            <div className={`text-[11px] mt-2 ${active?"text-white/70":"text-slate-500"}`}>{o.desc} {o.needUoH? "• @uohyd.ac.in":"• any email"}</div>
                            <div className="mt-3">
                              {active ? <span className="inline-flex h-8 px-3 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-white items-center">Active</span> : needUoHFail ? <span className="text-[11px] text-amber-600 font-semibold">Needs @uohyd.ac.in</span> : exists ? <button onClick={()=>{
                                const target = sameEmailProfiles.find(p=> p.role===o.role);
                                if(target){
                                  // Keep same name and profile image for same email across roles
                                  const img = getProfileImage(currentUser.email);
                                  if(img) try{ localStorage.setItem(getProfileImageKey(target.email), img); }catch{}
                                  const mapped={ id: target.id, name: currentUser.name, email: target.email, role: target.role, studentId: target.studentId|| currentUser.studentId, bio: getProfileAbout(target.email) || target.bio|| currentUser.bio||"", roleTitle: target.roleTitle||"", skills: target.skills||"", focus: target.focus||"" }; setCurrentUser(mapped); setProfileSwitcherOpen(false); showToast(`Switched to ${o.label} — same name & photo kept`);
                                }
                              }} className="h-8 px-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 w-full">Switch →</button> : <button onClick={()=>{
                                setAuthForm({...authForm, name: currentUser.name, email: currentUser.email, studentId: currentUser.studentId||"", roleTitle:"", skills:"", focus:"", bio:""});
                                setSelectedRegisterRole(o.role);
                                setAuthMode("register");
                                setAuthModalOpen(true);
                              }} className="h-8 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 w-full">Create →</button>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {profileEditOpen && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-bold text-slate-800">Edit about</div>
                    <p className="text-xs text-slate-500 mt-1">Visible on your profile card — tell others what you build or fund.</p>
                    <textarea value={profileAboutDraft} onChange={e=> setProfileAboutDraft(e.target.value)} placeholder="I build... I study... I fund..." className="mt-3 w-full min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-slate-300" />
                    <div className="mt-3 flex justify-end gap-2">
                      <button onClick={()=> setProfileEditOpen(false)} className="h-9 px-4 rounded-full border border-slate-200 text-sm font-semibold">Cancel</button>
                      <button onClick={()=>{
                        try{
                          localStorage.setItem(getProfileAboutKey(currentUser.email), profileAboutDraft);
                          const key2="startify_user_profiles";
                          const arr=JSON.parse(localStorage.getItem(key2)||"[]");
                          const idx=arr.findIndex(p=> p.email.toLowerCase()===currentUser.email.toLowerCase() && p.role===currentUser.role);
                          if(idx>=0){ arr[idx].bio=profileAboutDraft; localStorage.setItem(key2, JSON.stringify(arr)); }
                          setCurrentUser({...currentUser, bio: profileAboutDraft});
                          setProfileEditOpen(false);
                          showToast("✓ About updated");
                        }catch{ showToast("Failed to save"); }
                      }} className="h-9 px-5 rounded-full bg-slate-900 text-white text-sm font-bold">Save</button>
                    </div>
                  </div>
                )}
                {profileSkillsEditOpen && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    {currentUser.role === "talent" ? (
                      <>
                        <div className="text-sm font-bold text-slate-800">Edit skills</div>
                        <p className="text-xs text-slate-500 mt-1">Update your role title and skills — visible to founders.</p>
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Role title</label>
                            <input value={profileRoleTitleDraft} onChange={e=> setProfileRoleTitleDraft(e.target.value)} placeholder="e.g. Full-Stack Engineer" className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-300" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Skills</label>
                            <input value={profileSkillsDraft} onChange={e=> setProfileSkillsDraft(e.target.value)} placeholder="React, Node.js, Python" className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-300" />
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end gap-2">
                          <button onClick={()=> setProfileSkillsEditOpen(false)} className="h-9 px-4 rounded-full border border-slate-200 text-sm font-semibold">Cancel</button>
                          <button onClick={()=>{
                            try{
                              const emailLower = currentUser.email.toLowerCase();
                              const newRoleTitle = profileRoleTitleDraft.trim();
                              const newSkills = profileSkillsDraft.trim();
                              setBuilders(prev => prev.map(b => (b.id === currentUser.id || (b.email && b.email.toLowerCase()===emailLower)) ? { ...b, role: newRoleTitle || b.role, skills: newSkills || b.skills } : b));
                              try{
                                const key2="startify_user_profiles";
                                const arr=JSON.parse(localStorage.getItem(key2)||"[]");
                                const idx=arr.findIndex(p=> p.email.toLowerCase()===emailLower && p.role===currentUser.role);
                                if(idx>=0){ arr[idx].roleTitle=newRoleTitle; arr[idx].skills=newSkills; localStorage.setItem(key2, JSON.stringify(arr)); }
                              }catch{}
                              setCurrentUser({...currentUser, roleTitle: newRoleTitle || currentUser.roleTitle, skills: newSkills || currentUser.skills});
                              setProfileSkillsEditOpen(false);
                              showToast("✓ Skills updated");
                            }catch{ showToast("Failed to save"); }
                          }} className="h-9 px-5 rounded-full bg-slate-900 text-white text-sm font-bold">Save</button>
                        </div>
                      </>
                    ) : currentUser.role === "backer" ? (
                      <>
                        <div className="text-sm font-bold text-slate-800">Edit focus</div>
                        <p className="text-xs text-slate-500 mt-1">Update your investment focus — visible to founders.</p>
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Focus / Expertise</label>
                          <input value={profileFocusDraft} onChange={e=> setProfileFocusDraft(e.target.value)} placeholder="e.g. EdTech, AI & SaaS" className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-300" />
                        </div>
                        <div className="mt-3 flex justify-end gap-2">
                          <button onClick={()=> setProfileSkillsEditOpen(false)} className="h-9 px-4 rounded-full border border-slate-200 text-sm font-semibold">Cancel</button>
                          <button onClick={()=>{
                            try{
                              const emailLower = currentUser.email.toLowerCase();
                              const newFocus = profileFocusDraft.trim();
                              setFunders(prev => prev.map(f => (f.id === currentUser.id || (f.email && f.email.toLowerCase()===emailLower)) ? { ...f, focus: newFocus || f.focus } : f));
                              try{
                                const key2="startify_user_profiles";
                                const arr=JSON.parse(localStorage.getItem(key2)||"[]");
                                const idx=arr.findIndex(p=> p.email.toLowerCase()===emailLower && p.role===currentUser.role);
                                if(idx>=0){ arr[idx].focus=newFocus; localStorage.setItem(key2, JSON.stringify(arr)); }
                              }catch{}
                              setCurrentUser({...currentUser, focus: newFocus || currentUser.focus});
                              setProfileSkillsEditOpen(false);
                              showToast("✓ Focus updated");
                            }catch{ showToast("Failed to save"); }
                          }} className="h-9 px-5 rounded-full bg-slate-900 text-white text-sm font-bold">Save</button>
                        </div>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })()}

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

      {/* FOOTER */}
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
            An initiative for <strong className="text-slate-600">University of Hyderabad</strong> students • Founder/Builder @uohyd.ac.in • <a href="/admin.html" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">Admin</a>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={MAIN_WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:underline font-semibold"
            >
              WhatsApp Group
            </a>
          </div>
        </div>
      </footer>

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
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`text-[11px] sm:text-[13px] font-bold leading-none break-words ${selectedRegisterRole === role ? "text-white" : "text-slate-800"}`}>{label}</span>
                        <span className={`text-[9px] sm:text-[11px] leading-none break-words ${selectedRegisterRole === role ? "text-white/70" : "text-slate-500"}`}>{sub}</span>
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
                  Password * <span className="font-normal text-slate-400">— min 6 characters</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    placeholder={authMode === "signin" ? "Enter your password" : "Create a password"}
                    className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 pr-12 text-[13px] text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button type="button" onClick={()=> setShowPassword(!showPassword)} className="absolute right-1.5 top-1.5 h-8 px-3 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-slate-900 text-white font-bold text-[14px] hover:bg-black transition shadow-md"
              >
                {authMode === "signin" ? "Sign In & Continue →" : `Create ${selectedRegisterRole.toUpperCase()} Account →`}
              </button>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-start gap-2.5">
                <span className="h-6 w-6 rounded-full bg-emerald-500 text-white grid place-items-center text-[11px] shrink-0">✓</span>
                <div className="text-[11px] leading-4 text-slate-600"><strong className="text-slate-800">Verified community</strong> — connect and collaborate with confidence.</div>
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
                  desc: eventForm.desc
                };
                setEvents([newEvent, ...events]);
                setEventAddModalOpen(false);
                setEventForm({ title: "", date: "", time: "", venue: "", category: "Pitch Night", desc: "" });
                showToast("Event created and published.");
              }}
              className="mt-5 space-y-4"
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
                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Venue *</label>
                <input required value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} placeholder="Main Innovation Auditorium" className="w-full h-11 rounded-full bg-slate-50 border border-slate-200 px-4 text-[13px] text-slate-800 outline-none focus:border-slate-400" />
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
                <textarea required value={eventForm.desc} onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })} placeholder="Give a short description of the event." className="w-full min-h-[90px] rounded-[20px] bg-zinc-900 border border-white/15 p-4 text-[13px] text-white outline-none focus:border-white" />
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
