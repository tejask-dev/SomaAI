import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, signout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Only show Sign Out button on /chat or /chatbot route and if signout exists
  const showSignOut = user && typeof signout === "function" && (
    location.pathname === "/chat" || location.pathname === "/chatbot"
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-slate-200" 
          : "bg-white/80 backdrop-blur-sm border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="inline-flex items-center gap-3 focus:outline-none group">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="h-10 w-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 grid place-items-center text-white font-black shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300"
            >
              S
            </motion.div>
            <motion.span 
              className="font-bold tracking-tight text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
            >
              SomaAI
            </motion.span>
          </Link>
        </motion.div>

        <nav className="flex gap-8 items-center text-sm font-semibold">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/lessons"
              className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                location.pathname.startsWith("/lessons") 
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              📚 Lessons
              {location.pathname.startsWith("/lessons") && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-50 rounded-lg border border-indigo-200"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/chat"
              className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                (location.pathname === "/chat" || location.pathname === "/chatbot")
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              🤖 Chatbot
              {(location.pathname === "/chat" || location.pathname === "/chatbot") && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-50 rounded-lg border border-indigo-200"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>

          <AnimatePresence>
            {showSignOut && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={signout}
                className="ml-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-red-500/25 text-sm font-semibold transition-all duration-300"
              >
                Sign Out
              </motion.button>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
}