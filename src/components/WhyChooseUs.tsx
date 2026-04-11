"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import {
  Layers,
  Users,
  ShieldCheck,
  Clock,
  Building2,
  Paintbrush,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Layers,
  Users,
  ShieldCheck,
  Clock,
  Building2,
  Paintbrush,
};

interface WhyChooseUsItem {
  title: string;
  description: string;
  icon: string;
}

export default function WhyChooseUs({ items }: { items: WhyChooseUsItem[] }) {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Why Choose Us"
          title="Built on Trust & Excellence"
          subtitle="With years of experience in civil engineering and interior design, we deliver results that speak for themselves."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || Layers;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-light">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
