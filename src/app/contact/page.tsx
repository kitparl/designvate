import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import ContactContent from "./ContactContent";

export const metadata = {
  title: "Contact | DESIGNVATE VENTURES LLP",
  description:
    "Get in touch with DESIGNVATE VENTURES LLP for a free consultation and project quote.",
};

export default function ContactPage() {
  const content = getContent();

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch for a free consultation and project quote."
        breadcrumbs={[{ label: "Contact" }]}
      />
      <ContactContent contact={content.contact} />
    </>
  );
}
