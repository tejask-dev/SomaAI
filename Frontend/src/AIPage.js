import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import ReactMarkdown from "react-markdown";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_URL || "https://somaai-jfuq.onrender.com";
const detectLang = (text) => (/[\u0900-\u097F]/.test(text) ? "hi" : "en");

/* ─── Icons ──────────────────────────────────────────────────── */
function SendIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}
function PlusIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function TrashIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  );
}
function MaximizeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M16 21h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
    </svg>
  );
}
function MinimizeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" />
    </svg>
  );
}
function SidebarIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

/* ─── Page wrapper ───────────────────────────────────────────── */
export default function ChatbotPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/signin");
  }, [user, loading, navigate]);

  if (!user) return null;

  return (
    <div
      className={`${
        isFullScreen
          ? "fixed inset-0 z-50 bg-white"
          : "min-h-screen flex flex-col bg-slate-50"
      }`}
    >
      {!isFullScreen && <Navbar />}

      <main
        className={`flex-1 flex flex-col ${
          isFullScreen
            ? "h-full"
            : "pt-16 sm:pt-16 py-6 px-3 sm:px-6"
        }`}
      >
        {isFullScreen ? (
          <ChatBox
            user={user}
            lang={lang}
            setLang={setLang}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
          />
        ) : (
          <div className="flex-1 flex gap-6 max-w-7xl w-full mx-auto">
            {/* Left info panel — desktop only */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex flex-col justify-center w-80 shrink-0 gap-6 pb-4"
            >
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
                  SomaAI Chat
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Ask anything about health, safety, or growing up. Private,
                  non-judgmental, and always available.
                </p>
                <Link
                  to="/lessons"
                  className="btn-secondary text-sm inline-flex"
                >
                  Browse lessons
                </Link>
              </div>

              {/* Quick tips */}
              <div className="card p-5 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">You can ask about</p>
                {["HIV & STIs", "Contraception", "Consent", "Puberty & growing up", "Mental health", "Relationships"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </motion.aside>

            {/* Chat window */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex min-h-0 rounded-2xl overflow-hidden shadow-card-lg border border-slate-200"
              style={{ height: "calc(100vh - 8rem)", maxHeight: 720 }}
            >
              <ChatBox
                user={user}
                lang={lang}
                setLang={setLang}
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
              />
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── ChatBox ────────────────────────────────────────────────── */
function ChatBox({ user, lang, setLang, isFullScreen, setIsFullScreen }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm SomaAI. What health question can I help you with today?" },
  ]);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(isFullScreen);

  const messagesEndRef = useRef(null);
  const prevCountRef = useRef(messages.length);
  const inputRef = useRef(null);

  // Auto-scroll only when a new message arrives
  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  // Load chat history once on mount
  useEffect(() => {
    async function loadChats() {
      try {
        const snap = await getDocs(collection(db, "users", user.uid, "chats"));
        const chats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        chats.sort((a, b) => {
          const ta = a.timestamp?.toDate?.() ?? new Date(0);
          const tb = b.timestamp?.toDate?.() ?? new Date(0);
          return tb - ta;
        });
        setChatSessions(chats);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    }
    loadChats();
  }, [user.uid]);

  // Update sidebar visibility when fullscreen mode changes
  useEffect(() => {
    setShowSidebar(isFullScreen);
  }, [isFullScreen]);

  function startNewChat() {
    if (aiTyping) return;
    if (messages.length > 1) saveCurrentChat(messages);
    setMessages([{ role: "assistant", text: "Hi! I'm SomaAI. What health question can I help you with today?" }]);
    setSessionId(null);
    setChatId(null);
  }

  async function loadChat(id) {
    if (aiTyping) return;
    setChatId(id);
    setSessionId(null);
    try {
      const snap = await getDoc(doc(db, "users", user.uid, "chats", id));
      if (snap.exists()) setMessages(snap.data().messages || []);
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  }

  async function saveCurrentChat(msgs) {
    if (msgs.length <= 1 || !user?.uid) return;
    const data = {
      messages: msgs,
      timestamp: new Date(),
      title:
        msgs[1]?.text?.substring(0, 60) +
        (msgs[1]?.text?.length > 60 ? "…" : "") || "Conversation",
    };
    try {
      if (chatId) {
        await updateDoc(doc(db, "users", user.uid, "chats", chatId), data);
      } else {
        const ref = await addDoc(collection(db, "users", user.uid, "chats"), data);
        setChatId(ref.id);
        setChatSessions((prev) => [{ id: ref.id, ...data }, ...prev]);
      }
    } catch (err) {
      console.error("Error saving chat:", err);
    }
  }

  async function deleteChat(id) {
    try {
      await deleteDoc(doc(db, "users", user.uid, "chats", id));
      setChatSessions((prev) => prev.filter((c) => c.id !== id));
      if (chatId === id) startNewChat();
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || aiTyping) return;

    const detectedLang = detectLang(trimmed);
    setLang(detectedLang);

    const userMsg = { role: "user", text: trimmed };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setInput("");
    setAiTyping(true);

    let sid = sessionId;
    try {
      if (!sid) {
        const res = await fetch(`${API_BASE}/api/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: detectedLang }),
        });
        const data = await res.json();
        sid = data.session_id;
        setSessionId(sid);
      }

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sid, message: trimmed, language: detectedLang }),
      });
      const data = await res.json();

      const text =
        data.answer_simple || data.answer || data.error || "Sorry, no response received.";
      const finalMsgs = [...nextMsgs, { role: "assistant", text }];
      setMessages(finalMsgs);
      await saveCurrentChat(finalMsgs);
    } catch {
      setMessages([
        ...nextMsgs,
        { role: "assistant", text: "Connection error. Please check your network and try again." },
      ]);
    } finally {
      setAiTyping(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex w-full h-full overflow-hidden bg-white">
      {/* Sidebar — fullscreen only */}
      <AnimatePresence>
        {isFullScreen && showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-r border-slate-200 flex flex-col overflow-hidden shrink-0"
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-900">History</span>
            </div>
            <div className="p-3">
              <button
                onClick={startNewChat}
                className="w-full btn-primary text-xs py-2 justify-center"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                New chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
              {chatSessions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No history yet</p>
              ) : (
                chatSessions.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => loadChat(chat.id)}
                    className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                      chatId === chat.id
                        ? "bg-emerald-50 text-emerald-800"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="truncate flex-1">{chat.title}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 flex-shrink-0 transition-all p-0.5 rounded"
                      aria-label="Delete chat"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            {isFullScreen && (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <SidebarIcon />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth={1.75} strokeLinecap="round">
                  <path d="M12 2a7 7 0 017 7v1a2 2 0 010 4v1a7 7 0 01-14 0v-1a2 2 0 010-4V9a7 7 0 017-7z" />
                  <path d="M9 10h.01M15 10h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">SomaAI</p>
                <p className="text-xs text-emerald-600 leading-tight flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Online
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={isFullScreen ? "Exit full screen" : "Full screen"}
          >
            {isFullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-slate-50">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} text={msg.text} />
          ))}
          {aiTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0">
          <form onSubmit={sendMessage} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
                placeholder="Ask a health question…"
                rows={1}
                className="w-full resize-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all leading-relaxed"
                style={{ minHeight: 42, maxHeight: 120 }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || aiTyping}
              className="h-[42px] w-[42px] flex-shrink-0 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              aria-label="Send"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Message bubble ─────────────────────────────────────────── */
function ChatMessage({ role, text }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round">
            <path d="M12 2a7 7 0 017 7v1a2 2 0 010 4v1a7 7 0 01-14 0v-1a2 2 0 010-4V9a7 7 0 017-7z" />
            <path d="M9 10h.01M15 10h.01" />
          </svg>
        </div>
      )}

      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-600 text-white rounded-tr-md"
            : "bg-white text-slate-800 border border-slate-200 shadow-card rounded-tl-md"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{text}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="text-slate-800" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                ul: ({ node, ...props }) => <ul className="ml-4 list-disc" {...props} />,
                ol: ({ node, ...props }) => <ol className="ml-4 list-decimal" {...props} />,
                li: ({ node, ...props }) => <li className="text-slate-800" {...props} />,
                a: ({ node, ...props }) => <a className="text-indigo-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold text-white uppercase">
          Y
        </div>
      )}
    </motion.div>
  );
}

/* ─── Typing indicator ───────────────────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 justify-start"
    >
      <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round">
          <path d="M12 2a7 7 0 017 7v1a2 2 0 010 4v1a7 7 0 01-14 0v-1a2 2 0 010-4V9a7 7 0 017-7z" />
          <path d="M9 10h.01M15 10h.01" />
        </svg>
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-slate-200 shadow-card flex items-center gap-1.5">
        {[0, 0.18, 0.36].map((delay) => (
          <motion.span
            key={delay}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"
          />
        ))}
      </div>
    </motion.div>
  );
}
