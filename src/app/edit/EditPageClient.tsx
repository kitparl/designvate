"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Download,
  Eye,
  Plus,
  Trash2,
  Lock,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import contentData from "../../../data/content.json";

type ContentData = typeof contentData;

const STORAGE_KEY = "designvate-content";
const PASSWORD = "designvate2024";

function EditSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left font-display text-sm font-semibold text-primary"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="border-t border-gray-100 px-6 py-6">{children}</div>}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-medium text-gray-500">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function ImagePreview({ url }: { url: string }) {
  if (!url) return null;
  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
      <img
        src={url}
        alt="Preview"
        className="h-40 w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

export default function EditPageClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<ContentData>(contentData);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setContent(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToDefault = () => {
    if (confirm("Reset all content to default? This cannot be undone.")) {
      setContent(contentData);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const update = (path: string, value: unknown) => {
    setContent((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const updateArrayItem = (
    arrayPath: string,
    index: number,
    field: string,
    value: string
  ) => {
    setContent((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split(".");
      let arr = clone;
      for (const key of keys) arr = arr[key];
      arr[index][field] = value;
      return clone;
    });
  };

  const addArrayItem = (arrayPath: string, template: Record<string, unknown>) => {
    setContent((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split(".");
      let arr = clone;
      for (const key of keys) arr = arr[key];
      arr.push(template);
      return clone;
    });
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    if (!confirm("Remove this item?")) return;
    setContent((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split(".");
      let arr = clone;
      for (const key of keys) arr = arr[key];
      arr.splice(index, 1);
      return clone;
    });
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
        >
          <div className="mb-6 flex justify-center">
            <img
              src="/images/logo.png"
              alt="Designvate Ventures LLP"
              className="h-16 w-16 rounded-full object-contain"
            />
          </div>
          <h1 className="mb-2 text-center font-display text-xl font-bold text-gray-900">
            Content Editor
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            Enter password to access the editor
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="Password"
            autoFocus
          />
          {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-500">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Access Editor
          </button>
          <p className="mt-4 text-center text-xs text-gray-400">
            Default password: designvate2024
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-32">
      {/* Top Bar */}
      <div className="fixed top-20 left-0 right-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="font-display text-sm font-bold text-gray-900">
            Content Editor
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={resetToDefault}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={downloadJSON}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download size={14} />
              Download JSON
            </button>
            <button
              onClick={saveToLocalStorage}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
            >
              {saved ? <CheckCircle size={14} /> : <Save size={14} />}
              {saved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-4 px-4 pt-16">
        {/* Home Section */}
        <EditSection title="Home / Hero Section" defaultOpen>
          <InputField
            label="Title"
            value={content.home.title}
            onChange={(v) => update("home.title", v)}
          />
          <InputField
            label="Subtitle"
            value={content.home.subtitle}
            onChange={(v) => update("home.subtitle", v)}
          />
          <InputField
            label="Hero Image URL"
            value={content.home.heroImage}
            onChange={(v) => update("home.heroImage", v)}
          />
          <ImagePreview url={content.home.heroImage} />
          <InputField
            label="CTA Button Text"
            value={content.home.ctaText}
            onChange={(v) => update("home.ctaText", v)}
          />
        </EditSection>

        {/* About */}
        <EditSection title="About">
          <InputField
            label="Title"
            value={content.about.title}
            onChange={(v) => update("about.title", v)}
          />
          <InputField
            label="Description"
            value={content.about.description}
            onChange={(v) => update("about.description", v)}
            multiline
          />
          <InputField
            label="Description 2"
            value={content.about.description2}
            onChange={(v) => update("about.description2", v)}
            multiline
          />
          <InputField
            label="Team"
            value={content.about.team}
            onChange={(v) => update("about.team", v)}
            multiline
          />
          <InputField
            label="Vision"
            value={content.about.vision}
            onChange={(v) => update("about.vision", v)}
            multiline
          />
          <InputField
            label="Mission"
            value={content.about.mission}
            onChange={(v) => update("about.mission", v)}
            multiline
          />
          <InputField
            label="Image URL"
            value={content.about.image}
            onChange={(v) => update("about.image", v)}
          />
          <ImagePreview url={content.about.image} />
        </EditSection>

        {/* Stats */}
        <EditSection title="Stats">
          {content.stats.map((stat, i) => (
            <div
              key={i}
              className="mb-4 flex items-end gap-3 rounded-lg bg-gray-50 p-4"
            >
              <div className="flex-1">
                <InputField
                  label="Label"
                  value={stat.label}
                  onChange={(v) => updateArrayItem("stats", i, "label", v)}
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="Value"
                  value={stat.value}
                  onChange={(v) => updateArrayItem("stats", i, "value", v)}
                />
              </div>
              <button
                onClick={() => removeArrayItem("stats", i)}
                className="mb-4 text-red-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("stats", { label: "New Stat", value: "0+" })
            }
            className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <Plus size={14} />
            Add Stat
          </button>
        </EditSection>

        {/* Services */}
        <EditSection title="Services">
          {content.services.map((service, i) => (
            <div
              key={i}
              className="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {service.title || `Service ${i + 1}`}
                </span>
                <button
                  onClick={() => removeArrayItem("services", i)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <InputField
                label="Title"
                value={service.title}
                onChange={(v) => updateArrayItem("services", i, "title", v)}
              />
              <InputField
                label="Slug"
                value={service.slug}
                onChange={(v) => updateArrayItem("services", i, "slug", v)}
              />
              <InputField
                label="Description"
                value={service.description}
                onChange={(v) =>
                  updateArrayItem("services", i, "description", v)
                }
                multiline
              />
              <InputField
                label="Details"
                value={service.details}
                onChange={(v) => updateArrayItem("services", i, "details", v)}
                multiline
              />
              <InputField
                label="Image URL"
                value={service.image || ""}
                onChange={(v) => updateArrayItem("services", i, "image", v)}
              />
              {service.image && <ImagePreview url={service.image} />}
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("services", {
                title: "New Service",
                description: "",
                icon: "Building",
                slug: "new-service",
                details: "",
                image: "",
              })
            }
            className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <Plus size={14} />
            Add Service
          </button>
        </EditSection>

        {/* Projects */}
        <EditSection title="Projects">
          {content.projects.map((project, i) => (
            <div
              key={i}
              className="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {project.title || `Project ${i + 1}`}
                </span>
                <button
                  onClick={() => removeArrayItem("projects", i)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <InputField
                label="Title"
                value={project.title}
                onChange={(v) => updateArrayItem("projects", i, "title", v)}
              />
              <InputField
                label="Slug"
                value={project.slug}
                onChange={(v) => updateArrayItem("projects", i, "slug", v)}
              />
              <InputField
                label="Description"
                value={project.description}
                onChange={(v) =>
                  updateArrayItem("projects", i, "description", v)
                }
                multiline
              />
              <InputField
                label="Details"
                value={project.details}
                onChange={(v) => updateArrayItem("projects", i, "details", v)}
                multiline
              />
              <InputField
                label="Image URL"
                value={project.image}
                onChange={(v) => updateArrayItem("projects", i, "image", v)}
              />
              <ImagePreview url={project.image} />
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Location"
                  value={project.location}
                  onChange={(v) =>
                    updateArrayItem("projects", i, "location", v)
                  }
                />
                <InputField
                  label="Timeline"
                  value={project.timeline}
                  onChange={(v) =>
                    updateArrayItem("projects", i, "timeline", v)
                  }
                />
              </div>
              <InputField
                label="Category"
                value={project.category}
                onChange={(v) => updateArrayItem("projects", i, "category", v)}
              />
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("projects", {
                title: "New Project",
                slug: "new-project",
                description: "",
                image: "",
                location: "",
                timeline: "",
                category: "Corporate",
                details: "",
                images: [],
              })
            }
            className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <Plus size={14} />
            Add Project
          </button>
        </EditSection>

        {/* Testimonials */}
        <EditSection title="Testimonials">
          {content.testimonials.map((t, i) => (
            <div
              key={i}
              className="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {t.name || `Testimonial ${i + 1}`}
                </span>
                <button
                  onClick={() => removeArrayItem("testimonials", i)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <InputField
                label="Name"
                value={t.name}
                onChange={(v) => updateArrayItem("testimonials", i, "name", v)}
              />
              <InputField
                label="Designation"
                value={t.designation}
                onChange={(v) =>
                  updateArrayItem("testimonials", i, "designation", v)
                }
              />
              <InputField
                label="Feedback"
                value={t.feedback}
                onChange={(v) =>
                  updateArrayItem("testimonials", i, "feedback", v)
                }
                multiline
              />
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("testimonials", {
                name: "",
                designation: "",
                feedback: "",
              })
            }
            className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <Plus size={14} />
            Add Testimonial
          </button>
        </EditSection>

        {/* Clients */}
        <EditSection title="Clients">
          {content.clients.map((client, i) => (
            <div
              key={i}
              className="mb-4 flex items-end gap-3 rounded-lg bg-gray-50 p-4"
            >
              <div className="flex-1">
                <InputField
                  label="Name"
                  value={client.name}
                  onChange={(v) => updateArrayItem("clients", i, "name", v)}
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="Logo URL"
                  value={client.logo}
                  onChange={(v) => updateArrayItem("clients", i, "logo", v)}
                />
              </div>
              <button
                onClick={() => removeArrayItem("clients", i)}
                className="mb-4 text-red-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("clients", { name: "", logo: "" })
            }
            className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <Plus size={14} />
            Add Client
          </button>
        </EditSection>

        {/* Contact */}
        <EditSection title="Contact Information">
          <InputField
            label="Phone"
            value={content.contact.phone}
            onChange={(v) => update("contact.phone", v)}
          />
          <InputField
            label="Phone 2"
            value={content.contact.phone2}
            onChange={(v) => update("contact.phone2", v)}
          />
          <InputField
            label="Phone 3"
            value={content.contact.phone3}
            onChange={(v) => update("contact.phone3", v)}
          />
          <InputField
            label="Email"
            value={content.contact.email}
            onChange={(v) => update("contact.email", v)}
          />
          <InputField
            label="Email 2"
            value={content.contact.email2}
            onChange={(v) => update("contact.email2", v)}
          />
          <InputField
            label="Address"
            value={content.contact.address}
            onChange={(v) => update("contact.address", v)}
          />
          <InputField
            label="WhatsApp Number (without +)"
            value={content.contact.whatsapp}
            onChange={(v) => update("contact.whatsapp", v)}
          />
          <InputField
            label="Instagram URL"
            value={content.contact.instagram}
            onChange={(v) => update("contact.instagram", v)}
          />
          <InputField
            label="Google Maps Embed URL"
            value={content.contact.mapEmbedUrl}
            onChange={(v) => update("contact.mapEmbedUrl", v)}
          />
        </EditSection>

        {/* SEO */}
        <EditSection title="SEO Settings">
          <InputField
            label="Page Title"
            value={content.seo.title}
            onChange={(v) => update("seo.title", v)}
          />
          <InputField
            label="Meta Description"
            value={content.seo.description}
            onChange={(v) => update("seo.description", v)}
            multiline
          />
          <InputField
            label="Keywords"
            value={content.seo.keywords}
            onChange={(v) => update("seo.keywords", v)}
            multiline
          />
        </EditSection>

        {/* Instructions */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 font-display text-sm font-semibold text-blue-900">
            How to Update the Website
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Make your edits in the sections above</li>
            <li>2. Click &ldquo;Download JSON&rdquo; to get the updated content file</li>
            <li>
              3. Replace the file at <code className="rounded bg-blue-100 px-1.5 py-0.5 text-xs">/data/content.json</code> in
              your project
            </li>
            <li>4. Push the changes to deploy (Vercel auto-deploys)</li>
            <li>
              5. Alternatively, click &ldquo;Save&rdquo; to store changes in your browser
              (temporary)
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
