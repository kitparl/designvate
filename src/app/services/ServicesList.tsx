"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Service {
  title: string;
  description: string;
  slug: string;
  image?: string;
  details: string;
}

export default function ServicesList({ services }: { services: Service[] }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl"
              >
                {service.image && (
                  <div className="h-64 overflow-hidden">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                  </div>
                )}
                <div className="p-8">
                  <h3 className="mb-3 font-display text-xl font-bold text-primary">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-text-light">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors group-hover:text-accent-light">
                    Learn More
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
