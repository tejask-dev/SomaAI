import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-slate-800">
      <Header />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-emerald-100">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="#home" className="inline-flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-emerald-600 text-white font-black grid place-items-center">S</div>
          <span className="font-semibold text-lg tracking-tight">SomaAI</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#problem" className="hover:text-emerald-700">Problem</a>
          <a href="#features" className="hover:text-emerald-700">Features</a>
          <a href="#how" className="hover:text-emerald-700">How it works</a>
          <a href="#faq" className="hover:text-emerald-700">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#" className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700 active:scale-[.99]">
            Try Demo
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="pt-12 md:pt-16 pb-10 md:pb-16 bg-gradient-to-br from-emerald-100/60 to-emerald-50">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            Health answers and education, all-in-one
          </h1>
          <p className="mt-4 text-slate-700 text-base md:text-lg">
            SomaAI helps teens get accurate information, fast. Built with clarity, privacy, and cultural sensitivity in mind.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700">Try Demo</a>
            <a href="#features" className="px-5 py-3 rounded-2xl border border-emerald-200 text-emerald-800 font-semibold hover:bg-white">See Features</a>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <Stat label="Anonymous" value="100%" /> 
            <Stat label="Languages" value="4+" />
            <Stat label="Guideline‑aligned" value="WHO / UNFPA" />
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-3xl bg-white shadow-lg border border-emerald-100 p-4">
            <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white to-emerald-50 flex items-center justify-center text-center p-6">
              <p className="text-sm text-slate-600">
                Idk what to put here
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="text-xl font-bold text-emerald-700">{value}</div>
      <div className="mt-1 text-slate-600">{label}</div>
    </div>
  );
}

function Problem() {
  return (
    <section id="problem" className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why this matters</h2>
        <ul className="mt-6 space-y-3 list-disc pl-5 text-slate-700">
          <li>High adolescent fertility and HIV rates are tied to lack of accurate sexual health education.</li>
          <li>Cultural stigma makes it hard for youth to ask parents, teachers, or leaders.</li>
          <li>Few trained educators and limited clinic access delay intervention.</li>
        </ul>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: "AI Chat",
      desc: "Anonymous questions answered clearly and kindly, 24/7.",
    },
    {
      title: "Age‑appropriate",
      desc: "Educational content aligned to global public‑health guidance.",
    },
    {
      title: "Multi‑language",
      desc: "English now; Swahili, French, and Portuguese next.",
    },
    {
      title: "Clinic signposts",
      desc: "Helpful directions to youth‑friendly services and hotlines.",
    },
  ];
  return (
    <section id="features" className="py-12 md:py-16 bg-emerald-50/50 border-y border-emerald-100">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What you get</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">{i + 1}</div>
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-slate-700 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Ask privately",
      desc: "Open the demo and type any question. No sign‑up required.",
    },
    {
      title: "Get clear answers",
      desc: "Friendly guidance in simple language, plus safety tips.",
    },
    {
      title: "Find support",
      desc: "See links to clinics, hotlines, or trusted resources near you.",
    },
  ];
  return (
    <section id="how" className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How it works</h2>
        <ol className="mt-8 grid sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <li key={i} className="relative p-6 rounded-2xl border border-emerald-100 bg-white shadow-sm">
              <span className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-emerald-600 text-white grid place-items-center font-bold shadow">{i + 1}</span>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Is this medical advice?",
      a: "No. SomaAI provides educational information and signposts to professional care.",
    },
    {
      q: "Do you store messages?",
      a: "For the demo, messages are processed to respond and then discarded. Follow local laws for any data collection.",
    },
    {
      q: "Does it work offline?",
      a: "Offline mode is part of our future roadmap with built‑in FAQs and safety tips.",
    },
  ];
  return (
    <section id="faq" className="py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-6 divide-y divide-emerald-100 rounded-2xl border border-emerald-100 bg-white shadow-sm">
          {items.map((item, i) => (
            <details key={i} className="group p-4">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                <span>{item.q}</span>
                <span className="transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-2 text-slate-700 text-sm">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-8 py-8 border-t border-emerald-100 text-center text-sm text-slate-600">
      <div className="mx-auto max-w-6xl px-4">
        <p>Built for learning and health empowerment.</p>
        <p className="mt-1">© {new Date().getFullYear()} SomaAI</p>
      </div>
    </footer>
  );
}
