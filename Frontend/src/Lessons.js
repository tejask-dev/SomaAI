import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/solid";

const lessons = [
  {
    title: "Nutrition & Fitness",
    desc: "Learn how to fuel your body and stay active for a healthy lifestyle."
  },
  {
    title: "Mental Health Basics",
    desc: "Understand stress, anxiety, and tips to support your emotional well-being."
  },
  {
    title: "Digital Safety",
    desc: "Protect your privacy, stay safe online, and manage social media responsibly."
  },
  {
    title: "Sleep & Wellness",
    desc: "Discover the importance of sleep and healthy routines for teens."
  },
  {
    title: "Substance Awareness",
    desc: "Get facts about alcohol, drugs, and making safe choices."
  },
];

export default function Lessons() {
  const [search, setSearch] = useState("");
  const filtered = lessons.filter(
    l =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1 text-emerald-600 hover:underline">
              <HomeIcon className="h-5 w-5 text-emerald-600" />
              Home
            </Link>
            <h2 className="text-3xl font-bold ml-4">Lessons</h2>
          </div>
          <input
            type="text"
            placeholder="Search lessons…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-lg px-4 py-2 border border-emerald-200 shadow focus:ring-emerald-400 focus:outline-none"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {filtered.map((lesson, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-emerald-100 hover:scale-[1.03] transition-all duration-300"
            >
              <h3 className="font-semibold text-lg mb-1">{lesson.title}</h3>
              <p className="text-slate-700 text-sm">{lesson.desc}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center text-slate-500 py-12">No lessons found.</div>
          )}
        </div>
      </div>
    </section>
  );
}