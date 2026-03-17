import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

function ArrowIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function LessonCard({ name, id, content, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.45,
        delay: Math.min(index % 4, 3) * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to={`/lesson/${id}`}
        className="group block h-full card p-5 hover:shadow-card-hover transition-all duration-250 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        {/* Hover accent bar */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />

        <div className="flex flex-col h-full gap-3">
          {/* Lesson number badge */}
          <span className="self-start badge bg-slate-100 text-slate-500 text-[10px] tracking-wider">
            Lesson {id}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2">
            {name}
          </h3>

          {/* Preview */}
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
            {content}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-slate-400 font-medium">Available</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 group-hover:gap-2 transition-all duration-200">
              <span>Read</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
