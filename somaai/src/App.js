import React, { useState } from "react";
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Header />
      <Hero />
      <Challenge />
      <FAQ />
      <Footer />
    </div>
  );
}


function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="inline-flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-600 grid place-items-center text-white font-black">S</div>
          <span className="font-semibold tracking-tight">SomaAI</span>
        </a>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#challenge" className="hover:text-emerald-700">Challenge</a>
          <a href="#faq" className="hover:text-emerald-700">FAQ</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-sky-50 via-sky-50 to-emerald-50/30">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        {}
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Your Private Health Companion
          </h1>
          <p className="mt-4 text-slate-600 text-base md:text-lg max-w-prose">
            SomaAI provides confidential, non-judgmental, and accurate sexual
            health education for youth. Ask anything, anytime.
          </p>
        </div>

        {}
        <AskCard />
      </div>
    </section>
  );
}

function AskCard() {
  const [q, setQ] = useState("I need help with sexuality");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const tooShort = q.trim().length < 3;

  function submit() {
    if (tooShort || busy) return;
    setBusy(true);
    setAnswer("");
    setTimeout(() => {
      setTimeout(() => {
        setAnswer("Example: You can ask about consent, contraception, or HIV prevention. I’ll explain in simple words. If it’s urgent, please visit a clinic or hotline.");
        setBusy(false);
      }, 450);
    }, 300);
  }

  return (
    <div className="md:justify-self-end w-full max-w-lg">
      <div className="rounded-2xl bg-white shadow-lg border border-slate-100 p-5">
        <h3 className="font-semibold text-lg mb-3">Ask SomaAI</h3>

        <label htmlFor="ask" className="text-sm text-slate-600">What is your question?</label>
        <div className="relative mt-2">
          <textarea
            id="ask"
            rows={2}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Type here…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {/* little red dot if invalid, blue dot when ok — purely visual */}
          <span
            className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full ${tooShort ? "bg-red-500" : "bg-sky-500"}`}
            aria-hidden
          />
        </div>

        <button
          onClick={submit}
          className="mt-3 w-full rounded-xl bg-sky-600 text-white py-2.5 font-medium hover:bg-sky-700 active:scale-[.99] disabled:opacity-60"
          disabled={tooShort || busy}
        >
          {busy ? "Thinking…" : "Get Answer"}
        </button>

        {!!answer && (
          <div className="mt-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}

function Challenge() {
  const cards = [
    {
      title: "Adolescent Fertility",
      stat: "1 in 5",
      desc: "girls aged 15–19 becomes pregnant in Sub-Saharan Africa.",
      icon: "👧",
    },
    {
      title: "HIV Infections",
      stat: "4,000+",
      desc: "new HIV infections occur weekly among young women aged 15–24.",
      icon: "🧬",
    },
    {
      title: "Youth Population",
      stat: "60%",
      desc: "of Africa’s population is under the age of 25.",
      icon: "🛡️",
    },
    {
      title: "Impact Potential",
      stat: "Education is Key",
      desc: "Access to information can prevent pregnancies and save lives.",
      icon: "💚",
    },
  ];

  return (
    <section id="challenge" className="bg-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center tracking-tight">
          The Challenge We Face
        </h2>
        <p className="mt-3 text-center text-slate-600 max-w-3xl mx-auto">
          Lack of access to accurate sexual health education has critical consequences
          for youth in Sub-Saharan Africa.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4"
            >
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span className="text-base">{c.icon}</span>
                <span>{c.title}</span>
              </div>
              <div className="mt-2 text-xl font-bold">{c.stat}</div>
              <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "What is HIV?",
      a: "HIV is a virus that attacks the immune system. It can be prevented with safer sex and not sharing needles. Testing is important.",
    },
    {
      q: "How can I prevent pregnancy?",
      a: "Use reliable contraception like condoms, pills, implants, or injections. Condoms also help lower STI risk.",
    },
    {
      q: "What are contraceptives?",
      a: "Methods to prevent pregnancy. Examples: condoms, pills, IUDs/implants, injections, and more.",
    },
    {
      q: "What is consent?",
      a: "Clear, freely given agreement. Everyone must say yes without pressure. Consent can be changed at any time.",
    },
    {
      q: "How are STIs spread?",
      a: "Mostly through unprotected sexual contact. Condoms and testing reduce risk. See a clinic if you have symptoms.",
    },
  ];

  return (
    <section id="faq" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">
          Get quick answers to common sexual health questions. Information is based on
          WHO and UNFPA guidelines.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-100 divide-y divide-slate-100 bg-white">
          {items.map((item, i) => (
            <details key={i} className="group p-4">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="font-medium">{item.q}</span>
                <span className="text-slate-400 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-2 text-sm text-slate-700">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} SomaAI — Education tool, not medical advice.
    </footer>
  );
}
