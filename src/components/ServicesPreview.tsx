"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building, Home, Landmark, Paintbrush, ClipboardList, Armchair } from "lucide-react";
import SectionHeading from "./SectionHeading";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Building,
  Home,
  Landmark,
  Paintbrush,
  ClipboardList,
  Armchair,
};

interface Service {
  title: string;
  description: string;
  icon: string;
  slug: string;
  image?: string;
}

export default function ServicesPreview({ services }: { services: Service[] }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Services"
          title="What We Do"
          subtitle="From corporate interiors to government infrastructure, we deliver excellence across every sector."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Building;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl"
                >
                  {service.image && (
                    <div className="h-48 overflow-hidden">
                      <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${service.image})` }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3 inline-flex rounded-lg bg-accent/10 p-2 text-accent">
                      <Icon size={20} />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-semibold text-primary">
                      {service.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-text-light">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors group-hover:text-accent-light">
                      Learn More
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
