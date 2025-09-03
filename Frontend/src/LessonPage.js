import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Markdown from 'react-markdown';
import { db } from './firebase';
import { getDoc, getDocs, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import LessonCard from './LessonCard';
import './LessonPage.css';
import Navbar from "./Navbar";
import Youtube from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";

function LessonPage() {
    const [showSidebar, setShowSidebar] = useState(false);
    const { id } = useParams();
    const [data, setData] = useState();
    const [discoverLessons, setDiscoverLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('content');
    const [userProgress, setUserProgress] = useState(0);
    const [allLessons, setAllLessons] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(null);
    const [timer, setTimer] = useState(0);
    const [timerStarted, setTimerStarted] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();
    const discoverLessonCount = 4;
    const COMPLETION_TIME = 7 * 60; // 7 minutes minimum for completion

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const docs = await getDocs(collection(db, "Lessons"));
                const lessonsArr = docs.docs.map(d => ({ id: d.id, ...d.data() }));
                setAllLessons(lessonsArr);
                const result = await getContent(id);
                setData(result);

                // Find current lesson index
                const idx = lessonsArr.findIndex(l => l.id === id);
                setCurrentIdx(idx);

                addDiscoverLessons(lessonsArr);
                setIsLoading(false);

                // Progress fetch
                if (user) {
                    await fetchUserProgress(user.uid, lessonsArr);
                }
            } catch (error) {
                console.error("Error fetching lesson:", error);
                setIsLoading(false);
            }
        }

        function addDiscoverLessons(lessonsArr) {
            const availableLessons = lessonsArr.filter(lesson => lesson.id !== id);
            const picked = [];
            while (picked.length < Math.min(discoverLessonCount, availableLessons.length)) {
                const randomIdx = Math.floor(Math.random() * availableLessons.length);
                const lesson = availableLessons[randomIdx];
                if (!picked.find(l => l.id === lesson.id)) {
                    picked.push(lesson);
                }
            }
            setDiscoverLessons(picked);
        }

        async function fetchUserProgress(uid, lessonsArr) {
            try {
                const userProgressDoc = await getDoc(doc(db, "userProgress", uid));
                let completedLessons = [];
                if (userProgressDoc.exists()) completedLessons = userProgressDoc.data().completedLessons || [];
                setUserProgress(Math.round((completedLessons.length / lessonsArr.length) * 100));
                setHasCompleted(completedLessons.includes(id));
            } catch (e) { setUserProgress(0); }
        }

        fetchData();
        setTimer(0);
        setTimerStarted(false);
    }, [id, user]);

    // Timer for lesson completion
    useEffect(() => {
        let interval;
        if (activeSection === "content" && !hasCompleted && !timerStarted) {
            setTimerStarted(true);
            setTimer(0);
        }
        if (timerStarted && !hasCompleted && activeSection === "content") {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timerStarted, hasCompleted, activeSection]);

    // Mark as complete after time spent
    useEffect(() => {
        if (
            timerStarted &&
            !hasCompleted &&
            timer >= COMPLETION_TIME &&
            user &&
            allLessons.length > 0
        ) {
            markLessonComplete();
        }
        // eslint-disable-next-line
    }, [timer, timerStarted, hasCompleted, user, allLessons.length]);

    async function markLessonComplete() {
        try {
            const uid = user.uid;
            const userProgressRef = doc(db, "userProgress", uid);
            const progressSnap = await getDoc(userProgressRef);
            let completedLessons = [];
            if (progressSnap.exists()) completedLessons = progressSnap.data().completedLessons || [];
            if (!completedLessons.includes(id)) {
                completedLessons.push(id);
                await setDoc(userProgressRef, { completedLessons }, { merge: true });
                setUserProgress(Math.round((completedLessons.length / allLessons.length) * 100));
                setHasCompleted(true);
            }
        } catch (e) {
            console.error("Error marking lesson as complete", e);
        }
    }

    // Rate lesson (dummy logic, you can expand for user/lesson rating storage)
    function handleRateLesson() {
        window.alert("Thank you for rating this lesson!");
    }

    // Save progress (dummy logic)
    function handleSaveProgress() {
        window.alert("Your progress is saved automatically when you complete a lesson.");
    }

    function goToNextLesson() {
        if (currentIdx !== null && currentIdx + 1 < allLessons.length) {
            navigate(`/lesson/${allLessons[currentIdx + 1].id}`);
        }
    }

    function handleReadyToStart() {
        // Go to first lesson
        if (allLessons.length > 0) {
            navigate(`/lesson/${allLessons[0].id}`);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-80px)] pt-20">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
                    />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-80px)] pt-20">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-slate-700 mb-4">Lesson Not Found</h1>
                        <p className="text-slate-500">The lesson you're looking for doesn't exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Navbar />

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden py-16 px-4 pt-32"
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center mb-12"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                        >
                            {data.name}
                        </motion.h1>

                        {/* Navigation Tabs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex justify-center space-x-2 mb-8"
                        >
                            {['content', 'video', 'related'].map((section) => (
                                <motion.button
                                    key={section}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveSection(section)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                        activeSection === section
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                                            : "bg-white/80 text-slate-600 hover:bg-white hover:shadow-md"
                                    }`}
                                >
                                    <span style={{ fontWeight: activeSection === section ? 700 : 500 }}>
                                        {section === 'content' && '📖 Content'}
                                        {section === 'video' && '🎥 Video'}
                                        {section === 'related' && '🔗 Related'}
                                    </span>
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 blur-xl"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 blur-xl"
                />
            </motion.section>

            {/* Main Content */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="px-4 pb-20"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                {activeSection === 'content' && (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200"
                                    >
                                        <div className="prose prose-lg max-w-none">
                                            <Markdown>
                                                {data.content}
                                            </Markdown>
                                        </div>
                                        {/* Timer/Completion status */}
                                        {!hasCompleted && (
                                            <div className="mt-6 text-sm text-slate-500">
                                                {timer < COMPLETION_TIME
                                                    ? `Spend at least ${Math.ceil((COMPLETION_TIME - timer) / 60)} more minute(s) to complete this lesson`
                                                    : "Lesson marked as complete!"}
                                            </div>
                                        )}
                                        {/* Next lesson button */}
                                        {hasCompleted && currentIdx !== null && currentIdx + 1 < allLessons.length && (
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg font-bold text-lg hover:shadow-indigo-500/25 transition-all duration-300"
                                                onClick={goToNextLesson}
                                            >
                                                Go to Next Lesson →
                                            </motion.button>
                                        )}
                                    </motion.div>
                                )}

                                {activeSection === 'video' && data.video && (
                                    <motion.div
                                        key="video"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200"
                                    >
                                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Video Lesson</h2>
                                        <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                                            <Youtube
                                                videoId={getYouTubeID(data.video)}
                                                opts={{
                                                    height: '390',
                                                    width: '100%',
                                                    playerVars: { autoplay: 0, modestbranding: 1, rel: 0 }
                                                }}
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {activeSection === 'related' && (
                                    <motion.div
                                        key="related"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200"
                                    >
                                        <h2 className="text-2xl font-bold text-slate-800 mb-6">
                                            <b>Related Lessons</b>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {discoverLessons.map((lesson, i) => (
                                                <motion.div
                                                    key={lesson.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                                    whileHover={{ y: -5, scale: 1.02 }}
                                                >
                                                    <div onClick={() => navigate(`/lesson/${lesson.id}`)} className="cursor-pointer">
                                                        <LessonCard
                                                            id={lesson.id}
                                                            name={<b>{lesson.name}</b>}
                                                            content={<b>{lesson.content.slice(0, 80)}</b>}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="space-y-6"
                        >
                            {/* Quick Actions */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
                            >
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleReadyToStart}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                                    >
                                        ✨ Ready to Start Learning
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSaveProgress}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-200"
                                    >
                                        💾 Save Progress
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleRateLesson}
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
                                    >
                                        ⭐ Rate Lesson
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Progress Tracker */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
                            >
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Your Progress</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">Completion</span>
                                        <span className="font-bold text-indigo-600">{userProgress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${userProgress}%` }}
                                            transition={{ duration: 1, delay: 1.2 }}
                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                        />
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {userProgress === 100
                                            ? "All lessons completed! 🎉"
                                            : "Keep going! You're almost there."}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Lesson Stats */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
                            >
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Lesson Info</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Duration:</span>
                                        <span className="font-semibold">~7-10 min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Difficulty:</span>
                                        <span className="font-semibold text-green-600">Beginner</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Last Updated:</span>
                                        <span className="font-semibold">Today</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}

async function getContent(id) {
    const docRef = doc(db, "Lessons", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

function getYouTubeID(url) {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtu.be')) {
            return urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            return urlObj.searchParams.get('v');
        }
    } catch (error) {
        console.error("Invalid YouTube URL:", error);
    }
    return null;
}

export default LessonPage;