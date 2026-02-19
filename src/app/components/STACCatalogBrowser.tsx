import React, { useState } from 'react';
import { Search, Star, ExternalLink, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { STACDataset } from '../types';
import { format } from 'date-fns';

interface STACCatalogBrowserProps {
  datasets: STACDataset[];
  onToggleFavorite: (datasetId: string) => void;
  onDatasetFetch: (datasetId: string) => void;
}

export function STACCatalogBrowser({ datasets, onToggleFavorite, onDatasetFetch }: STACCatalogBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedECV, setSelectedECV] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedDataset, setSelectedDataset] = useState<STACDataset | null>(null);

  // Get unique ECVs and sources for filters
  const ecvs = Array.from(new Set(datasets.map(d => d.ecv)));
  const sources = Array.from(new Set(datasets.map(d => d.dataSource)));

  // Filter datasets
  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesECV = selectedECV === 'all' || dataset.ecv === selectedECV;
    const matchesSource = selectedSource === 'all' || dataset.dataSource === selectedSource;
    return matchesSearch && matchesECV && matchesSource;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-4 border-b border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select value={selectedECV} onValueChange={setSelectedECV}>
            <SelectTrigger className="bg-slate-800 border-slate-600">
              <SelectValue placeholder="ECV" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All ECVs</SelectItem>
              {ecvs.map(ecv => (
                <SelectItem key={ecv} value={ecv}>{ecv}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="bg-slate-800 border-slate-600">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredDatasets.map(dataset => (
            <div
              key={dataset.id}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-medium text-slate-100">{dataset.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => onToggleFavorite(dataset.id)}
                >
                  <Star
                    className={`h-4 w-4 ${dataset.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`}
                  />
                </Button>
              </div>
              
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{dataset.description}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                  {dataset.ecv}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                  {dataset.temporalResolution}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                  {dataset.unit}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs bg-slate-700 hover:bg-slate-600 border-slate-600"
                  onClick={() => setSelectedDataset(dataset)}
                >
                  Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => onDatasetFetch(dataset.id)}
                >
                  Fetch Data
                </Button>
              </div>
            </div>
          ))}

          {filteredDatasets.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No datasets match your filters
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Dataset details modal */}
      <Dialog open={!!selectedDataset} onOpenChange={() => setSelectedDataset(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-2xl">
          {selectedDataset && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedDataset.title}</DialogTitle>
                <DialogDescription className="text-slate-400">
                  {selectedDataset.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Essential Climate Variable</p>
                    <p className="text-sm">{selectedDataset.ecv}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Data Source</p>
                    <p className="text-sm">{selectedDataset.dataSource}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Sensor</p>
                    <p className="text-sm">{selectedDataset.sensor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Temporal Resolution</p>
                    <p className="text-sm">{selectedDataset.temporalResolution}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Unit</p>
                    <p className="text-sm">{selectedDataset.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Aggregation</p>
                    <p className="text-sm">{selectedDataset.aggregationType}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Time Range</p>
                  <p className="text-sm">
                    {format(selectedDataset.timeRange.start, 'MMM dd, yyyy')} -{' '}
                    {format(selectedDataset.timeRange.end, 'MMM dd, yyyy')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">License</p>
                  <p className="text-sm">{selectedDataset.license}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100"
                    onClick={() => window.open(selectedDataset.cdsLink, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-white" />
                    View on CDS
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      onDatasetFetch(selectedDataset.id);
                      setSelectedDataset(null);
                    }}
                  >
                    Fetch Data
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}