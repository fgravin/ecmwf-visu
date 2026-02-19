// Core type definitions for the climate data viewer

export type VisualizationType = 'raw' | 'delta' | 'zscore' | 'bivariate';

export interface STACDataset {
  id: string;
  title: string;
  description: string;
  ecv: string; // Essential Climate Variable
  dataSource: string;
  sensor: string;
  temporalResolution: string;
  unit: string;
  aggregationType: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  license: string;
  cdsLink: string;
  isFavorite?: boolean;
}

export interface LocalDataset {
  id: string;
  name: string;
  type: 'fetched' | 'computed';
  unit: string;
  timeRange?: {
    start: Date;
    end: Date;
  };
  size?: string;
}

export interface VisualizationLayer {
  id: string;
  name: string;
  type: VisualizationType;
  visible: boolean;
  opacity: number;
  config: {
    input1?: string; // dataset id
    input2?: string; // for delta, bivariate
    referenceMean?: string; // for zscore
    referenceStdDev?: string; // for zscore
    colormap1?: string;
    colormap2?: string; // for bivariate
    colormapBounds?: [number, number];
  };
}

export interface BasemapLayer {
  id: string;
  name: string;
  enabled: boolean;
  type: 'boundaries' | 'roads' | 'labels' | 'terrain' | 'other';
}

export interface POI {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  createdAt: Date;
}

export interface AOI {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]]; // [[west, south], [east, north]]
  metrics?: {
    average?: number;
    min?: number;
    max?: number;
    stdDev?: number;
  };
}

export interface TimeSeriesPlot {
  id: string;
  name: string;
  series: Array<{
    poiId: string;
    datasetId: string;
    color: string;
    data: Array<{ date: Date; value: number }>;
  }>;
}

export interface Colormap {
  id: string;
  name: string;
  isBuiltIn: boolean;
  colors: string[]; // array of hex colors
}
