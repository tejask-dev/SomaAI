import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChatbotPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-emerald-50 to-white text-slate-800">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-center gap-8 w-full max-w-4xl">
          <div className="flex-1 flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold mb-2">SomaAI Chat</h1>
            <p className="text-slate-600 mb-4 text-center max-w-md text-base sm:text-lg">
              Ask anything about health, safety, or growing up. Our AI is always ready to help—privately and kindly.
            </p>
            <div className="mb-3">
              <a
                href="/lessons"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 transition-all font-semibold"
              >
                Browse Lessons
              </a>
            </div>
          </div>
          <div className="flex-1">
            <ChatBox user={user} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-emerald-100 p-4 flex justify-between items-center">
      <a href="/" className="flex items-center gap-2 text-emerald-600 hover:underline text-sm">
        <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3.293l6 6V17a1 1 0 01-1 1h-3v-4H8v4H5a1 1 0 01-1-1v-7.707l6-6z" />
        </svg>
        Home
      </a>
      <span className="font-semibold text-lg">SomaAI</span>
    </header>
  );
}

function ChatBox({ user }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I’m SomaAI. What’s your question?" },
  ]);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const listRef = useRef(null);

  // On mount, create a session with backend
  useEffect(() => {
    async function startSession() {
      try {
        // You can change 'en' to user's preferred language if you want
        const res = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: "en" }),
        });
        const data = await res.json();
        if (data.session_id) {
          setSessionId(data.session_id);
          setMessages([
            { role: "assistant", text: data.message || "Hi! I’m SomaAI. What’s your question?" },
          ]);
        }
      } catch (err) {
        setMessages([
          { role: "assistant", text: "Sorry, could not connect to the AI backend. Please try again later." },
        ]);
      }
    }
    startSession();
  }, [user.uid]);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userMsg = { role: "user", text: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setAiTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: input.trim(),
        }),
      });
      const data = await res.json();
      if (data.answer_simple) {
        const aiMsg = { role: "assistant", text: data.answer_simple };
        setMessages([...newMsgs, aiMsg]);
      } else if (data.answer) {
        const aiMsg = { role: "assistant", text: data.answer };
        setMessages([...newMsgs, aiMsg]);
      } else if (data.error) {
        setMessages([
          ...newMsgs,
          { role: "assistant", text: data.error }
        ]);
      } else {
        setMessages([
          ...newMsgs,
          { role: "assistant", text: "Sorry, no response from backend." }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMsgs,
        { role: "assistant", text: "Error connecting to backend. Try again soon." }
      ]);
    }
    setAiTyping(false);
  }

  return (
    <div className="w-full max-w-xl flex flex-col bg-white border border-emerald-100 rounded-xl shadow p-4">
      <div ref={listRef} className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[60vh] pr-1">
        {messages.map((m, i) => (
          <Message key={i} role={m.role} text={m.text} />
        ))}
        {aiTyping && <TypingIndicator />}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border border-emerald-200 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring focus:ring-emerald-300"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

function Message({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-[75%] text-sm sm:text-base whitespace-pre-line ${
          isUser ? "bg-emerald-600 text-white" : "bg-emerald-100 text-slate-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-2 rounded-lg bg-emerald-100 text-slate-800 flex items-center space-x-1 text-sm">
        <span className="animate-bounce">●</span>
        <span className="animate-bounce delay-100">●</span>
        <span className="animate-bounce delay-200">●</span>
        <span className="ml-2">AI is typing...</span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-8 py-4 text-center text-xs text-slate-500 border-t border-emerald-100">
      © {new Date().getFullYear()} SomaAI — Built for learning and empowerment.
    </footer>
  );
}