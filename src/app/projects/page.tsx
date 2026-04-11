import { getContent } from "@/lib/content";
import PageHero from "@/components/PageHero";
import ProjectsGrid from "./ProjectsGrid";

export const metadata = {
  title: "Projects | DESIGNVATE VENTURES LLP",
  description:
    "Browse our portfolio of completed projects across corporate, residential, and government sectors.",
};

export default function ProjectsPage() {
  const content = getContent();

  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="A portfolio of excellence across corporate, residential, and government sectors."
        breadcrumbs={[{ label: "Projects" }]}
      />
      <ProjectsGrid projects={content.projects} />
    </>
  );
}
