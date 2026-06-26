'use client';
// Geosite DEVELOPERS — Loading indicator with progress bar for chunked asset loading

interface LoadingIndicatorProps {
  /** Progress value from 0.0 to 1.0 */
  progress: number;
}

/**
 * LoadingIndicator — shown during chunked asset loading
 * (when AssetLoaderState.status is 'loading-full' or 'loading-proxy').
 */
export function LoadingIndicator({ progress }: LoadingIndicatorProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const percentage = Math.round(clampedProgress * 100);

  return (
    <div
      data-testid="loading-indicator"
      role="status"
      aria-label={`Loading ${percentage}%`}
      className="flex flex-col items-center gap-2 p-4 min-w-[44px] min-h-[44px]"
    >
      <div className="w-full max-w-[300px] h-2 bg-gray-200 rounded overflow-hidden">
        <div
          data-testid="progress-bar"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full bg-blue-600 rounded transition-all duration-200 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{percentage}%</span>
    </div>
  );
}
