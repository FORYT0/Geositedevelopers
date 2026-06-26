'use client';
// Geosite DEVELOPERS — Lighting Preset Toggle UI component
import type { LightingPreset } from '../../lib/scene-config';

interface LightingPresetToggleProps {
  presets: LightingPreset[];
  activePresetId: string;
  onSelect: (id: string) => void;
}

/**
 * LightingPresetToggle — renders a button for each lighting preset (e.g. Day/Night).
 * Highlights the active preset. Used for exterior scene day/night switching.
 */
export function LightingPresetToggle({
  presets,
  activePresetId,
  onSelect,
}: LightingPresetToggleProps) {
  return (
    <div
      data-testid="lighting-preset-toggle"
      role="group"
      aria-label="Lighting preset"
      style={{ display: 'flex', gap: '0.5rem' }}
    >
      {presets.map((preset) => {
        const isActive = preset.id === activePresetId;
        return (
          <button
            key={preset.id}
            data-testid={`preset-btn-${preset.id}`}
            onClick={() => onSelect(preset.id)}
            aria-pressed={isActive}
            style={{
              minWidth: 44,
              minHeight: 44,
              padding: '0.5rem 1rem',
              background: isActive ? '#333' : '#eee',
              color: isActive ? '#fff' : '#333',
              border: isActive ? '2px solid #333' : '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: isActive ? 'bold' : 'normal',
            }}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
