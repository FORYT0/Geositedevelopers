'use client';
// Geosite DEVELOPERS — Model Catalog UI component
import { useState } from 'react';
import { useStore } from '@/src/store';
import type { SceneConfig } from '@/src/lib/scene-config';

type CategoryFilter = 'all' | 'exterior' | 'interior';

interface ModelCatalogProps {
  onSelectScene?: (sceneId: string) => void;
}

/**
 * ModelCatalog — grid of scene cards with thumbnail, title, and category badge.
 * Supports exterior/interior category filtering.
 * Accessible while a scene is active; scene switching without full page reload.
 */
export function ModelCatalog({ onSelectScene }: ModelCatalogProps) {
  const scenes = useStore((s) => s.scenes);
  const activeSceneId = useStore((s) => s.activeSceneId);
  const setActiveScene = useStore((s) => s.setActiveScene);
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const filteredScenes = filter === 'all'
    ? scenes
    : scenes.filter((s) => s.category === filter);

  const handleSelect = (scene: SceneConfig) => {
    setActiveScene(scene.id);
    onSelectScene?.(scene.id);
  };

  return (
    <div data-testid="model-catalog" className="p-4">
      {/* Category filter controls */}
      <div
        data-testid="category-filter"
        role="group"
        aria-label="Filter by category"
        className="flex gap-2 mb-4"
      >
        {(['all', 'exterior', 'interior'] as CategoryFilter[]).map((cat) => (
          <button
            key={cat}
            data-testid={`filter-${cat}`}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`min-w-[44px] min-h-[44px] px-4 py-2 rounded border-none cursor-pointer ${
              filter === cat ? 'bg-gray-800 text-white font-bold' : 'bg-gray-200 text-gray-800 font-normal'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Scene grid */}
      <div
        data-testid="scene-grid"
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
      >
        {filteredScenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            isActive={scene.id === activeSceneId}
            onSelect={() => handleSelect(scene)}
          />
        ))}
      </div>

      {filteredScenes.length === 0 && (
        <p data-testid="no-results" className="text-gray-500 text-center">
          No scenes found for the selected category.
        </p>
      )}
    </div>
  );
}

interface SceneCardProps {
  scene: SceneConfig;
  isActive: boolean;
  onSelect: () => void;
}

function SceneCard({ scene, isActive, onSelect }: SceneCardProps) {
  return (
    <button
      data-testid={`scene-card-${scene.id}`}
      onClick={onSelect}
      aria-label={`Select ${scene.title}`}
      aria-current={isActive ? 'true' : undefined}
      className={`min-w-[44px] min-h-[44px] flex flex-col rounded-lg overflow-hidden cursor-pointer p-0 text-left ${
        isActive 
          ? 'bg-blue-50 border-2 border-blue-600' 
          : 'bg-white border border-gray-300'
      }`}
    >
      {/* Thumbnail */}
      <img
        data-testid={`thumbnail-${scene.id}`}
        src={scene.thumbnailPath}
        alt={`${scene.title} thumbnail`}
        className="w-full h-[120px] object-cover"
        loading="lazy"
      />

      <div className="p-3 w-full">
        {/* Title */}
        <div
          data-testid={`title-${scene.id}`}
          className="font-bold mb-1 text-sm"
        >
          {scene.title}
        </div>

        {/* Category badge */}
        <span
          data-testid={`category-badge-${scene.id}`}
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
            scene.category === 'exterior' 
              ? 'bg-green-50 text-green-800' 
              : 'bg-blue-50 text-blue-800'
          }`}
        >
          {scene.category}
        </span>
      </div>
    </button>
  );
}

/**
 * Pure filter function — testable without React.
 */
export function filterByCategory(
  scenes: SceneConfig[],
  category: 'exterior' | 'interior'
): SceneConfig[] {
  return scenes.filter((s) => s.category === category);
}
