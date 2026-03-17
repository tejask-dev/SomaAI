import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Lessons", path: "/lessons" },
    { label: "Chat", path: "/chat" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function handleAuth() {
    if (user) {
      signout();
    } else {
      navigate("/signin");
    }
    setMobileOpen(false);
  }

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
          : "bg-white/90 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors duration-200">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none">
                <path
                  d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 4a3 3 0 110 6 3 3 0 010-6zm0 10a6.99 6.99 0 01-5.88-3.19C7.22 12.42 9.5 11.5 12 11.5c2.5 0 4.78.92 5.88 2.31A6.99 6.99 0 0112 17z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors duration-200">
              SomaAI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={handleAuth}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/signin"
                className="btn-primary text-sm"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile: auth + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <button
                onClick={handleAuth}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Sign out
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                {mobileOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <>
                    <path d="M3 7h18" />
                    <path d="M3 12h18" />
                    <path d="M3 17h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 w-72 bg-white border-l border-slate-200 z-50 md:hidden overflow-y-auto"
            >
              <div className="p-5 space-y-1">
                {navLinks.map(({ label, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(path)
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                {!user && (
                  <div className="pt-4">
                    <Link
                      to="/signin"
                      className="btn-primary w-full justify-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
