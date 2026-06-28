'use client';
import { useAdmin } from '@/src/contexts/AdminContext';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  path:         string;
  src:          string;
  alt:          string;
  style?:       React.CSSProperties;
  className?:   string;
  draggable?:   boolean;
}

/* ─── URL-picker modal ────────────────────────────────────── */
function ImagePickerModal({
  initialSrc,
  onApply,
  onClose,
}: { initialSrc: string; onApply: (url: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState(initialSrc);

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(8,8,6,0.82)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#0D0D0D',
          border: '1px solid rgba(201,168,76,0.25)',
          padding: '40px 44px',
          width: 560,
          maxWidth: '90vw',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>
              Edit Image
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '1.6rem', color: '#F8F4EE', letterSpacing: '-0.02em' }}>
              Replace Photo
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(248,244,238,0.4)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Preview */}
        {url && (
          <div style={{ width: '100%', height: 160, marginBottom: 20, overflow: 'hidden', background: '#1A1814' }}>
            <img
              src={url} alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
              onLoad={e =>  { (e.currentTarget as HTMLImageElement).style.opacity = '1'; }}
            />
          </div>
        )}

        {/* URL input */}
        <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.4)', display: 'block', marginBottom: 10 }}>
          Image URL
        </label>
        <input
          autoFocus
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://images.unsplash.com/photo-... or /renders/..."
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#1A1814', color: '#F8F4EE',
            border: '1px solid rgba(201,168,76,0.3)',
            padding: '14px 16px',
            fontFamily: 'var(--font-body)', fontSize: '0.82rem',
            outline: 'none', marginBottom: 24,
          }}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => onApply(url)}
            style={{
              flex: 1,
              background: '#C9A84C', color: '#0D0D0D',
              border: 'none', padding: '14px 24px',
              fontFamily: 'var(--font-body)', fontSize: '0.44rem',
              letterSpacing: '0.4em', textTransform: 'uppercase',
              fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8C97A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C'; }}
          >
            Apply
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '14px 24px',
              background: 'transparent',
              border: '1px solid rgba(248,244,238,0.15)',
              color: 'rgba(248,244,238,0.4)',
              fontFamily: 'var(--font-body)', fontSize: '0.44rem',
              letterSpacing: '0.4em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Editable image ──────────────────────────────────────── */
export function EditableImage({ path, src, alt, style, className, draggable }: Props) {
  const { isEditMode, updateField } = useAdmin();
  const [showPicker, setShowPicker] = useState(false);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!isEditMode) {
    return <img src={src} alt={alt} style={style} className={className} draggable={draggable} />;
  }

  return (
    <>
      <img
        src={src} alt={alt} draggable={draggable} className={className}
        style={{
          ...style,
          outline:       '2px dashed rgba(201,168,76,0.5)',
          outlineOffset: '-2px',
          cursor:        'pointer',
          transition:    (style?.transition ?? '') + ', outline-color 0.2s ease',
        }}
        onClick={() => setShowPicker(true)}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.outlineColor = '#C9A84C'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.outlineColor = 'rgba(201,168,76,0.5)'; }}
        title="Click to change image"
      />

      {/* Camera badge */}
      <div
        onClick={() => setShowPicker(true)}
        style={{
          position:       'absolute',
          top:            '50%', left: '50%',
          transform:      'translate(-50%, -50%)',
          background:     'rgba(201,168,76,0.9)',
          borderRadius:   '50%',
          width:          44, height: 44,
          display:        'flex', alignItems: 'center', justifyContent: 'center',
          cursor:         'pointer',
          pointerEvents:  'all',
          zIndex:         5,
          boxShadow:      '0 4px 16px rgba(0,0,0,0.4)',
        }}
        title="Change image"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9.5" r="2.8" stroke="#0D0D0D" strokeWidth="1.5"/>
          <path d="M2 7c.5-1 1.5-1.5 2.5-1.5L6 4h6l1.5 1.5c1 0 2 .5 2.5 1.5v5.5c0 1-.8 1.5-1.5 1.5H3.5C2.7 14 2 13.5 2 12.5V7z" stroke="#0D0D0D" strokeWidth="1.5"/>
        </svg>
      </div>

      {mounted && showPicker && (
        <ImagePickerModal
          initialSrc={src}
          onApply={url => { updateField(path, url); setShowPicker(false); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
