"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ContactInfo {
  phone: string;
  phone2: string;
  phone3: string;
  email: string;
  email2: string;
  address: string;
  mapEmbedUrl: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function ContactContent({
  contact,
}: {
  contact: ContactInfo;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      service: String(data.get("service") || ""),
      details: String(data.get("details") || ""),
      honeypot: String(data.get("company") || ""),
    };

    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !json.ok) {
        setStatus({
          kind: "error",
          message:
            json.error ||
            "Something went wrong. Please try again or call us directly.",
        });
        return;
      }

      form.reset();
      setStatus({ kind: "success" });
      setTimeout(() => setStatus({ kind: "idle" }), 6000);
    } catch {
      setStatus({
        kind: "error",
        message:
          "Network error. Please check your connection and try again.",
      });
    }
  };

  const submitting = status.kind === "submitting";

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

              {status.kind === "success" ? (
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
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-xs font-medium text-text-light"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        disabled={submitting}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="mb-1.5 block text-xs font-medium text-text-light"
                      >
                        Phone *
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        disabled={submitting}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                        placeholder="Your phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-medium text-text-light"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      disabled={submitting}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-service"
                      className="mb-1.5 block text-xs font-medium text-text-light"
                    >
                      Service Interested In
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      disabled={submitting}
                      defaultValue=""
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                    >
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
                    <label
                      htmlFor="contact-details"
                      className="mb-1.5 block text-xs font-medium text-text-light"
                    >
                      Project Details *
                    </label>
                    <textarea
                      id="contact-details"
                      name="details"
                      required
                      rows={4}
                      disabled={submitting}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  {/* Honeypot — must stay empty. Hidden from real users. */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-10000px",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                    }}
                  >
                    <label htmlFor="contact-company">Company</label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {status.kind === "error" && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{status.message}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-light hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:shadow-none"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Request
                      </>
                    )}
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
