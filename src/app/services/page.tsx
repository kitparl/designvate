import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import ServicesList from "./ServicesList";

export const metadata = {
  title: "Services | DESIGNVATE VENTURES LLP",
  description:
    "Explore our comprehensive range of civil engineering and interior design services.",
};

export default function ServicesPage() {
  const content = getContent();

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive construction and design solutions across every sector."
        breadcrumbs={[{ label: "Services" }]}
      />
      <ServicesList services={content.services} />
    </>
  );
}
