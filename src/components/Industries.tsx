"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function Industries({ industries }: { industries: string[] }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Industries We Serve"
          title="Diverse Sector Expertise"
          subtitle="Our experience spans across multiple sectors, delivering tailored solutions for every industry."
        />

        <div className="flex flex-wrap justify-center gap-3">
          {industries.map((industry, index) => (
            <motion.div
              key={industry}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-text transition-all hover:border-accent hover:bg-accent hover:text-white"
            >
              {industry}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
