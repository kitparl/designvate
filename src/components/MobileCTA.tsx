"use client";

import { Phone, MessageCircle } from "lucide-react";
import { getContent } from "@/lib/content";

export default function MobileCTA() {
  const content = getContent();
  const ctaPhone = content.home.ctaPhone || content.contact.phone;
  const whatsapp = content.contact.whatsapp || ctaPhone.replace(/[^\d]/g, "");
  const waHref = `https://wa.me/${whatsapp}?text=Hi%2C%20I%20am%20interested%20in%20your%20services`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2">
        <a
          href={`tel:${ctaPhone}`}
          className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-gray-50"
        >
          <Phone size={16} className="text-accent" />
          Call Now
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 py-3.5 text-sm font-semibold text-white"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
