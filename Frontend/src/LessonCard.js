import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LessonCard({name, id, content}) {
    const maxLength = 200;
    const truncatedContent = content.length > maxLength - 3 ? content.slice(0, maxLength - 3) + '...' : content;

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            <Link
                to={`/lesson/${id}`}
                className="block p-6 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative"
            >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                    {/* Header with icon */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                                {name}
                            </h3>
                        </div>
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            📚
                        </motion.div>
                    </div>

                    {/* Content preview */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {truncatedContent}
                    </p>

                    {/* Footer with action indicator */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span>Available</span>
                        </div>
                        <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                            className="text-indigo-500 font-semibold text-sm group-hover:text-indigo-600 transition-colors duration-300"
                        >
                            Start Learning →
                        </motion.div>
                    </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-200 transition-all duration-300" />
            </Link>
        </motion.div>
    );
}