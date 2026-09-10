// Startify Database Service (Firebase + Local Fallback) — Password + Email Link
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut, onAuthStateChanged } from 'firebase/auth';

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
// Debug: log config status once
if (typeof window !== "undefined") {
  console.log(`[Startify Firebase] configured=${isFirebaseConfigured} project=${firebaseConfig.projectId || "none"}`);
  if (!isFirebaseConfigured) console.warn("Firebase NOT configured — set VITE_FIREBASE_* in .env and Cloudflare Pages vars");
}

export { app, db, auth };
export const isSupabaseConfigured = isFirebaseConfigured; // alias for App.jsx

export const authService = {
  async signUp(email, password) {
    if (!isFirebaseConfigured || !auth) throw new Error("Firebase not configured — set VITE_FIREBASE_*");
    const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    try {
      await sendEmailVerification(cred.user, { url: window.location.origin, handleCodeInApp: false });
    } catch (e) {
      console.warn("sendEmailVerification failed", e?.message);
      throw new Error(`Failed to send verification email: ${e?.message || e}`);
    }
    try { await signOut(auth); } catch {}
    return cred.user;
  },
  async signIn(email, password) {
    if (!isFirebaseConfigured || !auth) throw new Error("Firebase not configured");
    const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      throw new Error("Please verify your email first — click the link sent to your inbox (check spam). Click Resend link if needed.");
    }
    return cred.user;
  },
  async resendVerification(email, password) {
    if (!isFirebaseConfigured || !auth) throw new Error("Firebase not configured");
    // Need to sign in temporarily to resend
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      if (cred.user.emailVerified) {
        await signOut(auth);
        throw new Error("Already verified — please Sign In.");
      }
      await sendEmailVerification(cred.user, { url: window.location.origin, handleCodeInApp: false });
      await signOut(auth);
      return true;
    } catch (e) {
      if (e?.message?.includes("Already verified")) throw e;
      // If wrong password, fall back to password reset flow hint
      throw e;
    }
  },
  async sendPasswordReset(email) {
    if (!isFirebaseConfigured || !auth) throw new Error("Firebase not configured");
    await sendPasswordResetEmail(auth, email.trim().toLowerCase(), { url: window.location.origin, handleCodeInApp: false });
    return true;
  },
  // Call on app start to handle email link verification redirect
  onAuthStateChanged(callback) {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
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
    if (local) { try { return { ...defaultSiteContent, ...JSON.parse(local) }; } catch (e) { console.error(e); } }
    return defaultSiteContent;
  },
  async saveSiteContent(content) { localStorage.setItem("startify_site_content", JSON.stringify(content)); return true; },
  async getServices() {
    const local = localStorage.getItem("startify_offered_services");
    if (local) { try { return JSON.parse(local); } catch (e) { console.error(e); } }
    return defaultServicesList;
  },
  async saveServices(services) { localStorage.setItem("startify_offered_services", JSON.stringify(services)); return true; },
  async getIdeas(defaultIdeas = []) {
    let cloudIdeas = [];
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "ideas"), orderBy("created_at", "desc"), limit(50));
        const snap = await getDocs(q);
        cloudIdeas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) { console.warn("Firestore fetch ideas failed, using local", err); }
    }
    const local = (()=>{ try{ return JSON.parse(localStorage.getItem("startify_submitted_ideas")||"[]"); }catch{return [];} })();
    // Handle soft-deleted demos (admin tombstones)
    const deletedIds = new Set(local.filter(i=> i.deleted).map(i=>i.id));
    const filteredDefault = defaultIdeas.filter(i=> !deletedIds.has(i.id));
    const filteredLocal = local.filter(i=> !i.deleted);
    const filteredCloud = cloudIdeas.filter(i=> !i.deleted && !deletedIds.has(i.id));
    // Merge cloud + local + default (demos treated as real), dedupe by id, cloud newest first
    const map = new Map();
    [...filteredDefault, ...filteredLocal].forEach(i=> { if(i && i.id) map.set(i.id, i); });
    filteredCloud.forEach(i=> { if(i && i.id) map.set(i.id, i); });
    const merged = Array.from(map.values());
    if (merged.length > 0) return merged;
    if (filteredCloud.length > 0) return filteredCloud;
    if (filteredLocal.length > 0) return [...filteredLocal, ...filteredDefault];
    return filteredDefault;
  },
  async saveIdea(idea) {
    const existing = JSON.parse(localStorage.getItem("startify_submitted_ideas") || "[]");
    localStorage.setItem("startify_submitted_ideas", JSON.stringify([idea, ...existing]));
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, "ideas"), {
          title: idea.title, category: idea.category, founder: idea.founder, email: idea.email || "", founderId: idea.founderId || "",
          desc: idea.desc, seeking: idea.seeking, status: idea.status || "Pending Review",
          created_at: serverTimestamp(), createdDate: idea.createdDate || new Date().toISOString(),
        });
      } catch (err) { console.warn("Firestore idea save error", err); }
    }
    try { await fetch("/api/ideas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(idea) }); } catch {}
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
    if (isFirebaseConfigured && db) { try { await addDoc(collection(db, "registrations"), { ...reg, created_at: serverTimestamp() }); } catch (err) { console.warn("Firestore registration save error", err); } }
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
    if (isFirebaseConfigured && db) { try { await addDoc(collection(db, "payments"), { ...payment, created_at: serverTimestamp() }); } catch (err) { console.warn("Firestore payment save error", err); } }
    return true;
  }
};
