import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { VisualizationType, LocalDataset } from '../types';

interface LayerBuilderProps {
  localDatasets: LocalDataset[];
  onCreateLayer: (config: {
    name: string;
    type: VisualizationType;
    input1?: string;
    input2?: string;
    referenceMean?: string;
    referenceStdDev?: string;
    colormap1?: string;
    colormap2?: string;
  }) => void;
}

export function LayerBuilder({ localDatasets, onCreateLayer }: LayerBuilderProps) {
  const [layerName, setLayerName] = useState('');
  const [layerType, setLayerType] = useState<VisualizationType>('raw');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [referenceMean, setReferenceMean] = useState('');
  const [referenceStdDev, setReferenceStdDev] = useState('');

  const handleCreate = () => {
    if (!layerName || !input1) return;

    onCreateLayer({
      name: layerName,
      type: layerType,
      input1,
      input2: layerType === 'delta' || layerType === 'bivariate' ? input2 : undefined,
      referenceMean: layerType === 'zscore' ? referenceMean : undefined,
      referenceStdDev: layerType === 'zscore' ? referenceStdDev : undefined,
    });

    // Reset form
    setLayerName('');
    setInput1('');
    setInput2('');
    setReferenceMean('');
    setReferenceStdDev('');
  };

  const canCreate = layerName && input1 &&
    (layerType === 'raw' ||
     (layerType === 'delta' && input2) ||
     (layerType === 'zscore' && referenceMean && referenceStdDev) ||
     (layerType === 'bivariate' && input2));

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div>
          <Label className="text-slate-200 text-xs mb-2 block">Layer Name</Label>
          <Input
            placeholder="e.g., Temperature Anomaly"
            value={layerName}
            onChange={(e) => setLayerName(e.target.value)}
            className="bg-slate-800 border-slate-600"
          />
        </div>

        <div>
          <Label className="text-slate-200 text-xs mb-2 block">Visualization Type</Label>
          <Tabs value={layerType} onValueChange={(v) => setLayerType(v as VisualizationType)}>
            <TabsList className="grid grid-cols-2 bg-slate-800">
              <TabsTrigger value="raw" className="text-xs">Raw</TabsTrigger>
              <TabsTrigger value="delta" className="text-xs">Delta</TabsTrigger>
            </TabsList>
            <TabsList className="grid grid-cols-2 bg-slate-800 mt-2">
              <TabsTrigger value="zscore" className="text-xs">Z-Score</TabsTrigger>
              <TabsTrigger value="bivariate" className="text-xs">Bivariate</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Raw Values Configuration */}
        {layerType === 'raw' && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div>
              <Label className="text-slate-200 text-xs mb-2 block">Input Dataset</Label>
              <Select value={input1} onValueChange={setInput1}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select dataset" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {localDatasets.map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Delta Configuration */}
        {layerType === 'delta' && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div>
              <Label className="text-slate-200 text-xs mb-2 block">Dataset A</Label>
              <Select value={input1} onValueChange={setInput1}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select first dataset" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {localDatasets.map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-200 text-xs mb-2 block">Dataset B (subtract from A)</Label>
              <Select value={input2} onValueChange={setInput2}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select second dataset" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {localDatasets.map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-slate-400">
              Result = Dataset A - Dataset B
            </p>
          </div>
        )}

        {/* Z-Score Configuration */}
        {layerType === 'zscore' && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div>
              <Label className="text-slate-200 text-xs mb-2 block">Sample Dataset</Label>
              <Select value={input1} onValueChange={setInput1}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select sample" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {localDatasets.map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-200 text-xs mb-2 block">Reference Mean</Label>
              <Select value={referenceMean} onValueChange={setReferenceMean}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select mean dataset" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {localDatasets.map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-200 text-xs mb-2 block">Reference Std Dev</Label>
              <Select value={referenceStdDev} onValueChange={setReferenceStdDev}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select std dev dataset" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {localDatasets.map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-slate-400">
              Z-Score = (Sample - Mean) / StdDev
            </p>
          </div>
        )}

        {/* Bivariate Configuration */}
        {layerType === 'bivariate' && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div>
              <Label className="text-slate-200 text-xs mb-2 block">Variable 1</Label>
              <Select value={input1} onValueChange={setInput1}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select first variable" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {localDatasets.map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-200 text-xs mb-2 block">Variable 2</Label>
              <Select value={input2} onValueChange={setInput2}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select second variable" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {localDatasets.map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-slate-400">
              Two variables blended with separate colormaps
            </p>
          </div>
        )}

        {localDatasets.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No local datasets available. Fetch data from the STAC catalog first.
          </div>
        )}

        {localDatasets.length > 0 && (
          <Button
            className="w-full"
            disabled={!canCreate}
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-2 text-white" />
            Create Visualization Layer
          </Button>
        )}
      </div>
    </ScrollArea>
  );
}