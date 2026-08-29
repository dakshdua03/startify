import { useState, useEffect } from "react";
import logoImg from "./assets/startify_white_background.jpg";
import { dbService } from "./lib/supabase";

/* ==========================================================================
   PRE-CREATED TEST ACCOUNTS & DEMO DATA FOR EASY TESTING
   ========================================================================== */

export const DEMO_USERS = [
  {
    id: "user_priya",
    name: "Priya Sharma",
    email: "priya@uohyd.ac.in",
    role: "founder",
    studentId: "UOH-2023-CS042",
    bio: "Final year CS student building CampusKart, a peer-to-peer campus marketplace."
  },
  {
    id: "user_vikram",
    name: "Vikram Singh",
    email: "vikram@uohyd.ac.in",
    role: "talent",
    studentId: "UOH-2022-CS110",
    roleTitle: "Full-Stack Engineer",
    skills: "React, Node.js, Python, PostgreSQL",
    bio: "Passionate developer looking to join exciting campus AI & SaaS startups."
  },
  {
    id: "user_backer",
    name: "Campus Angel Network",
    email: "angels@startify.net",
    role: "backer",
    ticketSize: "Pre-Seed & Micro-Capital",
    focus: "EdTech, AI & Consumer Apps",
    bio: "Alumni angel syndicate funding pre-seed student ideas from prototype to MVP."
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
  // Current Logged-in User State (Defaults to Priya for smooth initial preview)
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]);

  // Data Collections
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const [funders, setFunders] = useState(INITIAL_FUNDERS);
  const [builders, setBuilders] = useState(INITIAL_BUILDERS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  // Active Tab & Filters
  const [activeTab, setActiveTab] = useState("ideas"); // "ideas" | "talent" | "backers" | "events" | "dashboard"
  const [ideaCategoryFilter, setIdeaCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "register"
  const [selectedRegisterRole, setSelectedRegisterRole] = useState("founder"); // "founder" | "talent" | "backer"
  const [ideaModalOpen, setIdeaModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Targets for Modals
  const [targetConnectItem, setTargetConnectItem] = useState(null);
  const [activeChatRequest, setActiveChatRequest] = useState(null);
  const [targetEvent, setTargetEvent] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  // Form States
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
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

  useEffect(() => {
    dbService.getIdeas(INITIAL_IDEAS).then((data) => {
      if (data && data.length > 0) setIdeas(data);
    });
  }, []);

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
    showToast(`Logged in as ${user.name} (${user.role.toUpperCase()})`);
  };

  // Sign In / Registration Handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authMode === "signin") {
      // Find matching demo user or create session
      const found = DEMO_USERS.find((u) => u.email.toLowerCase() === authForm.email.toLowerCase());
      if (found) {
        setCurrentUser(found);
        showToast(`Welcome back, ${found.name}!`);
      } else {
        const newUser = {
          id: `user_${Date.now()}`,
          name: authForm.name || authForm.email.split("@")[0],
          email: authForm.email,
          role: selectedRegisterRole,
          studentId: authForm.studentId,
          bio: authForm.bio
        };
        setCurrentUser(newUser);
        showToast(`Account created! Logged in as ${newUser.name}.`);
      }
    } else {
      // Register Single Role Account
      const newUser = {
        id: `user_${Date.now()}`,
        name: authForm.name,
        email: authForm.email,
        role: selectedRegisterRole,
        studentId: authForm.studentId,
        roleTitle: authForm.roleTitle,
        skills: authForm.skills,
        focus: authForm.focus,
        bio: authForm.bio
      };

      if (selectedRegisterRole === "talent") {
        setBuilders([
          {
            id: newUser.id,
            name: newUser.name,
            role: authForm.roleTitle || "Builder",
            skills: authForm.skills || "Development & Design",
            year: "Campus Builder",
            verifiedStudent: !!authForm.studentId,
            status: "Available for Collaboration"
          },
          ...builders
        ]);
      } else if (selectedRegisterRole === "backer") {
        setFunders([
          {
            id: newUser.id,
            name: newUser.name,
            role: authForm.roleTitle || "Angel Backer",
            focus: authForm.focus || "Tech & AI",
            bio: authForm.bio || "Supporting student founders.",
            ticketSize: "Pre-Seed & Seed"
          },
          ...funders
        ]);
      }

      setCurrentUser(newUser);
      showToast(`Registered as ${selectedRegisterRole.toUpperCase()}! Welcome, ${newUser.name}.`);
    }

    setAuthModalOpen(false);
    setAuthForm({ name: "", email: "", studentId: "", roleTitle: "", skills: "", focus: "", bio: "" });
  };

  // Submit New Idea (Requires Login & Founder Role)
  const handleIdeaSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!newIdeaForm.studentId.trim() && !currentUser.studentId) {
      showToast("Student ID is required for verification.");
      return;
    }

    const newIdea = {
      id: `idea_${Date.now()}`,
      title: newIdeaForm.title,
      category: newIdeaForm.category,
      founderId: currentUser.id,
      founder: currentUser.name,
      verifiedStudent: true,
      studentId: newIdeaForm.studentId || currentUser.studentId || "UOH-VERIFIED",
      desc: newIdeaForm.desc,
      seeking: newIdeaForm.seeking,
      status: "Verified & Live",
      createdDate: "Just now"
    };

    dbService.saveIdea(newIdea);
    setIdeas([newIdea, ...ideas]);
    setIdeaModalOpen(false);
    showToast(`✓ Idea "${newIdeaForm.title}" posted!`);
    setNewIdeaForm({ title: "", category: "Tech / AI", studentId: "", desc: "", seeking: "Tech Co-Founder" });
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

  // Filtered Ideas
  const filteredIdeas = ideas.filter((idea) => {
    const matchesCategory =
      ideaCategoryFilter === "All" || idea.category.toLowerCase().includes(ideaCategoryFilter.toLowerCase());
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.seeking.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.founder.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // User Dashboard Filtered Data
  const myIncomingRequests = requests.filter((r) => r.receiverId === currentUser?.id);
  const myOutgoingRequests = requests.filter((r) => r.senderId === currentUser?.id);
  const myAcceptedConnections = requests.filter(
    (r) => (r.senderId === currentUser?.id || r.receiverId === currentUser?.id) && r.status === "accepted"
  );
  const myIdeas = ideas.filter((i) => i.founderId === currentUser?.id);

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-100 selection:bg-white selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-black px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-3 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-black"></span>
          {toastMessage}
        </div>
      )}

      {/* QUICK DEMO ACCOUNT SWITCHER BAR (FOR EASY TESTING ACROSS 3 ROLES) */}
      <div className="bg-zinc-950 border-b border-white/10 px-4 py-2.5 text-xs text-zinc-400">
        <div className="mx-auto max-w-[1200px] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
              Test Accounts Switcher:
            </span>
            {DEMO_USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSwitchUser(u)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  currentUser?.id === u.id
                    ? "bg-white text-black"
                    : "bg-zinc-900 text-zinc-300 border border-white/10 hover:border-white/30"
                }`}
              >
                {u.role === "founder" && "💡 "}
                {u.role === "talent" && "⚡ "}
                {u.role === "backer" && "💼 "}
                {u.name} ({u.role.toUpperCase()})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 uppercase font-bold border border-white/10">
                  {currentUser.role}
                </span>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="text-zinc-500 hover:text-white underline ml-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setAuthModalOpen(true);
                }}
                className="text-white hover:underline font-bold"
              >
                Sign In / Register →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION HEADER */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#121214]/90 border-b border-white/10">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab("ideas")}>
            <img
              src={logoImg}
              alt="Startify Logo"
              className="h-10 w-10 rounded-full border border-white/20 object-cover"
            />
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-[19px] font-heading text-white">
                  STARTIFY
                </span>
                <span className="hidden sm:inline-block h-3.5 w-px bg-white/20" />
                <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Community Ecosystem
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5 font-medium">
                Connect • Collaborate • Build
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-2 text-[13px] font-medium text-zinc-300 bg-zinc-950 p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setActiveTab("ideas")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeTab === "ideas" ? "bg-white text-black font-bold" : "hover:text-white"
              }`}
            >
              Ideas Board
            </button>
            <button
              onClick={() => setActiveTab("talent")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeTab === "talent" ? "bg-white text-black font-bold" : "hover:text-white"
              }`}
            >
              Skilled Talent
            </button>
            <button
              onClick={() => setActiveTab("backers")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeTab === "backers" ? "bg-white text-black font-bold" : "hover:text-white"
              }`}
            >
              Backers Hub
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeTab === "events" ? "bg-white text-black font-bold" : "hover:text-white"
              }`}
            >
              Events
            </button>
            {currentUser && (
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-1.5 rounded-full transition relative ${
                  activeTab === "dashboard" ? "bg-white text-black font-bold" : "hover:text-white text-zinc-200"
                }`}
              >
                My Dashboard
                {myIncomingRequests.filter((r) => r.status === "pending").length > 0 && (
                  <span className="ml-1.5 h-2 w-2 rounded-full bg-white inline-block animate-pulse" />
                )}
              </button>
            )}
          </div>

          {/* Header Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() =>
                requireAuth(() => {
                  if (currentUser.role !== "founder") {
                    showToast("Switching to Founder role or posting idea!");
                  }
                  setIdeaModalOpen(true);
                })
              }
              className="h-10 px-5 rounded-full bg-white text-black font-bold text-[12.5px] hover:bg-zinc-200 transition"
            >
              + Post Idea
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-10 w-10 rounded-full border border-white/15 grid place-items-center text-white"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-zinc-950 p-5 space-y-3 text-[14px]">
            <button
              onClick={() => {
                setActiveTab("ideas");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1 text-zinc-300"
            >
              Ideas Board
            </button>
            <button
              onClick={() => {
                setActiveTab("talent");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1 text-zinc-300"
            >
              Skilled Talent
            </button>
            <button
              onClick={() => {
                setActiveTab("backers");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1 text-zinc-300"
            >
              Backers Hub
            </button>
            <button
              onClick={() => {
                setActiveTab("events");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1 text-zinc-300"
            >
              Events & Meetups
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-1 font-bold text-white"
              >
                My Dashboard ({currentUser.role.toUpperCase()})
              </button>
            )}
            <div className="pt-2">
              <button
                onClick={() =>
                  requireAuth(() => {
                    setMobileMenuOpen(false);
                    setIdeaModalOpen(true);
                  })
                }
                className="w-full h-11 rounded-full bg-white text-black font-bold text-[13px]"
              >
                + Post Startup Idea
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO BANNER (Shown when viewing main tabs) */}
      {activeTab !== "dashboard" && (
        <section className="mx-auto max-w-[1200px] px-5 md:px-8 pt-10 pb-8 border-b border-white/10">
          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/15 text-xs text-zinc-300 font-medium">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse-glow" />
                Single-Role Ecosystem • Direct Connection & Live Chat
              </div>

              <h1 className="font-heading text-[36px] sm:text-[44px] md:text-[52px] font-extrabold leading-[1.08] tracking-tight mt-5">
                Connect on <span className="text-zinc-400">Startup Ideas</span>. Chat Directly After Request Acceptance.
              </h1>

              <p className="text-[15px] md:text-[16.5px] leading-[1.6] text-zinc-400 mt-4 max-w-[580px]">
                Sign in as an <strong>Idea Creator</strong>, <strong>Skilled Builder</strong>, or <strong>Backer</strong>. Send requests to connect and unlock real-time direct chat upon acceptance.
              </p>

              <div className="mt-6 flex flex-wrap gap-3.5">
                <button
                  onClick={() =>
                    requireAuth(() => setIdeaModalOpen(true))
                  }
                  className="h-11 px-6 rounded-full bg-white text-black font-bold text-[13.5px] hover:bg-zinc-200 transition"
                >
                  Post Your Idea →
                </button>
                {currentUser ? (
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="h-11 px-6 rounded-full border border-white/20 bg-zinc-900 text-white font-semibold text-[13px] hover:bg-zinc-800 transition"
                  >
                    Open My Role Dashboard ({currentUser.role.toUpperCase()})
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setAuthModalOpen(true);
                    }}
                    className="h-11 px-6 rounded-full border border-white/20 bg-zinc-900 text-white font-semibold text-[13px] hover:bg-zinc-800 transition"
                  >
                    Register Account (Choose Role)
                  </button>
                )}
              </div>
            </div>

            {/* Quick Role Explanation Card */}
            <div className="rounded-[24px] border border-white/15 bg-zinc-950 p-6 border-glow">
              <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                Ecosystem Workflow
              </div>
              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">1. Single Role Account</span>
                    <p className="text-zinc-400 mt-0.5">Register as Founder, Builder, or Backer.</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 border border-white/10">Step 1</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">2. Send Connection Request</span>
                    <p className="text-zinc-400 mt-0.5">Pitch backers or offer skills to ideas.</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 border border-white/10">Step 2</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">3. Accept & Direct Chat</span>
                    <p className="text-zinc-400 mt-0.5">Accept request to open live direct chat.</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white text-black font-bold">Step 3</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================================================
         TAB 1: IDEAS BOARD (FRONT PAGE SHOWCASE)
         ========================================================================== */}
      {activeTab === "ideas" && (
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

            <button
              onClick={() =>
                requireAuth(() => setIdeaModalOpen(true))
              }
              className="h-10 px-5 rounded-full bg-white text-black font-bold text-[13px] hover:bg-zinc-200 transition shrink-0"
            >
              + Post Idea
            </button>
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
                      : "bg-zinc-950 text-zinc-400 border-white/10 hover:border-white/30"
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
                className="w-full h-10 rounded-full bg-zinc-950 border border-white/15 px-4 text-[13px] text-white placeholder-zinc-500 outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="rounded-[24px] border border-white/10 bg-zinc-950 p-6 flex flex-col justify-between hover:border-white/30 transition border-glow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-zinc-900 border border-white/15 text-zinc-300">
                      {idea.category}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-black">
                      ✓ ID VERIFIED
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-[22px] mt-4 text-white">
                    {idea.title}
                  </h3>

                  <div className="text-[12px] text-zinc-400 mt-1 font-medium flex items-center gap-2">
                    <span>Founder: {idea.founder}</span>
                    {idea.studentId && (
                      <span className="text-[10.5px] text-zinc-500 font-mono">
                        ({idea.studentId})
                      </span>
                    )}
                  </div>

                  <p className="text-[14px] text-zinc-300 leading-[1.6] mt-4">
                    {idea.desc}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[12px] text-zinc-400">
                    <span className="font-semibold text-white">Seeking:</span>{" "}
                    <span className="text-zinc-300">{idea.seeking}</span>
                  </div>

                  <button
                    onClick={() =>
                      requireAuth(() => {
                        setTargetConnectItem(idea);
                        setConnectModalOpen(true);
                      })
                    }
                    className="h-10 px-5 rounded-full bg-white text-black text-[12.5px] font-bold hover:bg-zinc-200 transition shrink-0"
                  >
                    Connect / Pitch →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==========================================================================
         TAB 2: SKILLED TALENT DIRECTORY
         ========================================================================== */}
      {activeTab === "talent" && (
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
              className="h-10 px-5 rounded-full border border-white/20 bg-zinc-950 text-white font-semibold text-[13px] hover:bg-zinc-800 transition"
            >
              + Register as Skilled Talent
            </button>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {builders.map((b) => (
              <div
                key={b.id}
                className="rounded-[22px] border border-white/10 bg-zinc-950 p-5 flex flex-col justify-between hover:border-white/25 transition border-glow"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-full bg-white text-black grid place-items-center font-bold font-heading text-[16px]">
                      {b.name[0]}
                    </div>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-white/15">
                      ✓ STUDENT ID
                    </span>
                  </div>

                  <div className="font-heading font-bold text-[18px] mt-4 text-white">
                    {b.name}
                  </div>
                  <div className="text-[12px] font-semibold text-zinc-300 mt-0.5">
                    {b.role}
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-white/5 text-[12px]">
                    <div className="text-zinc-400 text-[10.5px] font-bold uppercase tracking-wider">
                      Skills
                    </div>
                    <div className="text-zinc-200 mt-1 font-medium">{b.skills}</div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    requireAuth(() => {
                      setTargetConnectItem(b);
                      setConnectModalOpen(true);
                    })
                  }
                  className="mt-5 w-full h-9 rounded-full border border-white/20 text-[12px] font-semibold text-white hover:bg-white hover:text-black transition"
                >
                  Invite to Team →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==========================================================================
         TAB 3: BACKERS HUB
         ========================================================================== */}
      {activeTab === "backers" && (
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
              className="h-10 px-5 rounded-full border border-white/20 bg-zinc-950 text-white font-semibold text-[13px] hover:bg-zinc-800 transition"
            >
              + Register as Backer
            </button>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {funders.map((f) => (
              <div
                key={f.id}
                className="rounded-[24px] border border-white/15 bg-zinc-950 p-6 flex flex-col justify-between hover:border-white/30 transition border-glow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-full border border-white/20 bg-zinc-900 grid place-items-center font-bold text-white font-heading text-[15px]">
                      {f.name[0]}
                    </div>
                    <span className="text-[10.5px] font-bold px-3 py-1 rounded-full bg-white text-black">
                      {f.ticketSize}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-[20px] mt-4 text-white">
                    {f.name}
                  </h3>
                  <div className="text-[12px] text-zinc-400 font-medium">
                    {f.role}
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-zinc-900 border border-white/10 text-[12px]">
                    <span className="text-zinc-400 font-semibold">Focus Areas:</span>{" "}
                    <span className="text-white">{f.focus}</span>
                  </div>

                  <p className="text-[13.5px] text-zinc-300 leading-[1.55] mt-4">
                    {f.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() =>
                      requireAuth(() => {
                        setTargetConnectItem(f);
                        setConnectModalOpen(true);
                      })
                    }
                    className="w-full h-10 rounded-full bg-white text-black text-[12.5px] font-bold hover:bg-zinc-200 transition"
                  >
                    Pitch Idea to Backer →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==========================================================================
         TAB 4: EVENTS & MEETUPS
         ========================================================================== */}
      {activeTab === "events" && (
        <section id="events" className="mx-auto max-w-[1200px] px-5 md:px-8 py-12">
          <div className="border-b border-white/10 pb-6">
            <div className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
              MEETUPS & PITCH DAYS
            </div>
            <h2 className="font-heading text-[28px] md:text-[36px] font-extrabold mt-1">
              Upcoming Community Events
            </h2>
            <p className="text-[13.5px] text-zinc-400 mt-1 max-w-[600px]">
              Present your idea or meet co-founders in person & online.
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-[24px] border border-white/10 bg-zinc-950 p-6 flex flex-col justify-between hover:border-white/30 transition border-glow"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold px-3 py-1 rounded-full bg-zinc-900 border border-white/15 text-zinc-300 uppercase">
                      {ev.category}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {ev.date}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-[20px] mt-4 text-white">
                    {ev.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-[12.5px] text-zinc-300">
                    <div>🕒 <strong>Time:</strong> {ev.time}</div>
                    <div>📍 <strong>Venue:</strong> {ev.venue}</div>
                  </div>

                  <p className="text-[13.5px] text-zinc-400 leading-[1.55] mt-4">
                    {ev.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setTargetEvent(ev);
                      setEventModalOpen(true);
                    }}
                    className="w-full h-10 rounded-full bg-white text-black text-[12.5px] font-bold hover:bg-zinc-200 transition"
                  >
                    RSVP for Event →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==========================================================================
         TAB 5: ROLE-SPECIFIC DASHBOARD (FOR LOGGED IN USER)
         ========================================================================== */}
      {activeTab === "dashboard" && currentUser && (
        <section className="mx-auto max-w-[1200px] px-5 md:px-8 py-10">
          {/* Dashboard Header */}
          <div className="rounded-[28px] border border-white/15 bg-zinc-950 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-glow">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase">
                  {currentUser.role} DASHBOARD
                </span>
                {currentUser.studentId && (
                  <span className="text-[11px] text-zinc-400 font-mono">
                    ({currentUser.studentId})
                  </span>
                )}
              </div>
              <h1 className="font-heading text-[28px] md:text-[34px] font-extrabold mt-2 text-white">
                Welcome, {currentUser.name}
              </h1>
              <p className="text-[13.5px] text-zinc-400 mt-1">
                {currentUser.role === "founder" && "Manage your posted startup ideas, view incoming talent & backer requests, and chat directly."}
                {currentUser.role === "talent" && "View your builder profile, track incoming team invites, and talk to founders."}
                {currentUser.role === "backer" && "View founder pitches, manage dealflow inquiries, and chat directly with student startups."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {currentUser.role === "founder" && (
                <button
                  onClick={() => setIdeaModalOpen(true)}
                  className="h-10 px-5 rounded-full bg-white text-black font-bold text-[12.5px] hover:bg-zinc-200 transition"
                >
                  + Post New Idea
                </button>
              )}
            </div>
          </div>

          {/* DASHBOARD GRID */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {/* COLUMN 1: INCOMING REQUESTS (Accept / Decline Flow) */}
            <div className="space-y-6">
              <div className="rounded-[24px] border border-white/10 bg-zinc-950 p-6 border-glow">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-heading font-extrabold text-[18px]">
                      Incoming Connection Requests
                    </h3>
                    <div className="text-[12px] text-zinc-400">
                      Requests sent to you or your startup ideas.
                    </div>
                  </div>
                  <span className="h-7 px-3 rounded-full bg-zinc-900 border border-white/15 text-white font-bold text-xs grid place-items-center">
                    {myIncomingRequests.length}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {myIncomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white text-[13.5px]">
                            {req.senderName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 uppercase font-bold border border-white/10">
                            {req.senderRole}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-zinc-400 mt-0.5">
                          Re: <strong>{req.targetTitle}</strong> • {req.createdAt}
                        </div>
                        <p className="text-[13px] text-zinc-300 mt-2 bg-zinc-950 p-3 rounded-xl border border-white/5">
                          "{req.message}"
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        {req.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleRejectRequest(req.id)}
                              className="h-8 px-3 rounded-full border border-white/15 text-[11.5px] font-semibold text-zinc-400 hover:text-white"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptRequest(req.id)}
                              className="h-8 px-4 rounded-full bg-white text-black text-[11.5px] font-bold hover:bg-zinc-200"
                            >
                              ✓ Accept Request
                            </button>
                          </>
                        ) : req.status === "accepted" ? (
                          <span className="text-[11.5px] font-bold text-white flex items-center gap-2">
                            <span>✓ Accepted</span>
                            <button
                              onClick={() => {
                                setActiveChatRequest(req);
                                setChatModalOpen(true);
                              }}
                              className="h-8 px-4 rounded-full bg-white text-black text-[11.5px] font-bold"
                            >
                              Open Live Chat 💬
                            </button>
                          </span>
                        ) : (
                          <span className="text-[11.5px] text-zinc-500 font-medium">Declined</span>
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
              <div className="rounded-[24px] border border-white/10 bg-zinc-950 p-6 border-glow">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-heading font-extrabold text-[18px]">
                    My Sent Requests
                  </h3>
                  <span className="text-xs text-zinc-400">{myOutgoingRequests.length} total</span>
                </div>

                <div className="mt-4 space-y-3">
                  {myOutgoingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">To: {req.receiverName}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">Re: {req.targetTitle}</div>
                      </div>
                      <div>
                        {req.status === "accepted" ? (
                          <button
                            onClick={() => {
                              setActiveChatRequest(req);
                              setChatModalOpen(true);
                            }}
                            className="h-8 px-3.5 rounded-full bg-white text-black font-bold text-[11px]"
                          >
                            Chat Now 💬
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10.5px] capitalize font-medium">
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
              <div className="rounded-[24px] border border-white/15 bg-zinc-950 p-6 border-glow">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-heading font-extrabold text-[18px]">
                      Active Connections & Direct Chats
                    </h3>
                    <div className="text-[12px] text-zinc-400">
                      Unlocked messaging with accepted partners.
                    </div>
                  </div>
                  <span className="h-7 px-3 rounded-full bg-white text-black font-bold text-xs grid place-items-center">
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
                        className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between hover:border-white/30 transition cursor-pointer"
                        onClick={() => {
                          setActiveChatRequest(req);
                          setChatModalOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white text-black grid place-items-center font-bold font-heading text-[14px]">
                            {partnerName[0]}
                          </div>
                          <div>
                            <div className="font-bold text-white text-[14px]">
                              {partnerName}
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              Topic: {req.targetTitle} • {partnerRole.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <button className="h-9 px-4 rounded-full bg-white text-black font-bold text-[11.5px]">
                          Open Chat 💬
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
                <div className="rounded-[24px] border border-white/10 bg-zinc-950 p-6 border-glow">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="font-heading font-extrabold text-[18px]">
                      My Posted Ideas ({myIdeas.length})
                    </h3>
                    <button
                      onClick={() => setIdeaModalOpen(true)}
                      className="text-xs text-white font-bold hover:underline"
                    >
                      + Add Idea
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {myIdeas.map((idea) => (
                      <div
                        key={idea.id}
                        className="p-4 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-white text-[14px]">{idea.title}</div>
                          <div className="text-[11.5px] text-zinc-400 mt-0.5">
                            Category: {idea.category} • Seeking: {idea.seeking}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-white/10 text-[10.5px] text-zinc-300 font-medium">
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
      <footer className="border-t border-white/10 bg-[#121214] text-zinc-400 py-10">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[12.5px]">
          <div className="flex items-center gap-3.5">
            <img
              src={logoImg}
              alt="Startify Logo"
              className="h-8 w-8 rounded-full border border-white/20 object-cover"
            />
            <div>
              <span className="font-bold text-white font-heading text-[15px]">
                STARTIFY
              </span>
              <span className="text-zinc-500 ml-2">© {new Date().getFullYear()}</span>
            </div>
          </div>

          <div className="text-zinc-500 text-center md:text-left text-[11.5px]">
            Open Community Ecosystem • Powered for UoH members & startup collaborators
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
            <button onClick={() => setActiveTab("ideas")} className="hover:text-white transition">
              Ideas
            </button>
            <button onClick={() => setActiveTab("events")} className="hover:text-white transition">
              Meetups
            </button>
          </div>
        </div>
      </footer>

      {/* ==========================================================================
         MODALS
         ========================================================================== */}

      {/* MODAL 1: AUTH / SIGN IN / SINGLE ROLE REGISTRATION */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setAuthModalOpen(false)}
          />
          <div className="relative w-full max-w-[460px] rounded-[28px] bg-zinc-950 border border-white/20 shadow-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="font-heading font-extrabold text-[22px]">
                  {authMode === "signin" ? "Sign In to Startify" : "Register Single Role Account"}
                </div>
                <div className="text-[12px] text-zinc-400 mt-0.5">
                  Must be logged in to post, send requests, or chat.
                </div>
              </div>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/20 grid place-items-center text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-full border border-white/10 text-xs font-semibold text-center">
              <button
                onClick={() => setAuthMode("signin")}
                className={`py-2 rounded-full transition ${
                  authMode === "signin" ? "bg-white text-black font-bold" : "text-zinc-400"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`py-2 rounded-full transition ${
                  authMode === "register" ? "bg-white text-black font-bold" : "text-zinc-400"
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-5 space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-300 mb-1.5">
                    Select Your Single Account Role *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRegisterRole("founder")}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-bold text-center transition ${
                        selectedRegisterRole === "founder"
                          ? "bg-white text-black border-white"
                          : "bg-zinc-900 text-zinc-400 border-white/10"
                      }`}
                    >
                      💡 Founder
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRegisterRole("talent")}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-bold text-center transition ${
                        selectedRegisterRole === "talent"
                          ? "bg-white text-black border-white"
                          : "bg-zinc-900 text-zinc-400 border-white/10"
                      }`}
                    >
                      ⚡ Builder
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRegisterRole("backer")}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-bold text-center transition ${
                        selectedRegisterRole === "backer"
                          ? "bg-white text-black border-white"
                          : "bg-zinc-900 text-zinc-400 border-white/10"
                      }`}
                    >
                      💼 Backer
                    </button>
                  </div>
                </div>
              )}

              {authMode === "register" && (
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="Your Full Name"
                    className="w-full h-11 rounded-full bg-zinc-900 border border-white/15 px-4 text-[13px] text-white outline-none focus:border-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full h-11 rounded-full bg-zinc-900 border border-white/15 px-4 text-[13px] text-white outline-none focus:border-white"
                />
              </div>

              {authMode === "register" && (
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
                    Student ID No. (Verification)
                  </label>
                  <input
                    value={authForm.studentId}
                    onChange={(e) => setAuthForm({ ...authForm, studentId: e.target.value })}
                    placeholder="e.g. UOH-2024-CS101"
                    className="w-full h-11 rounded-full bg-zinc-900 border border-white/15 px-4 text-[13px] text-white outline-none focus:border-white"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-white text-black font-bold text-[14px] hover:bg-zinc-200 transition"
              >
                {authMode === "signin" ? "Sign In & Continue →" : `Create ${selectedRegisterRole.toUpperCase()} Account →`}
              </button>
            </form>
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
          <div className="relative w-full max-w-[480px] rounded-[28px] bg-zinc-950 border border-white/20 shadow-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="font-heading font-extrabold text-[22px]">
                  Post Startup Idea
                </div>
                <div className="text-[12px] text-zinc-400 mt-0.5">
                  Posting as <strong>{currentUser?.name}</strong> (Student ID Verified)
                </div>
              </div>
              <button
                onClick={() => setIdeaModalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/20 grid place-items-center text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIdeaSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
                  Idea / Project Title *
                </label>
                <input
                  required
                  value={newIdeaForm.title}
                  onChange={(e) => setNewIdeaForm({ ...newIdeaForm, title: e.target.value })}
                  placeholder="e.g. CampusKart, StudyBuddy AI..."
                  className="w-full h-11 rounded-full bg-zinc-900 border border-white/15 px-4 text-[13px] text-white outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newIdeaForm.category}
                    onChange={(e) => setNewIdeaForm({ ...newIdeaForm, category: e.target.value })}
                    className="w-full h-11 rounded-full bg-zinc-900 border border-white/15 px-4 text-[13px] text-white outline-none focus:border-white"
                  >
                    <option>Tech / AI</option>
                    <option>E-Commerce / D2C</option>
                    <option>Food & Services</option>
                    <option>EdTech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
                    Seeking Role
                  </label>
                  <select
                    value={newIdeaForm.seeking}
                    onChange={(e) => setNewIdeaForm({ ...newIdeaForm, seeking: e.target.value })}
                    className="w-full h-11 rounded-full bg-zinc-900 border border-white/15 px-4 text-[13px] text-white outline-none focus:border-white"
                  >
                    <option>Tech Co-Founder</option>
                    <option>UI/UX Designer</option>
                    <option>Growth Lead</option>
                    <option>Pre-Seed Backer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
                  Student ID No. * (Verification)
                </label>
                <input
                  required
                  value={newIdeaForm.studentId || currentUser?.studentId || ""}
                  onChange={(e) => setNewIdeaForm({ ...newIdeaForm, studentId: e.target.value })}
                  placeholder="e.g. UOH-2024-XX"
                  className="w-full h-11 rounded-full bg-zinc-900 border border-white/15 px-4 text-[13px] text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
                  Idea Description & Vision *
                </label>
                <textarea
                  required
                  value={newIdeaForm.desc}
                  onChange={(e) => setNewIdeaForm({ ...newIdeaForm, desc: e.target.value })}
                  placeholder="Describe your startup idea in 2-3 clear sentences..."
                  className="w-full min-h-[90px] rounded-[20px] bg-zinc-900 border border-white/15 p-4 text-[13px] text-white outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-white text-black font-bold text-[14px] hover:bg-zinc-200 transition"
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
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="font-heading font-extrabold text-[20px]">
                  Send Connection Request
                </div>
                <div className="text-[12px] text-zinc-400 mt-0.5">
                  To: <strong>{targetConnectItem?.founder || targetConnectItem?.name}</strong> ({targetConnectItem?.title || targetConnectItem?.role})
                </div>
              </div>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/20 grid place-items-center text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
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
                className="w-full h-12 rounded-full bg-white text-black font-bold text-[14px] hover:bg-zinc-200 transition"
              >
                Send Request →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DIRECT CHAT / LIVE MESSAGING MODAL */}
      {chatModalOpen && activeChatRequest && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setChatModalOpen(false)}
          />
          <div className="relative w-full max-w-[540px] h-[540px] rounded-[28px] bg-zinc-950 border border-white/20 shadow-2xl flex flex-col justify-between overflow-hidden text-white">
            {/* Chat Top Header */}
            <div className="p-5 bg-zinc-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white text-black grid place-items-center font-bold font-heading text-[15px]">
                  {activeChatRequest.senderId === currentUser.id
                    ? activeChatRequest.receiverName[0]
                    : activeChatRequest.senderName[0]}
                </div>
                <div>
                  <div className="font-heading font-bold text-[16px]">
                    {activeChatRequest.senderId === currentUser.id
                      ? activeChatRequest.receiverName
                      : activeChatRequest.senderName}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Topic: {activeChatRequest.targetTitle} • Connection Accepted ✓
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatModalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/20 grid place-items-center text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3 bg-[#121214]">
              {messages
                .filter((m) => m.requestId === activeChatRequest.id)
                .map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className="text-[10px] text-zinc-500 mb-1 px-1">
                        {isMe ? "You" : msg.senderName} • {msg.createdAt}
                      </div>
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-[1.5] ${
                          isMe
                            ? "bg-white text-black font-medium"
                            : "bg-zinc-900 text-zinc-100 border border-white/10"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

              {messages.filter((m) => m.requestId === activeChatRequest.id).length === 0 && (
                <div className="text-center py-10 text-zinc-500 text-xs">
                  Connection request accepted! Send the first message to start talking.
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-4 bg-zinc-900 border-t border-white/10 flex items-center gap-3"
            >
              <input
                required
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 h-11 rounded-full bg-zinc-950 border border-white/15 px-4 text-[13.5px] text-white outline-none focus:border-white"
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-full bg-white text-black font-bold text-[13px] hover:bg-zinc-200 transition"
              >
                Send 💬
              </button>
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
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="font-heading font-extrabold text-[20px]">
                  RSVP: {targetEvent?.title}
                </div>
                <div className="text-[12px] text-zinc-400 mt-0.5">
                  {targetEvent?.date} • {targetEvent?.venue}
                </div>
              </div>
              <button
                onClick={() => setEventModalOpen(false)}
                className="h-8 w-8 rounded-full border border-white/20 grid place-items-center text-zinc-400 hover:text-white"
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
                <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={eventRegisterForm.name || currentUser?.name || ""}
                  onChange={(e) =>
                    setEventRegisterForm({ ...eventRegisterForm, name: e.target.value })
                  }
                  placeholder="Your Name"
                  className="w-full h-11 rounded-full bg-zinc-900 border border-white/15 px-4 text-[13px] text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-zinc-300 mb-1">
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
                  className="w-full h-11 rounded-full bg-zinc-900 border border-white/15 px-4 text-[13px] text-white outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-white text-black font-bold text-[14px] hover:bg-zinc-200 transition"
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
