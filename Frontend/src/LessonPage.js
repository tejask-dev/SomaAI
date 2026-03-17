import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import { db } from "./firebase";
import {
  getDoc,
  getDocs,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import LessonCard from "./LessonCard";
import Navbar from "./Navbar";
import Youtube from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";

/* ─── Icons ──────────────────────────────────────────────────── */
function ChevronLeft({ className = "w-4 h-4" }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>;
}
function ChevronRight({ className = "w-4 h-4" }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>;
}
function CheckCircle({ className = "w-5 h-5" }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
function StarIcon({ className = "w-5 h-5", filled = false }) {
  return <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}

/* ─── Rating modal ───────────────────────────────────────────── */
function RatingModal({ onSubmit, onClose, existingRating }) {
  const [selected, setSelected] = useState(existingRating || 0);
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="bg-white rounded-2xl shadow-card-lg border border-slate-200 p-7 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-900 text-center mb-1">Rate this lesson</h3>
        <p className="text-sm text-slate-500 text-center mb-7">How useful did you find it?</p>

        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            >
              <StarIcon
                className={`w-8 h-8 ${(hovered || selected) >= star ? "text-yellow-400" : "text-slate-200"}`}
                filled={(hovered || selected) >= star}
              />
            </button>
          ))}
        </div>

        <p className="text-center text-xs font-medium text-slate-500 mb-6 h-4">
          {(hovered || selected) > 0 && labels[hovered || selected]}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={selected === 0}
            onClick={() => onSubmit(selected)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── LessonPage ─────────────────────────────────────────────── */
function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [discoverLessons, setDiscoverLessons] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  const [userProgress, setUserProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [existingRating, setExistingRating] = useState(0);
  const [ratingStatus, setRatingStatus] = useState(""); // "saved" | "error" | "signin"
  const [progressSaved, setProgressSaved] = useState(false);

  const COMPLETION_TIME = 3 * 60;

  /* ── Fetch lesson data ── */
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setTimer(0);
      setTimerStarted(false);
      setActiveTab("content");

      try {
        const allDocs = await getDocs(collection(db, "Lessons"));
        const arr = allDocs.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAllLessons(arr);

        const idx = arr.findIndex((l) => l.id === id);
        setCurrentIdx(idx);

        // Discover lessons (random, excluding current)
        const pool = arr.filter((l) => l.id !== id);
        const picked = [];
        while (picked.length < Math.min(4, pool.length)) {
          const r = Math.floor(Math.random() * pool.length);
          if (!picked.includes(pool[r])) picked.push(pool[r]);
        }
        setDiscoverLessons(picked);

        const snap = await getDoc(doc(db, "Lessons", id));
        setData(snap.data() ?? null);

        if (user) {
          const progressSnap = await getDoc(doc(db, "userProgress", user.uid));
          const completed = progressSnap.exists()
            ? progressSnap.data().completedLessons ?? []
            : [];
          setHasCompleted(completed.includes(id));
          setUserProgress(Math.round((completed.length / arr.length) * 100));

          // Load existing rating
          const ratingSnap = await getDoc(doc(db, "lessonRatings", `${user.uid}_${id}`));
          if (ratingSnap.exists()) setExistingRating(ratingSnap.data().rating ?? 0);
          else setExistingRating(0);
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, user]);

  /* ── Timer ── */
  useEffect(() => {
    if (activeTab === "content" && !hasCompleted && !timerStarted) {
      setTimerStarted(true);
      setTimer(0);
    }
  }, [activeTab, hasCompleted, timerStarted]);

  useEffect(() => {
    if (!timerStarted || hasCompleted || activeTab !== "content") return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerStarted, hasCompleted, activeTab]);

  useEffect(() => {
    if (timerStarted && !hasCompleted && timer >= COMPLETION_TIME && user && allLessons.length > 0) {
      markComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  async function markComplete() {
    if (!user) return;
    try {
      const ref = doc(db, "userProgress", user.uid);
      const snap = await getDoc(ref);
      const completed = snap.exists() ? snap.data().completedLessons ?? [] : [];
      if (!completed.includes(id)) {
        const next = [...completed, id];
        await setDoc(ref, { completedLessons: next }, { merge: true });
        setHasCompleted(true);
        setUserProgress(Math.round((next.length / allLessons.length) * 100));
      }
    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  }

  /* ── Rating ── */
  function handleRateLesson() {
    if (!user) { setRatingStatus("signin"); setTimeout(() => setRatingStatus(""), 4000); return; }
    setShowRatingModal(true);
  }

  async function submitRating(rating) {
    setShowRatingModal(false);
    try {
      const ref = doc(db, "lessonRatings", `${user.uid}_${id}`);
      const entry = { userId: user.uid, lessonId: id, rating, timestamp: new Date() };
      const snap = await getDoc(ref);
      if (snap.exists()) await updateDoc(ref, entry);
      else await setDoc(ref, entry);

      // Update lesson aggregate
      const lessonRef = doc(db, "Lessons", id);
      const lessonSnap = await getDoc(lessonRef);
      if (lessonSnap.exists()) {
        const ratings = lessonSnap.data().ratings ?? [];
        const idx = ratings.findIndex((r) => r.userId === user.uid);
        const newEntry = { userId: user.uid, rating, timestamp: new Date() };
        if (idx >= 0) ratings[idx] = newEntry; else ratings.push(newEntry);
        const avg = ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
        await updateDoc(lessonRef, {
          ratings,
          averageRating: Math.round(avg * 10) / 10,
          totalRatings: ratings.length,
        });
      }
      setExistingRating(rating);
      setRatingStatus("saved");
    } catch (err) {
      console.error("Error saving rating:", err);
      setRatingStatus("error");
    } finally {
      setTimeout(() => setRatingStatus(""), 3500);
    }
  }

  function handleSaveProgress() {
    setProgressSaved(true);
    setTimeout(() => setProgressSaved(false), 3000);
  }

  function goNext() {
    if (currentIdx !== null && currentIdx + 1 < allLessons.length) {
      navigate(`/lesson/${allLessons[currentIdx + 1].id}`);
    }
  }
  function goPrev() {
    if (currentIdx !== null && currentIdx > 0) {
      navigate(`/lesson/${allLessons[currentIdx - 1].id}`);
    }
  }

  /* ── Loading ── */
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
            <p className="text-sm text-slate-400">Loading lesson…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Lesson not found</h1>
            <p className="text-sm text-slate-500 mb-6">This lesson doesn't seem to exist.</p>
            <a href="/lessons" className="btn-primary">Browse all lessons</a>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "content", label: "Lesson" },
    ...(data.video ? [{ key: "video", label: "Video" }] : []),
    { key: "related", label: "Related" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Rating modal */}
      <AnimatePresence>
        {showRatingModal && (
          <RatingModal
            existingRating={existingRating}
            onSubmit={submitRating}
            onClose={() => setShowRatingModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Page header */}
      <section className="pt-20 sm:pt-24 pb-0 border-b border-slate-100 bg-slate-50">
        <div className="section-container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-4 mb-5">
            <a href="/lessons" className="hover:text-slate-600 transition-colors">Lessons</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 truncate max-w-xs">{data.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-0">
            <div className="max-w-2xl">
              {hasCompleted && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mb-3">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Completed
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {data.name}
              </h1>
              <p className="text-sm text-slate-500 mt-2">~3–5 min read · Beginner</p>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={goPrev}
                disabled={!currentIdx}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous lesson"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goNext}
                disabled={currentIdx === null || currentIdx + 1 >= allLessons.length}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next lesson"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 -mb-px">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200 ${
                  activeTab === key
                    ? "border-emerald-600 text-emerald-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content area */}
      <section className="py-10">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* Lesson content */}
                {activeTab === "content" && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.22 }}
                    className="card p-6 sm:p-8"
                  >
                    <div className="prose prose-slate prose-sm sm:prose-base max-w-none
                      prose-headings:font-bold prose-headings:tracking-tight
                      prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                      prose-p:text-slate-600 prose-p:leading-relaxed
                      prose-strong:text-slate-900 prose-strong:font-semibold
                      prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                      prose-ul:text-slate-600 prose-ol:text-slate-600
                      prose-li:leading-relaxed">
                      <Markdown>{data.content}</Markdown>
                    </div>

                    {/* Completion progress */}
                    {!hasCompleted && (
                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span>Reading progress</span>
                          <span>{Math.min(100, Math.round((timer / COMPLETION_TIME) * 100))}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100">
                          <motion.div
                            animate={{ width: `${Math.min(100, (timer / COMPLETION_TIME) * 100)}%` }}
                            transition={{ duration: 1 }}
                            className="h-1.5 rounded-full bg-emerald-500"
                          />
                        </div>
                        {timer < COMPLETION_TIME && (
                          <p className="text-xs text-slate-400 mt-2">
                            {Math.ceil((COMPLETION_TIME - timer) / 60)} minute{Math.ceil((COMPLETION_TIME - timer) / 60) !== 1 ? "s" : ""} left to complete
                          </p>
                        )}
                      </div>
                    )}

                    {/* Completed state + next button */}
                    {hasCompleted && (
                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-4">
                          <CheckCircle className="w-4 h-4" />
                          Lesson complete
                        </div>
                        {currentIdx !== null && currentIdx + 1 < allLessons.length && (
                          <button
                            onClick={goNext}
                            className="btn-primary text-sm"
                          >
                            Next lesson
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Video tab */}
                {activeTab === "video" && data.video && (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.22 }}
                    className="card overflow-hidden"
                  >
                    <div className="p-5 border-b border-slate-100">
                      <h2 className="font-semibold text-slate-900">Video lesson</h2>
                    </div>
                    <div className="aspect-video">
                      <Youtube
                        videoId={getYouTubeID(data.video)}
                        opts={{ height: "100%", width: "100%", playerVars: { autoplay: 0, modestbranding: 1, rel: 0 } }}
                        className="w-full h-full"
                        iframeClassName="w-full h-full"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Related tab */}
                {activeTab === "related" && (
                  <motion.div
                    key="related"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.22 }}
                    className="card p-6 sm:p-8"
                  >
                    <h2 className="font-semibold text-slate-900 mb-5">Related lessons</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {discoverLessons.map((lesson, i) => (
                        <LessonCard
                          key={lesson.id}
                          id={lesson.id}
                          name={lesson.name}
                          content={(lesson.content ?? "").substring(0, 100) + "…"}
                          index={i}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="space-y-4"
            >
              {/* Progress */}
              {user && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Your progress</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Overall completion</span>
                    <span className="font-medium text-slate-700">{userProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${userProgress}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-2 rounded-full bg-emerald-500"
                    />
                  </div>
                  {userProgress === 100 && (
                    <p className="text-xs text-emerald-600 font-medium mt-2">All lessons complete!</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="card p-5 space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Actions</h3>

                <button
                  onClick={handleSaveProgress}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                >
                  <span>Save progress</span>
                  {progressSaved && (
                    <span className="text-xs text-emerald-600 font-medium">Saved!</span>
                  )}
                </button>

                <button
                  onClick={handleRateLesson}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                >
                  <span>{existingRating > 0 ? `Your rating: ${existingRating}/5` : "Rate this lesson"}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon
                        key={s}
                        className={`w-3.5 h-3.5 ${existingRating >= s ? "text-yellow-400" : "text-slate-200"}`}
                        filled={existingRating >= s}
                      />
                    ))}
                  </div>
                </button>

                {ratingStatus === "saved" && (
                  <p className="text-xs text-emerald-600 text-center pt-1">Rating saved!</p>
                )}
                {ratingStatus === "error" && (
                  <p className="text-xs text-red-500 text-center pt-1">Could not save. Try again.</p>
                )}
                {ratingStatus === "signin" && (
                  <p className="text-xs text-amber-600 text-center pt-1">
                    <a href="/signin" className="underline">Sign in</a> to rate lessons.
                  </p>
                )}
              </div>

              {/* Lesson info */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">About this lesson</h3>
                <dl className="space-y-2.5 text-xs">
                  {[
                    { dt: "Duration", dd: "~3–5 min" },
                    { dt: "Level", dd: "Beginner" },
                    { dt: "Status", dd: hasCompleted ? "Completed" : "Not started" },
                  ].map(({ dt, dd }) => (
                    <div key={dt} className="flex justify-between">
                      <dt className="text-slate-500">{dt}</dt>
                      <dd className={`font-medium ${hasCompleted && dt === "Status" ? "text-emerald-600" : "text-slate-800"}`}>{dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Ask SomaAI CTA */}
              <div className="rounded-2xl bg-slate-900 p-5 text-white">
                <p className="text-sm font-semibold mb-1">Have a question?</p>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  SomaAI can answer follow-up questions on this topic.
                </p>
                <a
                  href="/chat"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Ask SomaAI
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Helper ─────────────────────────────────────────────────── */
function getYouTubeID(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {}
  return null;
}

export default LessonPage;
