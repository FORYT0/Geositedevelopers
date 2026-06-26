'use client';
// Geosite DEVELOPERS — Error card with descriptive message and retry button

interface ErrorCardProps {
  errorMessage: string;
  onRetry: () => void;
}

/**
 * ErrorCard — shown when asset loading fails.
 * Displays a human-readable error message and a "Retry" button.
 */
export function ErrorCard({ errorMessage, onRetry }: ErrorCardProps) {
  return (
    <div
      data-testid="error-card"
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem',
        background: '#fff3f3',
        border: '1px solid #ffcccc',
        borderRadius: 8,
        maxWidth: 400,
      }}
    >
      <span style={{ fontSize: 24 }} aria-hidden="true">⚠️</span>
      <p
        data-testid="error-message"
        style={{ margin: 0, color: '#cc0000', textAlign: 'center', fontSize: 14 }}
      >
        {errorMessage}
      </p>
      <button
        data-testid="retry-button"
        onClick={onRetry}
        style={{
          minWidth: 44,
          minHeight: 44,
          padding: '0.5rem 1.5rem',
          background: '#0066cc',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        Retry
      </button>
    </div>
  );
}
