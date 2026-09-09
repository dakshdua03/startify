// Startify Database Service (Firebase + Local Fallback)
// Handles Firestore (ideas/registrations/payments) and Email OTP via Firestore with Firebase Auth fallback
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  try { db = getFirestore(app); } catch (e) { console.warn("Firestore init failed", e); }
  try { auth = getAuth(app); } catch (e) { console.warn("Auth init failed", e); }
}

export { app, db, auth };

// Keep legacy export names for App.jsx compatibility
export const isSupabaseConfigured = isFirebaseConfigured;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const authService = {
  async sendOtp(email) {
    const target = email.trim().toLowerCase();
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured — set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID");
    const code = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    try {
      await setDoc(doc(db, "email_otps", target), {
        code,
        email: target,
        createdAt: Date.now(),
        expiresAt,
        verified: false,
      });
    } catch (err) {
      console.warn("Firestore OTP store failed, falling back to local", err);
      // fallback to local storage for dev without Firestore rules
      try {
        const store = JSON.parse(localStorage.getItem("startify_email_verification") || "{}");
        store[target] = { code, at: Date.now(), expiresAt, verified: false };
        localStorage.setItem("startify_email_verification", JSON.stringify(store));
      } catch {}
      // still throw? No — allow demo toast with code
      console.log(`[DEV OTP] ${target}: ${code}`);
      return true;
    }
    // Best effort: try Firebase Email Link (sends real email via Firebase). If not configured, log code for dev.
    if (auth) {
      try {
        const actionCodeSettings = {
          url: window.location.href,
          handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, target, actionCodeSettings);
        // Firebase sent email link — we still keep 6-digit code as primary for this UI
        window.localStorage.setItem("emailForSignIn", target);
      } catch (e) {
        console.warn("Firebase sendSignInLinkToEmail failed (using 6-digit code only)", e?.message || e);
      }
    }
    // In dev, show code in console/toast helper — App.jsx will show toast
    console.log(`[Firebase OTP] ${target}: ${code} (valid 5 min)`);
    // Also store code locally so demo can display if Firestore read fails due to rules
    try {
      const store = JSON.parse(localStorage.getItem("startify_email_verification") || "{}");
      store[target] = { code, at: Date.now(), expiresAt, verified: false, cloud: true };
      localStorage.setItem("startify_email_verification", JSON.stringify(store));
    } catch {}
    return true;
  },
  async verifyOtp(email, token) {
    const target = email.trim().toLowerCase();
    const input = token.trim();
    if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured");
    // First: check if it's a Firebase email link (optional)
    if (auth && isSignInWithEmailLink(auth, window.location.href)) {
      try {
        const emailForLink = window.localStorage.getItem("emailForSignIn") || target;
        const result = await signInWithEmailLink(auth, emailForLink, window.location.href);
        if (result.user) return true;
      } catch (e) {
        console.warn("Email link verification failed", e?.message);
      }
    }
    // Primary: 6-digit code stored in Firestore
    try {
      const snap = await getDoc(doc(db, "email_otps", target));
      if (snap.exists()) {
        const data = snap.data();
        if (Date.now() > data.expiresAt) throw new Error("OTP expired — request a new code");
        if (data.code !== input) throw new Error("Invalid OTP");
        await setDoc(doc(db, "email_otps", target), { ...data, verified: true }, { merge: true });
        return true;
      }
    } catch (err) {
      // If Firestore read fails (rules/network), fallback to local store
      if (err?.message?.includes("Invalid OTP") || err?.message?.includes("expired")) throw err;
      console.warn("Firestore OTP verify fallback to local", err?.message);
    }
    // Local fallback
    try {
      const store = JSON.parse(localStorage.getItem("startify_email_verification") || "{}");
      const entry = store[target];
      if (entry && entry.code === input) {
        if (Date.now() > entry.expiresAt) throw new Error("OTP expired");
        entry.verified = true;
        localStorage.setItem("startify_email_verification", JSON.stringify(store));
        return true;
      }
    } catch (e) {
      if (e?.message?.includes("expired")) throw e;
    }
    // Dev helper: if code was logged, allow it? No strict fail
    throw new Error("Invalid or expired OTP — check email / console for code");
  }
};

const defaultSiteContent = {
  heroHeadline: "Where UoH ideas meet co-founders, talent & funders.",
  heroSub: "Startify is the open social hub for University of Hyderabad student founders. Register your idea, find coders & designers, get early feedback, or join an 8-week accelerator cohort led by founder Daksh Dua.",
  statStartups: "11",
  statMembers: "210+",
  statGrowth: "2.6x",
  founderName: "Daksh Dua",
  founderTitle: "Founder of Startify • UoH Accelerator Lead",
  proPassPrice: 299,
  acceleratorPrice: 4999,
  instagramHandle: "@dakshdua03"
};

const defaultServicesList = [
  { id: "validation", title: "Idea Validation Sprint", price: "₹999", amount: 999, sub: "Free for UoH Batch 1", time: "7 days", desc: "Kill bad ideas fast. 30+ customer interviews, landing test, pricing validation.", outcome: "Go / No-Go Report" },
  { id: "mvp", title: "MVP Build Sprint", price: "₹3,499", amount: 3499, sub: "Team from Talent Pool", time: "30 days", desc: "Daksh matches you with vetted builders to ship your MVP. Full scope & launch management.", outcome: "Live MVP + Users" },
  { id: "growth", title: "Growth Engine", price: "₹1,999/mo", amount: 1999, sub: "Most Popular", time: "Ongoing", desc: "Distribution strategy, content engine, and sales systems worked weekly with Daksh.", outcome: "2x Revenue Growth" },
  { id: "fundraise", title: "Fundraising Prep", price: "₹1,999", amount: 1999, sub: "Deck & Investor Intros", time: "10 days", desc: "Pitch deck refinement, financial modeling, and intros to angel mentors in our network.", outcome: "Investor Ready Deck" },
];

export const dbService = {
  async getSiteContent() {
    const local = localStorage.getItem("startify_site_content");
    if (local) {
      try { return { ...defaultSiteContent, ...JSON.parse(local) }; } catch (e) { console.error(e); }
    }
    return defaultSiteContent;
  },
  async saveSiteContent(content) {
    localStorage.setItem("startify_site_content", JSON.stringify(content));
    return true;
  },
  async getServices() {
    const local = localStorage.getItem("startify_offered_services");
    if (local) {
      try { return JSON.parse(local); } catch (e) { console.error(e); }
    }
    return defaultServicesList;
  },
  async saveServices(services) {
    localStorage.setItem("startify_offered_services", JSON.stringify(services));
    return true;
  },
  async getIdeas(defaultIdeas = []) {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "ideas"), orderBy("created_at", "desc"), limit(50));
        const snap = await getDocs(q);
        const cloudIdeas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (cloudIdeas && cloudIdeas.length > 0) return cloudIdeas;
      } catch (err) { console.warn("Firestore fetch ideas failed, using local", err); }
    }
    const local = localStorage.getItem("startify_submitted_ideas");
    if (local) {
      try { return [...JSON.parse(local), ...defaultIdeas]; } catch (e) { console.error(e); }
    }
    return defaultIdeas;
  },
  async saveIdea(idea) {
    const existing = JSON.parse(localStorage.getItem("startify_submitted_ideas") || "[]");
    localStorage.setItem("startify_submitted_ideas", JSON.stringify([idea, ...existing]));
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, "ideas"), {
          title: idea.title,
          category: idea.category,
          founder: idea.founder,
          email: idea.email || "",
          founderId: idea.founderId || "",
          desc: idea.desc,
          seeking: idea.seeking,
          status: idea.status || "Pending Review",
          created_at: serverTimestamp(),
          createdDate: idea.createdDate || new Date().toISOString(),
        });
      } catch (err) { console.warn("Firestore idea save error", err); }
    }
    // also ping Cloudflare Function (keeps wrangler binding working)
    try {
      await fetch("/api/ideas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(idea) });
    } catch {}
    return true;
  },
  async getRegistrations() {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "registrations"), orderBy("created_at", "desc"), limit(100));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => d.data());
        if (data && data.length > 0) return data;
      } catch (e) { console.warn("Firestore registration fetch fallback", e); }
    }
    const local = localStorage.getItem("startify_registrations");
    return local ? JSON.parse(local) : [
      { name: "Rahul Sharma", email: "rahul@uohyd.ac.in", role: "founder", year: "3rd Year", ideaOrSkills: "Building EdTech AI Assistant", contact: "9876543210", registeredAt: "2026-08-23" },
      { name: "Aditi Rao", email: "aditi@uohyd.ac.in", role: "builder", year: "4th Year CSE", ideaOrSkills: "React, Tailwind, Node.js", contact: "9123456789", registeredAt: "2026-08-22" },
      { name: "Karan Patel", email: "karan@angelnet.in", role: "funder", year: "Alumni", ideaOrSkills: "Angel investor looking for SaaS ideas", contact: "9988776655", registeredAt: "2026-08-21" }
    ];
  },
  async saveRegistration(reg) {
    const existing = JSON.parse(localStorage.getItem("startify_registrations") || "[]");
    localStorage.setItem("startify_registrations", JSON.stringify([reg, ...existing]));
    try { await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reg) }); } catch (e) { console.warn("Cloudflare API ping", e); }
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, "registrations"), { ...reg, created_at: serverTimestamp() });
      } catch (err) { console.warn("Firestore registration save error", err); }
    }
    return true;
  },
  async getPayments() {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "payments"), orderBy("created_at", "desc"), limit(100));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => d.data());
        if (data && data.length > 0) return data;
      } catch (e) { console.warn("Firestore payment fetch fallback", e); }
    }
    const local = localStorage.getItem("startify_payments");
    return local ? JSON.parse(local) : [
      { paymentId: "pay_sample_101", service: "Idea Validation Sprint", amount: 999, user: "Rahul Sharma", contact: "9876543210", timestamp: "2026-08-23 14:30", status: "SUCCESS" },
      { paymentId: "pay_sample_102", service: "Pro Founder Pass", amount: 299, user: "Priya Roy", contact: "9811223344", timestamp: "2026-08-23 16:10", status: "SUCCESS" }
    ];
  },
  async savePayment(payment) {
    const existing = JSON.parse(localStorage.getItem("startify_payments") || "[]");
    localStorage.setItem("startify_payments", JSON.stringify([payment, ...existing]));
    if (isFirebaseConfigured && db) {
      try { await addDoc(collection(db, "payments"), { ...payment, created_at: serverTimestamp() }); } catch (err) { console.warn("Firestore payment save error", err); }
    }
    return true;
  }
};
