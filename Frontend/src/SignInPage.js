import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

/**
 * Sign In Page Component
 * Handles user authentication (email/password and Google)
 */
export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [pw, setPw] = useState("");
	const [isRegister, setIsRegister] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

	if (user) {
		navigate("/chat");
		return null;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			if (isRegister) {
				await createUserWithEmailAndPassword(auth, email, pw);
			} else {
				await signInWithEmailAndPassword(auth, email, pw);
			}
			navigate("/chat");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogle() {
		setError("");
		setLoading(true);
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			navigate("/chat");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50">
			<Navbar />
			<div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 pt-24 sm:pt-28">
				<motion.form
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm w-full"
					onSubmit={handleSubmit}>
					<motion.div
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.1 }}>
						<h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
							{isRegister ? "Create Account" : "Welcome Back"}
						</h2>

						<div className="space-y-4 sm:space-y-5">
							<div>
								<input
									className="w-full px-4 py-3 sm:py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
									type="email"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={loading}
								/>
							</div>
							<div>
								<input
									className="w-full px-4 py-3 sm:py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
									type="password"
									placeholder="Password"
									value={pw}
									onChange={(e) => setPw(e.target.value)}
									required
									disabled={loading}
									minLength={6}
								/>
							</div>

							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
									{error}
								</motion.div>
							)}

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								disabled={loading}
								className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 sm:py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
								type="submit">
								{loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
							</motion.button>

							<div className="relative my-4 sm:my-6">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-slate-200"></div>
								</div>
								<div className="relative flex justify-center text-xs sm:text-sm">
									<span className="px-2 bg-white text-slate-500">Or continue with</span>
								</div>
							</div>

							<motion.button
								type="button"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								disabled={loading}
								className="w-full bg-white border-2 border-slate-200 text-slate-700 rounded-xl py-3 sm:py-3.5 font-semibold shadow-md hover:shadow-lg hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
								onClick={handleGoogle}>
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<path
										fill="#4285F4"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="#34A853"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="#FBBC05"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="#EA4335"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Sign in with Google
							</motion.button>

							<div className="text-xs sm:text-sm text-center text-slate-600 mt-4 sm:mt-6">
								{isRegister ? (
									<>
										Already have an account?{" "}
										<button
											type="button"
											className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
											onClick={() => {
												setIsRegister(false);
												setError("");
											}}>
											Sign In
										</button>
									</>
								) : (
									<>
										Don't have an account?{" "}
										<button
											type="button"
											className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
											onClick={() => {
												setIsRegister(true);
												setError("");
											}}>
											Sign Up
										</button>
									</>
								)}
							</div>

							<div className="text-center mt-4 sm:mt-6">
								<Link
									to="/"
									className="text-indigo-600 hover:text-indigo-700 underline text-xs sm:text-sm font-medium">
									Back to Home
								</Link>
							</div>
						</div>
					</motion.div>
				</motion.form>
			</div>
		</div>
	);
}
