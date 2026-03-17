import React, { useState, useEffect } from "react";
import LessonCard from "./LessonCard";
import { db } from "./firebase";
import { getDocs, collection } from "firebase/firestore";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TOPICS = [
  "All Topics",
  "Health & Safety",
  "Relationships",
  "Mental Health",
  "Physical Health",
  "Life Skills",
];

function SearchIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function SpinnerIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.2} />
      <path d="M3 12a9 9 0 019-9" className="animate-spin origin-center" style={{ animationDuration: "0.8s" }} />
    </svg>
  );
}

export default function Lessons() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [lessons, setLessons] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredLessons, setFilteredLessons] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const docs = await getDocs(collection(db, "Lessons"));
        const arr = docs.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => Number(a.id) - Number(b.id));
        setLessons(arr);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFilteredLessons(
      lessons.filter((l) => {
        const name = l.name?.toLowerCase() ?? "";
        const content = l.content?.toLowerCase() ?? "";
        return name.includes(term) || content.includes(term);
      })
    );
  }, [lessons, search]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.15} />
              <path d="M3 12a9 9 0 019-9" style={{ animation: "spin 0.75s linear infinite" }} />
            </svg>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p className="text-sm text-slate-400">Loading lessons…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page header */}
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-12 border-b border-slate-100 bg-slate-50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-3">
              Lessons
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
              Health education, structured.
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Browse our curated library of lessons covering sexual health,
              relationships, mental wellbeing, and more.
            </p>
          </motion.div>

          {/* Search + filter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 space-y-4"
          >
            {/* Search */}
            <div className="relative max-w-md">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search lessons…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Topic chips */}
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    selectedTopic === topic
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lessons grid */}
      <section className="py-10 sm:py-14">
        <div className="section-container">
          {/* Count */}
          <p className="text-sm text-slate-400 mb-6">
            {filteredLessons.length} lesson{filteredLessons.length !== 1 ? "s" : ""}
          </p>

          <AnimatePresence mode="wait">
            {filteredLessons.length > 0 ? (
              <motion.div
                key={`${selectedTopic}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filteredLessons.map((lesson, index) => (
                  <LessonCard
                    key={lesson.id}
                    id={lesson.id}
                    name={lesson.name}
                    index={index}
                    content={
                      lesson.content.length > 120
                        ? lesson.content.substring(0, 120).trimEnd() + "…"
                        : lesson.content
                    }
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <SearchIcon className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">No lessons found</h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  Try adjusting your search or selecting a different topic.
                </p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="mt-5 btn-secondary text-sm"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA strip */}
      {filteredLessons.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-12">
          <div className="section-container text-center">
            <p className="text-sm text-slate-500 mb-4">
              Want a personalised deep-dive on any topic?
            </p>
            <a href="/chat" className="btn-primary inline-flex">
              Ask SomaAI
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
