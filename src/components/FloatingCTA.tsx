"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getContent } from "@/lib/content";

export default function FloatingCTA() {
  const content = getContent();
  const ctaPhone = content.home.ctaPhone || content.contact.phone;
  const whatsapp = content.contact.whatsapp || ctaPhone.replace(/[^\d]/g, "");
  const waHref = `https://wa.me/${whatsapp}?text=Hi%2C%20I%20am%20interested%20in%20your%20services`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <motion.a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-shadow hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </motion.a>
      <motion.a
        href={`tel:${ctaPhone}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-shadow hover:shadow-xl"
        aria-label="Call us"
      >
        <Phone size={24} />
      </motion.a>
    </div>
  );
}
