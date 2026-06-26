'use client';

/**
 * LoadingSkeleton — fallback UI while models are loading.
 * Shows thumbnail and progress indicator during proxy/full load phases.
 */
export interface LoadingSkeletonProps {
  thumbnailPath?: string;
  progress?: number;
  phase?: 'proxy' | 'full';
}

export function LoadingSkeleton({ thumbnailPath, progress = 0, phase = 'proxy' }: LoadingSkeletonProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-900">
      {/* Thumbnail background */}
      {thumbnailPath && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${thumbnailPath}')` }}
        />
      )}

      {/* Skeleton overlay */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Pulsing geometry placeholder */}
        <div className="w-24 h-24 rounded-lg bg-gray-700 animate-pulse" />

        {/* Progress text */}
        <div className="text-center">
          <p className="text-white/70 text-sm mb-2">
            {phase === 'proxy' ? 'Loading preview...' : 'Loading full model...'}
          </p>
          <p className="text-white text-xs">{Math.round(progress * 100)}%</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
