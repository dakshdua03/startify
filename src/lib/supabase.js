// Startify Database Service (Supabase & Cloud Storage with Local Fallback)
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
export const isSupabaseConfigured = !!supabase;

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
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
  // Fetch Site Custom Content & Figures
  async getSiteContent() {
    const local = localStorage.getItem("startify_site_content");
    if (local) {
      try {
        return { ...defaultSiteContent, ...JSON.parse(local) };
      } catch (e) {
        console.error(e);
      }
    }
    return defaultSiteContent;
  },

  // Save Site Custom Content & Figures
  async saveSiteContent(content) {
    localStorage.setItem("startify_site_content", JSON.stringify(content));
    return true;
  },

  // Fetch Services Offered
  async getServices() {
    const local = localStorage.getItem("startify_offered_services");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultServicesList;
  },

  // Save / Update Services Offered
  async saveServices(services) {
    localStorage.setItem("startify_offered_services", JSON.stringify(services));
    return true;
  },

  // Fetch Ideas from Database
  async getIdeas(defaultIdeas = []) {
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/ideas?select=*&order=created_at.desc`, { headers });
        if (res.ok) {
          const cloudIdeas = await res.json();
          if (cloudIdeas && cloudIdeas.length > 0) {
            return cloudIdeas;
          }
        }
      } catch (err) {
        console.warn("Supabase fetch failed, using local storage", err);
      }
    }
    const local = localStorage.getItem("startify_submitted_ideas");
    if (local) {
      try {
        return [...JSON.parse(local), ...defaultIdeas];
      } catch (e) {
        console.error(e);
      }
    }
    return defaultIdeas;
  },

  // Insert New Idea into Database
  async saveIdea(idea) {
    const existing = JSON.parse(localStorage.getItem("startify_submitted_ideas") || "[]");
    localStorage.setItem("startify_submitted_ideas", JSON.stringify([idea, ...existing]));

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/ideas`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            title: idea.title,
            category: idea.category,
            founder: idea.founder,
            desc: idea.desc,
            seeking: idea.seeking,
            status: idea.status || "Idea Posted"
          })
        });
      } catch (err) {
        console.warn("Cloud idea save error", err);
      }
    }
    return true;
  },

  // Fetch Registrations for Admin Dashboard
  async getRegistrations() {
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/registrations?select=*&order=created_at.desc`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) return data;
        }
      } catch (e) {
        console.warn("Cloud registration fetch fallback", e);
      }
    }
    const local = localStorage.getItem("startify_registrations");
    return local ? JSON.parse(local) : [
      { name: "Rahul Sharma", email: "rahul@uohyd.ac.in", role: "founder", year: "3rd Year", ideaOrSkills: "Building EdTech AI Assistant", contact: "9876543210", registeredAt: "2026-08-23" },
      { name: "Aditi Rao", email: "aditi@uohyd.ac.in", role: "builder", year: "4th Year CSE", ideaOrSkills: "React, Tailwind, Node.js", contact: "9123456789", registeredAt: "2026-08-22" },
      { name: "Karan Patel", email: "karan@angelnet.in", role: "funder", year: "Alumni", ideaOrSkills: "Angel investor looking for SaaS ideas", contact: "9988776655", registeredAt: "2026-08-21" }
    ];
  },

  // Save User Registration
  async saveRegistration(reg) {
    const existing = JSON.parse(localStorage.getItem("startify_registrations") || "[]");
    localStorage.setItem("startify_registrations", JSON.stringify([reg, ...existing]));

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reg)
      });
    } catch (e) {
      console.warn("Cloudflare API ping", e);
    }

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/registrations`, {
          method: "POST",
          headers,
          body: JSON.stringify(reg)
        });
      } catch (err) {
        console.warn("Supabase registration save error", err);
      }
    }
    return true;
  },

  // Fetch Payments for Admin Dashboard
  async getPayments() {
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/payments?select=*&order=created_at.desc`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) return data;
        }
      } catch (e) {
        console.warn("Cloud payment fetch fallback", e);
      }
    }
    const local = localStorage.getItem("startify_payments");
    return local ? JSON.parse(local) : [
      { paymentId: "pay_sample_101", service: "Idea Validation Sprint", amount: 999, user: "Rahul Sharma", contact: "9876543210", timestamp: "2026-08-23 14:30", status: "SUCCESS" },
      { paymentId: "pay_sample_102", service: "Pro Founder Pass", amount: 299, user: "Priya Roy", contact: "9811223344", timestamp: "2026-08-23 16:10", status: "SUCCESS" }
    ];
  },

  // Save Payment Record
  async savePayment(payment) {
    const existing = JSON.parse(localStorage.getItem("startify_payments") || "[]");
    localStorage.setItem("startify_payments", JSON.stringify([payment, ...existing]));

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
          method: "POST",
          headers,
          body: JSON.stringify(payment)
        });
      } catch (err) {
        console.warn("Supabase payment save error", err);
      }
    }
    return true;
  }
};
