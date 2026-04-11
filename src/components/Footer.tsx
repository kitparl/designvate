import Link from "next/link";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { Phone, Mail, MapPin, ExternalLink, Globe } from "lucide-react";

export default function Footer() {
  const content = getContent();
  const { contact } = content;

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Designvate Ventures LLP"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-contain"
              />
              <div>
                <span className="font-display text-lg font-bold tracking-wide">
                  DESIGNVATE
                </span>
                <span className="block text-[10px] tracking-[0.2em] text-white/60">
                  VENTURES LLP
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Concept-to-completion solutions for transforming spaces. Premium
              civil engineering & interior design.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-accent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/projects", label: "Projects" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-accent">
              Services
            </h3>
            <ul className="space-y-3">
              {content.services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-white/60 transition-colors hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-accent">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent"
                >
                  <Phone size={14} />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent"
                >
                  <Mail size={14} />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                {contact.address}
              </li>
              <li>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent"
                >
                  <ExternalLink size={14} />
                  @designvateventuresllp
                </a>
              </li>
              <li>
                <a
                  href={`https://${contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent"
                >
                  <Globe size={14} />
                  {contact.website}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p>
            &copy; {new Date().getFullYear()} DESIGNVATE VENTURES LLP (VSAS
            Group). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
