'use client';
import { useAdmin } from '@/src/contexts/AdminContext';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function LoginModal() {
  const { showLogin, closeLogin, login } = useAdmin();
  const [pw,      setPw]      = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showLogin) {
      setPw(''); setError('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [showLogin]);

  if (!showLogin) return null;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!pw.trim()) return;
    setLoading(true); setError('');
    const ok = await login(pw);
    setLoading(false);
    if (!ok) { setError('Incorrect password. Try again.'); setPw(''); inputRef.current?.focus(); }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100000,
        background: 'rgba(8,8,6,0.88)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) closeLogin(); }}
    >
      <div
        style={{
          background:  '#0D0D0D',
          border:      '1px solid rgba(201,168,76,0.22)',
          padding:     '52px 56px',
          width:       460,
          maxWidth:    '90vw',
          boxShadow:   '0 40px 100px rgba(0,0,0,0.8)',
          position:    'relative',
        }}
      >
        {/* Gold corner accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 32, borderTop: '1.5px solid #C9A84C', borderLeft: '1.5px solid #C9A84C' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderBottom: '1.5px solid #C9A84C', borderRight: '1.5px solid #C9A84C' }} />

        {/* Close */}
        <button
          onClick={closeLogin}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: 'none', border: 'none',
            color: 'rgba(248,244,238,0.3)', fontSize: 18, cursor: 'pointer',
          }}
        >✕</button>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.42rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>
            Geosite DEVELOPERS
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '2rem', color: '#F8F4EE', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Admin Access
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(248,244,238,0.3)', marginTop: 12, lineHeight: 1.7 }}>
            Enter your admin password to enable site editing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.35)', display: 'block', marginBottom: 10 }}>
            Password
          </label>
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#1A1814', color: '#F8F4EE',
              border: `1px solid ${error ? 'rgba(255,80,80,0.5)' : 'rgba(201,168,76,0.25)'}`,
              padding: '16px 18px',
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              outline: 'none', letterSpacing: '0.15em',
              marginBottom: 8,
              transition: 'border-color 0.2s ease',
            }}
            onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = '#C9A84C'; }}
            onBlur={e  => { (e.currentTarget as HTMLInputElement).style.borderColor = error ? 'rgba(255,80,80,0.5)' : 'rgba(201,168,76,0.25)'; }}
          />
          {error && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,100,100,0.85)', marginBottom: 20 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !pw.trim()}
            style={{
              width: '100%', marginTop: error ? 0 : 16,
              padding: '16px',
              background: loading ? 'rgba(201,168,76,0.5)' : '#C9A84C',
              color: '#0D0D0D', border: 'none',
              fontFamily: 'var(--font-body)', fontSize: '0.44rem',
              letterSpacing: '0.45em', textTransform: 'uppercase',
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {loading ? 'Verifying…' : 'Enter Studio'}
          </button>
        </form>

        {/* Hint */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.38rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.15)', marginTop: 28, textAlign: 'center' }}>
          Shortcut: Ctrl + Shift + G
        </p>
      </div>
    </div>,
    document.body
  );
}
