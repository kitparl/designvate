"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import SectionHeading from "./SectionHeading";

interface Project {
  title: string;
  slug: string;
  description: string;
  image: string;
  location: string;
  timeline: string;
  category: string;
}

export default function FeaturedProjects({
  projects,
}: {
  projects: Project[];
}) {
  const featured = projects.slice(0, 6);

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Projects"
          title="Featured Work"
          subtitle="A showcase of our finest projects across corporate, residential, and government sectors."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-primary-light hover:shadow-lg"
          >
            View All Projects
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
