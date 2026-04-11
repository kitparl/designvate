"use client";

import { motion } from "framer-motion";
import Breadcrumb from "./Breadcrumb";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: { label: string; href?: string }[];
  bgImage?: string;
}

export default function PageHero({
  title,
  subtitle,
  breadcrumbs,
  bgImage,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[40vh] items-end overflow-hidden bg-primary">
      {bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-primary/80" />
        </>
      )}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Breadcrumb items={breadcrumbs} />
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-lg text-white/60">{subtitle}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
