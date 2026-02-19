import React from 'react';
import { Database, Download, Trash2, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { LocalDataset } from '../types';

interface LocalDataExplorerProps {
  datasets: LocalDataset[];
  favoriteIds: string[];
  onDelete: (datasetId: string) => void;
  onDownload: (datasetId: string) => void;
}

export function LocalDataExplorer({ datasets, favoriteIds, onDelete, onDownload }: LocalDataExplorerProps) {
  const favoritesSection = datasets.filter(d => favoriteIds.includes(d.id));
  const fetchedSection = datasets.filter(d => d.type === 'fetched' && !favoriteIds.includes(d.id));
  const computedSection = datasets.filter(d => d.type === 'computed');

  const DatasetCard = ({ dataset }: { dataset: LocalDataset }) => (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1">
          <Database className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-slate-100 truncate">{dataset.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {dataset.unit} • {dataset.size || 'N/A'}
            </p>
          </div>
        </div>
        {favoriteIds.includes(dataset.id) && (
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 shrink-0" />
        )}
      </div>

      <div className="flex gap-1.5 mb-3">
        <Badge
          variant="secondary"
          className={`text-xs ${
            dataset.type === 'fetched'
              ? 'bg-blue-900/50 text-blue-300'
              : 'bg-purple-900/50 text-purple-300'
          }`}
        >
          {dataset.type}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100"
          onClick={() => onDownload(dataset.id)}
        >
          <Download className="h-3 w-3 mr-1 text-white" />
          Zarr
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs bg-slate-700 hover:bg-red-900 border-slate-600 hover:border-red-800 text-slate-100"
          onClick={() => onDelete(dataset.id)}
        >
          <Trash2 className="h-3 w-3 text-white" />
        </Button>
      </div>
    </div>
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Favorites Section */}
        {favoritesSection.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <h2 className="text-sm font-medium text-slate-200">Favorites</h2>
              <Badge variant="secondary" className="text-xs bg-slate-700">
                {favoritesSection.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {favoritesSection.map(dataset => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          </div>
        )}

        {/* Fetched Data Section */}
        {fetchedSection.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-medium text-slate-200">Fetched Data</h2>
              <Badge variant="secondary" className="text-xs bg-slate-700">
                {fetchedSection.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {fetchedSection.map(dataset => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          </div>
        )}

        {/* Computed Data Section */}
        {computedSection.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-medium text-slate-200">User Computed</h2>
              <Badge variant="secondary" className="text-xs bg-slate-700">
                {computedSection.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {computedSection.map(dataset => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          </div>
        )}

        {datasets.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No local datasets yet</p>
            <p className="text-xs mt-1">Fetch data from the STAC catalog to get started</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}