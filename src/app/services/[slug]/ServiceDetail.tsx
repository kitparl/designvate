"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getContent } from "@/lib/content";

interface Service {
  title: string;
  description: string;
  slug: string;
  details: string;
  image?: string;
}

export default function ServiceDetail({
  service,
  allServices,
}: {
  service: Service;
  allServices: Service[];
}) {
  const otherServices = allServices.filter((s) => s.slug !== service.slug);
  const content = getContent();
  const ctaPhone = content.home.ctaPhone || content.contact.phone;

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
            {service.image && (
              <div className="mb-8 overflow-hidden rounded-2xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-80 w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <h2 className="mb-6 font-display text-2xl font-bold text-primary">
              About This Service
            </h2>
            <p className="mb-8 whitespace-pre-line text-lg leading-relaxed text-text-light">
              {service.details}
            </p>

            <div className="rounded-2xl bg-surface p-8">
              <h3 className="mb-4 font-display text-lg font-semibold text-primary">
                Interested in this service?
              </h3>
              <p className="mb-6 text-sm text-text-light">
                Get in touch with our team for a free consultation and detailed
                quote.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`tel:${ctaPhone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light"
                >
                  <Phone size={16} />
                  Call Now
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                >
                  Contact Us
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sticky top-28">
              <h3 className="mb-4 font-display text-lg font-semibold text-primary">
                Other Services
              </h3>
              <div className="space-y-3">
                {otherServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group flex items-center justify-between rounded-xl bg-surface p-4 transition-all hover:bg-accent hover:text-white"
                  >
                    <span className="text-sm font-medium">{s.title}</span>
                    <ArrowRight
                      size={14}
                      className="text-text-light transition-colors group-hover:text-white"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
