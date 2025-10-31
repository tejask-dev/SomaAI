import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navbar Page Link Component
 * Individual navigation link with active state styling
 */
const Page = ({ name, path, onClick }) => {
	const location = useLocation();
	const isActive = location.pathname.startsWith(path);

	return (
		<motion.div
			whileHover={{ y: -2 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}>
			<Link
				to={path}
				className={`px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
					isActive
						? "text-indigo-600 bg-indigo-50 font-semibold"
						: "text-slate-600 hover:text-indigo-600 hover:bg-slate-50 font-medium"
				}`}>
				{name}
			</Link>
		</motion.div>
	);
};

/**
 * Main Navbar Component
 * Responsive navigation bar with mobile menu
 */
export default function Navbar() {
	const { user, signout } = useAuth();
	const navigate = useNavigate();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const pages = [
		{ name: "📚 Lessons", path: "/lessons" },
		{ name: "🤖 Chatbot", path: "/chat" },
	];

	const showSignOut = user && typeof signout === "function";

	// Handle scroll effect for navbar styling
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close mobile menu on route change
	const location = useLocation();
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				isMobileMenuOpen &&
				!event.target.closest(".mobile-menu") &&
				!event.target.closest(".mobile-menu-button")
			) {
				setIsMobileMenuOpen(false);
			}
		};

		if (isMobileMenuOpen) {
			document.addEventListener("click", handleClickOutside);
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	const handleAuthAction = () => {
		if (showSignOut) {
			signout();
		} else {
			navigate("/signin");
		}
		setIsMobileMenuOpen(false);
	};

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6, type: "spring" }}
			className={`w-full fixed top-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200"
					: "bg-white/90 backdrop-blur-sm border-b border-slate-100"
			}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 md:h-20">
					{/* Logo */}
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						<Link
							to="/"
							className="inline-flex items-center gap-2 sm:gap-3 focus:outline-none group">
							<motion.div
								whileHover={{ rotate: 360 }}
								transition={{ duration: 0.6 }}
								className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 grid place-items-center text-white font-black shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
								S
							</motion.div>
							<motion.span
								className="font-bold tracking-tight text-lg sm:text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline-block"
								whileHover={{ scale: 1.02 }}>
								SomaAI
							</motion.span>
						</Link>
					</motion.div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex gap-4 lg:gap-8 items-center text-sm font-semibold">
						{pages.map((page, index) => (
							<Page {...page} key={index} />
						))}

						<AnimatePresence>
							<motion.button
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleAuthAction}
								className={`bg-gradient-to-r text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold ${
									showSignOut
										? "from-red-500 to-pink-500 hover:shadow-red-500/25"
										: "from-indigo-600 to-purple-600 hover:shadow-indigo-500/25"
								}`}>
								{showSignOut ? "Sign Out" : "Sign In"}
							</motion.button>
						</AnimatePresence>
					</nav>

					{/* Mobile Menu Button */}
					<div className="flex items-center gap-3 md:hidden">
						<AnimatePresence>
							{user && (
								<motion.button
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleAuthAction}
									className={`bg-gradient-to-r text-white px-3 py-1.5 rounded-lg text-xs font-semibold ${
										showSignOut
											? "from-red-500 to-pink-500"
											: "from-indigo-600 to-purple-600"
									}`}>
									{showSignOut ? "Out" : "In"}
								</motion.button>
							)}
						</AnimatePresence>
						<motion.button
							className="mobile-menu-button p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Toggle menu">
							<svg
								className="w-6 h-6"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor">
								{isMobileMenuOpen ? (
									<path d="M6 18L18 6M6 6l12 12" />
								) : (
									<path d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</motion.button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
							className="fixed inset-0 bg-black/50 z-40 md:hidden top-16"
						/>

						{/* Menu Panel */}
						<motion.nav
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="mobile-menu fixed top-16 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 md:hidden overflow-y-auto">
							<div className="flex flex-col p-4 space-y-2">
								{pages.map((page, index) => (
									<Page
										{...page}
										key={index}
										onClick={() => setIsMobileMenuOpen(false)}
									/>
								))}

								{!user && (
									<motion.button
										whileTap={{ scale: 0.95 }}
										onClick={handleAuthAction}
										className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-300">
										Sign In
									</motion.button>
								)}
							</div>
						</motion.nav>
					</>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
