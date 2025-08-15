import React from "react";

export default function Lessons() {
  const lessons = [
    {
      title: "Nutrition & Fitness",
      desc: "Learn how to fuel your body and stay active for a healthy lifestyle."
    },
    {
      title: "Mental Health Basics",
      desc: "Understand stress, anxiety, and tips to support your emotional well-being."
    },
    {
      title: "Digital Safety",
      desc: "Protect your privacy, stay safe online, and manage social media responsibly."
    },
    {
      title: "Sleep & Wellness",
      desc: "Discover the importance of sleep and healthy routines for teens."
    },
    {
      title: "Substance Awareness",
      desc: "Get facts about alcohol, drugs, and making safe choices."
    },
  ];

  return (
    <section id="lessons" className="py-12 md:py-16 bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Lessons</h2>
        <p className="mt-2 text-slate-700">
          Access bite-sized, reliable health lessons designed for teens and young adults.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold text-lg">{lesson.title}</h3>
              <p className="mt-2 text-slate-700 text-sm">{lesson.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
