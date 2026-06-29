'use client';
import {
  createContext, useCallback, useContext,
  useEffect, useRef, useState,
} from 'react';
import { DEFAULT_CONTENT, SiteContent, deepMerge, setAtPath } from '@/src/lib/site-content';
import { RICH_IMAGE_PRESET } from '@/src/lib/rich-images';

/* ─── Types ──────────────────────────────────────────────────── */
interface AdminContextType {
  /* auth */
  isAdmin:       boolean;
  showLogin:     boolean;
  openLogin:     () => void;
  closeLogin:    () => void;
  login:         (pw: string) => Promise<boolean>;
  logout:        () => Promise<void>;

  /* editing */
  isEditMode:    boolean;
  toggleEditMode:() => void;

  /* content */
  content:       SiteContent;
  updateField:   (path: string, value: unknown) => void;
  removeItem:    (listPath: string, index: number) => void;
  addItem:       (listPath: string, item: unknown) => void;
  pendingCount:   number;
  isSaving:       boolean;
  lastSaved:      Date | null;
  saveChanges:    () => Promise<void>;
  discardChanges: () => void;
  populateImages: () => void;
}

/* ─── Context ────────────────────────────────────────────────── */
const Ctx = createContext<AdminContextType | null>(null);

export function useAdmin(): AdminContextType {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAdmin must be used inside AdminProvider');
  return c;
}

/* ─── Provider ───────────────────────────────────────────────── */
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin,      setIsAdmin]      = useState(false);
  const [showLogin,    setShowLogin]    = useState(false);
  const [isEditMode,   setIsEditMode]   = useState(false);
  const [content,      setContent]      = useState<SiteContent>(DEFAULT_CONTENT);
  const [savedContent, setSavedContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSaving,     setIsSaving]     = useState(false);
  const [lastSaved,    setLastSaved]    = useState<Date | null>(null);

  /* ── Bootstrap: check session + load KV content ── */
  useEffect(() => {
    (async () => {
      try {
        const [authRes, contentRes] = await Promise.all([
          fetch('/api/admin/auth'),
          fetch('/api/content'),
        ]);

        if (authRes.ok) {
          const { isAdmin: ia } = await authRes.json() as { isAdmin: boolean };
          setIsAdmin(ia);
        }

        if (contentRes.ok) {
          const { content: stored } = await contentRes.json() as { content: Partial<SiteContent> };
          if (stored && Object.keys(stored).length > 0) {
            const merged = deepMerge(DEFAULT_CONTENT, stored as SiteContent);
            setContent(merged);
            setSavedContent(merged);
          }
        }
      } catch { /* silently ignore network errors */ }
    })();
  }, []);

  /* ── Keyboard shortcut: Ctrl+Shift+G → open login ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        setShowLogin(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── Auth ── */
  const login = useCallback(async (pw: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password: pw }),
      });
      if (res.ok) { setIsAdmin(true); setShowLogin(false); return true; }
      return false;
    } catch { return false; }
  }, []);

  const logout = useCallback(async () => {
    try { await fetch('/api/admin/auth', { method: 'DELETE' }); } catch {}
    setIsAdmin(false);
    setIsEditMode(false);
    setPendingCount(0);
  }, []);

  /* ── Edit mode ── */
  const toggleEditMode = useCallback(() => {
    setIsEditMode(m => !m);
  }, []);

  /* ── Content mutations ── */
  const updateField = useCallback((path: string, value: unknown) => {
    setContent(prev => setAtPath(prev, path, value) as SiteContent);
    setPendingCount(n => n + 1);
  }, []);

  const removeItem = useCallback((listPath: string, index: number) => {
    setContent(prev => {
      const parts  = listPath.split('.');
      const getAt  = (obj: unknown, p: string[]): unknown =>
        p.reduce((o, k) => (o as Record<string,unknown>)[k], obj);
      const arr = getAt(prev, parts) as unknown[];
      const updated = arr.filter((_, i) => i !== index);
      return setAtPath(prev, listPath, updated) as SiteContent;
    });
    setPendingCount(n => n + 1);
  }, []);

  const addItem = useCallback((listPath: string, item: unknown) => {
    setContent(prev => {
      const parts = listPath.split('.');
      const getAt = (obj: unknown, p: string[]): unknown =>
        p.reduce((o, k) => (o as Record<string,unknown>)[k], obj);
      const arr = getAt(prev, parts) as unknown[];
      return setAtPath(prev, listPath, [...arr, item]) as SiteContent;
    });
    setPendingCount(n => n + 1);
  }, []);

  /* ── Save / discard ── */
  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      await fetch('/api/content', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ content }),
      });
      setSavedContent(content);
      setPendingCount(0);
      setLastSaved(new Date());
    } catch { /* TODO: show error toast */ }
    finally { setIsSaving(false); }
  }, [content]);

  const discardChanges = useCallback(() => {
    setContent(savedContent);
    setPendingCount(0);
  }, [savedContent]);

  /* ── Populate images (bulk-apply rich preset) ── */
  const populateImages = useCallback(() => {
    setContent(prev => {
      let next = prev as unknown;
      for (const [path, value] of Object.entries(RICH_IMAGE_PRESET)) {
        next = setAtPath(next as SiteContent, path, value);
      }
      return next as SiteContent;
    });
    setPendingCount(n => n + Object.keys(RICH_IMAGE_PRESET).length);
  }, []);

  return (
    <Ctx.Provider value={{
      isAdmin, showLogin,
      openLogin:  () => setShowLogin(true),
      closeLogin: () => setShowLogin(false),
      login, logout,
      isEditMode, toggleEditMode,
      content, updateField, removeItem, addItem,
      pendingCount, isSaving, lastSaved,
      saveChanges, discardChanges, populateImages,
    }}>
      {children}
    </Ctx.Provider>
  );
}
