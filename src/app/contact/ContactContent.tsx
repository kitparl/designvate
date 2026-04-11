"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";

interface ContactInfo {
  phone: string;
  phone2: string;
  phone3: string;
  email: string;
  email2: string;
  address: string;
  mapEmbedUrl: string;
}

export default function ContactContent({
  contact,
}: {
  contact: ContactInfo;
}) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 font-display text-2xl font-bold text-primary">
              Get In Touch
            </h2>
            <p className="mb-8 text-text-light">
              Have a project in mind? We&apos;d love to hear from you. Reach out
              and let&apos;s start building something amazing together.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-sm font-semibold text-primary">
                    Phone
                  </h3>
                  <a
                    href={`tel:${contact.phone}`}
                    className="block text-sm text-text-light hover:text-accent"
                  >
                    {contact.phone}
                  </a>
                  <a
                    href={`tel:${contact.phone2}`}
                    className="block text-sm text-text-light hover:text-accent"
                  >
                    {contact.phone2}
                  </a>
                  <a
                    href={`tel:${contact.phone3}`}
                    className="block text-sm text-text-light hover:text-accent"
                  >
                    {contact.phone3}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-sm font-semibold text-primary">
                    Email
                  </h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="block text-sm text-text-light hover:text-accent"
                  >
                    {contact.email}
                  </a>
                  <a
                    href={`mailto:${contact.email2}`}
                    className="block text-sm text-text-light hover:text-accent"
                  >
                    {contact.email2}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-sm font-semibold text-primary">
                    Office
                  </h3>
                  <p className="text-sm text-text-light">{contact.address}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            {contact.mapEmbedUrl && (
              <div className="mt-8 overflow-hidden rounded-2xl">
                <iframe
                  src={contact.mapEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-2xl bg-surface p-8">
              <h2 className="mb-2 font-display text-2xl font-bold text-primary">
                Request a Quote
              </h2>
              <p className="mb-8 text-sm text-text-light">
                Fill in the form below and our team will get back to you within
                24 hours.
              </p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle size={48} className="mb-4 text-green-500" />
                  <h3 className="mb-2 font-display text-lg font-semibold text-primary">
                    Thank You!
                  </h3>
                  <p className="text-sm text-text-light">
                    Your message has been received. We&apos;ll get back to you
                    shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-text-light">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-text-light">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                        placeholder="Your phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-text-light">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-text-light">
                      Service Interested In
                    </label>
                    <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20">
                      <option value="">Select a service</option>
                      <option>Corporate Interiors</option>
                      <option>Residential Construction</option>
                      <option>Government Projects</option>
                      <option>Interior Design</option>
                      <option>Project Management</option>
                      <option>Custom Furniture</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-text-light">
                      Project Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-light hover:shadow-lg"
                  >
                    <Send size={16} />
                    Send Request
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
