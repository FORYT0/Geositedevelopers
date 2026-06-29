'use client';
import { useAdmin } from '@/src/contexts/AdminContext';
import { useEffect, useState } from 'react';

export function AdminToolbar() {
  const {
    isAdmin, isEditMode, toggleEditMode,
    pendingCount, isSaving, lastSaved,
    saveChanges, discardChanges, logout, openLogin, populateImages,
  } = useAdmin();

  const [visible,   setVisible]   = useState(false);
  const [saveAnim,  setSaveAnim]  = useState(false);

  /* Animate in after mount */
  useEffect(() => {
    if (isAdmin) setTimeout(() => setVisible(true), 120);
    else setVisible(false);
  }, [isAdmin]);

  /* Success flash */
  useEffect(() => {
    if (lastSaved) {
      setSaveAnim(true);
      const t = setTimeout(() => setSaveAnim(false), 2000);
      return () => clearTimeout(t);
    }
  }, [lastSaved]);

  /* ── Login nudge (non-admin) ── */
  if (!isAdmin) {
    return (
      <button
        onClick={openLogin}
        title="Admin Login (Ctrl+Shift+G)"
        style={{
          position:   'fixed',
          bottom:     24,
          right:      24,
          zIndex:     9000,
          width:      40,
          height:     40,
          borderRadius: '50%',
          background:  'rgba(13,13,13,0.85)',
          border:      '1px solid rgba(201,168,76,0.2)',
          color:       'rgba(201,168,76,0.45)',
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'center',
          cursor:      'pointer',
          backdropFilter: 'blur(8px)',
          transition:  'border-color 0.3s ease, color 0.3s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'rgba(201,168,76,0.65)';
          el.style.color       = '#C9A84C';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'rgba(201,168,76,0.2)';
          el.style.color       = 'rgba(201,168,76,0.45)';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M4.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>
    );
  }

  /* ── Admin toolbar ── */
  return (
    <div
      style={{
        position:    'fixed',
        bottom:      visible ? 0 : -80,
        left:        '50%',
        transform:   'translateX(-50%)',
        zIndex:      9000,
        display:     'flex',
        alignItems:  'center',
        gap:         2,
        background:  'rgba(8,8,6,0.97)',
        border:      '1px solid rgba(201,168,76,0.2)',
        borderBottom:'none',
        backdropFilter: 'blur(20px)',
        boxShadow:   '0 -4px 40px rgba(0,0,0,0.5)',
        borderRadius:'4px 4px 0 0',
        overflow:    'hidden',
        transition:  'bottom 0.5s cubic-bezier(0.16,1,0.3,1)',
        minWidth:    680,
      }}
    >
      {/* Gold top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

      {/* Edit mode toggle */}
      <ToolbarBtn
        active={isEditMode}
        onClick={toggleEditMode}
        icon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 2L12 4.5 4.5 12H2v-2.5L9.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M8 3.5L10.5 6" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        }
        label={isEditMode ? 'Editing' : 'Edit Mode'}
        accent={isEditMode}
      />

      {/* Separator */}
      <div style={{ width: 1, height: 28, background: 'rgba(248,244,238,0.08)', flexShrink: 0 }} />

      {/* Change count */}
      <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', gap: 8, minWidth: 130 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: pendingCount > 0 ? '#C9A84C' : 'rgba(248,244,238,0.15)',
          transition: 'background 0.3s ease',
          flexShrink: 0,
        }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: pendingCount > 0 ? 'rgba(248,244,238,0.65)' : 'rgba(248,244,238,0.25)', transition: 'color 0.3s ease', whiteSpace: 'nowrap' }}>
          {saveAnim ? '✓ Saved' : pendingCount > 0 ? `${pendingCount} change${pendingCount > 1 ? 's' : ''}` : 'No changes'}
        </span>
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 28, background: 'rgba(248,244,238,0.08)', flexShrink: 0 }} />

      {/* Save */}
      <ToolbarBtn
        disabled={pendingCount === 0 || isSaving}
        onClick={saveChanges}
        icon={
          isSaving
            ? <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>↻</span>
            : <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 9.5L5 12.5 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
        }
        label={isSaving ? 'Saving…' : 'Save All'}
        accent
      />

      {/* Discard */}
      <ToolbarBtn
        disabled={pendingCount === 0}
        onClick={discardChanges}
        icon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        }
        label="Discard"
      />

      {/* Separator */}
      <div style={{ width: 1, height: 28, background: 'rgba(248,244,238,0.08)', flexShrink: 0 }} />

      {/* Populate Images */}
      <ToolbarBtn
        onClick={populateImages}
        icon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="3" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="4.5" cy="6.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
            <path d="M1 10l3-3 2.5 2.5L9 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 1v3M8 2.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        }
        label="Populate Images"
      />

      {/* Separator */}
      <div style={{ width: 1, height: 28, background: 'rgba(248,244,238,0.08)', flexShrink: 0 }} />

      {/* Logout */}
      <ToolbarBtn
        onClick={logout}
        icon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.5 7H12M12 7L9.5 4.5M12 7l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 2H3a1 1 0 00-1 1v8a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        }
        label="Logout"
      />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Toolbar button ──────────────────────────────────────── */
function ToolbarBtn({
  onClick, icon, label, active = false, accent = false, disabled = false,
}: {
  onClick:    () => void;
  icon:       React.ReactNode;
  label:      string;
  active?:    boolean;
  accent?:    boolean;
  disabled?:  boolean;
}) {
  const [hov, setHov] = useState(false);

  const color = active || (accent && !disabled) ? '#C9A84C'
    : disabled ? 'rgba(248,244,238,0.2)'
    : hov      ? 'rgba(248,244,238,0.8)'
    : 'rgba(248,244,238,0.45)';

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:    'flex', alignItems: 'center', gap: 8,
        padding:    '14px 18px',
        background: active ? 'rgba(201,168,76,0.1)' : hov && !disabled ? 'rgba(248,244,238,0.04)' : 'transparent',
        border:     'none',
        color,
        cursor:     disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.38em', textTransform: 'uppercase', fontWeight: active ? 600 : 400 }}>
        {label}
      </span>
    </button>
  );
}
