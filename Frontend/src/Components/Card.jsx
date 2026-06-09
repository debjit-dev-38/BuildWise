import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Card = ({ project, themekey }) => {
  const navigate=useNavigate();
  const diffColor =
    project.difficulty === "Beginner"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : project.difficulty === "Intermediate"
      ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
      : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className={`w-90 rounded-2xl border border-white/5 bg-[#111318] overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col m-2`}>
      <div className="relative h-50 overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent" />

        <span
          className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full border ${diffColor}`}
        >
          {project.difficulty}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-white text-sm mb-2">
          {project.title}
        </h3>

        <p className="text-zinc-400 text-xs mb-3 line-clamp-2">
          {project.description}
        </p>

        <p className="text-xs text-zinc-500 mb-3 flex items-center gap-1">
          <Clock size={11} />
          {project.duration}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStacks?.map((tech) => (
            <span
              key={tech}
              className="text-xs bg-white/5 text-zinc-400 px-2 py-1 rounded-md border border-white/5"
            >
              {tech}
            </span>
          ))}
        </div>

        <button onClick={() => navigate("/project")} className="mt-auto w-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-2 transition-colors duration-150 flex items-center justify-center gap-1.5">
          Start Project
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default Card;