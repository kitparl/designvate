import { getContent } from "@/lib/content";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Stats from "@/components/Stats";
import ServicesPreview from "@/components/ServicesPreview";
import FeaturedProjects from "@/components/FeaturedProjects";
import Testimonials from "@/components/Testimonials";
import Clients from "@/components/Clients";
import Industries from "@/components/Industries";
import CTASection from "@/components/CTASection";

export default function Home() {
  const content = getContent();

  return (
    <>
      <Hero
        title={content.home.title}
        subtitle={content.home.subtitle}
        heroImage={content.home.heroImage}
        ctaText={content.home.ctaText}
      />
      <WhyChooseUs items={content.whyChooseUs} />
      <Stats stats={content.stats} />
      <ServicesPreview services={content.services} />
      <FeaturedProjects projects={content.projects} />
      <Testimonials testimonials={content.testimonials} />
      <Clients clients={content.clients} />
      <Industries industries={content.industries} />
      <CTASection />
    </>
  );
}
