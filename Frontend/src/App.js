import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css";
import deepakPhoto from "./assets/Daniel.jpg";
import tejasPhoto from "./assets/tejas-1.jpg";
import samPhoto from "./assets/swanish.jpg";
import { motion } from "framer-motion";

/* ─── Shared animation variant ──────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

/* ─── Inline SVG icons ───────────────────────────────────────── */
function ShieldIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L4 7v5c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V7L12 3z" />
    </svg>
  );
}
function ChatIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
    </svg>
  );
}
function GlobeIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3a12.5 12.5 0 010 18M12 3a12.5 12.5 0 000 18" />
    </svg>
  );
}
function BookIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}
function CheckIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function ChevronDown({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── Main App ───────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Challenge />
      <WhySomaAI />
      <FAQ />
      <Team />
      <Footer />
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative bg-white overflow-hidden pt-24 sm:pt-28 pb-20 sm:pb-28">
      {/* Subtle background glow — not a harsh gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center overflow-hidden"
      >
        <div className="h-[600px] w-[900px] rounded-full bg-emerald-50 blur-3xl opacity-70" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="mb-6"
          >
            <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              AI-Powered Health Education
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="show"
            custom={0.1}
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-5 leading-[1.1]"
          >
            Your Private Health
            <br />
            <span className="text-emerald-600">Companion</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial="hidden"
            animate="show"
            custom={0.2}
            variants={fadeUp}
            className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-9"
          >
            Confidential, non-judgmental sexual health education for youth.
            Ask anything — about HIV, contraception, consent, or growing up.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="show"
            custom={0.3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/chat" className="btn-primary px-7 py-3 text-base shadow-md shadow-emerald-200/60">
              Start chatting free
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/lessons" className="btn-secondary px-7 py-3 text-base">
              Browse lessons
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Trust bar ──────────────────────────────────────────────── */
function TrustBar() {
  const stats = [
    { value: "6", label: "Languages" },
    { value: "100%", label: "Private" },
    { value: "24/7", label: "Available" },
    { value: "Free", label: "Always" },
  ];
  return (
    <section className="border-y border-slate-100 bg-slate-50">
      <div className="section-container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────────────── */
function HowItWorks() {
  const features = [
    {
      Icon: ChatIcon,
      title: "Ask Anything",
      description:
        "Type your question or browse our lessons. No topic is off-limits — SomaAI answers with care and accuracy.",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      Icon: ShieldIcon,
      title: "Private & Safe",
      description:
        "No personal information required. Your questions stay confidential — we never store who you are.",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      Icon: GlobeIcon,
      title: "Learn in Your Language",
      description:
        "Get accurate, culturally respectful answers in English, French, Swahili, Portuguese, Spanish, and Hindi.",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <section id="how" className="py-24 bg-white">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-3">How it works</p>
          <h2 className="section-heading mb-4">Simple. Private. Effective.</h2>
          <p className="section-sub max-w-xl mx-auto">
            SomaAI makes health education accessible for every young person.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ Icon, title, description, iconBg, iconColor }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i * 0.1}
              variants={fadeUp}
              className="card p-8 flex flex-col gap-5 hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Challenge stats ────────────────────────────────────────── */
function Challenge() {
  const stats = [
    {
      value: "1 in 5",
      title: "Adolescent Pregnancy",
      desc: "Girls aged 15–19 become pregnant in Sub-Saharan Africa.",
    },
    {
      value: "4,000+",
      title: "Weekly HIV Infections",
      desc: "New HIV cases occur weekly among women aged 15–24.",
    },
    {
      value: "60%",
      title: "Youth Population",
      desc: "Of Africa's population is under the age of 25.",
    },
    {
      value: "Access",
      title: "Changes Everything",
      desc: "Education and access to information prevent pregnancies and save lives.",
    },
  ];

  return (
    <section id="challenge" className="py-24 bg-slate-900 text-white">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3">The challenge</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            The Problem We're Solving
          </h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Lack of access to sexual health education has critical consequences
            for youth across Sub-Saharan Africa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {stats.map(({ value, title, desc }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i * 0.1}
              variants={fadeUp}
              className="bg-slate-900 p-8 flex flex-col gap-3"
            >
              <p className="text-3xl font-bold tracking-tight text-emerald-400">{value}</p>
              <p className="font-semibold text-white text-sm">{title}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why SomaAI ─────────────────────────────────────────────── */
function WhySomaAI() {
  const benefits = [
    "Updated regularly with trusted health information",
    "Answers in 6 languages — English, French, Swahili, Portuguese, Spanish, and Hindi",
    "Built with youth and health educators for real questions",
    "Accessible from any device, anytime, without an app download",
    "Designed for privacy — no account required to ask questions",
    "Sensitive topics handled with care and cultural respect",
  ];

  return (
    <section id="why" className="py-24 bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-3">Why SomaAI</p>
            <h2 className="section-heading mb-5">
              Health education built for the next generation
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              SomaAI meets young people where they are — with honest, accurate,
              and compassionate health information when they need it most.
            </p>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                    <CheckIcon className="w-3 h-3 text-emerald-600" />
                  </span>
                  <span className="text-sm text-slate-600 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: feature highlights */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            custom={0.15}
            variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { Icon: BookIcon, label: "Structured Lessons", sub: "Curated health topics" },
              { Icon: ChatIcon, label: "AI Chat", sub: "Ask anything privately" },
              { Icon: ShieldIcon, label: "Safe Space", sub: "No judgment, ever" },
              { Icon: GlobeIcon, label: "Multilingual", sub: "6 languages supported" },
            ].map(({ Icon, label, sub }) => (
              <div key={label} className="card p-5 flex gap-4 items-start">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState(null);

  const items = [
    {
      q: "What is HIV and how is it transmitted?",
      a: "HIV is a virus that attacks the immune system. It is mainly transmitted through unprotected sexual contact, sharing needles, or from mother to child. It can be prevented through safer sex practices, testing, and treatment. With proper care, people with HIV can live long, healthy lives.",
    },
    {
      q: "How can I prevent an unwanted pregnancy?",
      a: "Use reliable contraception consistently. Options include condoms (which also protect against STIs), birth control pills, injections, implants, or IUDs. Condoms are the only method that protects against both pregnancy and sexually transmitted infections.",
    },
    {
      q: "What does consent mean?",
      a: "Consent is a clear, freely given, enthusiastic agreement to participate in any activity. It must be ongoing — anyone can change their mind at any time. Consent cannot be given if someone is pressured, intoxicated, or asleep.",
    },
    {
      q: "How are STIs spread and how can I stay safe?",
      a: "STIs are mostly spread through unprotected sexual contact. Using condoms consistently and getting tested regularly significantly reduces risk. Many STIs have no visible symptoms, so regular testing is important even if you feel healthy.",
    },
    {
      q: "Is my conversation with SomaAI private?",
      a: "Yes. SomaAI does not require any personal information to use. Your questions are processed privately and we do not store identifying information about who you are. You can ask about any topic without fear of judgment.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-3">FAQ</p>
          <h2 className="section-heading mb-4">Common questions</h2>
          <p className="section-sub max-w-xl mx-auto">
            Quick answers to the topics young people ask about most.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="max-w-2xl mx-auto divide-y divide-slate-200 card overflow-hidden"
        >
          {items.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left group focus:outline-none"
              >
                <span className="font-medium text-sm text-slate-900 pr-6">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-6 pb-5"
                >
                  <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.2}
          variants={fadeUp}
          className="text-center mt-10"
        >
          <p className="text-sm text-slate-500 mb-4">Have a question that isn't here?</p>
          <Link to="/chat" className="btn-primary">
            Ask SomaAI directly
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Team ───────────────────────────────────────────────────── */
function Team() {
  const members = [
    { name: "Daniel Laferriere", role: "Full Stack Developer", photo: deepakPhoto },
    { name: "Tejas Kaushik", role: "AI & Full Stack Developer", photo: tejasPhoto },
    { name: "Swanish Baweja", role: "Full Stack Developer", photo: samPhoto },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-3">Team</p>
          <h2 className="section-heading mb-4">Meet the builders</h2>
          <p className="section-sub max-w-lg mx-auto">
            Passionate about empowering youth with knowledge and support.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-10 sm:gap-14">
          {members.map(({ name, role, photo }, i) => (
            <motion.div
              key={name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i * 0.1}
              variants={fadeUp}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-card">
                <img
                  src={photo}
                  alt={name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm text-slate-900">{name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.3}
          variants={fadeUp}
          className="text-center mt-12 text-sm text-slate-500"
        >
          Want to contribute?{" "}
          <a
            href="mailto:hello@somaai.org"
            className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 transition-colors"
          >
            Get in touch
          </a>
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 4a3 3 0 110 6 3 3 0 010-6zm0 10a6.99 6.99 0 01-5.88-3.19C7.22 12.42 9.5 11.5 12 11.5c2.5 0 4.78.92 5.88 2.31A6.99 6.99 0 0112 17z" fill="white" />
                </svg>
              </div>
              <span className="font-semibold text-white">SomaAI</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs text-center md:text-left">
              AI-powered health education for youth.
              <br />
              An education tool — not medical advice.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3 text-sm">
            {[
              { label: "Lessons", path: "/lessons" },
              { label: "Chat", path: "/chat" },
              { label: "Sign In", path: "/signin" },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} SomaAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
