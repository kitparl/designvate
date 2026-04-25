import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const localAssetUrl = z
  .string()
  .startsWith("/")
  .refine((v) => v.startsWith("/images/") || v.startsWith("/files/"), {
    message: "Local assets must start with /images/ or /files/",
  });

const maybeUrl = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (!v) return true;
      if (v.startsWith("/")) return true;
      try {
        const parsed = new URL(v);
        void parsed;
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL or a local path starting with /" }
  );

const requiredString = (label: string) =>
  z.string().trim().min(1, { message: `${label} is required` });

export const contentSchema = z
  .object({
    home: z.object({
      title: requiredString("Home title"),
      subtitle: requiredString("Home subtitle"),
      heroImage: maybeUrl,
      ctaText: requiredString("CTA text"),
      ctaPhone: requiredString("CTA phone"),
    }),

    about: z.object({
      title: requiredString("About title"),
      description: requiredString("About description"),
      description2: z.string().default(""),
      team: z.string().default(""),
      vision: z.string().default(""),
      mission: z.string().default(""),
      philosophy: z.string().default(""),
      image: maybeUrl,
    }),

    whyChooseUs: z.array(
      z.object({
        title: requiredString("Why Choose Us title"),
        description: requiredString("Why Choose Us description"),
        icon: requiredString("Icon"),
      })
    ),

    stats: z.array(
      z.object({
        label: requiredString("Stat label"),
        value: requiredString("Stat value"),
      })
    ),

    services: z.array(
      z.object({
        title: requiredString("Service title"),
        description: requiredString("Service description"),
        icon: requiredString("Service icon"),
        slug: z
          .string()
          .trim()
          .min(1, { message: "Service slug is required" })
          .regex(slugRegex, { message: "Service slug must be kebab-case" }),
        details: z.string().default(""),
        image: maybeUrl.optional().or(z.literal("")),
      })
    ),

    projects: z.array(
      z.object({
        title: requiredString("Project title"),
        slug: z
          .string()
          .trim()
          .min(1, { message: "Project slug is required" })
          .regex(slugRegex, { message: "Project slug must be kebab-case" }),
        description: requiredString("Project description"),
        image: maybeUrl,
        location: z.string().default(""),
        timeline: z.string().default(""),
        category: z.string().default(""),
        details: z.string().default(""),
        images: z.array(maybeUrl).default([]),
      })
    ),

    testimonials: z.array(
      z.object({
        name: requiredString("Testimonial name"),
        designation: z.string().default(""),
        feedback: requiredString("Feedback"),
      })
    ),

    clients: z.array(
      z.object({
        name: requiredString("Client name"),
        logo: maybeUrl.optional().or(z.literal("")),
      })
    ),

    industries: z.array(requiredString("Industry")),

    setup: z.object({
      title: requiredString("Setup title"),
      teams: z.array(requiredString("Team")).default([]),
    }),

    values: z.object({
      metal: z.string().default(""),
      wood: z.string().default(""),
      sand: z.string().default(""),
    }),

    contact: z.object({
      phone: requiredString("Phone"),
      phone2: z.string().default(""),
      phone3: z.string().default(""),
      email: requiredString("Email"),
      email2: z.string().default(""),
      address: requiredString("Address"),
      whatsapp: z.string().default(""),
      instagram: z.string().default(""),
      website: z.string().default(""),
      mapEmbedUrl: z.string().default(""),
    }),

    seo: z.object({
      title: requiredString("SEO title"),
      description: requiredString("SEO description"),
      keywords: z.string().default(""),
    }),

    companyProfile: z.object({
      downloadUrl: localAssetUrl,
      label: requiredString("Company profile label"),
    }),
  })
  .superRefine((content, ctx) => {
    const serviceSlugs = new Map<string, number>();
    for (let i = 0; i < content.services.length; i++) {
      const s = content.services[i];
      if (serviceSlugs.has(s.slug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Service slug must be unique",
          path: ["services", i, "slug"],
        });
      } else {
        serviceSlugs.set(s.slug, i);
      }
    }

    const projectSlugs = new Map<string, number>();
    for (let i = 0; i < content.projects.length; i++) {
      const p = content.projects[i];
      if (projectSlugs.has(p.slug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Project slug must be unique",
          path: ["projects", i, "slug"],
        });
      } else {
        projectSlugs.set(p.slug, i);
      }
    }
  });

export type ContentData = z.infer<typeof contentSchema>;

export function safeParseContent(input: unknown) {
  return contentSchema.safeParse(input);
}

export function zodIssuesToPathMap(issues: z.ZodIssue[]) {
  const map: Record<string, string[]> = {};
  for (const issue of issues) {
    const path = issue.path.join(".");
    if (!map[path]) map[path] = [];
    map[path].push(issue.message);
  }
  return map;
}

