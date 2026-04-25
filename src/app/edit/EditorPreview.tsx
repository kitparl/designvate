"use client";

import { useEffect, useMemo, useState } from "react";
import type { ContentData } from "@/lib/contentSchema";
import type { Content as SiteContent } from "@/lib/content";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Stats from "@/components/Stats";
import ServicesPreview from "@/components/ServicesPreview";
import FeaturedProjects from "@/components/FeaturedProjects";
import Testimonials from "@/components/Testimonials";
import Clients from "@/components/Clients";
import Industries from "@/components/Industries";
import PageHero from "@/components/PageHero";
import AboutContent from "@/app/about/AboutContent";
import ServicesList from "@/app/services/ServicesList";
import ProjectsGrid from "@/app/projects/ProjectsGrid";
import ContactContent from "@/app/contact/ContactContent";
import ServiceDetail from "@/app/services/[slug]/ServiceDetail";
import ProjectDetail from "@/app/projects/[slug]/ProjectDetail";

type PreviewRoute =
  | "home"
  | "about"
  | "services"
  | "service-detail"
  | "projects"
  | "project-detail"
  | "contact";

type Device = "mobile" | "tablet" | "desktop";

export default function EditorPreview({
  content,
  route: controlledRoute,
  onRouteChange,
  device: controlledDevice,
  onDeviceChange,
}: {
  content: ContentData;
  route?: PreviewRoute;
  onRouteChange?: (r: PreviewRoute) => void;
  device?: Device;
  onDeviceChange?: (d: Device) => void;
}) {
  const [routeUncontrolled, setRouteUncontrolled] =
    useState<PreviewRoute>("home");
  const [deviceUncontrolled, setDeviceUncontrolled] =
    useState<Device>("mobile");

  const route = controlledRoute ?? routeUncontrolled;
  const device = controlledDevice ?? deviceUncontrolled;
  const setRoute = onRouteChange ?? setRouteUncontrolled;
  const setDevice = onDeviceChange ?? setDeviceUncontrolled;
  const [serviceSlug, setServiceSlug] = useState<string>(
    content.services[0]?.slug || ""
  );
  const [projectSlug, setProjectSlug] = useState<string>(
    content.projects[0]?.slug || ""
  );

  useEffect(() => {
    if (content.services.length === 0) {
      setServiceSlug("");
      return;
    }
    if (!content.services.some((s) => s.slug === serviceSlug)) {
      setServiceSlug(content.services[0]!.slug);
    }
  }, [content.services, serviceSlug]);

  useEffect(() => {
    if (content.projects.length === 0) {
      setProjectSlug("");
      return;
    }
    if (!content.projects.some((p) => p.slug === projectSlug)) {
      setProjectSlug(content.projects[0]!.slug);
    }
  }, [content.projects, projectSlug]);

  const service = useMemo(
    () =>
      content.services.find((s) => s.slug === serviceSlug) ||
      content.services[0],
    [content.services, serviceSlug]
  );
  const project = useMemo(
    () =>
      content.projects.find((p) => p.slug === projectSlug) ||
      content.projects[0],
    [content.projects, projectSlug]
  );

  const frameClass =
    device === "mobile"
      ? "mx-auto w-full max-w-[420px]"
      : device === "tablet"
        ? "mx-auto w-full max-w-[820px]"
        : "w-full";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={route}
            onChange={(e) => setRoute(e.target.value as PreviewRoute)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            aria-label="Preview route"
          >
            <option value="home">Home</option>
            <option value="about">About</option>
            <option value="services">Services</option>
            <option value="service-detail">Service Detail</option>
            <option value="projects">Projects</option>
            <option value="project-detail">Project Detail</option>
            <option value="contact">Contact</option>
          </select>

          {route === "service-detail" && (
            <select
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              aria-label="Select service"
            >
              {content.services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title || s.slug}
                </option>
              ))}
            </select>
          )}

          {route === "project-detail" && (
            <select
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              aria-label="Select project"
            >
              {content.projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title || p.slug}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-gray-50 p-1">
          {(["mobile", "tablet", "desktop"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                device === d ? "bg-amber-600 text-white" : "text-gray-700"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-auto bg-gray-50 p-3 md:max-h-[calc(100vh-180px)]">
        <div className={`${frameClass} overflow-hidden rounded-xl bg-white shadow`}>
          {route === "home" && (
            <>
              <Hero
                title={content.home.title}
                subtitle={content.home.subtitle}
                heroImage={content.home.heroImage}
                ctaText={content.home.ctaText}
                ctaPhone={content.home.ctaPhone}
              />
              <WhyChooseUs items={content.whyChooseUs} />
              <Stats stats={content.stats} />
              <ServicesPreview services={content.services} />
              <FeaturedProjects projects={content.projects} />
              <Testimonials testimonials={content.testimonials} />
              <Clients clients={content.clients} />
              <Industries industries={content.industries} />
            </>
          )}

          {route === "about" && (
            <>
              <PageHero
                title="About Us"
                subtitle="Our story, vision, and the people who make it happen."
                breadcrumbs={[{ label: "About" }]}
                bgImage={content.about.image}
              />
              <AboutContent content={content as unknown as SiteContent} />
            </>
          )}

          {route === "services" && (
            <>
              <PageHero
                title="Our Services"
                subtitle="Comprehensive construction and design solutions across every sector."
                breadcrumbs={[{ label: "Services" }]}
              />
              <ServicesList services={content.services} />
            </>
          )}

          {route === "service-detail" && service && (
            <>
              <PageHero
                title={service.title}
                subtitle={service.description}
                breadcrumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}
                bgImage={service.image || undefined}
              />
              <ServiceDetail service={service} allServices={content.services} />
            </>
          )}

          {route === "projects" && (
            <>
              <PageHero
                title="Our Projects"
                subtitle="A portfolio of excellence across corporate, residential, and government sectors."
                breadcrumbs={[{ label: "Projects" }]}
              />
              <ProjectsGrid projects={content.projects} />
            </>
          )}

          {route === "project-detail" && project && (
            <>
              <PageHero
                title={project.title}
                subtitle={project.description}
                breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: project.title }]}
                bgImage={project.image}
              />
              <ProjectDetail project={project} allProjects={content.projects} />
            </>
          )}

          {route === "contact" && (
            <>
              <PageHero
                title="Contact Us"
                subtitle="Get in touch for a free consultation and project quote."
                breadcrumbs={[{ label: "Contact" }]}
              />
              <ContactContent contact={content.contact} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

