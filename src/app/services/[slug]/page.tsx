import { getContent } from "@/lib/content";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ServiceDetail from "./ServiceDetail";

export function generateStaticParams() {
  const content = getContent();
  return content.services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const content = getContent();
  const service = content.services.find((s) => s.slug === params.slug);
  if (!service) return {};
  return {
    title: `${service.title} | DESIGNVATE VENTURES LLP`,
    description: service.description,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const content = getContent();
  const service = content.services.find((s) => s.slug === params.slug);

  if (!service) notFound();

  return (
    <>
      <PageHero
        title={service.title}
        subtitle={service.description}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
        bgImage={service.image}
      />
      <ServiceDetail service={service} allServices={content.services} />
    </>
  );
}
