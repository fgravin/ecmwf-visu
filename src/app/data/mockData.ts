import { STACDataset, Colormap } from './types';

// Mock STAC catalog data
export const mockSTACDatasets: STACDataset[] = [
  {
    id: 'temp-era5-monthly',
    title: 'ERA5 Monthly Temperature 2m',
    description: 'Monthly averaged 2-metre temperature from ERA5 reanalysis dataset',
    ecv: 'Temperature',
    dataSource: 'ERA5',
    sensor: 'Reanalysis',
    temporalResolution: 'Monthly',
    unit: '°C',
    aggregationType: 'Mean',
    timeRange: {
      start: new Date('1979-01-01'),
      end: new Date('2024-12-31'),
    },
    license: 'Copernicus License',
    cdsLink: 'https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels-monthly-means',
  },
  {
    id: 'precip-era5-monthly',
    title: 'ERA5 Monthly Precipitation',
    description: 'Monthly total precipitation from ERA5 reanalysis',
    ecv: 'Precipitation',
    dataSource: 'ERA5',
    sensor: 'Reanalysis',
    temporalResolution: 'Monthly',
    unit: 'mm',
    aggregationType: 'Sum',
    timeRange: {
      start: new Date('1979-01-01'),
      end: new Date('2024-12-31'),
    },
    license: 'Copernicus License',
    cdsLink: 'https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels-monthly-means',
  },
  {
    id: 'sst-cmems-daily',
    title: 'CMEMS Sea Surface Temperature',
    description: 'Daily sea surface temperature from satellite observations',
    ecv: 'Sea Surface Temperature',
    dataSource: 'CMEMS',
    sensor: 'Multi-Satellite',
    temporalResolution: 'Daily',
    unit: '°C',
    aggregationType: 'Mean',
    timeRange: {
      start: new Date('1981-09-01'),
      end: new Date('2024-12-31'),
    },
    license: 'CMEMS License',
    cdsLink: 'https://data.marine.copernicus.eu/product/SST_GLO_SST_L4_REP_OBSERVATIONS_010_011',
  },
  {
    id: 'ndvi-modis-monthly',
    title: 'MODIS Normalized Difference Vegetation Index',
    description: 'Monthly NDVI from MODIS Terra satellite',
    ecv: 'Vegetation Index',
    dataSource: 'MODIS',
    sensor: 'Terra',
    temporalResolution: 'Monthly',
    unit: 'Index',
    aggregationType: 'Mean',
    timeRange: {
      start: new Date('2000-02-01'),
      end: new Date('2024-12-31'),
    },
    license: 'NASA EOSDIS',
    cdsLink: 'https://modis.gsfc.nasa.gov/data/dataprod/mod13.php',
  },
  {
    id: 'snow-era5-monthly',
    title: 'ERA5 Snow Depth',
    description: 'Monthly snow depth water equivalent from ERA5',
    ecv: 'Snow Cover',
    dataSource: 'ERA5',
    sensor: 'Reanalysis',
    temporalResolution: 'Monthly',
    unit: 'm',
    aggregationType: 'Mean',
    timeRange: {
      start: new Date('1979-01-01'),
      end: new Date('2024-12-31'),
    },
    license: 'Copernicus License',
    cdsLink: 'https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels-monthly-means',
  },
  {
    id: 'wind-era5-monthly',
    title: 'ERA5 Wind Speed 10m',
    description: 'Monthly averaged 10-metre wind speed from ERA5',
    ecv: 'Wind Speed',
    dataSource: 'ERA5',
    sensor: 'Reanalysis',
    temporalResolution: 'Monthly',
    unit: 'm/s',
    aggregationType: 'Mean',
    timeRange: {
      start: new Date('1979-01-01'),
      end: new Date('2024-12-31'),
    },
    license: 'Copernicus License',
    cdsLink: 'https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels-monthly-means',
  },
  {
    id: 'soil-moisture-era5',
    title: 'ERA5 Soil Moisture',
    description: 'Volumetric soil water layer 1 from ERA5',
    ecv: 'Soil Moisture',
    dataSource: 'ERA5',
    sensor: 'Reanalysis',
    temporalResolution: 'Monthly',
    unit: 'm³/m³',
    aggregationType: 'Mean',
    timeRange: {
      start: new Date('1979-01-01'),
      end: new Date('2024-12-31'),
    },
    license: 'Copernicus License',
    cdsLink: 'https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels-monthly-means',
  },
  {
    id: 'ice-nsidc-daily',
    title: 'NSIDC Sea Ice Concentration',
    description: 'Daily sea ice concentration from passive microwave',
    ecv: 'Sea Ice',
    dataSource: 'NSIDC',
    sensor: 'SSMIS',
    temporalResolution: 'Daily',
    unit: '%',
    aggregationType: 'Mean',
    timeRange: {
      start: new Date('1978-10-25'),
      end: new Date('2024-12-31'),
    },
    license: 'NSIDC License',
    cdsLink: 'https://nsidc.org/data/g02135',
  },
];

// Built-in colormaps
export const builtInColormaps: Colormap[] = [
  {
    id: 'viridis',
    name: 'Viridis',
    isBuiltIn: true,
    colors: ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'],
  },
  {
    id: 'plasma',
    name: 'Plasma',
    isBuiltIn: true,
    colors: ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921'],
  },
  {
    id: 'inferno',
    name: 'Inferno',
    isBuiltIn: true,
    colors: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a', '#fcffa4'],
  },
  {
    id: 'coolwarm',
    name: 'Cool-Warm',
    isBuiltIn: true,
    colors: ['#3b4cc0', '#7196d2', '#b4d8f5', '#f4e3c3', '#e67c5d', '#b40426'],
  },
  {
    id: 'rdylbu',
    name: 'RdYlBu',
    isBuiltIn: true,
    colors: ['#a50026', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'],
  },
  {
    id: 'spectral',
    name: 'Spectral',
    isBuiltIn: true,
    colors: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    isBuiltIn: true,
    colors: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    isBuiltIn: true,
    colors: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
  },
];

// Generate mock time series data
export function generateMockTimeSeriesData(
  startDate: Date,
  endDate: Date,
  baseValue: number = 15,
  variance: number = 5
): Array<{ date: Date; value: number }> {
  const data: Array<{ date: Date; value: number }> = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const trend = Math.sin((current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365) * 2 * Math.PI);
    const noise = (Math.random() - 0.5) * variance;
    data.push({
      date: new Date(current),
      value: baseValue + trend * variance + noise,
    });
    
    // Advance by 1 month
    current.setMonth(current.getMonth() + 1);
  }
  
  return data;
}
