"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar, Tag, ArrowRight } from "lucide-react";

interface Project {
  title: string;
  slug: string;
  description: string;
  image: string;
  location: string;
  timeline: string;
  category: string;
  details: string;
  images: string[];
}

export default function ProjectDetail({
  project,
  allProjects,
}: {
  project: Project;
  allProjects: Project[];
}) {
  const related = allProjects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 3);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {/* Image Gallery */}
            <div className="mb-8 grid gap-4">
              {project.images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-2xl">
                  <img
                    src={img}
                    alt={`${project.title} - Image ${i + 1}`}
                    className="h-80 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <h2 className="mb-6 font-display text-2xl font-bold text-primary">
              Project Overview
            </h2>
            <p className="mb-8 whitespace-pre-line text-lg leading-relaxed text-text-light">
              {project.details}
            </p>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-16">
                <h3 className="mb-6 font-display text-xl font-bold text-primary">
                  Related Projects
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {related.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="group overflow-hidden rounded-xl bg-surface transition-all hover:shadow-lg"
                    >
                      <div className="h-40 overflow-hidden">
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${p.image})` }}
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-display text-sm font-semibold text-primary">
                          {p.title}
                        </h4>
                        <span className="text-xs text-text-light">
                          {p.location}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl bg-surface p-6">
                <h3 className="mb-4 font-display text-lg font-semibold text-primary">
                  Project Details
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-accent" />
                    <div>
                      <span className="block text-xs text-text-light">
                        Location
                      </span>
                      <span className="font-medium text-primary">
                        {project.location}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-accent" />
                    <div>
                      <span className="block text-xs text-text-light">
                        Timeline
                      </span>
                      <span className="font-medium text-primary">
                        {project.timeline}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Tag size={16} className="text-accent" />
                    <div>
                      <span className="block text-xs text-text-light">
                        Category
                      </span>
                      <span className="font-medium text-primary">
                        {project.category}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-primary p-6 text-white">
                <h3 className="mb-2 font-display text-lg font-semibold">
                  Have a Similar Project?
                </h3>
                <p className="mb-4 text-sm text-white/60">
                  Let us help you bring your vision to life.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold transition-all hover:bg-accent-light"
                >
                  Get a Quote
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
