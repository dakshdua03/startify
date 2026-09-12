// Startify Database Service (Firebase + Local Fallback) — Password + Email Link
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDa2GrOS9xmrZGI-0W8BLE_vLu9XJr3i0A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "startify-01.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "startify-01",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "startify-01.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "451497028667",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:451497028667:web:356d1693d60a204095c01e",
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
  async signOut() {
    if (!auth) return;
    try { await signOut(auth); } catch {}
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
        const snap = await getDocs(collection(db, "ideas"));
        cloudIdeas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) { console.warn("Firestore fetch ideas failed, using local", err); }
    }
    const local = (()=>{ try{ return JSON.parse(localStorage.getItem("startify_submitted_ideas")||"[]"); }catch{return [];} })();
    // Handle soft-deleted demos (admin tombstones)
    const deletedIds = new Set(local.filter(i=> i.deleted).map(i=>i.id));
    const filteredDefault = defaultIdeas.filter(i=> !deletedIds.has(i.id));
    const filteredLocal = local.filter(i=> !i.deleted);
    const filteredCloud = cloudIdeas.filter(i=> !i.deleted && !deletedIds.has(i.id));
    // Merge: default -> local -> cloud (cloud always takes ultimate priority)
    const map = new Map();
    [...filteredDefault].forEach(i=> { if(i && i.id) map.set(i.id, i); });
    [...filteredLocal].forEach(i=> { if(i && i.id) map.set(i.id, i); });
    [...filteredCloud].forEach(i=> { if(i && i.id) map.set(i.id, i); });
    const merged = Array.from(map.values());
    if (merged.length > 0) return merged;
    return filteredDefault;
  },
  async saveIdea(idea) {
    const existing = JSON.parse(localStorage.getItem("startify_submitted_ideas") || "[]");
    localStorage.setItem("startify_submitted_ideas", JSON.stringify([idea, ...existing]));
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "ideas", idea.id), {
          id: idea.id,
          title: idea.title, category: idea.category, founder: idea.founder, email: idea.email || "", founderId: idea.founderId || "",
          desc: idea.desc, seeking: idea.seeking, status: idea.status || "Pending Review",
          created_at: serverTimestamp(), createdDate: idea.createdDate || new Date().toISOString(),
        }, { merge: true });
      } catch (err) { console.warn("Firestore idea save error", err); }
    }
    try { await fetch("/api/ideas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(idea) }); } catch {}
    return true;
  },
  async getRegistrations() {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "registrations"));
        return snap.docs.map(d => d.data());
      } catch (e) { console.warn("Firestore registration fetch fallback", e); }
    }
    const local = localStorage.getItem("startify_registrations");
    return local ? JSON.parse(local) : [];
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
        const snap = await getDocs(collection(db, "payments"));
        return snap.docs.map(d => d.data());
      } catch (e) { console.warn("Firestore payment fetch fallback", e); }
    }
    const local = localStorage.getItem("startify_payments");
    return local ? JSON.parse(local) : [];
  },
  async savePayment(payment) {
    const existing = JSON.parse(localStorage.getItem("startify_payments") || "[]");
    localStorage.setItem("startify_payments", JSON.stringify([payment, ...existing]));
    if (isFirebaseConfigured && db) { try { await addDoc(collection(db, "payments"), { ...payment, created_at: serverTimestamp() }); } catch (err) { console.warn("Firestore payment save error", err); } }
    return true;
  },

  // ---- Profiles (name/about/skills/focus per email+role) ----
  async getProfiles() {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "profiles"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("Firestore profiles fetch error", e); }
    }
    try { return JSON.parse(localStorage.getItem("startify_user_profiles") || "[]"); } catch { return []; }
  },
  async saveProfile(profile) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
      const idx = arr.findIndex(p => p.email.toLowerCase() === profile.email.toLowerCase() && p.role === profile.role);
      if (idx >= 0) arr[idx] = { ...arr[idx], ...profile };
      else arr.unshift(profile);
      localStorage.setItem("startify_user_profiles", JSON.stringify(arr));
    } catch {}
    if (isFirebaseConfigured && db) {
      try {
        const docId = `${profile.email.toLowerCase()}_${profile.role}`;
        await setDoc(doc(db, "profiles", docId), { ...profile, updated_at: serverTimestamp() }, { merge: true });
      } catch (e) { console.warn("Firestore profile save error", e); }
    }
    return true;
  },
  async deleteProfile(email, role) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_user_profiles") || "[]");
      localStorage.setItem("startify_user_profiles", JSON.stringify(arr.filter(p => !(p.email.toLowerCase() === email.toLowerCase() && p.role === role))));
    } catch {}
    if (isFirebaseConfigured && db) {
      try { await deleteDoc(doc(db, "profiles", `${email.toLowerCase()}_${role}`)); } catch (e) { console.warn("Firestore profile delete error", e); }
    }
    return true;
  },

  // ---- Connection requests (chats) ----
  async getRequests() {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "requests"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("Firestore requests fetch error", e); }
    }
    try { return JSON.parse(localStorage.getItem("startify_requests") || "[]"); } catch { return []; }
  },
  async saveRequest(req) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_requests") || "[]");
      const idx = arr.findIndex(r => r.id === req.id);
      if (idx >= 0) arr[idx] = req; else arr.unshift(req);
      localStorage.setItem("startify_requests", JSON.stringify(arr));
    } catch {}
    if (isFirebaseConfigured && db) {
      try { await setDoc(doc(db, "requests", req.id), { ...req, updated_at: serverTimestamp(), created_at: req.created_at || serverTimestamp() }, { merge: true }); } catch (e) { console.warn("Firestore request save error", e); }
    }
    return true;
  },
  subscribeRequests(callback) {
    if (!isFirebaseConfigured || !db) return () => {};
    try {
      return onSnapshot(collection(db, "requests"), (snap) => {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => console.warn("Requests snapshot error:", err));
    } catch { return () => {}; }
  },

  // ---- Chat messages ----
  async getMessages() {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "messages"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("Firestore messages fetch error", e); }
    }
    try { return JSON.parse(localStorage.getItem("startify_messages") || "[]"); } catch { return []; }
  },
  async saveMessage(msg) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_messages") || "[]");
      if (!arr.some(m => m.id === msg.id)) { arr.push(msg); localStorage.setItem("startify_messages", JSON.stringify(arr)); }
    } catch {}
    if (isFirebaseConfigured && db) {
      try { await setDoc(doc(db, "messages", msg.id), { ...msg, created_at: msg.created_at || serverTimestamp() }, { merge: true }); } catch (e) { console.warn("Firestore message save error", e); }
    }
    return true;
  },
  subscribeMessages(callback) {
    if (!isFirebaseConfigured || !db) return () => {};
    try {
      return onSnapshot(collection(db, "messages"), (snap) => {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => console.warn("Messages snapshot error:", err));
    } catch { return () => {}; }
  },

  // ---- Talent / Backer directories (admin-created) ----
  async getBuilders() {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "builders"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("Firestore builders fetch error", e); }
    }
    try { return JSON.parse(localStorage.getItem("startify_admin_builders") || "[]"); } catch { return []; }
  },
  async saveBuilder(b) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_admin_builders") || "[]");
      const idx = arr.findIndex(x => x.id === b.id);
      if (idx >= 0) arr[idx] = b; else arr.unshift(b);
      localStorage.setItem("startify_admin_builders", JSON.stringify(arr));
    } catch {}
    if (isFirebaseConfigured && db) {
      try { await setDoc(doc(db, "builders", b.id), { ...b, updated_at: serverTimestamp() }, { merge: true }); } catch (e) { console.warn("Firestore builder save error", e); }
    }
    return true;
  },
  async deleteBuilder(id) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_admin_builders") || "[]");
      localStorage.setItem("startify_admin_builders", JSON.stringify(arr.filter(x => x.id !== id)));
    } catch {}
    if (isFirebaseConfigured && db) {
      try { await deleteDoc(doc(db, "builders", id)); } catch (e) { console.warn("Firestore builder delete error", e); }
    }
    return true;
  },
  async getFunders() {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "funders"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("Firestore funders fetch error", e); }
    }
    try { return JSON.parse(localStorage.getItem("startify_admin_funders") || "[]"); } catch { return []; }
  },
  async saveFunder(f) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_admin_funders") || "[]");
      const idx = arr.findIndex(x => x.id === f.id);
      if (idx >= 0) arr[idx] = f; else arr.unshift(f);
      localStorage.setItem("startify_admin_funders", JSON.stringify(arr));
    } catch {}
    if (isFirebaseConfigured && db) {
      try { await setDoc(doc(db, "funders", f.id), { ...f, updated_at: serverTimestamp() }, { merge: true }); } catch (e) { console.warn("Firestore funder save error", e); }
    }
    return true;
  },
  async deleteFunder(id) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_admin_funders") || "[]");
      localStorage.setItem("startify_admin_funders", JSON.stringify(arr.filter(x => x.id !== id)));
    } catch {}
    if (isFirebaseConfigured && db) {
      try { await deleteDoc(doc(db, "funders", id)); } catch (e) { console.warn("Firestore funder delete error", e); }
    }
    return true;
  },

  // ---- Events ----
  async getEventsStore() {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "events"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("Firestore events fetch error", e); }
    }
    try { return JSON.parse(localStorage.getItem("startify_events") || "[]"); } catch { return []; }
  },
  async saveEventStore(ev) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_events") || "[]");
      const idx = arr.findIndex(x => x.id === ev.id);
      if (idx >= 0) arr[idx] = ev; else arr.unshift(ev);
      localStorage.setItem("startify_events", JSON.stringify(arr));
    } catch {}
    if (isFirebaseConfigured && db) {
      try { await setDoc(doc(db, "events", ev.id), { ...ev, updated_at: serverTimestamp() }, { merge: true }); } catch (e) { console.warn("Firestore event save error", e); }
    }
    return true;
  },
  async deleteEventStore(id) {
    try {
      const arr = JSON.parse(localStorage.getItem("startify_events") || "[]");
      localStorage.setItem("startify_events", JSON.stringify(arr.filter(x => x.id !== id)));
    } catch {}
    if (isFirebaseConfigured && db) {
      try { await deleteDoc(doc(db, "events", id)); } catch (e) { console.warn("Firestore event delete error", e); }
    }
    return true;
  }
};
