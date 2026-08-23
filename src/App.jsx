
import { useState } from "react";

const groups = [
  { name: "Ideas", members: "87", logo: "/src/assets/startify_ideas_logo_1.webp", desc: "Post ideas, get feedback, find co-founders", use: "Validation & co-founder hunt" },
  { name: "Business & Resources", members: "42", logo: "/src/assets/startify_business_resources_logo_1.webp", desc: "Funding, tools, playbooks, investor intros", use: "Resources to grow" },
  { name: "Skills & Talent", members: "64", logo: "/src/assets/startify_skills_talent_badge.webp", desc: "Builders, designers, marketers ready to build", use: "Your MVP team" },
  { name: "Core Team", members: "12", logo: "/src/assets/core_team_shield_logo.webp", desc: "My operating team + top mentors", use: "Direct access to me" },
  { name: "Community", members: "187", logo: "/src/assets/community_network_logo.webp", desc: "The full UoH startup graph", use: "Distribution & hires" },
];

const services = [
  { id: "validation", title: "Idea Validation Sprint", price: "₹999", sub: "Free for UoH till Dec '25", time: "7 days", desc: "Kill bad ideas fast. 30+ customer interviews, landing test, pricing validation.", outcome: "Go / No-Go report" },
  { id: "mvp", title: "MVP Build Program", price: "₹4,999", sub: "Team from Skills & Talent", time: "30 days", desc: "My vetted builders ship your MVP. I manage scope, quality, launch.", outcome: "Live MVP + users" },
  { id: "growth", title: "Growth Engine", price: "₹2,999/mo", sub: "My core offer • Most popular", time: "Ongoing", desc: "Content, distribution, sales system. I work with you weekly to get revenue.", outcome: "2x growth / mo" },
  { id: "fundraise", title: "Fundraising Prep", price: "₹1,999", sub: "Deck + intro prep", time: "10 days", desc: "Pitch deck, financial model, investor list from Business & Resources group.", outcome: "Investor-ready deck" },
  { id: "team", title: "Team Match", price: "Free", sub: "Via Startify platform", time: "48 hours", desc: "Find co-founder, CTO, designer from 187 members. I vet and intro.", outcome: "Team in 2 days" },
  { id: "community", title: "Startify Access", price: "Free → ₹499/yr", sub: "All 5 groups", time: "Instant", desc: "Join 5 WhatsApp groups I built to accelerate UoH founders.", outcome: "Full network access" },
];

const weeks = [
  { w: "W1", title: "Idea", task: "Clarity & ICP" },
  { w: "W2", title: "Validation", task: "50 interviews" },
  { w: "W3", title: "MVP", task: "Build with team" },
  { w: "W4", title: "Launch", task: "First 10 users" },
  { w: "W5", title: "Growth", task: "Distribution" },
  { w: "W6", title: "Revenue", task: "First ₹10k" },
  { w: "W7", title: "Pitch", task: "Deck & story" },
  { w: "W8", title: "Demo Day", task: "Investors + UoH" },
];

const cases = [
  { brand: "UoH Merch Co", before: "₹12k / mo", after: "₹31k / mo in 45 days", growth: "2.6x sales", quote: "Daksh rebuilt my offer and got us into 3 hostels. First time we crossed 30k.", owner: "Aarav • 3rd Year" },
  { brand: "CampusKart", before: "Idea only", after: "MVP live in 20 days", growth: "0 → 47 users", quote: "Found my tech co-founder via Skills & Talent. Daksh managed the build.", owner: "Priya • Final Year" },
  { brand: "Chai & Code", before: "No customers", after: "First paying user in 9 days", growth: "Idea → Revenue", quote: "Validation sprint saved me 3 months. He made me talk to real users.", owner: "Rohan • 2nd Year" },
];

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Growth Engine");
  const [groupModal, setGroupModal] = useState(null);
  const [testiIdx, setTestiIdx] = useState(0);
  const [yearly, setYearly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ name: "", idea: "", help: "", budget: "₹0-1k" });
  const [submitted, setSubmitted] = useState(false);

  const openBooking = (svc) => {
    if (svc) setSelectedService(svc);
    setBookingOpen(true);
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBooking = { ...form, service: selectedService, at: new Date().toLocaleString() };
    setBookings([newBooking, ...bookings]);
    localStorage.setItem('startify_bookings', JSON.stringify([newBooking, ...bookings]));
    setSubmitted(true);
    setTimeout(() => {
      setBookingOpen(false);
      setForm({ name: "", idea: "", help: "", budget: "₹0-1k" });
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#0A1931] selection:bg-[#0A1931] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap');
        *{font-family: Inter, system-ui, sans-serif}
        h1,h2,h3,.outfit{font-family: Outfit, Inter, sans-serif}
      `}</style>

      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#FCFCF9]/80 border-b border-black/[0.06]">
        <div className="mx-auto max-w-[1180px] px-5 md:px-7 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#0A1931] text-white grid place-items-center font-bold outfit text-[15px]">D</div>
            <div className="leading-none">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-[17px] outfit">Daksh Dua</span>
                <span className="hidden md:inline-flex h-[18px] w-px bg-black/10" />
                <span className="hidden md:inline-flex text-[11px] font-bold tracking-[0.18em] opacity-60">STARTIFY</span>
              </div>
              <div className="text-[11px] font-medium opacity-60 -mt-[1px]">Accelerator @ UoH</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[13.5px] font-medium">
            <a href="#services" className="hover:opacity-60">Services</a>
            <a href="#accelerator" className="hover:opacity-60">Accelerator</a>
            <a href="#community" className="hover:opacity-60">Community</a>
            <a href="#pricing" className="hover:opacity-60">Pricing</a>
            <a href="/admin.html" className="px-3 py-1.5 rounded-full border text-xs">Admin</a>
            <button onClick={()=>openBooking()} className="h-9 px-5 rounded-full bg-[#0A1931] text-white text-[13px] font-semibold">Book Call</button>
          </div>
          <button onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden h-9 w-9 rounded-full border grid place-items-center">☰</button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t bg-white p-4 space-y-3">
            <a href="#services" className="block">Services</a>
            <a href="#accelerator" className="block">Accelerator</a>
            <a href="#community" className="block">Community</a>
            <a href="#pricing" className="block">Pricing</a>
            <button onClick={()=>openBooking()} className="w-full h-10 rounded-full bg-[#0A1931] text-white">Book Call</button>
          </div>
        )}
      </nav>

      <section className="mx-auto max-w-[1180px] px-5 md:px-7 pt-12 md:pt-20">
        <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1931] text-white text-[11px] font-semibold tracking-wide">NOW: Batch 1 Free • 7 spots left • UoH Only</div>
            <h1 className="outfit text-[38px] md:text-[56px] font-[800] leading-[0.95] tracking-[-0.03em] mt-5">I help founders at UoH build & grow <span className="bg-gradient-to-r from-[#C1272D] to-[#3B5BFE] bg-clip-text text-transparent">profitable</span> businesses.</h1>
            <p className="text-[16px] md:text-[17px] leading-[1.6] opacity-70 mt-5 max-w-[560px]">I'm Daksh Dua, 23 — Founder of Startify, UoH's first startup accelerator. I've helped 11 startups go from 0 to revenue. Startify is my platform to help you too. I will charge in future, free for UoH now to build proof.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={()=>openBooking('Growth Engine')} className="h-11 px-6 rounded-full bg-[#0A1931] text-white font-semibold text-[14px]">Book 1:1 Growth Call →</button>
              <a href="#services" className="h-11 px-6 rounded-full border border-black/10 bg-white font-semibold text-[14px] grid place-items-center">See How I Help</a>
            </div>
            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-2">{[1,2,3].map(i=><div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 grid place-items-center text-[11px] font-bold">U</div>)}</div>
              <div className="text-[12px] leading-[1.3]"><div className="font-semibold">Trusted by 187 members at UoH</div><div className="opacity-60">11 startups • 28 mentorships • 2x avg growth</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#0A1931] text-white grid place-items-center font-bold text-[18px]">D</div>
                <div><div className="font-bold outfit">Daksh Dua</div><div className="text-[12px] opacity-60">Accelerator • Startify Founder • UoH</div></div>
                <div className="ml-auto text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">● Available for new founders</div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-[14px] bg-[#F6F7F9] border border-black/5 p-3"><div className="text-[20px] font-bold outfit">11</div><div className="text-[11px] opacity-60">Businesses helped</div></div>
                <div className="rounded-[14px] bg-[#F6F7F9] border border-black/5 p-3"><div className="text-[20px] font-bold outfit">187</div><div className="text-[11px] opacity-60">Members</div></div>
                <div className="rounded-[14px] bg-[#F6F7F9] border border-black/5 p-3"><div className="text-[20px] font-bold outfit">2x</div><div className="text-[11px] opacity-60">Avg growth</div></div>
              </div>
              <div className="mt-4 rounded-[14px] bg-[#0A1931] text-white p-4">
                <div className="text-[11px] font-bold tracking-wide opacity-70">WHAT I DO</div>
                <div className="text-[13px] leading-[1.5] mt-2">I don't just give advice. I find you team from Skills & Talent, get you resources from Business group, and work weekly to get revenue. My platform Startify is the system, I am the accelerator.</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={()=>openBooking()} className="h-10 rounded-full bg-[#0A1931] text-white text-[13px] font-semibold">Book Call</button>
                <a href="https://instagram.com/dakshdua03" target="_blank" className="h-10 rounded-full border border-black/10 grid place-items-center text-[13px] font-semibold">IG: dakshdua03</a>
              </div>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {groups.map(g=>(
                <button key={g.name} onClick={()=>setGroupModal(g)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-black/10 text-[11px] font-medium shrink-0">
                  <img src={g.logo} className="h-5 w-5 rounded-full object-cover" /> {g.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-[1180px] px-5 md:px-7 mt-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h2 className="outfit text-[28px] md:text-[36px] font-bold leading-[1.1] tracking-[-0.02em]">Services I sell —<br/>free for UoH now, paid soon.</h2>
          <div className="text-[13px] opacity-60 max-w-[360px]">I built Startify to deliver these. Batch 1 free to build case studies, then I charge. Lock free now.</div>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {services.map(s=>(
            <div key={s.id} className="rounded-[22px] border border-black/10 bg-white p-5 flex flex-col">
              <div className="flex items-start justify-between"><div className="text-[11px] font-bold tracking-wide px-2 py-1 rounded-full bg-[#F6F7F9] border">{s.time}</div><div className="text-right"><div className="font-bold outfit">{s.price}</div><div className="text-[10px] opacity-60">{s.sub}</div></div></div>
              <div className="outfit font-bold text-[16px] mt-4">{s.title}</div>
              <div className="text-[13px] opacity-70 leading-[1.5] mt-2 flex-1">{s.desc}</div>
              <div className="mt-3 text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 w-fit">Outcome: {s.outcome}</div>
              <button onClick={()=>openBooking(s.title)} className="mt-4 h-10 rounded-full bg-[#0A1931] text-white text-[13px] font-semibold">Book {s.title.split(' ')[0]} →</button>
            </div>
          ))}
        </div>
      </section>

      <section id="accelerator" className="mt-20 bg-[#0A1931] text-white">
        <div className="mx-auto max-w-[1180px] px-5 md:px-7 py-14 md:py-20">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div><div className="text-[11px] font-bold tracking-[0.2em] opacity-60">STARTIFY ACCELERATE</div><h2 className="outfit text-[32px] md:text-[44px] font-bold leading-[0.95] mt-3">UoH's first<br/>8-week accelerator<br/>by Daksh</h2></div>
            <div className="max-w-[420px]"><div className="text-[14px] leading-[1.6] opacity-80">Not a course. I work with 7 founders for 8 weeks to go from idea to revenue. Weekly 1:1, team from Skills & Talent, resources from Business group, demo day with investors.</div><div className="mt-5 flex gap-3"><button onClick={()=>openBooking('Accelerator Batch 1')} className="h-11 px-6 rounded-full bg-white text-[#0A1931] font-semibold">Apply for Batch 1 (Free)</button><div className="text-[12px] opacity-60">Next batch ₹9,999 • 7 spots left</div></div></div>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {weeks.map(w=><div key={w.w} className="rounded-[16px] bg-white/[0.06] border border-white/10 p-4"><div className="text-[11px] font-bold opacity-60">{w.w}</div><div className="font-bold outfit mt-1">{w.title}</div><div className="text-[12px] opacity-70 mt-1">{w.task}</div></div>)}
          </div>
        </div>
      </section>

      <section id="community" className="mx-auto max-w-[1180px] px-5 md:px-7 mt-16">
        <h2 className="outfit text-[24px] font-bold">5 communities I built as tools to accelerate you</h2>
        <div className="mt-6 grid md:grid-cols-5 gap-3">
          {groups.map(g=>(
            <button key={g.name} onClick={()=>setGroupModal(g)} className="rounded-[18px] border border-black/10 bg-white p-4 text-left hover:border-[#0A1931]/30 transition">
              <img src={g.logo} className="h-14 w-14 rounded-[14px] object-cover border" />
              <div className="font-bold text-[13px] mt-3">{g.name}</div>
              <div className="text-[11px] opacity-60 mt-1">{g.members} members</div>
              <div className="text-[11px] opacity-60 mt-2">{g.use}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 md:px-7 mt-16">
        <h2 className="outfit text-[24px] font-bold">Businesses I've helped grow</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {cases.map(c=>(
            <div key={c.brand} className="rounded-[20px] border border-black/10 bg-white p-5">
              <div className="flex justify-between text-[11px]"><span className="px-2 py-1 rounded-full bg-[#F6F7F9] border">{c.before}</span><span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">→ {c.after}</span></div>
              <div className="font-bold outfit text-[16px] mt-4">{c.brand} • {c.growth}</div>
              <div className="text-[13px] italic opacity-70 mt-2">"{c.quote}"</div>
              <div className="text-[11px] opacity-60 mt-3">{c.owner}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1180px] px-5 md:px-7 mt-20 mb-20">
        <div className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="outfit text-[26px] font-bold">Pricing — free now, paid Jan 2026</h2><div className="flex items-center gap-2 p-1 rounded-full bg-[#F6F7F9] border"><button onClick={()=>setYearly(false)} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold ${!yearly?'bg-[#0A1931] text-white':'opacity-60'}`}>Monthly</button><button onClick={()=>setYearly(true)} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold ${yearly?'bg-[#0A1931] text-white':'opacity-60'}`}>Yearly -20%</button></div></div>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="rounded-[20px] border border-black/10 p-5"><div className="font-bold">Free</div><div className="text-[28px] font-bold outfit mt-2">₹0</div><div className="text-[12px] opacity-60 mt-1">Community access, post ideas, find team (slow)</div><div className="mt-4 space-y-2 text-[13px]"><div>✓ 5 WhatsApp groups</div><div>✓ Post 1 idea</div><div>✓ Browse talent</div></div><button onClick={()=>openBooking('Free Access')} className="mt-5 w-full h-10 rounded-full border font-semibold text-[13px]">Join Free</button></div>
            <div className="rounded-[20px] border-2 border-[#0A1931] p-5 bg-[#0A1931] text-white"><div className="flex justify-between"><div className="font-bold">Builder</div><div className="text-[10px] px-2 py-1 rounded-full bg-white text-[#0A1931] font-bold">MOST POPULAR</div></div><div className="text-[28px] font-bold outfit mt-2">{yearly ? '₹799' : '₹999'}<span className="text-[14px] font-normal opacity-70">/mo</span></div><div className="text-[12px] opacity-70 mt-1">Everything free + direct access to me</div><div className="mt-4 space-y-2 text-[13px]"><div>✓ Weekly 1:1 with Daksh</div><div>✓ Growth calls</div><div>✓ Priority team match</div><div>✓ Resources & templates</div></div><button onClick={()=>openBooking('Builder Plan')} className="mt-5 w-full h-10 rounded-full bg-white text-[#0A1931] font-semibold text-[13px]">Start Builder • Lock Free Now</button></div>
            <div className="rounded-[20px] border border-black/10 p-5"><div className="font-bold">Accelerator</div><div className="text-[28px] font-bold outfit mt-2">₹9,999</div><div className="text-[12px] opacity-60 mt-1">8-week program, Batch 1 free, next paid</div><div className="mt-4 space-y-2 text-[13px]"><div>✓ 8-week accelerator</div><div>✓ MVP built</div><div>✓ Fundraising prep</div><div>✓ Demo day</div></div><button onClick={()=>openBooking('Accelerator')} className="mt-5 w-full h-10 rounded-full bg-[#0A1931] text-white font-semibold text-[13px]">Apply for Free Batch 1</button></div>
          </div>
          <div className="mt-6 text-[11px] opacity-50 text-center">Free for UoH students till Dec 2025 to build proof. Prices activate Jan 2026. All bookings now lock free pricing. Razorpay integration ready — add keys in .env</div>
        </div>
      </section>

      <footer className="border-t border-black/[0.06] bg-[#FCFCF9]">
        <div className="mx-auto max-w-[1180px] px-5 md:px-7 h-[64px] flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-3"><span className="font-bold outfit">STARTIFY © {new Date().getFullYear()}</span><span className="opacity-40">Built by Daksh Dua • UoH • I help founders build & grow</span></div>
          <div className="hidden md:flex gap-4 opacity-60"><a href="/admin.html">Admin</a><span>•</span><a href="https://instagram.com/dakshdua03" target="_blank">IG: dakshdua03</a></div>
        </div>
      </footer>

      {bookingOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-[#0A1931]/60 backdrop-blur-[6px]" onClick={() => setBookingOpen(false)} />
          <div className="relative w-full max-w-[480px] rounded-[24px] bg-white border border-black/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] p-6 md:p-7">
            {!submitted ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div><div className="outfit font-[800] text-[20px] leading-[1]">Book {selectedService}</div><div className="text-[12px] opacity-60 mt-2">30 min • I review before call • Free for UoH now, paid Jan 2026</div></div>
                  <button onClick={() => setBookingOpen(false)} className="h-8 w-8 rounded-full border border-black/10 grid place-items-center">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Your name" className="w-full h-11 rounded-full border border-black/10 bg-[#F6F7F9] px-4 text-[13px] outline-none focus:border-[#0A1931]" />
                  <input required value={form.idea} onChange={e=>setForm({...form, idea:e.target.value})} placeholder="Business / Idea" className="w-full h-11 rounded-full border border-black/10 bg-[#F6F7F9] px-4 text-[13px] outline-none focus:border-[#0A1931]" />
                  <textarea required value={form.help} onChange={e=>setForm({...form, help:e.target.value})} placeholder="What help do you need most?" className="w-full min-h-[86px] rounded-[18px] border border-black/10 bg-[#F6F7F9] p-4 text-[13px] outline-none focus:border-[#0A1931]" />
                  <select value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})} className="w-full h-11 rounded-full border border-black/10 bg-[#F6F7F9] px-4 text-[13px]"><option>₹0-1k (student)</option><option>₹1k-5k</option><option>₹5k-20k</option><option>₹20k+ (serious)</option></select>
                  <button type="submit" className="w-full h-12 rounded-full bg-[#0A1931] text-white font-semibold text-[14px]">Confirm Booking • Lock Free Spot</button>
                  <div className="text-[11px] opacity-50 text-center">No payment now. Razorpay ready. This secures free UoH spot before paid launch.</div>
                </form>
              </>
            ) : (
              <div className="py-10 text-center"><div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 grid place-items-center mx-auto text-[20px]">✓</div><div className="outfit font-bold text-[20px] mt-4">Booked! I'll DM you on WhatsApp</div><div className="text-[13px] opacity-60 mt-2">Draft saved locally. Copy it to keep spot locked.</div></div>
            )}
          </div>
        </div>
      )}

      {groupModal && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-[#0A1931]/60 backdrop-blur-[6px]" onClick={()=>setGroupModal(null)} />
          <div className="relative w-full max-w-[420px] rounded-[24px] bg-white border border-black/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] p-6">
            <div className="flex gap-4 items-start"><img src={groupModal.logo} alt={groupModal.name} className="h-16 w-16 rounded-[18px] object-cover border" /><div><div className="outfit font-bold text-[18px]">{groupModal.name}</div><div className="text-[12px] opacity-60 mt-1">{groupModal.members} members • {groupModal.use}</div><div className="text-[13px] opacity-70 mt-2">{groupModal.desc}</div></div></div>
            <div className="mt-6 rounded-[14px] bg-[#F6F7F9] border p-4"><div className="text-[11px] font-bold opacity-60">TOOL I BUILT FOR YOU</div><div className="text-[13px] mt-2">Free for UoH till Dec 2025 → ₹499/yr after. Join now to lock free.</div><div className="mt-3 flex gap-2"><button onClick={()=>{setGroupModal(null); openBooking(groupModal.name);}} className="flex-1 h-10 rounded-full bg-[#0A1931] text-white text-[12px] font-semibold">Request Invite via Daksh</button><button onClick={()=>setGroupModal(null)} className="h-10 px-4 rounded-full border text-[12px] font-semibold">Close</button></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
