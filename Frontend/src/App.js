import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css";
import deepakPhoto from "./assets/Daniel.jpg";
import tejasPhoto from "./assets/tejas-1.jpg";
import samPhoto from "./assets/swanish.jpg";
import { motion } from "framer-motion";

/**
 * Main App Component
 * Landing page with all sections
 */
export default function App() {
	const location = useLocation();
	const isHome = location.pathname === "/";

	return (
		<div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
			<Navbar />
			{isHome && <Hero />}
			<HowItWorks />
			<Challenge />
			<WhySomaAI />
			<FAQ />
			<Team />
			<Footer />
		</div>
	);
}

/**
 * Hero Section Component
 * Main landing section with call-to-action buttons
 */
function Hero() {
	return (
		<section className="relative bg-gradient-to-b from-blue-50 via-blue-50 to-emerald-50/30 overflow-hidden flex flex-col items-center justify-center pt-24 sm:pt-28 md:pt-32">
			<div className="max-w-3xl w-full mx-auto flex flex-col items-center justify-center py-12 sm:py-16 md:py-24 px-4 sm:px-6">
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4 sm:mb-6 text-center">
					Your Private Health Companion
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="mt-2 sm:mt-4 text-slate-600 text-sm sm:text-base md:text-lg max-w-prose text-center px-2">
					SomaAI provides confidential, non-judgmental, and accurate sexual
					health education for youth. Ask anything, anytime.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4 sm:px-0">
					<Link
						to="/chat"
						className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg rounded-xl bg-emerald-600 text-white shadow-lg font-bold hover:scale-105 active:scale-95 transition-all text-center">
						Try SomaAI Chat
					</Link>
					<Link
						to="/lessons"
						className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg rounded-xl bg-white border-2 border-emerald-400 text-emerald-700 shadow hover:bg-emerald-50 active:scale-95 transition-all font-bold text-center">
						Browse Lessons
					</Link>
				</motion.div>
			</div>
		</section>
	);
}

/**
 * How It Works Section
 * Explains the main features of SomaAI
 */
function HowItWorks() {
	const features = [
		{
			icon: "🤖",
			title: "Ask Anything",
			description: "Type your question or browse our lessons. No topic is off-limits—SomaAI is here for you.",
			bgColor: "bg-blue-50",
		},
		{
			icon: "🔒",
			title: "Private & Safe",
			description: "No personal info, no judgment. We keep your questions private and never store who you are.",
			bgColor: "bg-emerald-50",
		},
		{
			icon: "🌍",
			title: "Learn & Grow",
			description: "Get simple, accurate, culturally respectful answers—plus videos and myth-busting facts.",
			bgColor: "bg-pink-50",
		},
	];

	return (
		<section id="how" className="bg-white py-12 sm:py-16 md:py-20">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight mb-8 sm:mb-12">
					How SomaAI Works
				</motion.h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							whileHover={{ y: -5, scale: 1.02 }}
							className={`rounded-2xl ${feature.bgColor} shadow-lg hover:shadow-xl p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300`}>
							<span className="mb-3 sm:mb-4 text-4xl sm:text-5xl">{feature.icon}</span>
							<h3 className="font-semibold mb-2 sm:mb-3 text-lg sm:text-xl">{feature.title}</h3>
							<p className="text-sm sm:text-base text-slate-700 leading-relaxed">{feature.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * Challenge Section
 * Displays statistics about the challenges faced
 */
function Challenge() {
	const cards = [
		{
			title: "Adolescent Fertility",
			stat: "1 in 5",
			desc: "girls aged 15–19 becomes pregnant in Sub-Saharan Africa.",
			icon: "👧",
			color: "from-pink-100 via-orange-100 to-pink-50",
		},
		{
			title: "HIV Infections",
			stat: "4,000+",
			desc: "new HIV infections occur weekly among young women aged 15–24.",
			icon: "🧬",
			color: "from-sky-100 via-blue-100 to-sky-50",
		},
		{
			title: "Youth Population",
			stat: "60%",
			desc: "of Africa's population is under the age of 25.",
			icon: "💧",
			color: "from-emerald-100 via-green-100 to-emerald-50",
		},
		{
			title: "Impact Potential",
			stat: "Education is Key",
			desc: "Access to information can prevent pregnancies and save lives.",
			icon: "💚",
			color: "from-green-100 via-emerald-100 to-green-50",
		},
	];

	return (
		<section id="challenge" className="bg-gradient-to-b from-emerald-50 via-emerald-50 to-white py-12 sm:py-16 md:py-20">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight mb-3 sm:mb-4">
					The Challenge We Face
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="mt-2 sm:mt-3 text-center text-sm sm:text-base text-slate-600 max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
					Lack of access to accurate sexual health education has critical
					consequences for youth in Sub-Saharan Africa.
				</motion.p>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
					{cards.map((c, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: i * 0.1 }}
							whileHover={{ y: -5, scale: 1.02 }}
							className={`rounded-2xl bg-gradient-to-br ${c.color} border border-emerald-100 shadow-md hover:shadow-lg p-5 sm:p-6 transition-all duration-300`}>
							<div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm mb-2 sm:mb-3 font-semibold">
								<span className="text-lg sm:text-xl">{c.icon}</span>
								<span className="truncate">{c.title}</span>
							</div>
							<div className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-emerald-700">
								{c.stat}
							</div>
							<p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">{c.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * Why SomaAI Section
 * Highlights key benefits and features
 */
function WhySomaAI() {
	const benefits = [
		{
			icon: "📖",
			title: "Always Up-to-Date",
			description: "SomaAI learns from the latest trusted resources and is regularly updated by health experts.",
		},
		{
			icon: "🌐",
			title: "Multi-Lingual",
			description: "Use SomaAI in English, French, Portuguese, Swahili, Spanish, Hindi, and more. Inclusive for all backgrounds.",
		},
		{
			icon: "🧑‍🤝‍🧑",
			title: "Community Driven",
			description: "Built with the help of youth and health educators to answer real questions, not just textbook ones.",
		},
	];

	return (
		<section id="why" className="bg-emerald-50 py-12 sm:py-16 md:py-20">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight mb-8 sm:mb-12">
					Why SomaAI?
				</motion.h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{benefits.map((benefit, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							whileHover={{ y: -5, scale: 1.02 }}
							className="rounded-2xl shadow-lg hover:shadow-xl bg-white p-6 sm:p-8 text-center transition-all duration-300">
							<span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">{benefit.icon}</span>
							<h3 className="font-bold mb-2 sm:mb-3 text-lg sm:text-xl">{benefit.title}</h3>
							<p className="text-sm sm:text-base text-slate-700 leading-relaxed">{benefit.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * FAQ Section
 * Frequently asked questions with expandable answers
 */
function FAQ() {
	const items = [
		{
			q: "What is HIV?",
			a: "HIV is a virus that attacks the immune system. It can be prevented with safer sex and not sharing needles. Testing is important.",
		},
		{
			q: "How can I prevent pregnancy?",
			a: "Use reliable contraception like condoms, pills, implants, or injections. Condoms also help lower STI risk.",
		},
		{
			q: "What are contraceptives?",
			a: "Methods to prevent pregnancy. Examples: condoms, pills, IUDs/implants, injections, and more.",
		},
		{
			q: "What is consent?",
			a: "Clear, freely given agreement. Everyone must say yes without pressure. Consent can be changed at any time.",
		},
		{
			q: "How are STIs spread?",
			a: "Mostly through unprotected sexual contact. Condoms and testing reduce risk. See a clinic if you have symptoms.",
		},
	];

	return (
		<section id="faq" className="bg-white py-12 sm:py-16 md:py-20">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight mb-8 sm:mb-12">
					Frequently Asked Questions
				</motion.h2>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="mt-4 sm:mt-8 rounded-2xl border border-slate-100 divide-y divide-slate-100 bg-white shadow-lg">
					{items.map((item, i) => (
						<details
							key={i}
							className="group p-4 sm:p-6 transition-all duration-300 hover:bg-slate-50">
							<summary className="flex justify-between items-center cursor-pointer list-none focus:outline-none">
								<span className="font-medium text-sm sm:text-base pr-4">{item.q}</span>
								<span className="text-slate-400 transition-transform group-open:rotate-180 flex-shrink-0">
									⌄
								</span>
							</summary>
							<p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-700 transition-all duration-300 leading-relaxed">
								{item.a}
							</p>
						</details>
					))}
				</motion.div>
			</div>
		</section>
	);
}

/**
 * Team Section
 * Displays team members
 */
function Team() {
	const teamMembers = [
		{
			name: "Daniel laferriere",
			role: "Full Stack Dev",
			photo: deepakPhoto,
		},
		{
			name: "Tejas Kaushik",
			role: "AI & Full Stack Dev",
			photo: tejasPhoto,
		},
		{
			name: "Swanish Baweja",
			role: "Full Stack Dev",
			photo: samPhoto,
		},
	];

	return (
		<section className="bg-gradient-to-t from-emerald-50 to-white py-12 sm:py-16 md:py-20">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 tracking-tight">
					Meet the Team
				</motion.h2>
				<div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16">
					{teamMembers.map((member, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							whileHover={{ y: -5 }}
							className="flex flex-col items-center gap-2 sm:gap-3">
							<div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full shadow-lg hover:shadow-xl overflow-hidden flex items-center justify-center bg-slate-200 transition-all duration-300">
								<img
									src={member.photo}
									alt={member.name}
									className="w-full h-full object-cover object-center"
									draggable={false}
									loading="lazy"
								/>
							</div>
							<span className="font-bold mt-2 text-sm sm:text-base">{member.name}</span>
							<span className="text-xs sm:text-sm text-slate-500">{member.role}</span>
						</motion.div>
					))}
				</div>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="text-center mt-8 sm:mt-12 text-sm sm:text-base text-slate-700 max-w-2xl mx-auto px-4">
					We're passionate about empowering youth with knowledge and support.
					Want to help?{" "}
					<a
						href="mailto:hello@somaai.org"
						className="text-emerald-600 hover:text-emerald-700 underline font-semibold transition-colors">
						Get in touch
					</a>
					.
				</motion.p>
			</div>
		</section>
	);
}

/**
 * Footer Component
 */
function Footer() {
	return (
		<footer className="border-t border-slate-100 py-6 sm:py-8 text-center text-xs sm:text-sm text-slate-500 bg-gradient-to-t from-emerald-50 to-white">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				© {new Date().getFullYear()} SomaAI — Education tool, not medical advice.
			</div>
		</footer>
	);
}
