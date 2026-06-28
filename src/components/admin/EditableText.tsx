'use client';
import { useAdmin } from '@/src/contexts/AdminContext';
import { useEffect, useRef } from 'react';

type Tag = 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'em' | 'strong' | 'li' | 'a';

interface Props {
  /** Dot-notation path into SiteContent, e.g. "landing.tagline" */
  path:       string;
  as?:        Tag;
  style?:     React.CSSProperties;
  className?: string;
  children:   string;
  /** Allow newlines (textarea-like). Default: Enter key blurs. */
  multiline?: boolean;
  /** Extra inline styles applied only in edit mode */
  editStyle?: React.CSSProperties;
}

export function EditableText({
  path, as: Tag = 'span', style, className,
  children, multiline = false, editStyle,
}: Props) {
  const { isEditMode, updateField } = useAdmin();
  const ref       = useRef<HTMLElement>(null);
  const focused   = useRef(false);

  /* Keep DOM in sync with props when not focused */
  useEffect(() => {
    if (ref.current && !focused.current) {
      if (ref.current.innerText !== children) {
        ref.current.innerText = children;
      }
    }
  }, [children]);

  if (!isEditMode) {
    return <Tag style={style} className={className}>{children}</Tag>;
  }

  const editModeStyle: React.CSSProperties = {
    ...style,
    outline:       '1.5px dashed rgba(201,168,76,0.55)',
    outlineOffset: '3px',
    cursor:        'text',
    borderRadius:  '1px',
    minWidth:      '1ch',
    transition:    'outline-color 0.2s ease, background 0.2s ease',
    ...editStyle,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      style={editModeStyle}
      className={className}
      onFocus={e => {
        focused.current = true;
        (e.currentTarget as HTMLElement).style.outlineColor = '#C9A84C';
        (e.currentTarget as HTMLElement).style.background   = 'rgba(201,168,76,0.06)';
      }}
      onBlur={e => {
        focused.current = false;
        const el = e.currentTarget as HTMLElement;
        el.style.outlineColor = 'rgba(201,168,76,0.55)';
        el.style.background   = 'transparent';
        updateField(path, el.innerText.trim());
      }}
      onKeyDown={multiline ? undefined : (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); (e.currentTarget as HTMLElement).blur(); }
      }}
    >
      {children}
    </Tag>
  );
}
