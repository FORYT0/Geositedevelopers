'use client';
import { useAdmin } from '@/src/contexts/AdminContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* ─── Shared arrow button style ───────────────────────────── */
function arrowBtnStyle(
  side: 'left' | 'right',
  visible: boolean,
): React.CSSProperties {
  return {
    position:      'absolute',
    top:           '50%',
    [side]:        10,
    transform:     'translateY(-50%)',
    width:         32,
    height:        32,
    borderRadius:  '50%',
    background:    'rgba(8,8,6,0.62)',
    backdropFilter:'blur(6px)',
    border:        '1px solid rgba(201,168,76,0.3)',
    color:         '#C9A84C',
    fontSize:      18,
    lineHeight:    '1',
    display:       'flex',
    alignItems:    'center',
    justifyContent:'center',
    cursor:        'pointer',
    zIndex:        10,
    opacity:       visible ? 1 : 0,
    pointerEvents: visible ? 'all' : 'none',
    transition:    'opacity 0.25s ease',
    userSelect:    'none',
    padding:       '0',
  } as React.CSSProperties;
}

/* ─── Slideshow (view-mode only) ─────────────────────────── */
function Slideshow({
  images, style, alt, className,
}: {
  images:    string[];
  style?:    React.CSSProperties;
  alt:       string;
  className?:string;
}) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = images.length;

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(i => (i + 1) % n);
    }, 6000);
  }, [n]);

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval]);

  const go = useCallback((dir: number) => {
    setCurrent(i => (i + dir + n) % n);
    resetInterval();
  }, [n, resetInterval]);

  /* Container inherits caller's style for position/dimensions */
  const containerStyle: React.CSSProperties = {
    ...style,
    position: style?.position ?? 'relative',
    overflow: 'hidden',
  };

  return (
    <div
      className={className}
      style={containerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Crossfading images — same behaviour as LandingSection hero */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${alt} — ${i + 1}`}
          draggable={false}
          style={{
            position:       'absolute',
            inset:          0,
            width:          '100%',
            height:         '100%',
            objectFit:      'cover',
            objectPosition: 'center',
            opacity:        i === current ? 1 : 0,
            transition:     'opacity 1.8s ease',
            display:        'block',
          }}
        />
      ))}

      {/* Prev arrow */}
      <button
        onClick={e => { e.stopPropagation(); go(-1); }}
        style={arrowBtnStyle('left', hovered)}
        aria-label="Previous image"
      >‹</button>

      {/* Next arrow */}
      <button
        onClick={e => { e.stopPropagation(); go(1); }}
        style={arrowBtnStyle('right', hovered)}
        aria-label="Next image"
      >›</button>

      {/* Dot indicators */}
      <div
        style={{
          position:      'absolute',
          bottom:        10,
          left:          '50%',
          transform:     'translateX(-50%)',
          display:       'flex',
          gap:           5,
          zIndex:        10,
          opacity:       hovered ? 1 : 0,
          transition:    'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        {images.map((_, i) => (
          <div
            key={i}
            style={{
              width:      i === current ? 14 : 5,
              height:     5,
              borderRadius:3,
              background: i === current ? '#C9A84C' : 'rgba(255,255,255,0.4)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── URL-picker modal ────────────────────────────────────── */
function ImagePickerModal({
  initialSrc,
  title,
  onApply,
  onClose,
}: {
  initialSrc: string;
  title:      string;
  onApply:    (url: string) => void;
  onClose:    () => void;
}) {
  const [url, setUrl] = useState(initialSrc);

  return createPortal(
    <div
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        99999,
        background:    'rgba(8,8,6,0.82)',
        backdropFilter:'blur(6px)',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#0D0D0D',
          border:     '1px solid rgba(201,168,76,0.25)',
          padding:    '40px 44px',
          width:      560,
          maxWidth:   '90vw',
          boxShadow:  '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>
              Edit Image
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '1.6rem', color: '#F8F4EE', letterSpacing: '-0.02em' }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(248,244,238,0.4)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
          >✕</button>
        </div>

        {/* Preview */}
        {url && (
          <div style={{ width: '100%', height: 160, marginBottom: 20, overflow: 'hidden', background: '#1A1814' }}>
            <img
              src={url}
              alt="preview"
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
            width:        '100%',
            boxSizing:    'border-box',
            background:   '#1A1814',
            color:        '#F8F4EE',
            border:       '1px solid rgba(201,168,76,0.3)',
            padding:      '14px 16px',
            fontFamily:   'var(--font-body)',
            fontSize:     '0.82rem',
            outline:      'none',
            marginBottom: 24,
          }}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => onApply(url)}
            style={{
              flex:          1,
              background:    '#C9A84C',
              color:         '#0D0D0D',
              border:        'none',
              padding:       '14px 24px',
              fontFamily:    'var(--font-body)',
              fontSize:      '0.44rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              fontWeight:    600,
              cursor:        'pointer',
              transition:    'background 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8C97A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C'; }}
          >
            Apply
          </button>
          <button
            onClick={onClose}
            style={{
              padding:       '14px 24px',
              background:    'transparent',
              border:        '1px solid rgba(248,244,238,0.15)',
              color:         'rgba(248,244,238,0.4)',
              fontFamily:    'var(--font-body)',
              fontSize:      '0.44rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              cursor:        'pointer',
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
interface Props {
  path:       string;
  src:        string | string[];
  alt:        string;
  style?:     React.CSSProperties;
  className?: string;
  draggable?: boolean;
}

export function EditableImage({ path, src, alt, style, className, draggable }: Props) {
  const { isEditMode, updateField } = useAdmin();
  const [editIndex,  setEditIndex]  = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [addMode,    setAddMode]    = useState(false);
  const [mounted,    setMounted]    = useState(false);

  const images  = Array.isArray(src) ? src : [src];
  const isMulti = images.length > 1;

  useEffect(() => { setMounted(true); }, []);

  /* Keep editIndex in bounds when array shrinks */
  useEffect(() => {
    if (editIndex >= images.length) setEditIndex(Math.max(0, images.length - 1));
  }, [images.length, editIndex]);

  /* ── View mode ── */
  if (!isEditMode) {
    if (isMulti) {
      return <Slideshow images={images} style={style} alt={alt} className={className} />;
    }
    return (
      <img
        src={images[0]}
        alt={alt}
        style={style}
        className={className}
        draggable={draggable}
      />
    );
  }

  /* ── Edit mode helpers ── */
  const currentSrc = images[editIndex] ?? '';

  const handleReplace = (url: string) => {
    if (!url.trim()) return;
    if (images.length === 1) {
      updateField(path, url);
    } else {
      updateField(path, images.map((img, i) => i === editIndex ? url : img));
    }
    setShowPicker(false);
    setAddMode(false);
  };

  const handleAdd = (url: string) => {
    if (!url.trim()) return;
    const next = [...images, url];
    updateField(path, next);
    setEditIndex(next.length - 1);
    setShowPicker(false);
    setAddMode(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    const next = images.filter((_, i) => i !== editIndex);
    /* Collapse back to plain string when only one image remains */
    updateField(path, next.length === 1 ? next[0] : next);
    setEditIndex(Math.min(editIndex, next.length - 1));
  };

  const openReplace = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddMode(false);
    setShowPicker(true);
  };

  const openAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddMode(true);
    setShowPicker(true);
  };

  /* Edit-mode wrapper inherits caller style for position/size */
  const wrapStyle: React.CSSProperties = {
    ...style,
    position: style?.position ?? 'relative',
    overflow: 'hidden',
  };

  return (
    <>
      <div style={wrapStyle} className={className}>

        {/* Current image */}
        <img
          src={currentSrc}
          alt={alt}
          draggable={draggable}
          onClick={openReplace}
          style={{
            display:        'block',
            width:          '100%',
            height:         '100%',
            objectFit:      'cover',
            objectPosition: 'center',
            outline:        '2px dashed rgba(201,168,76,0.5)',
            outlineOffset:  '-2px',
            cursor:         'pointer',
            transition:     'outline-color 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.outlineColor = '#C9A84C'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.outlineColor = 'rgba(201,168,76,0.5)'; }}
          title="Click to replace"
        />

        {/* Camera badge — centre overlay */}
        <div
          onClick={openReplace}
          style={{
            position:       'absolute',
            top:            '50%',
            left:           '50%',
            transform:      'translate(-50%, -50%)',
            background:     'rgba(201,168,76,0.9)',
            borderRadius:   '50%',
            width:          44,
            height:         44,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            pointerEvents:  'all',
            zIndex:         5,
            boxShadow:      '0 4px 16px rgba(0,0,0,0.4)',
          }}
          title="Replace image"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9.5" r="2.8" stroke="#0D0D0D" strokeWidth="1.5"/>
            <path d="M2 7c.5-1 1.5-1.5 2.5-1.5L6 4h6l1.5 1.5c1 0 2 .5 2.5 1.5v5.5c0 1-.8 1.5-1.5 1.5H3.5C2.7 14 2 13.5 2 12.5V7z" stroke="#0D0D0D" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* Add image — top-right gold + */}
        <button
          onClick={openAdd}
          title="Add another image (creates slideshow)"
          style={{
            position:       'absolute',
            top:            8,
            right:          8,
            width:          26,
            height:         26,
            borderRadius:   '50%',
            background:     'rgba(201,168,76,0.9)',
            border:         'none',
            color:          '#0D0D0D',
            fontSize:       16,
            fontWeight:     700,
            cursor:         'pointer',
            zIndex:         10,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            boxShadow:      '0 2px 8px rgba(0,0,0,0.4)',
            lineHeight:     '1',
            padding:        '0',
          }}
        >+</button>

        {/* Multi-image controls — visible only when 2+ images */}
        {isMulti && (
          <>
            {/* Remove current — top-left red × */}
            <button
              onClick={handleRemove}
              title="Remove this image from slideshow"
              style={{
                position:       'absolute',
                top:            8,
                left:           8,
                width:          26,
                height:         26,
                borderRadius:   '50%',
                background:     'rgba(200,50,50,0.82)',
                border:         'none',
                color:          '#fff',
                fontSize:       15,
                fontWeight:     700,
                cursor:         'pointer',
                zIndex:         10,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                boxShadow:      '0 2px 8px rgba(0,0,0,0.4)',
                lineHeight:     '1',
                padding:        '0',
              }}
            >×</button>

            {/* Prev slide */}
            {editIndex > 0 && (
              <button
                onClick={e => { e.stopPropagation(); setEditIndex(i => i - 1); }}
                title="Previous image"
                style={{
                  position:       'absolute',
                  top:            '50%',
                  left:           8,
                  transform:      'translateY(-50%)',
                  width:          28,
                  height:         28,
                  borderRadius:   '50%',
                  background:     'rgba(8,8,6,0.7)',
                  border:         '1px solid rgba(201,168,76,0.35)',
                  color:          '#C9A84C',
                  fontSize:       16,
                  cursor:         'pointer',
                  zIndex:         10,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  lineHeight:     '1',
                  padding:        '0',
                }}
              >‹</button>
            )}

            {/* Next slide */}
            {editIndex < images.length - 1 && (
              <button
                onClick={e => { e.stopPropagation(); setEditIndex(i => i + 1); }}
                title="Next image"
                style={{
                  position:       'absolute',
                  top:            '50%',
                  right:          8,
                  transform:      'translateY(-50%)',
                  width:          28,
                  height:         28,
                  borderRadius:   '50%',
                  background:     'rgba(8,8,6,0.7)',
                  border:         '1px solid rgba(201,168,76,0.35)',
                  color:          '#C9A84C',
                  fontSize:       16,
                  cursor:         'pointer',
                  zIndex:         10,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  lineHeight:     '1',
                  padding:        '0',
                }}
              >›</button>
            )}

            {/* Slide counter — bottom-centre */}
            <div
              style={{
                position:       'absolute',
                bottom:         8,
                left:           '50%',
                transform:      'translateX(-50%)',
                background:     'rgba(8,8,6,0.68)',
                backdropFilter: 'blur(4px)',
                padding:        '3px 10px',
                borderRadius:   10,
                fontFamily:     'var(--font-body)',
                fontSize:       '0.38rem',
                letterSpacing:  '0.25em',
                color:          '#C9A84C',
                zIndex:         10,
                whiteSpace:     'nowrap',
              }}
            >
              {editIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* URL-picker modal */}
      {mounted && showPicker && (
        <ImagePickerModal
          initialSrc={addMode ? '' : currentSrc}
          title={addMode ? 'Add Image to Slideshow' : 'Replace Photo'}
          onApply={addMode ? handleAdd : handleReplace}
          onClose={() => { setShowPicker(false); setAddMode(false); }}
        />
      )}
    </>
  );
}
