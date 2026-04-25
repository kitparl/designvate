"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ContentData } from "@/lib/contentSchema";
import { safeParseContent, zodIssuesToPathMap } from "@/lib/contentSchema";

const STORAGE_KEY = "designvate-content:draft:v2";
const SNAPSHOTS_KEY = "designvate-content:snapshots:v2";

type Snapshot = {
  id: string;
  name: string;
  createdAt: number;
  content: ContentData;
};

function now() {
  return Date.now();
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function clone<T>(v: T): T {
  // structuredClone is available in modern browsers; fallback for safety.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sc = (globalThis as any).structuredClone as undefined | ((x: T) => T);
  if (typeof sc === "function") return sc(v);
  return JSON.parse(JSON.stringify(v)) as T;
}

function setByPath<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".").filter(Boolean);
  const draft = clone(obj) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let cur = draft;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!;
    if (cur[k] === undefined || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]!] = value;
  return draft as T;
}

export type ValidationState = {
  ok: boolean;
  issuesByPath: Record<string, string[]>;
  issueCount: number;
};

export function useContentEditor(defaultContent: ContentData) {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // History for undo/redo
  const [history, setHistory] = useState<ContentData[]>([]);
  const [future, setFuture] = useState<ContentData[]>([]);
  const skipHistoryRef = useRef(false);

  const validation = useMemo<ValidationState>(() => {
    const result = safeParseContent(content);
    if (result.success) return { ok: true, issuesByPath: {}, issueCount: 0 };
    const issuesByPath = zodIssuesToPathMap(result.error.issues);
    return {
      ok: false,
      issuesByPath,
      issueCount: result.error.issues.length,
    };
  }, [content]);

  const pushHistory = useCallback(
    (prev: ContentData) => {
      if (skipHistoryRef.current) return;
      setHistory((h) => {
        const next = h.length >= 50 ? h.slice(1) : h.slice();
        next.push(prev);
        return next;
      });
      setFuture([]);
    },
    [setHistory, setFuture]
  );

  const updatePath = useCallback(
    (path: string, value: unknown) => {
      setContent((prev) => {
        pushHistory(prev);
        const next = setByPath(prev, path, value) as ContentData;
        return next;
      });
      setIsDirty(true);
    },
    [pushHistory]
  );

  const setWholeContent = useCallback(
    (next: ContentData) => {
      setContent((prev) => {
        pushHistory(prev);
        return next;
      });
      setIsDirty(true);
    },
    [pushHistory]
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1]!;
      setFuture((f) => [content, ...f]);
      skipHistoryRef.current = true;
      setContent(prev);
      skipHistoryRef.current = false;
      setIsDirty(true);
      return h.slice(0, -1);
    });
  }, [content]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0]!;
      setHistory((h) => [...h, content]);
      skipHistoryRef.current = true;
      setContent(next);
      skipHistoryRef.current = false;
      setIsDirty(true);
      return f.slice(1);
    });
  }, [content]);

  const saveDraft = useCallback(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 2, updatedAt: now(), content })
    );
    setLastSavedAt(now());
    setIsDirty(false);
  }, [content]);

  const discardDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLastSavedAt(null);
    setIsDirty(false);
  }, []);

  const resetToDefault = useCallback(() => {
    skipHistoryRef.current = true;
    setContent(defaultContent);
    skipHistoryRef.current = false;
    setHistory([]);
    setFuture([]);
    setIsDirty(true);
  }, [defaultContent]);

  // Autosave timer
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!isDirty) return;
      saveDraft();
    }, 3000);
    return () => window.clearInterval(id);
  }, [isDirty, saveDraft]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveDraft();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [redo, saveDraft, undo]);

  const getDraftOnDisk = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = safeJsonParse<{ version: number; updatedAt: number; content: unknown }>(raw);
    if (!parsed || parsed.version !== 2) return null;
    const validated = safeParseContent(parsed.content);
    if (!validated.success) return null;
    return { updatedAt: parsed.updatedAt, content: validated.data };
  }, []);

  const restoreDraft = useCallback(
    (draft: ContentData) => {
      skipHistoryRef.current = true;
      setContent(draft);
      skipHistoryRef.current = false;
      setHistory([]);
      setFuture([]);
      setIsDirty(true);
    },
    []
  );

  const listSnapshots = useCallback((): Snapshot[] => {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    if (!raw) return [];
    const parsed = safeJsonParse<Snapshot[]>(raw);
    if (!parsed || !Array.isArray(parsed)) return [];
    return parsed
      .filter((s) => s && typeof s.id === "string" && typeof s.createdAt === "number")
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt);
  }, []);

  const saveSnapshots = useCallback((snaps: Snapshot[]) => {
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snaps));
  }, []);

  const createSnapshot = useCallback(
    (name: string) => {
      const snaps = listSnapshots();
      const snap: Snapshot = {
        id: `${now()}-${Math.random().toString(16).slice(2)}`,
        name: name.trim() || `Snapshot ${new Date().toLocaleString()}`,
        createdAt: now(),
        content,
      };
      saveSnapshots([snap, ...snaps].slice(0, 20));
      return snap;
    },
    [content, listSnapshots, saveSnapshots]
  );

  const deleteSnapshot = useCallback(
    (id: string) => {
      const snaps = listSnapshots().filter((s) => s.id !== id);
      saveSnapshots(snaps);
    },
    [listSnapshots, saveSnapshots]
  );

  const restoreSnapshot = useCallback(
    (id: string) => {
      const snap = listSnapshots().find((s) => s.id === id);
      if (!snap) return false;
      restoreDraft(snap.content);
      return true;
    },
    [listSnapshots, restoreDraft]
  );

  return {
    content,
    setWholeContent,
    updatePath,
    validation,
    isDirty,
    lastSavedAt,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    undo,
    redo,
    saveDraft,
    discardDraft,
    resetToDefault,
    getDraftOnDisk,
    restoreDraft,
    listSnapshots,
    createSnapshot,
    deleteSnapshot,
    restoreSnapshot,
  };
}

