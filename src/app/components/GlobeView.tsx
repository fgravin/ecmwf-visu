import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  MultiChannelSeriesTiledLayer,
  Colormap,
  ColormapDescriptionLibrary,
  type MultiChannelSeriesTiledLayerSpecification,
} from 'maplibre-gl-shader-layer';
import { BasemapLayer } from '../types';

const TEMPERATURE_TILESET_URL = '/demo-tilesets/temperature_2m/index.json';
const TEMPERATURE_TILE_PREFIX = '/temperature-tiles/';

interface GlobeViewProps {
  basemapLayers: BasemapLayer[];
  onMapLoad?: (map: maplibregl.Map) => void;
}

export function GlobeView({ basemapLayers, onMapLoad }: GlobeViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const temperatureLayer = useRef<MultiChannelSeriesTiledLayer | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with globe projection
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#1a1a2e',
            },
          },
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      },
      center: [0, 20],
      zoom: 1.5,
      maxPitch: 85,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-right');

    // Enable globe projection after style loads
    map.current.on('style.load', () => {
      map.current?.setProjection({ type: 'globe' });
    });

    // Add temperature layer and notify parent when map is loaded
    map.current.on('load', async () => {
      if (!map.current) return;

      // Fetch the temperature dataset specification
      try {
        const response = await fetch(TEMPERATURE_TILESET_URL);
        const seriesInfo = (await response.json()) as MultiChannelSeriesTiledLayerSpecification;

        const colormap = Colormap.fromColormapDescription(
          ColormapDescriptionLibrary.turbo,
          { min: -25, max: 40, reverse: false },
        );

        temperatureLayer.current = new MultiChannelSeriesTiledLayer('temperature-layer', {
          datasetSpecification: seriesInfo,
          colormap,
          colormapGradient: true,
          tileUrlPrefix: TEMPERATURE_TILE_PREFIX,
        });

        temperatureLayer.current.setOpacity(0.7);
        map.current.addLayer(temperatureLayer.current);
      } catch (err) {
        console.error('Failed to load temperature data:', err);
      }

      if (onMapLoad) {
        onMapLoad(map.current);
      }
    });

    // Enable globe rotation
    let userInteracting = false;

    function spinGlobe() {
      if (!map.current || userInteracting) return;
      const center = map.current.getCenter();
      center.lng -= 0.1;
      map.current.easeTo({ center, duration: 100, easing: (t) => t });
      requestAnimationFrame(spinGlobe);
    }

    spinGlobe();

    map.current.on('mousedown', () => {
      userInteracting = true;
    });

    map.current.on('mouseup', () => {
      userInteracting = false;
      setTimeout(() => spinGlobe(), 1000);
    });

    map.current.on('dragend', () => {
      userInteracting = false;
      setTimeout(() => spinGlobe(), 1000);
    });

    map.current.on('pitchend', () => {
      userInteracting = false;
      setTimeout(() => spinGlobe(), 1000);
    });

    map.current.on('rotateend', () => {
      userInteracting = false;
      setTimeout(() => spinGlobe(), 1000);
    });

    return () => {
      map.current?.remove();
      map.current = null;
      temperatureLayer.current = null;
    };
  }, [onMapLoad]);

  // Update layers visibility based on basemap configuration
  useEffect(() => {
    if (!map.current) return;

    basemapLayers.forEach((layer) => {
      console.log(`Layer ${layer.name} is ${layer.enabled ? 'enabled' : 'disabled'}`);
    });
  }, [basemapLayers]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {/* Missing data indicator overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-yellow-500/90 text-black text-xs px-3 py-1 rounded-full flex items-center gap-2 opacity-0 transition-opacity" id="missing-data-indicator">
          <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
          Missing data in current view
        </div>
      </div>
    </div>
  );
}
