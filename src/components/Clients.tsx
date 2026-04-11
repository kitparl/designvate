"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

interface Client {
  name: string;
  logo: string;
}

export default function Clients({ clients }: { clients: Client[] }) {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Clients"
          title="Trusted By Industry Leaders"
          subtitle="We've had the privilege to work with leading corporate brands and organizations."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-center justify-center rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-10 object-contain opacity-60 transition-opacity hover:opacity-100"
                />
              ) : (
                <span className="font-display text-sm font-semibold text-text-light/60 transition-colors hover:text-primary">
                  {client.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
