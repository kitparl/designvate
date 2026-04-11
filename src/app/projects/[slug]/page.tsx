import { getContent } from "@/lib/content";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ProjectDetail from "./ProjectDetail";

export function generateStaticParams() {
  const content = getContent();
  return content.projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const content = getContent();
  const project = content.projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: `${project.title} | DESIGNVATE VENTURES LLP`,
    description: project.description,
  };
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const content = getContent();
  const project = content.projects.find((p) => p.slug === params.slug);

  if (!project) notFound();

  return (
    <>
      <PageHero
        title={project.title}
        subtitle={project.description}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
        bgImage={project.image}
      />
      <ProjectDetail project={project} allProjects={content.projects} />
    </>
  );
}
