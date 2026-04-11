import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import AboutContent from "./AboutContent";

export const metadata = {
  title: "About Us | DESIGNVATE VENTURES LLP",
  description:
    "Learn about DESIGNVATE VENTURES LLP (VSAS Group) — our history, vision, mission, and the team behind our success.",
};

export default function AboutPage() {
  const content = getContent();

  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Our story, vision, and the people who make it happen."
        breadcrumbs={[{ label: "About" }]}
        bgImage={content.about.image}
      />
      <AboutContent content={content} />
    </>
  );
}
