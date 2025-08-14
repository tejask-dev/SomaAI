import React, { useState, useRef, useEffect } from "react";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen flex flex-col bg-emerald-50 text-slate-800">
      <Header />
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">SomaAI Chat</h1>
        <p className="text-slate-600 mb-6 text-center max-w-xl text-sm sm:text-base">
          Ask anything, get great answers.
        </p>
        <ChatBox />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-emerald-100 p-4 flex justify-between items-center">
      <span className="font-semibold text-lg">SomaAI</span>
      <a href="/" className="text-emerald-600 hover:underline text-sm">Back to Home</a>
    </header>
  );
}

function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I’m SomaAI. What’s your question?" },
  ]);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAiTyping(true);

    setTimeout(() => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "(Backend reply here)" }
        ]);
        setAiTyping(false);
      }, 1000 + Math.random() * 1000);
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col bg-white border border-emerald-100 rounded-xl shadow p-4">
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
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700" type="submit">
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
