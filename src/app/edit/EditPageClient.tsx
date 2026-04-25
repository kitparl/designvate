"use client";

import { useMemo, useRef, useState } from "react";
import {
  Save,
  Download,
  Eye,
  Plus,
  Trash2,
  Undo2,
  Redo2,
  Copy,
  ArrowUp,
  ArrowDown,
  Upload,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import contentData from "../../../data/content.json";
import type { ContentData } from "@/lib/contentSchema";
import { safeParseContent } from "@/lib/contentSchema";
import { useContentEditor } from "./useContentEditor";
import EditorPreview from "./EditorPreview";

const PASSWORD = "ankur@123";

function EditSection({
  title,
  children,
  defaultOpen = false,
  onPreview,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onPreview?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left font-display text-sm font-semibold text-primary"
      >
        <span className="flex items-center gap-2">
          {title}
          {onPreview && (
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPreview();
              }}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-200"
              role="button"
              tabIndex={0}
            >
              <Eye size={12} />
              Preview
            </span>
          )}
        </span>
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
  error,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  error?: string;
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
          className={`w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:border-amber-500 focus:ring-amber-100"
          }`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:border-amber-500 focus:ring-amber-100"
          }`}
          placeholder={placeholder}
        />
      )}
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
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
  const [error, setError] = useState("");
  const [restorePrompt, setRestorePrompt] = useState<null | {
    updatedAt: number;
    content: ContentData;
  }>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [publishing, setPublishing] = useState(false);
  const [previewRoute, setPreviewRoute] = useState<
    | "home"
    | "about"
    | "services"
    | "service-detail"
    | "projects"
    | "project-detail"
    | "contact"
  >("home");
  const [previewDevice, setPreviewDevice] = useState<
    "mobile" | "tablet" | "desktop"
  >("mobile");
  const importRef = useRef<HTMLInputElement | null>(null);

  const defaultContent = useMemo(() => {
    const parsed = safeParseContent(contentData);
    return parsed.success ? parsed.data : (contentData as unknown as ContentData);
  }, []);

  const editor = useContentEditor(defaultContent);
  const { content, validation } = editor;

  const publishEnabled = process.env.NEXT_PUBLIC_ENABLE_PUBLISH === "true";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      setError("");

      // After auth, offer to restore draft (if present).
      const draft = editor.getDraftOnDisk();
      if (draft) setRestorePrompt(draft);
    } else {
      setError("Incorrect password");
    }
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
      editor.resetToDefault();
      editor.discardDraft();
    }
  };

  const getErr = (path: string) => validation.issuesByPath[path]?.[0];

  const mutateArray = <T,>(
    arrayPath: string,
    mutate: (arr: T[]) => void,
    confirmText?: string
  ) => {
    if (confirmText && !confirm(confirmText)) return;
    const next = structuredClone(content) as unknown as ContentData;
    const keys = arrayPath.split(".");
    let cur: unknown = next;
    for (const k of keys) {
      if (typeof cur !== "object" || cur === null) return;
      const obj = cur as Record<string, unknown>;
      cur = obj[k];
    }
    if (!Array.isArray(cur)) return;
    mutate(cur as T[]);
    editor.setWholeContent(next as unknown as ContentData);
  };

  const updateArrayItem = (
    arrayPath: string,
    index: number,
    field: string,
    value: string
  ) => {
    mutateArray<unknown>(arrayPath, (arr) => {
      const item = arr[index];
      if (typeof item !== "object" || item === null) return;
      (item as Record<string, unknown>)[field] = value;
    });
  };

  const addArrayItem = (arrayPath: string, template: Record<string, unknown>) => {
    mutateArray<unknown>(arrayPath, (arr) => {
      arr.push(template);
    });
  };

  const duplicateArrayItem = (arrayPath: string, index: number) => {
    mutateArray<unknown>(arrayPath, (arr) => {
      arr.splice(index + 1, 0, structuredClone(arr[index]));
    });
  };

  const moveArrayItem = (arrayPath: string, index: number, dir: -1 | 1) => {
    mutateArray<unknown>(arrayPath, (arr) => {
      const nextIndex = index + dir;
      if (nextIndex < 0 || nextIndex >= arr.length) return;
      const tmp = arr[index];
      arr[index] = arr[nextIndex];
      arr[nextIndex] = tmp;
    });
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    mutateArray<unknown>(arrayPath, (arr) => {
      arr.splice(index, 1);
    }, "Remove this item?");
  };

  const onImportClick = () => importRef.current?.click();

  const onImportFile = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      alert("Invalid JSON file.");
      return;
    }
    const validated = safeParseContent(parsed);
    if (!validated.success) {
      alert(
        `Content validation failed. Please fix errors first.\n\nExample: ${validated.error.issues[0]?.message || "Unknown error"}`
      );
      return;
    }
    editor.setWholeContent(validated.data);
    editor.saveDraft();
  };

  const onPublish = async () => {
    if (!validation.ok) {
      alert("Fix validation issues before publishing.");
      return;
    }
    if (!confirm("Publish the current content?")) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        alert(json.error || "Publish failed.");
        return;
      }
      alert("Published.");
    } catch {
      alert("Network error while publishing.");
    } finally {
      setPublishing(false);
    }
  };

  const openPreview = (route: typeof previewRoute) => {
    setPreviewRoute(route);
    setActiveTab("preview");
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
            Default password: ankur@123
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-32">
      {/* Top Bar */}
      <div className="fixed top-20 left-0 right-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <h1 className="font-display text-sm font-bold text-gray-900">
            Content Editor
          </h1>
          <div className="hidden items-center gap-2 md:flex">
            <div
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                validation.ok
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
              title={
                validation.ok
                  ? "All checks passed"
                  : `${validation.issueCount} issues found`
              }
            >
              {validation.ok ? "Valid" : `${validation.issueCount} issues`}
            </div>
            <button
              onClick={resetToDefault}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={editor.undo}
              disabled={!editor.canUndo}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Undo2 size={14} />
              Undo
            </button>
            <button
              onClick={editor.redo}
              disabled={!editor.canRedo}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Redo2 size={14} />
              Redo
            </button>
            <button
              onClick={() => {
                const name = prompt("Snapshot name (optional)") || "";
                editor.createSnapshot(name);
                alert("Snapshot saved.");
              }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Save size={14} />
              Snapshot
            </button>
            <button
              onClick={onImportClick}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Upload size={14} />
              Import
            </button>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => onImportFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={downloadJSON}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download size={14} />
              Download JSON
            </button>
            {publishEnabled && (
              <button
                onClick={onPublish}
                disabled={publishing || !validation.ok}
                className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishing ? <Save size={14} /> : <Eye size={14} />}
                Publish
              </button>
            )}
            <button
              onClick={editor.saveDraft}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
            >
              {editor.isDirty ? <Save size={14} /> : <CheckCircle size={14} />}
              {editor.isDirty ? "Save draft" : "Saved"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="mx-auto max-w-6xl px-4 pt-16 md:hidden">
        <div className="mb-4 grid grid-cols-2 rounded-xl bg-white p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("edit")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              activeTab === "edit"
                ? "bg-amber-600 text-white"
                : "text-gray-700"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              activeTab === "preview"
                ? "bg-amber-600 text-white"
                : "text-gray-700"
            }`}
          >
            Preview
          </button>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              validation.ok
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {validation.ok ? "Valid" : `${validation.issueCount} issues`}
          </div>
          <button
            onClick={editor.saveDraft}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white"
          >
            {editor.isDirty ? <Save size={14} /> : <CheckCircle size={14} />}
            {editor.isDirty ? "Save draft" : "Saved"}
          </button>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            onClick={onImportClick}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800"
          >
            <Upload size={14} />
            Import
          </button>
          <button
            onClick={downloadJSON}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800"
          >
            <Download size={14} />
            Export
          </button>
          {publishEnabled && (
            <button
              onClick={onPublish}
              disabled={publishing || !validation.ok}
              className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 disabled:opacity-50"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Restore prompt */}
      {restorePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-display text-lg font-bold text-gray-900">
              Restore previous draft?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We found an autosaved draft from{" "}
              <span className="font-semibold">
                {new Date(restorePrompt.updatedAt).toLocaleString()}
              </span>
              .
            </p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  editor.restoreDraft(restorePrompt.content);
                  setRestorePrompt(null);
                }}
                className="flex-1 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Restore
              </button>
              <button
                onClick={() => {
                  editor.discardDraft();
                  setRestorePrompt(null);
                }}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl gap-4 px-4 pt-2 md:grid md:grid-cols-[minmax(360px,480px)_1fr] md:pt-16">
        <div className={`${activeTab === "preview" ? "hidden" : ""} md:block`}>
        {/* Home Section */}
        <EditSection
          title="Home / Hero Section"
          defaultOpen
          onPreview={() => openPreview("home")}
        >
          <InputField
            label="Title"
            value={content.home.title}
            onChange={(v) => editor.updatePath("home.title", v)}
            error={getErr("home.title")}
          />
          <InputField
            label="Subtitle"
            value={content.home.subtitle}
            onChange={(v) => editor.updatePath("home.subtitle", v)}
            error={getErr("home.subtitle")}
          />
          <InputField
            label="Hero Image URL"
            value={content.home.heroImage}
            onChange={(v) => editor.updatePath("home.heroImage", v)}
            error={getErr("home.heroImage")}
          />
          <ImagePreview url={content.home.heroImage} />
          <InputField
            label="CTA Button Text"
            value={content.home.ctaText}
            onChange={(v) => editor.updatePath("home.ctaText", v)}
            error={getErr("home.ctaText")}
          />
          <InputField
            label="CTA Phone (tel link)"
            value={content.home.ctaPhone}
            onChange={(v) => editor.updatePath("home.ctaPhone", v)}
            error={getErr("home.ctaPhone")}
          />
        </EditSection>

        {/* About */}
        <EditSection title="About" onPreview={() => openPreview("about")}>
          <InputField
            label="Title"
            value={content.about.title}
            onChange={(v) => editor.updatePath("about.title", v)}
            error={getErr("about.title")}
          />
          <InputField
            label="Description"
            value={content.about.description}
            onChange={(v) => editor.updatePath("about.description", v)}
            multiline
            error={getErr("about.description")}
          />
          <InputField
            label="Description 2"
            value={content.about.description2}
            onChange={(v) => editor.updatePath("about.description2", v)}
            multiline
          />
          <InputField
            label="Team"
            value={content.about.team}
            onChange={(v) => editor.updatePath("about.team", v)}
            multiline
          />
          <InputField
            label="Vision"
            value={content.about.vision}
            onChange={(v) => editor.updatePath("about.vision", v)}
            multiline
          />
          <InputField
            label="Mission"
            value={content.about.mission}
            onChange={(v) => editor.updatePath("about.mission", v)}
            multiline
          />
          <InputField
            label="Philosophy"
            value={content.about.philosophy}
            onChange={(v) => editor.updatePath("about.philosophy", v)}
            multiline
          />
          <InputField
            label="Image URL"
            value={content.about.image}
            onChange={(v) => editor.updatePath("about.image", v)}
            error={getErr("about.image")}
          />
          <ImagePreview url={content.about.image} />
        </EditSection>

        {/* Why Choose Us */}
        <EditSection
          title="Why Choose Us"
          onPreview={() => openPreview("home")}
        >
          {content.whyChooseUs.map((item, i) => (
            <div
              key={i}
              className="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  {item.title || `Item ${i + 1}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveArrayItem("whyChooseUs", i, -1)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveArrayItem("whyChooseUs", i, 1)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => duplicateArrayItem("whyChooseUs", i)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => removeArrayItem("whyChooseUs", i)}
                    className="rounded-md p-1 text-red-500 hover:bg-white"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <InputField
                label="Title"
                value={item.title}
                onChange={(v) => updateArrayItem("whyChooseUs", i, "title", v)}
                error={getErr(`whyChooseUs.${i}.title`)}
              />
              <InputField
                label="Description"
                value={item.description}
                onChange={(v) =>
                  updateArrayItem("whyChooseUs", i, "description", v)
                }
                multiline
                error={getErr(`whyChooseUs.${i}.description`)}
              />
              <InputField
                label="Icon (Lucide name)"
                value={item.icon}
                onChange={(v) => updateArrayItem("whyChooseUs", i, "icon", v)}
                error={getErr(`whyChooseUs.${i}.icon`)}
              />
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("whyChooseUs", {
                title: "New Item",
                description: "",
                icon: "Layers",
              })
            }
            className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <Plus size={14} />
            Add Item
          </button>
        </EditSection>

        {/* Stats */}
        <EditSection title="Stats" onPreview={() => openPreview("home")}>
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
                  error={getErr(`stats.${i}.label`)}
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="Value"
                  value={stat.value}
                  onChange={(v) => updateArrayItem("stats", i, "value", v)}
                  error={getErr(`stats.${i}.value`)}
                />
              </div>
              <div className="mb-4 flex items-center gap-1">
                <button
                  onClick={() => moveArrayItem("stats", i, -1)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveArrayItem("stats", i, 1)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Move down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => duplicateArrayItem("stats", i)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Duplicate"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => removeArrayItem("stats", i)}
                  className="text-red-400 hover:text-red-600"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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
        <EditSection title="Services" onPreview={() => openPreview("services")}>
          {content.services.map((service, i) => (
            <div
              key={i}
              className="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {service.title || `Service ${i + 1}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveArrayItem("services", i, -1)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveArrayItem("services", i, 1)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => duplicateArrayItem("services", i)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => removeArrayItem("services", i)}
                    className="rounded-md p-1 text-red-500 hover:bg-white"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <InputField
                label="Title"
                value={service.title}
                onChange={(v) => updateArrayItem("services", i, "title", v)}
                error={getErr(`services.${i}.title`)}
              />
              <InputField
                label="Icon (Lucide name)"
                value={service.icon}
                onChange={(v) => updateArrayItem("services", i, "icon", v)}
                error={getErr(`services.${i}.icon`)}
              />
              <InputField
                label="Slug"
                value={service.slug}
                onChange={(v) => updateArrayItem("services", i, "slug", v)}
                error={getErr(`services.${i}.slug`)}
              />
              <InputField
                label="Description"
                value={service.description}
                onChange={(v) =>
                  updateArrayItem("services", i, "description", v)
                }
                multiline
                error={getErr(`services.${i}.description`)}
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
                error={getErr(`services.${i}.image`)}
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
        <EditSection title="Projects" onPreview={() => openPreview("projects")}>
          {content.projects.map((project, i) => (
            <div
              key={i}
              className="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {project.title || `Project ${i + 1}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveArrayItem("projects", i, -1)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveArrayItem("projects", i, 1)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => duplicateArrayItem("projects", i)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => removeArrayItem("projects", i)}
                    className="rounded-md p-1 text-red-500 hover:bg-white"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <InputField
                label="Title"
                value={project.title}
                onChange={(v) => updateArrayItem("projects", i, "title", v)}
                error={getErr(`projects.${i}.title`)}
              />
              <InputField
                label="Slug"
                value={project.slug}
                onChange={(v) => updateArrayItem("projects", i, "slug", v)}
                error={getErr(`projects.${i}.slug`)}
              />
              <InputField
                label="Description"
                value={project.description}
                onChange={(v) =>
                  updateArrayItem("projects", i, "description", v)
                }
                multiline
                error={getErr(`projects.${i}.description`)}
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
                error={getErr(`projects.${i}.image`)}
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

              {/* Project gallery images[] */}
              <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-700">
                    Gallery Images
                  </div>
                  <button
                    onClick={() =>
                      mutateArray<string>(
                        `projects.${i}.images`,
                        (arr) => arr.push("")
                      )
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-amber-700"
                  >
                    <Plus size={14} />
                    Add image
                  </button>
                </div>
                {(project.images || []).map((img, j) => (
                  <div key={j} className="mb-2 rounded-md bg-gray-50 p-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={img}
                        onChange={(e) =>
                          mutateArray<string>(`projects.${i}.images`, (arr) => {
                            arr[j] = e.target.value;
                          })
                        }
                        className={`w-full rounded-md border px-2 py-1.5 text-sm outline-none focus:ring-2 ${
                          getErr(`projects.${i}.images.${j}`)
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-amber-500 focus:ring-amber-100"
                        }`}
                        placeholder="https://..."
                      />
                      <button
                        onClick={() =>
                          mutateArray<string>(
                            `projects.${i}.images`,
                            (arr) => arr.splice(j, 1),
                            "Remove this image?"
                          )
                        }
                        className="rounded-md p-1 text-red-500 hover:bg-white"
                        aria-label="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {getErr(`projects.${i}.images.${j}`) && (
                      <div className="mt-1 text-xs text-red-600">
                        {getErr(`projects.${i}.images.${j}`)}
                      </div>
                    )}
                    <ImagePreview url={img} />
                  </div>
                ))}
              </div>
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
        <EditSection
          title="Testimonials"
          onPreview={() => openPreview("home")}
        >
          {content.testimonials.map((t, i) => (
            <div
              key={i}
              className="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {t.name || `Testimonial ${i + 1}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveArrayItem("testimonials", i, -1)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveArrayItem("testimonials", i, 1)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => duplicateArrayItem("testimonials", i)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white"
                    aria-label="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => removeArrayItem("testimonials", i)}
                    className="rounded-md p-1 text-red-500 hover:bg-white"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <InputField
                label="Name"
                value={t.name}
                onChange={(v) => updateArrayItem("testimonials", i, "name", v)}
                error={getErr(`testimonials.${i}.name`)}
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
                error={getErr(`testimonials.${i}.feedback`)}
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
        <EditSection title="Clients" onPreview={() => openPreview("home")}>
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
                  error={getErr(`clients.${i}.name`)}
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="Logo URL"
                  value={client.logo || ""}
                  onChange={(v) => updateArrayItem("clients", i, "logo", v)}
                  error={getErr(`clients.${i}.logo`)}
                />
              </div>
              <div className="mb-4 flex items-center gap-1">
                <button
                  onClick={() => moveArrayItem("clients", i, -1)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveArrayItem("clients", i, 1)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Move down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => duplicateArrayItem("clients", i)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Duplicate"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => removeArrayItem("clients", i)}
                  className="text-red-400 hover:text-red-600"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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

        {/* Industries */}
        <EditSection
          title="Industries"
          onPreview={() => openPreview("home")}
        >
          {content.industries.map((industry, i) => (
            <div key={i} className="mb-3 flex items-center gap-2">
              <input
                value={industry}
                onChange={(e) =>
                  mutateArray<string>("industries", (arr) => {
                    arr[i] = e.target.value;
                  })
                }
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                  getErr(`industries.${i}`)
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-amber-500 focus:ring-amber-100"
                }`}
              />
              <button
                onClick={() => moveArrayItem("industries", i, -1)}
                className="rounded-md p-1 text-gray-500 hover:bg-white"
                aria-label="Move up"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => moveArrayItem("industries", i, 1)}
                className="rounded-md p-1 text-gray-500 hover:bg-white"
                aria-label="Move down"
              >
                <ArrowDown size={16} />
              </button>
              <button
                onClick={() => removeArrayItem("industries", i)}
                className="rounded-md p-1 text-red-500 hover:bg-white"
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => mutateArray<string>("industries", (arr) => arr.push(""))}
            className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <Plus size={14} />
            Add Industry
          </button>
        </EditSection>

        {/* Setup */}
        <EditSection title="Our Setup" onPreview={() => openPreview("about")}>
          <InputField
            label="Title"
            value={content.setup.title}
            onChange={(v) => editor.updatePath("setup.title", v)}
            error={getErr("setup.title")}
          />
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-700">Teams</div>
              <button
                onClick={() => mutateArray<string>("setup.teams", (arr) => arr.push(""))}
                className="flex items-center gap-1 text-xs font-semibold text-amber-700"
              >
                <Plus size={14} />
                Add team
              </button>
            </div>
            {content.setup.teams.map((team, i) => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <input
                  value={team}
                  onChange={(e) =>
                    mutateArray<string>("setup.teams", (arr) => {
                      arr[i] = e.target.value;
                    })
                  }
                  className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
                <button
                  onClick={() => moveArrayItem("setup.teams", i, -1)}
                  className="rounded-md p-1 text-gray-500 hover:bg-gray-50"
                  aria-label="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveArrayItem("setup.teams", i, 1)}
                  className="rounded-md p-1 text-gray-500 hover:bg-gray-50"
                  aria-label="Move down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => removeArrayItem("setup.teams", i)}
                  className="rounded-md p-1 text-red-500 hover:bg-gray-50"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </EditSection>

        {/* Values */}
        <EditSection title="Values" onPreview={() => openPreview("about")}>
          <InputField
            label="Metal"
            value={content.values.metal}
            onChange={(v) => editor.updatePath("values.metal", v)}
            multiline
          />
          <InputField
            label="Wood"
            value={content.values.wood}
            onChange={(v) => editor.updatePath("values.wood", v)}
            multiline
          />
          <InputField
            label="Sand"
            value={content.values.sand}
            onChange={(v) => editor.updatePath("values.sand", v)}
            multiline
          />
        </EditSection>

        {/* Contact */}
        <EditSection
          title="Contact Information"
          onPreview={() => openPreview("contact")}
        >
          <InputField
            label="Phone"
            value={content.contact.phone}
            onChange={(v) => editor.updatePath("contact.phone", v)}
            error={getErr("contact.phone")}
          />
          <InputField
            label="Phone 2"
            value={content.contact.phone2}
            onChange={(v) => editor.updatePath("contact.phone2", v)}
          />
          <InputField
            label="Phone 3"
            value={content.contact.phone3}
            onChange={(v) => editor.updatePath("contact.phone3", v)}
          />
          <InputField
            label="Email"
            value={content.contact.email}
            onChange={(v) => editor.updatePath("contact.email", v)}
            error={getErr("contact.email")}
          />
          <InputField
            label="Email 2"
            value={content.contact.email2}
            onChange={(v) => editor.updatePath("contact.email2", v)}
          />
          <InputField
            label="Address"
            value={content.contact.address}
            onChange={(v) => editor.updatePath("contact.address", v)}
            error={getErr("contact.address")}
          />
          <InputField
            label="WhatsApp Number (without +)"
            value={content.contact.whatsapp}
            onChange={(v) => editor.updatePath("contact.whatsapp", v)}
          />
          <InputField
            label="Instagram URL"
            value={content.contact.instagram}
            onChange={(v) => editor.updatePath("contact.instagram", v)}
          />
          <InputField
            label="Website (domain)"
            value={content.contact.website}
            onChange={(v) => editor.updatePath("contact.website", v)}
          />
          <InputField
            label="Google Maps Embed URL"
            value={content.contact.mapEmbedUrl}
            onChange={(v) => editor.updatePath("contact.mapEmbedUrl", v)}
          />
        </EditSection>

        {/* SEO */}
        <EditSection title="SEO Settings">
          <InputField
            label="Page Title"
            value={content.seo.title}
            onChange={(v) => editor.updatePath("seo.title", v)}
            error={getErr("seo.title")}
          />
          <InputField
            label="Meta Description"
            value={content.seo.description}
            onChange={(v) => editor.updatePath("seo.description", v)}
            multiline
            error={getErr("seo.description")}
          />
          <InputField
            label="Keywords"
            value={content.seo.keywords}
            onChange={(v) => editor.updatePath("seo.keywords", v)}
            multiline
          />

          {/* Non-technical SEO preview */}
          <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs font-semibold text-gray-700">
              Google preview (example)
            </div>
            <div className="mt-2 text-[13px] text-blue-700">
              {content.seo.title || "Page title"}
            </div>
            <div className="text-[12px] text-emerald-700">
              https://your-domain.com
            </div>
            <div className="mt-1 text-[12px] text-gray-600">
              {(content.seo.description || "Meta description…").slice(0, 160)}
              {content.seo.description.length > 160 ? "…" : ""}
            </div>
          </div>
        </EditSection>

        {/* Company Profile */}
        <EditSection title="Company Profile">
          <InputField
            label="Download URL (local, e.g. /files/company-profile.pdf)"
            value={content.companyProfile.downloadUrl}
            onChange={(v) => editor.updatePath("companyProfile.downloadUrl", v)}
            error={getErr("companyProfile.downloadUrl")}
          />
          <InputField
            label="Button Label"
            value={content.companyProfile.label}
            onChange={(v) => editor.updatePath("companyProfile.label", v)}
            error={getErr("companyProfile.label")}
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

        {/* Preview placeholder (Phase t7) */}
        <div className={`${activeTab === "edit" ? "hidden" : ""} md:block`}>
          <div className="sticky top-36">
            <EditorPreview
              content={content}
              route={previewRoute}
              onRouteChange={setPreviewRoute}
              device={previewDevice}
              onDeviceChange={setPreviewDevice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
