"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";

interface Project {
  title: string;
  slug: string;
  description: string;
  image: string;
  location: string;
  timeline: string;
  category: string;
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                active === cat
                  ? "bg-accent text-white shadow-lg"
                  : "bg-surface text-text-light hover:bg-surface-dark"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-4 left-4 rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold text-white">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 font-display text-lg font-semibold text-primary">
                      {project.title}
                    </h3>
                    <p className="mb-3 text-sm text-text-light line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-light">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {project.timeline}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
