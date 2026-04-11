"use client";

import { Phone, MessageCircle } from "lucide-react";

export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2">
        <a
          href="tel:+918960449433"
          className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-gray-50"
        >
          <Phone size={16} className="text-accent" />
          Call Now
        </a>
        <a
          href="https://wa.me/918960449433?text=Hi%2C%20I%20am%20interested%20in%20your%20services"
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
