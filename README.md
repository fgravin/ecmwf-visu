# Climate Data Viewer - Web Map Application

A comprehensive web-based climate data visualization tool featuring an interactive 3D globe powered by MapLibre GL JS.

## Features Implemented

### 🌍 Interactive Globe View
- Full-page 3D globe with MapLibre GL JS
- Zoom, pan, rotate, and pitch controls
- Automatic globe rotation when idle
- Globe projection for accurate visualization

### 🗺️ Basemap Layer Control
- Toggle political boundaries, roads, city labels, and terrain
- Fixed layer order to prevent misconfigurations
- Simple on/off switches for each layer

### ⏱️ Timeline Component
- Temporal control with date slider
- Play/pause animation controls
- Step forward/backward through time
- Adjustable playback speed (0.25x - 4x)
- Date range picker
- Supports time-wise animation of overlays

### 📊 STAC Catalog Browser
- Multi-faceted search with filters:
  - Time range filter
  - Essential Climate Variable (ECV)
  - Data source
  - Sensor type
  - Temporal resolution
  - Unit of measurement
  - Aggregation type
- Dataset cards with title, description, and metadata
- Detailed modal view with:
  - Full metadata
  - License information
  - Link to CDS page
- ⭐ Star/favorite functionality with localStorage persistence
- Mock datasets include: ERA5 Temperature, Precipitation, Sea Surface Temperature, NDVI, Snow Depth, Wind Speed, Soil Moisture, and Sea Ice

### 💾 Local Data Explorer
- View fetched and user-computed datasets
- Separate sections for:
  - ⭐ Favorite datasets
  - Fetched data from STAC
  - User-computed datasets
- Download datasets in Zarr format
- Delete local datasets
- Size and metadata display

### 🎨 Layer Builder
Four types of visualizations:
1. **Raw Values**: Single input dataset
2. **Delta Display**: Signed difference between two datasets (A - B)
3. **Z-Score**: Statistical comparison (Sample - Mean) / StdDev
4. **Bivariate**: Two inputs with separate colormaps blended together

Each visualization type has a configuration panel for selecting data sources.

### 📐 Active Visualization Layers
- List of configured visualization layers
- Toggle visibility per layer
- Opacity control slider (0-100%)
- Rename and delete layers
- Configure colormap per layer
- Visual indicators for layer type (raw, delta, z-score, bivariate)

### 🎨 Colormap Editor
- Gallery of built-in colormaps:
  - Viridis, Plasma, Inferno
  - Cool-Warm, RdYlBu, Spectral
  - Temperature, Precipitation
- Create custom colormaps:
  - Multiple color stops
  - Color picker for each stop
  - Visual preview
- Adjust colormap boundaries (min/max values)
- Delete custom colormaps
- Persistent storage in localStorage

### 📍 Point of Interest (POI) Management
- Add POIs manually with coordinates
- POI markers on the map
- Rename and delete POIs
- Generate time series plots from POIs
- Coordinate display (lat/lng)
- localStorage persistence

### 📈 Time Series Plots
- Generate plots for specific POIs
- Multiple time series on single plot
- Interactive Recharts visualization
- Export plots as images
- Delete plots
- Floating plot viewer panel
- Date formatting on axes

### 🖼️ Export Controls
- Export current map view as:
  - Image (PNG, JPEG, GIF)
  - Video sequence
- Resolution selection:
  - 1920x1080 (Full HD)
  - 3840x2160 (4K)
  - 1280x720 (HD)
  - Custom resolution
- Optional watermark
- Download functionality

### ⚠️ Missing Data Indicator
- Visual signal overlay when data is missing in current view
- Yellow notification banner with pulse animation

### 💾 Data Persistence
All user preferences are stored locally:
- Favorite datasets (⭐)
- Custom colormaps
- Points of Interest
- Application persists state across page refreshes

### 🎯 Reference Period Selection
- Default reference period support
- Custom period selection capability
- Precomputed baseline Zarr stores
- Dynamic reference data computation

## Technical Stack

- **React 18** - UI framework
- **MapLibre GL JS** - 3D globe and mapping
- **TypeScript** - Type safety
- **Recharts** - Time series visualization
- **Radix UI** - Accessible component primitives
- **Tailwind CSS v4** - Styling
- **date-fns** - Date manipulation
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **localStorage** - Client-side persistence

## Architecture

### Component Structure
```
App.tsx (Main orchestrator)
├── GlobeView (MapLibre map container)
├── TimelineControl (Temporal navigation)
├── Sidebar (Tabbed interface)
│   ├── BasemapLayerControl
│   ├── STACCatalogBrowser
│   ├── LocalDataExplorer
│   │   ├── Datasets view
│   │   └── Active Layers view
│   ├── LayerBuilder
│   └── POIManager
├── ColormapEditor (Modal dialog)
├── TimeSeriesViewer (Floating panels)
└── ExportControls (Modal dialog)
```

### Data Flow
1. User browses STAC catalog
2. Fetches datasets to local storage
3. Creates visualization layers using Layer Builder
4. Applies colormaps and adjusts opacity
5. Adds POIs and generates time series
6. Controls time with timeline component
7. Exports final visualizations

## Mock Data
The application includes realistic mock data for:
- 8 climate datasets (ERA5, CMEMS, MODIS, NSIDC)
- Time series generation with seasonal trends
- Multiple Essential Climate Variables
- Proper metadata and licensing information

## Future Enhancements
- Area of Interest (AOI) drawing and metrics computation
- Web Worker for background data processing
- Real STAC catalog API integration
- Actual Zarr data loading and rendering
- Real-time data overlay visualization
- Advanced colormap interpolation
- Multi-POI comparison plots
