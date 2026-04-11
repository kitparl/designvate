"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Target,
  BookOpen,
  Users,
  Wrench,
  ShieldCheck,
  BarChart3,
  TestTube,
  Palette,
} from "lucide-react";
import type { Content } from "@/lib/content";

const teamIcons = [Palette, Wrench, BarChart3, ShieldCheck, Users, TestTube];

export default function AboutContent({ content }: { content: Content }) {
  const { about, setup, values } = content;

  return (
    <>
      {/* Story */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-2 inline-block font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Our Story
              </span>
              <h2 className="mb-6 font-display text-3xl font-bold text-primary">
                History & Philosophy
              </h2>
              <p className="mb-4 leading-relaxed text-text-light">
                {about.description}
              </p>
              <p className="mb-4 leading-relaxed text-text-light">
                {about.description2}
              </p>
              <p className="leading-relaxed text-text-light">{about.team}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url(${about.image})` }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-accent p-6 text-white shadow-xl">
                <div className="font-display text-3xl font-bold">10+</div>
                <div className="text-sm text-white/80">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl bg-white p-8 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent">
                <Eye size={24} />
              </div>
              <h3 className="mb-4 font-display text-xl font-bold text-primary">
                Our Vision
              </h3>
              <p className="leading-relaxed text-text-light">{about.vision}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl bg-white p-8 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent">
                <Target size={24} />
              </div>
              <h3 className="mb-4 font-display text-xl font-bold text-primary">
                Our Mission
              </h3>
              <p className="leading-relaxed text-text-light">
                {about.mission}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 rounded-2xl bg-white p-8 shadow-sm"
          >
            <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent">
              <BookOpen size={24} />
            </div>
            <h3 className="mb-4 font-display text-xl font-bold text-primary">
              Our Philosophy
            </h3>
            <p className="leading-relaxed text-text-light">
              {about.philosophy}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="mb-2 inline-block font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Our Values
            </span>
            <h2 className="font-display text-3xl font-bold text-primary">
              Values That Drive Us
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Metal",
                subtitle: "Strength & Resilience",
                desc: values.metal,
              },
              {
                name: "Wood",
                subtitle: "Growth & Experience",
                desc: values.wood,
              },
              {
                name: "Sand",
                subtitle: "Adaptability & Innovation",
                desc: values.sand,
              },
            ].map((val, index) => (
              <motion.div
                key={val.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl border border-gray-100 p-8 text-center transition-all hover:border-accent/20 hover:shadow-lg"
              >
                <h3 className="mb-1 font-display text-2xl font-bold text-primary">
                  {val.name}
                </h3>
                <span className="mb-4 block text-xs font-semibold uppercase tracking-wider text-accent">
                  {val.subtitle}
                </span>
                <p className="text-sm leading-relaxed text-text-light italic">
                  &ldquo;{val.desc}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup / Teams */}
      <section className="bg-primary py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="mb-2 inline-block font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {setup.title}
            </span>
            <h2 className="font-display text-3xl font-bold text-white">
              Our Expert Teams
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              A complete design house with specialized teams for every aspect of
              your project.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {setup.teams.map((team, index) => {
              const Icon = teamIcons[index] || Users;
              return (
                <motion.div
                  key={team}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-center gap-4 rounded-xl bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                    <Icon size={20} />
                  </div>
                  <span className="font-display text-sm font-semibold text-white">
                    {team}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
