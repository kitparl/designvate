# Content Editor v2 — Implementation Spec (Designvate)

This document is the **single source of truth** for implementing a robust, low-bug, non-technical friendly Content Editor for this project.

## Goals

- **Non-technical editing**: business users can update the site without touching code.
- **Developer low-effort**: once built, developers rarely intervene for content changes.
- **Safe publishing**: prevent broken pages/invalid content from reaching production.
- **Draft protection**: if the tab closes / page refreshes, edits are recoverable.
- **Full coverage**: the editor must support **100% of `data/content.json`** (no missing fields).

## Non-goals (for v2 initial release)

- A full multi-tenant CMS for multiple companies.
- Complex AB testing.
- Full i18n/translation management (can be added later).

## Current State (v1)

- Route: `/edit` renders `src/app/edit/EditPageClient.tsx`.
- Edits are stored in-memory and can be:
  - **Saved** to `localStorage` (draft)
  - **Downloaded** as `content.json` (manual replacement required)
- The website pages read from `data/content.json` on disk, so **localStorage draft does not change the live site**.

## Source of Truth + Data Model

### Canonical content file

- **File**: `data/content.json`
- **Type**: `ContentData = typeof contentData` (already in `EditPageClient.tsx`)

### Required: Formal schema

Create a formal schema so validation is deterministic and consistent in editor + publish.

- **Schema format**: Zod (recommended) or JSON Schema
- **Schema file**: `src/lib/contentSchema.(ts|js)` (or equivalent)
- **Rules**:
  - Required fields must be explicitly marked (e.g., hero title, contact phone/email).
  - Arrays must validate each item shape.
  - Slugs must be unique within their collections and match a safe pattern.

#### Suggested validations (minimum)

- **Slug pattern**: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- **URLs**: must parse as valid URL for external links; allow `/images/...` and `/files/...` for local assets.
- **Phone/WhatsApp**: numeric-only or `+` prefixed, consistent formatting.
- **Map embed**: must be `https://www.google.com/maps/embed?...` (or warn).
- **Images**: if provided, must load (warn if broken; don’t silently hide).

## UX Requirements

### 1) Authentication (minimum viable)

- Keep password gate for now, but do not hardcode in client code long-term.
- For v2:
  - Read password from environment (server-side) and issue a short-lived session token/cookie.
  - Rate-limit login attempts.

### 2) Editor layout

- **Left**: editor controls (sections, fields)
- **Right**: live preview (real site rendering with draft content)
- **Top bar**:
  - Draft status (Saved/Unsaved)
  - Last autosave time
  - Buttons: Undo, Redo, Save Draft, Download JSON, Import JSON, Publish (if enabled), Reset

### 3) Live Preview (must-have)

- Preview must render from **draft content state**, not disk.
- Provide route selector:
  - Home, About, Services list, Service detail, Projects list, Project detail, Contact
- Responsive toggles: mobile/tablet/desktop.

### 4) Draft safety (must-have)

Implement robust draft protection using `localStorage`.

- Autosave:
  - Save draft to `localStorage` every N seconds (e.g., 2–5s) **and** on blur.
  - Store a `draftVersion`, `updatedAt`, and optional `schemaVersion`.
- On editor load:
  - If a draft exists and differs from default content, show modal:
    - Restore draft / Discard draft
- Add **Snapshots** (lightweight versioning):
  - User can create named snapshots (e.g., “Before April updates”)
  - List snapshots, restore, delete
  - Store snapshots in `localStorage` (v2) and optionally remote later.

### 5) Undo / Redo (must-have)

- Multi-step undo/redo across all edits.
- Keyboard shortcuts:
  - Undo: Ctrl/Cmd+Z
  - Redo: Ctrl/Cmd+Shift+Z
- Ensure undo/redo interacts correctly with autosave (autosave should persist current state).

### 6) Full content coverage (must-have)

Editor UI must include all keys present in `data/content.json`, including but not limited to:

- **Home**: title, subtitle, heroImage, ctaText, ctaPhone
- **About**: title, description, description2, team, vision, mission, philosophy, image
- **Why Choose Us**: array of `{ title, description, icon }` (add/remove/reorder)
- **Stats**: array of `{ label, value }` (add/remove/reorder)
- **Services**: array items including `title, description, icon, slug, details, image`
- **Projects**: array items including `title, slug, description, image, location, timeline, category, details, images[]`
- **Testimonials**: array items `name, designation, feedback`
- **Clients**: array items `name, logo`
- **Industries**: string array
- **Setup**: title + `teams[]`
- **Values**: `metal, wood, sand`
- **Contact**: all fields present (`phone`, `phone2`, `phone3`, `email`, `email2`, `address`, `whatsapp`, `instagram`, `website`, `mapEmbedUrl`)
- **SEO**: title, description, keywords (v2 also supports per-page overrides)
- **Company Profile**: downloadUrl, label

### 7) Array item UX (must-have)

For each list/array editor:

- Add item (from template)
- Remove item (with confirm)
- Duplicate item
- Reorder items (drag & drop + move up/down buttons)
- Collapse/expand each item card
- Show a summary title (e.g., service title, project title)
- “Empty state” guidance when list is empty

### 8) Import / Export (must-have)

- **Import JSON**
  - Upload `content.json`
  - Validate with schema
  - If invalid: show errors, do not apply
  - If valid: apply (replace entire content)
  - Optional: advanced merge mode (section-by-section) as v2.1
- **Export**
  - Download current draft as JSON
  - Download current published content as JSON (once publish exists)

### 9) Validation & error display (must-have)

- Field-level errors shown inline.
- Section-level error summary at top of section.
- A global validation banner in top bar:
  - “All checks passed” or “X issues found”

### 10) Rich text (v2.1)

For long fields (details/descriptions):

- Add Markdown editor (minimum) or rich text editor (optional).
- Preview formatting in live preview.

### 11) Media (v2.1)

- Image URL tester with:
  - Preview
  - “Broken image” warning
- Optional uploads (v3):
  - Upload to a provider and store resulting URL in content.

## Publishing (choose an approach)

Publishing is how we eliminate “download JSON → replace file → push to deploy”.

### Option A: GitHub Publish (recommended for this repo)

- Editor performs authenticated commit to update `data/content.json`.
- Modes:
  - **PR mode (safer)**: create branch + PR
  - **Direct mode (fast)**: commit to default branch
- Requirements:
  - Store GitHub token securely (server-side only)
  - Audit log for publish events
  - Rollback: pick a previous publish commit and restore content

### Option B: Database Publish (Supabase/Firebase)

- Store published content in DB.
- Site loads from API; editor writes to DB.
- Requirements:
  - caching + revalidation strategy
  - roles/permissions

### Option C: Headless CMS

- Migrate content model into a CMS.
- Most powerful, highest setup overhead.

## Acceptance Criteria (Definition of Done)

### Editor correctness

- All keys in `data/content.json` are editable through UI.
- Add/remove/reorder/duplicate works for every array.
- Undo/redo works across all edits.
- Autosave draft persists and restores after refresh.
- Import rejects invalid JSON with actionable messages.
- Download outputs valid schema-conformant JSON.

### Safety

- Validation prevents publishing invalid content.
- Broken images/URLs are surfaced as warnings/errors.
- Slug uniqueness is enforced (services/projects).

### UX

- Live preview reflects draft changes immediately.
- Editor remains usable on typical laptop screens.

## Implementation Phases (recommended)

### Phase 1 (v2.0): “Complete + Safe Draft Editor”

- Formal schema + validation UI
- Full content coverage in editor
- Array UX: add/remove/duplicate/reorder
- Autosave draft + restore modal
- Undo/redo
- Import/Export JSON
- Live preview (basic)

### Phase 2 (v2.1): “Creator-friendly”

- Rich text (markdown) for long fields
- Better preview routing (detail pages)
- Snapshot manager (named snapshots)
- Better image/link diagnostics

### Phase 3 (v3): “One-click Publish”

- GitHub PR/commit publish OR DB publish
- Published history + rollback
- Roles, audit log

## Notes for Cursor (implementation guidance)

- Prefer a **generic form renderer** driven by schema/config rather than hardcoding every field.
- Avoid deep-cloning with `JSON.parse(JSON.stringify(...))` for large objects; use an immutable update helper (e.g., `structuredClone` where available, or a library) and a safe path setter.
- Ensure preview uses the **same components** as the real site to avoid “preview mismatch”.
- Keep the editor resilient: no runtime crashes on missing keys; show “unknown field” fallback UI for future schema additions.

