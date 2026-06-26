'use client';
// Geosite DEVELOPERS — Material Info Panel UI component

interface MaterialInfoPanelProps {
  materialName: string;
  finishSpec: string;
  onClose?: () => void;
}

/**
 * MaterialInfoPanel — displays material name and finish specification
 * on interior surface click. Shown as an overlay panel.
 */
export function MaterialInfoPanel({ materialName, finishSpec, onClose }: MaterialInfoPanelProps) {
  return (
    <div
      data-testid="material-info-panel"
      style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '1.5rem',
        background: 'rgba(0, 0, 0, 0.75)',
        color: '#fff',
        borderRadius: 8,
        padding: '1rem 1.25rem',
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div
        data-testid="material-name"
        style={{ fontWeight: 'bold', fontSize: 16 }}
      >
        {materialName}
      </div>
      <div
        data-testid="finish-spec"
        style={{ fontSize: 13, color: '#ccc' }}
      >
        {finishSpec}
      </div>
      {onClose && (
        <button
          data-testid="close-button"
          onClick={onClose}
          aria-label="Close material info"
          style={{
            alignSelf: 'flex-end',
            minWidth: 44,
            minHeight: 44,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 4,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
            padding: '0 0.75rem',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
