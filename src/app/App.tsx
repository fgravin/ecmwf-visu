import React, { useState, useEffect, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { GlobeView } from './components/GlobeView';
import { TimelineControl } from './components/TimelineControl';
import { STACCatalogBrowser } from './components/STACCatalogBrowser';
import { LocalDataExplorer } from './components/LocalDataExplorer';
import { LayerBuilder } from './components/LayerBuilder';
import { ActiveLayersList } from './components/ActiveLayersList';
import { ColormapEditor } from './components/ColormapEditor';
import { POIManager } from './components/POIManager';
import { TimeSeriesViewer } from './components/TimeSeriesViewer';
import { BasemapLayerControl } from './components/BasemapLayerControl';
import { ExportControls } from './components/ExportControls';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import {
  Download,
  Layers,
  Database,
  Palette,
  MapPin,
  Settings,
  Map as MapIcon,
  Plus,
  X,
} from 'lucide-react';
import {
  STACDataset,
  LocalDataset,
  VisualizationLayer,
  BasemapLayer,
  POI,
  TimeSeriesPlot,
  Colormap,
  VisualizationType,
} from './types';
import { mockSTACDatasets, builtInColormaps, generateMockTimeSeriesData } from './data/mockData';

function App() {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date('2024-06-01'));
  const [dateRange] = useState({
    start: new Date('1979-01-01'),
    end: new Date('2024-12-31'),
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [stacDatasets, setStacDatasets] = useState<STACDataset[]>(mockSTACDatasets);
  const [localDatasets, setLocalDatasets] = useState<LocalDataset[]>([]);
  const [visualizationLayers, setVisualizationLayers] = useState<VisualizationLayer[]>([]);
  const [basemapLayers, setBasemapLayers] = useState<BasemapLayer[]>([
    { id: 'boundaries', name: 'Political Boundaries', enabled: true, type: 'boundaries' },
    { id: 'roads', name: 'Roads', enabled: false, type: 'roads' },
    { id: 'labels', name: 'City Labels', enabled: true, type: 'labels' },
    { id: 'terrain', name: 'Terrain', enabled: false, type: 'terrain' },
  ]);
  const [pois, setPois] = useState<POI[]>([]);
  const [timeSeriesPlots, setTimeSeriesPlots] = useState<TimeSeriesPlot[]>([]);
  const [colormaps, setColormaps] = useState<Colormap[]>(builtInColormaps);
  const [selectedColormapLayerId, setSelectedColormapLayerId] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('stac');
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('stac-favorites');
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      setStacDatasets(prev =>
        prev.map(ds => ({ ...ds, isFavorite: favoriteIds.includes(ds.id) }))
      );
    }

    const savedCustomColormaps = localStorage.getItem('custom-colormaps');
    if (savedCustomColormaps) {
      const customMaps = JSON.parse(savedCustomColormaps);
      setColormaps(prev => [...prev, ...customMaps]);
    }

    const savedPOIs = localStorage.getItem('pois');
    if (savedPOIs) {
      const loadedPOIs = JSON.parse(savedPOIs);
      setPois(loadedPOIs.map((poi: any) => ({ ...poi, createdAt: new Date(poi.createdAt) })));
    }
  }, []);

  // Timeline playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentDate(prev => {
        const next = new Date(prev);
        next.setMonth(next.getMonth() + 1);
        if (next > dateRange.end) {
          setIsPlaying(false);
          return dateRange.start;
        }
        return next;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, dateRange]);

  // STAC Dataset handlers
  const handleToggleFavorite = useCallback((datasetId: string) => {
    setStacDatasets(prev => {
      const updated = prev.map(ds =>
        ds.id === datasetId ? { ...ds, isFavorite: !ds.isFavorite } : ds
      );
      const favoriteIds = updated.filter(ds => ds.isFavorite).map(ds => ds.id);
      localStorage.setItem('stac-favorites', JSON.stringify(favoriteIds));
      return updated;
    });
  }, []);

  const handleFetchDataset = useCallback((datasetId: string) => {
    const dataset = stacDatasets.find(ds => ds.id === datasetId);
    if (!dataset) return;

    const localDataset: LocalDataset = {
      id: `local-${Date.now()}`,
      name: dataset.title,
      type: 'fetched',
      unit: dataset.unit,
      timeRange: dataset.timeRange,
      size: `${(Math.random() * 500 + 100).toFixed(1)} MB`,
    };

    setLocalDatasets(prev => [...prev, localDataset]);
    toast.success(`Fetched ${dataset.title}`);
  }, [stacDatasets]);

  // Local dataset handlers
  const handleDeleteLocalDataset = useCallback((datasetId: string) => {
    setLocalDatasets(prev => prev.filter(ds => ds.id !== datasetId));
    toast.success('Dataset deleted');
  }, []);

  const handleDownloadDataset = useCallback((datasetId: string) => {
    toast.success('Downloading dataset in Zarr format...');
  }, []);

  // Visualization layer handlers
  const handleCreateLayer = useCallback((config: any) => {
    const newLayer: VisualizationLayer = {
      id: `layer-${Date.now()}`,
      name: config.name,
      type: config.type,
      visible: true,
      opacity: 1,
      config: {
        input1: config.input1,
        input2: config.input2,
        referenceMean: config.referenceMean,
        referenceStdDev: config.referenceStdDev,
        colormap1: 'viridis',
      },
    };

    setVisualizationLayers(prev => [...prev, newLayer]);
    toast.success(`Created layer: ${config.name}`);
  }, []);

  const handleToggleLayerVisibility = useCallback((layerId: string) => {
    setVisualizationLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  const handleLayerOpacityChange = useCallback((layerId: string, opacity: number) => {
    setVisualizationLayers(prev =>
      prev.map(layer => (layer.id === layerId ? { ...layer, opacity } : layer))
    );
  }, []);

  const handleDeleteLayer = useCallback((layerId: string) => {
    setVisualizationLayers(prev => prev.filter(layer => layer.id !== layerId));
    toast.success('Layer deleted');
  }, []);

  const handleRenameLayer = useCallback((layerId: string) => {
    const layer = visualizationLayers.find(l => l.id === layerId);
    if (!layer) return;
    
    const newName = prompt('Enter new name:', layer.name);
    if (newName) {
      setVisualizationLayers(prev =>
        prev.map(l => (l.id === layerId ? { ...l, name: newName } : l))
      );
    }
  }, [visualizationLayers]);

  // Colormap handlers
  const handleApplyColormap = useCallback(
    (layerId: string, colormapId: string, bounds: [number, number]) => {
      setVisualizationLayers(prev =>
        prev.map(layer =>
          layer.id === layerId
            ? {
                ...layer,
                config: {
                  ...layer.config,
                  colormap1: colormapId,
                  colormapBounds: bounds,
                },
              }
            : layer
        )
      );
      toast.success('Colormap applied');
    },
    []
  );

  const handleCreateColormap = useCallback((name: string, colors: string[]) => {
    const newColormap: Colormap = {
      id: `custom-${Date.now()}`,
      name,
      isBuiltIn: false,
      colors,
    };

    setColormaps(prev => {
      const updated = [...prev, newColormap];
      const customMaps = updated.filter(cm => !cm.isBuiltIn);
      localStorage.setItem('custom-colormaps', JSON.stringify(customMaps));
      return updated;
    });
    toast.success('Custom colormap created');
  }, []);

  const handleDeleteColormap = useCallback((colormapId: string) => {
    setColormaps(prev => {
      const updated = prev.filter(cm => cm.id !== colormapId);
      const customMaps = updated.filter(cm => !cm.isBuiltIn);
      localStorage.setItem('custom-colormaps', JSON.stringify(customMaps));
      return updated;
    });
    toast.success('Colormap deleted');
  }, []);

  // Basemap layer handlers
  const handleToggleBasemapLayer = useCallback((layerId: string) => {
    setBasemapLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  }, []);

  // POI handlers
  const handleAddPOI = useCallback((name: string, coordinates: [number, number]) => {
    const newPOI: POI = {
      id: `poi-${Date.now()}`,
      name,
      coordinates,
      createdAt: new Date(),
    };

    setPois(prev => {
      const updated = [...prev, newPOI];
      localStorage.setItem('pois', JSON.stringify(updated));
      return updated;
    });

    // Add marker to map
    if (map) {
      new maplibregl.Marker({ color: '#3b82f6' })
        .setLngLat(coordinates)
        .setPopup(new maplibregl.Popup().setHTML(`<strong>${name}</strong>`))
        .addTo(map);
    }

    toast.success(`POI added: ${name}`);
  }, [map]);

  const handleDeletePOI = useCallback((poiId: string) => {
    setPois(prev => {
      const updated = prev.filter(poi => poi.id !== poiId);
      localStorage.setItem('pois', JSON.stringify(updated));
      return updated;
    });
    toast.success('POI deleted');
  }, []);

  const handleRenamePOI = useCallback((poiId: string, newName: string) => {
    setPois(prev => {
      const updated = prev.map(poi => (poi.id === poiId ? { ...poi, name: newName } : poi));
      localStorage.setItem('pois', JSON.stringify(updated));
      return updated;
    });
    toast.success('POI renamed');
  }, []);

  const handleCreateTimeSeries = useCallback((poiId: string) => {
    const poi = pois.find(p => p.id === poiId);
    if (!poi) return;

    const newPlot: TimeSeriesPlot = {
      id: `plot-${Date.now()}`,
      name: `Time Series - ${poi.name}`,
      series: [
        {
          poiId: poi.id,
          datasetId: 'temp-era5-monthly',
          color: '#3b82f6',
          data: generateMockTimeSeriesData(new Date('2020-01-01'), new Date('2024-12-31')),
        },
      ],
    };

    setTimeSeriesPlots(prev => [...prev, newPlot]);
    toast.success('Time series plot created');
  }, [pois]);

  const handleDeleteTimeSeries = useCallback((plotId: string) => {
    setTimeSeriesPlots(prev => prev.filter(plot => plot.id !== plotId));
    toast.success('Plot deleted');
  }, []);

  const handleExportTimeSeries = useCallback((plotId: string) => {
    toast.success('Exporting plot as image...');
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <MapIcon className="h-6 w-6 text-blue-400" />
          <h1 className="text-lg font-semibold">Climate Data Viewer</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            className="bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100"
          >
            <Download className="h-4 w-4 mr-2 text-slate-100" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100"
          >
            {sidebarOpen ? <X className="h-4 w-4 text-slate-100" /> : <Settings className="h-4 w-4 text-slate-100" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <GlobeView basemapLayers={basemapLayers} onMapLoad={setMap} />
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col">
            <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-5 bg-slate-800 rounded-none border-b border-slate-700">
                <TabsTrigger value="basemap" className="text-xs">
                  <MapIcon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="stac" className="text-xs">
                  <Database className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="local" className="text-xs">
                  <Layers className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="builder" className="text-xs">
                  <Plus className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="poi" className="text-xs">
                  <MapPin className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="basemap" className="h-full m-0">
                  <BasemapLayerControl
                    layers={basemapLayers}
                    onToggleLayer={handleToggleBasemapLayer}
                  />
                </TabsContent>

                <TabsContent value="stac" className="h-full m-0">
                  <STACCatalogBrowser
                    datasets={stacDatasets}
                    onToggleFavorite={handleToggleFavorite}
                    onDatasetFetch={handleFetchDataset}
                  />
                </TabsContent>

                <TabsContent value="local" className="h-full m-0">
                  <div className="h-full flex flex-col">
                    <Tabs defaultValue="datasets" className="flex-1 flex flex-col">
                      <TabsList className="grid grid-cols-2 bg-slate-800 mx-4 mt-4">
                        <TabsTrigger value="datasets" className="text-xs">Datasets</TabsTrigger>
                        <TabsTrigger value="layers" className="text-xs">Layers</TabsTrigger>
                      </TabsList>
                      <TabsContent value="datasets" className="flex-1 m-0">
                        <LocalDataExplorer
                          datasets={localDatasets}
                          favoriteIds={stacDatasets.filter(ds => ds.isFavorite).map(ds => ds.id)}
                          onDelete={handleDeleteLocalDataset}
                          onDownload={handleDownloadDataset}
                        />
                      </TabsContent>
                      <TabsContent value="layers" className="flex-1 m-0">
                        <ActiveLayersList
                          layers={visualizationLayers}
                          onToggleVisibility={handleToggleLayerVisibility}
                          onOpacityChange={handleLayerOpacityChange}
                          onDelete={handleDeleteLayer}
                          onRename={handleRenameLayer}
                          onConfigureColormap={setSelectedColormapLayerId}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>

                <TabsContent value="builder" className="h-full m-0">
                  <LayerBuilder
                    localDatasets={localDatasets}
                    onCreateLayer={handleCreateLayer}
                  />
                </TabsContent>

                <TabsContent value="poi" className="h-full m-0">
                  <POIManager
                    pois={pois}
                    onAdd={handleAddPOI}
                    onDelete={handleDeletePOI}
                    onRename={handleRenamePOI}
                    onCreateTimeSeries={handleCreateTimeSeries}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </div>

      {/* Timeline Control */}
      <TimelineControl
        currentDate={currentDate}
        dateRange={dateRange}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onStepBackward={() => {
          const prev = new Date(currentDate);
          prev.setMonth(prev.getMonth() - 1);
          if (prev >= dateRange.start) setCurrentDate(prev);
        }}
        onStepForward={() => {
          const next = new Date(currentDate);
          next.setMonth(next.getMonth() + 1);
          if (next <= dateRange.end) setCurrentDate(next);
        }}
        onDateChange={setCurrentDate}
        playbackSpeed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
      />

      {/* Colormap Editor */}
      <ColormapEditor
        colormaps={colormaps}
        selectedLayerId={selectedColormapLayerId}
        onClose={() => setSelectedColormapLayerId(null)}
        onApplyColormap={handleApplyColormap}
        onCreateColormap={handleCreateColormap}
        onDeleteColormap={handleDeleteColormap}
      />

      {/* Time Series Viewer */}
      {timeSeriesPlots.length > 0 && (
        <TimeSeriesViewer
          plots={timeSeriesPlots}
          onDelete={handleDeleteTimeSeries}
          onExportImage={handleExportTimeSeries}
          onClose={() => setTimeSeriesPlots([])}
        />
      )}

      {/* Export Dialog */}
      <ExportControls
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />

      {/* Toast Notifications */}
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}

export default App;