import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
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

// Language detection: Hindi (Devanagari), else English
const detectLang = (text) => (/[\u0900-\u097F]/.test(text) ? "hi" : "en");

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
					? "fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
					: "min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
			} text-slate-800`}>
			{/* Always show navbar, but adjust styling for full-screen */}
			<div
				className={`${
					isFullScreen ? "absolute top-0 left-0 right-0 z-[60]" : ""
				}`}>
				<Navbar />
			</div>

			<main
				className={`flex-1 flex flex-col w-full h-full items-center justify-center ${
					isFullScreen ? "pt-[4.5rem] py-0" : "pt-24 py-8"
				}`}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className={`flex flex-col md:flex-row w-full h-full ${
						isFullScreen ? "max-w-none" : "max-w-7xl"
					} grow gap-8`}>
					{/* Left panel text - hide in full screen */}
					{!isFullScreen && (
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className='hidden md:flex flex-1 flex-col items-center justify-center'>
							<motion.h1
								initial={{ scale: 0.8 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.6, delay: 0.4 }}
								className='text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
								SomaAI Chat
							</motion.h1>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.8, delay: 0.6 }}
								className='text-xl max-w-md text-center mb-8 text-slate-600 leading-relaxed'>
								Ask anything about health, safety, or growing up. Our AI is
								always ready to help—privately and kindly.
							</motion.p>
							<motion.a
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.95 }}
								href='/lessons'
								className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-lg hover:shadow-indigo-500/25 transition-all duration-100'>
								Browse Lessons
							</motion.a>
						</motion.div>
					)}
					{/* Right panel: chat window */}
					<motion.div
						initial={{ opacity: 0, x: isFullScreen ? 0 : 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						className={`flex flex-col items-stretch justify-end self-center ${
							isFullScreen
								? "flex-1 w-full h-full"
								: "w-full md:w-[500px] h-[550px]"
						}`}>
						<ChatBox
							user={user}
							lang={lang}
							setLang={setLang}
							isFullScreen={isFullScreen}
							setIsFullScreen={setIsFullScreen}
						/>
					</motion.div>
				</motion.div>
			</main>
			{!isFullScreen && <Footer />}
		</div>
	);
}

function ChatBox({ user, lang, setLang, isFullScreen, setIsFullScreen }) {
	const [messages, setMessages] = useState([
		{ role: "assistant", text: "Hi! I'm SomaAI. What's your question?" },
	]);
	const [input, setInput] = useState("");
	const [aiTyping, setAiTyping] = useState(false);
	const [sessionId, setSessionId] = useState(null);
	const [showSidebar, setShowSidebar] = useState(false);
	const [chatSessions, setChatSessions] = useState([]);
	const [chatId, setChatId] = useState(null);
	const [showHistorySidebar, setShowHistorySidebar] = useState(true);
	const listRef = useRef(null);
	const prevMessagesRef = useRef(messages);

	useEffect(() => {
		// Only scroll if a new message was added
		if (messages.length > prevMessagesRef.current.length) {
			listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
		}
		prevMessagesRef.current = messages;
	}, [messages]);

	// Create new chat session
	const startNewChat = () => {
		// Don't do anything if AI is currently generating a response
		if (aiTyping) return;

		// Save current chat if it has messages
		if (messages.length > 1) {
			saveCurrentChat(messages);
		}

		// Reset for new chat
		setMessages([
			{ role: "assistant", text: "Hi! I'm SomaAI. How can I help you?" },
		]);
		setSessionId(null);
		setChatId(null);
		setShowSidebar(false);
	};

	// Load selected chat
	const loadChat = async (id) => {
		// Don't do anything if AI is currently generating a response
		if (aiTyping) return;

		setChatId(id);
		setSessionId(null);

		try {
			const ref = doc(db, "users", user.uid, "chats", id);
			const snap = await getDoc(ref);

			if (snap.exists()) {
				setMessages(snap.data().messages || []);
			} else {
				console.log("No such document!");
			}
		} catch (err) {
			console.error("Error fetching chat:", err);
		}
	};

	// Save current chat to history
	const saveCurrentChat = async (msgs) => {
		if (msgs.length > 1 && user && user.uid) {
			try {
				const data = {
					messages: msgs,
					timestamp: new Date(),
					title:
						(msgs?.length > 50
							? msgs[1]?.text?.substring(0, 50) + "..."
							: msgs[1]?.text) || "New Chat",
				};

				if (chatId) {
					// Update existing chat
					await updateDoc(doc(db, "users", user.uid, "chats", chatId), data);
				} else {
					// Create new chat
					const docRef = await addDoc(
						collection(db, "users", user.uid, "chats"),
						data
					);
					setChatId(docRef.id);
				}
			} catch (error) {
				console.error("Error saving chat:", error);
			}
		}
	};

	// Load all chats
	const loadChats = async () => {
		const querySnapshot = await getDocs(
			collection(db, "users", user.uid, "chats")
		);

		setChatSessions(
			querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
		);
	};
	loadChats();

	// Delete specific chat
	const deleteChat = async (_chatId) => {
		try {
			await deleteDoc(doc(db, "users", user.uid, "chats", _chatId));
			setChatSessions(chatSessions.filter((chat) => chat.id !== _chatId));
			if (chatId === _chatId) {
				startNewChat();
			}
		} catch (error) {
			console.error("Error deleting chat:", error);
		}
	};

	async function sendMessage(e) {
		e.preventDefault();
		if (!input.trim()) return;

		const detectedLang = detectLang(input);
		setLang(detectedLang);

		const API_BASE = "https://somaai-jfuq.onrender.com";
		const userMsg = { role: "user", text: input.trim(), lang: detectedLang };
		const newMsgs = [...messages, userMsg];
		setMessages(newMsgs);
		setInput("");
		setAiTyping(true);

		let session_id = sessionId;
		try {
			if (!session_id) {
				// Create new session if first message
				const res = await fetch(`${API_BASE}/api/session`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ language: detectedLang }),
				});
				const data = await res.json();
				session_id = data.session_id;
				setSessionId(session_id);
			}
			const res = await fetch(`${API_BASE}/api/chat`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					session_id,
					message: input.trim(),
					language: detectedLang,
				}),
			});
			const data = await res.json();
			let aiMsg;
			if (data.answer_simple) {
				aiMsg = { role: "assistant", text: data.answer_simple };
			} else if (data.answer) {
				aiMsg = { role: "assistant", text: data.answer };
			} else if (data.error) {
				aiMsg = { role: "assistant", text: data.error };
			} else {
				aiMsg = { role: "assistant", text: "Sorry, no response from backend." };
			}
			newMsgs.push(aiMsg);
			setMessages(newMsgs);
			setSessionId(session_id);
		} catch {
			const aiMsg = {
				role: "assistant",
				text: "Error connecting to backend. Try again soon.",
			};
			setMessages([...newMsgs, aiMsg]);
		} finally {
			setAiTyping(false);
			await saveCurrentChat(newMsgs);
		}
	}

	return (
		<div
			className={`flex w-full h-full shadow-lg overflow-hidden ${
				isFullScreen ? "rounded-none" : "rounded-2xl"
			}`}>
			{/* History Sidebar - only show in full screen */}
			{isFullScreen && (
				<AnimatePresence>
					{showHistorySidebar && (
						<motion.div
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: 300, opacity: 1 }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ type: "spring", bounce: 0 }}
							className='bg-white border-r border-slate-200 overflow-hidden whitespace-nowrap'>
							<div className='p-4 border-b border-slate-200'>
								<h3 className='text-lg font-bold text-slate-800'>
									Chat History
								</h3>
							</div>
							<div className='p-4'>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={startNewChat}
									className='w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 mb-4'>
									✨ New Chat
								</motion.button>
								<div className='space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto'>
									{chatSessions.map((chat) => (
										<motion.div
											key={chat.id}
											className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
												chatId === chat.id
													? "bg-indigo-100 border border-indigo-300"
													: "bg-slate-50 hover:bg-slate-100"
											}`}
											onClick={() => loadChat(chat.id)}>
											<div className='flex items-center justify-between'>
												<p className='text-sm font-medium text-slate-800 truncate'>
													{chat.title}
												</p>
												<button
													onClick={(e) => {
														e.stopPropagation();
														deleteChat(chat.id);
													}}
													className='text-red-500 hover:text-red-700 text-xs'>
													🗑️
												</button>
											</div>
											<p className='text-xs text-slate-500 mt-1'>
												{new Date(chat.timestamp.toDate()).toLocaleDateString()}
											</p>
										</motion.div>
									))}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			)}

			{/* Main Chat Area */}
			<motion.div
				className={`flex flex-col w-full h-full bg-white border border-r-0 border-slate-200 overflow-hidden transition-all duration-500`}>
				{/* Chat Header */}
				<div className='bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-3'>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
								className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
								🤖
							</motion.div>
							<div>
								<h3 className='font-bold text-lg'>SomaAI Assistant</h3>
								<p className='text-sm text-indigo-100'>Always here to help</p>
							</div>
						</div>
						<div className='flex items-center space-x-2'>
							{/* History Sidebar Toggle - only show in full screen */}
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() =>
									isFullScreen
										? setShowHistorySidebar(!showHistorySidebar)
										: setIsFullScreen(true)
								}
								className='p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors'
								title={showHistorySidebar ? "Hide History" : "Show History"}>
								📚
							</motion.button>
							{/* Full Screen Button */}
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => setIsFullScreen(!isFullScreen)}
								className='p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors'
								title={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
								{isFullScreen ? "⛶" : "⛶"}
							</motion.button>
							{/* Settings Button */}
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => setShowSidebar(!showSidebar)}
								className='p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors'>
								⚙️
							</motion.button>
						</div>
					</div>
				</div>

				{/* Messages Area */}
				<div
					ref={listRef}
					className='flex-1 flex-shrink-0 overflow-y-auto p-4 space-y-4 bg-slate-50'>
					{messages.map((message, index) => (
						<Message key={index} role={message.role} text={message.text} />
					))}
					{aiTyping && <TypingIndicator />}
				</div>

				{/* Input Area - Fixed positioning */}
				<div className='bg-white border-t border-slate-200 p-4'>
					<form onSubmit={sendMessage} className='flex items-center space-x-3'>
						<input
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='Type your question...'
							className='flex-1 px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm'
							style={{
								maxHeight: isFullScreen ? "80px" : "48px",
								minHeight: "48px",
							}}
						/>
						<motion.button
							type='submit'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							disabled={!input.trim() || aiTyping}
							className='bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm'>
							<span>Send</span>
							<motion.span
								animate={{ x: [0, 5, 0] }}
								transition={{
									duration: 1,
									repeat: Infinity,
								}}>
								→
							</motion.span>
						</motion.button>
					</form>
				</div>
			</motion.div>
		</div>
	);
}

function Message({ role, text }) {
	const isUser = role === "user";
	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
				transition={{ duration: 0.3 }}
				className={`px-4 py-3 rounded-2xl max-w-[85%] text-base whitespace-pre-line break-words shadow-lg ${
					isUser
						? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
						: "bg-white text-slate-800 border border-slate-200"
				}`}
				style={{
					fontFamily: isUser ? undefined : "inherit",
					marginLeft: isUser ? "auto" : 0,
					marginRight: !isUser ? "auto" : 0,
				}}>
				<ReactMarkdown
					components={{
						strong: ({ node, ...props }) => (
							<strong style={{ fontWeight: 700 }} {...props} />
						),
						b: ({ node, ...props }) => (
							<b style={{ fontWeight: 700 }} {...props} />
						),
						p: ({ node, ...props }) => (
							<p style={{ margin: "0.2em 0" }} {...props} />
						),
						ul: ({ node, ...props }) => (
							<ul style={{ margin: "0.3em 0 0.3em 1.5em" }} {...props} />
						),
					}}>
					{text}
				</ReactMarkdown>
			</motion.div>
		</div>
	);
}

function TypingIndicator() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='flex justify-start'>
			<div className='px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 flex items-center space-x-2 text-sm shadow-lg'>
				<motion.span
					animate={{ y: [0, -5, 0] }}
					transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
					className='text-indigo-500'>
					●
				</motion.span>
				<motion.span
					animate={{ y: [0, -5, 0] }}
					transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
					className='text-purple-500'>
					●
				</motion.span>
				<motion.span
					animate={{ y: [0, -5, 0] }}
					transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
					className='text-pink-500'>
					●
				</motion.span>
				<span className='ml-2 text-slate-600'>AI is typing...</span>
			</div>
		</motion.div>
	);
}

function Footer() {
	return (
		<motion.footer
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8, delay: 1 }}
			className='py-6 text-center text-sm text-slate-500 border-t border-slate-200 bg-white/50 backdrop-blur-sm'>
			© {new Date().getFullYear()} SomaAI — Built for learning and empowerment.
		</motion.footer>
	);
}
