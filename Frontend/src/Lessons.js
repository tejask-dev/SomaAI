import React, { useState, useEffect } from "react";
import LessonCard from "./LessonCard";
import { db } from "./firebase";
import { getDocs, collection } from "firebase/firestore";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

// Sample topics for filtering (you can modify these based on your actual lesson topics)
const TOPICS = [
	"All Topics",
	"Health & Safety",
	"Personal Development",
	"Relationships",
	"Mental Health",
	"Physical Health",
	"Social Skills",
	"Life Skills",
];

export default function Lessons() {
	const [search, setSearch] = useState("");
	const [lessons, setLessons] = useState([]);
	const [selectedTopic, setSelectedTopic] = useState("All Topics");
	const [isLoading, setIsLoading] = useState(true);
	const [filteredLessons, setFilteredLessons] = useState([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const docs = await getDocs(collection(db, "Lessons"));
				const lessonsWithId = docs.docs.map((d) => ({
					id: d.id,
					...d.data(),
				}));

				lessonsWithId.sort((a, b) => Number(a.id) - Number(b.id));
				setLessons(lessonsWithId);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching lessons:", error);
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		let filtered = lessons.filter((l) => {
			const term = search.toLowerCase();
			const name = l.name?.toLowerCase() || "";
			const content = l.content?.toLowerCase() || "";
			const matchesSearch = name.includes(term) || content.includes(term);

			if (selectedTopic === "All Topics") {
				return matchesSearch;
			}

			// You can add topic matching logic here based on your lesson structure
			// For now, we'll just filter by search term
			return matchesSearch;
		});

		setFilteredLessons(filtered);
	}, [lessons, search, selectedTopic]);

	const handleTopicChange = (topic) => {
		setSelectedTopic(topic);
		setSearch(""); // Clear search when changing topics
	};

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

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
			<Navbar />

			{/* Hero Section */}
			<motion.section
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="relative overflow-hidden py-20 px-4 pt-32"
			>
				<div className="max-w-7xl mx-auto text-center">
					<motion.div
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="mb-8"
					>
						<h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
							Discover & Learn
						</h1>
						<p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
							Explore our comprehensive collection of lessons designed to
							empower and educate
						</p>
					</motion.div>

					{/* Search and Filter Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="max-w-4xl mx-auto"
					>
						{/* Search Bar */}
						<div className="relative mb-8">
							<motion.input
								whileFocus={{ scale: 1.02 }}
								type="text"
								placeholder="Search lessons..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
							/>
							<div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
								🔍
							</div>
						</div>

						{/* Topic Filter Buttons */}
						<div className="flex flex-wrap justify-center gap-3 mb-8">
							{TOPICS.map((topic, index) => (
								<motion.button
									key={topic}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.4, delay: 0.1 * index }}
									whileHover={{ scale: 1.05, y: -2 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => handleTopicChange(topic)}
									className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
										selectedTopic === topic
											? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-indigo-500/25"
											: "bg-white/80 text-slate-600 hover:bg-white hover:shadow-xl backdrop-blur-sm"
									}`}
								>
									{topic}
								</motion.button>
							))}
						</div>
					</motion.div>
				</div>

				{/* Decorative Elements */}
				<motion.div
					animate={{
						y: [0, -20, 0],
						rotate: [0, 5, 0],
					}}
					transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 blur-xl"
				/>
				<motion.div
					animate={{
						y: [0, 20, 0],
						rotate: [0, -5, 0],
					}}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 blur-xl"
				/>
			</motion.section>

			{/* Lessons Grid Section */}
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.6 }}
				className="px-4 pb-20"
			>
				<div className="max-w-7xl mx-auto">
					{/* Results Count */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.8 }}
						className="text-center mb-12"
					>
						<p className="text-lg text-slate-600">
							{filteredLessons.length} lesson
							{filteredLessons.length !== 1 ? "s" : ""} found
							{selectedTopic !== "All Topics" && ` in ${selectedTopic}`}
						</p>
					</motion.div>

					{/* Lessons Grid */}
					<AnimatePresence mode="wait">
						{filteredLessons.length > 0 ? (
							<motion.div
								key={`${selectedTopic}-${search}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
							>
								{filteredLessons.map((lesson, index) => (
									<motion.div
										key={lesson.id}
										initial={{ opacity: 0, y: 30, scale: 0.9 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										transition={{
											duration: 0.5,
											delay: index * 0.1,
											type: "spring",
											stiffness: 100,
										}}
										whileHover={{
											y: -8,
											scale: 1.02,
											transition: { duration: 0.2 },
										}}
									>
										<LessonCard
											id={lesson.id}
											name={lesson.name}
											content={
												lesson.content.length > 100
													? lesson.content
															.slice(20, lesson.content.lastIndexOf(" ", 120))
															.replace(/[.,?!]+$/g, "") // Regex that looks like wizardry but removes punctuation from the end
															.replace(/\*\*/g, "") + // Remove bold syntax
													  "..."
													: lesson.content
											}
										/>
									</motion.div>
								))}
							</motion.div>
						) : (
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
								className="text-center py-20"
							>
								<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
									<span className="text-4xl">📚</span>
								</div>
								<h3 className="text-2xl font-bold text-slate-700 mb-3">
									No lessons found
								</h3>
								<p className="text-slate-500 max-w-md mx-auto">
									Try adjusting your search terms or topic filter to find what
									you're looking for.
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.section>

			{/* Call to Action */}
			<motion.section
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 1 }}
				className="px-4 pb-20"
			>
				<div className="max-w-4xl mx-auto text-center">
					<div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-12 text-white shadow-2xl">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Ready to Start Learning?
						</h2>
						<p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
							Choose any lesson to begin your educational journey with SomaAI
						</p>
						<motion.button
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
						>
							Start Learning Now
						</motion.button>
					</div>
				</div>
			</motion.section>
		</div>
	);
}
