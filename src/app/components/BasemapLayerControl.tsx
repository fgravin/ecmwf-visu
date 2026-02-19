import React from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { BasemapLayer } from '../types';

interface BasemapLayerControlProps {
  layers: BasemapLayer[];
  onToggleLayer: (layerId: string) => void;
}

export function BasemapLayerControl({ layers, onToggleLayer }: BasemapLayerControlProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <p className="text-xs text-slate-400 mb-4">
          Toggle basemap layers. Note: Layer order is fixed to prevent misconfigurations.
        </p>
        
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700"
          >
            <Label htmlFor={layer.id} className="text-sm text-slate-200 cursor-pointer">
              {layer.name}
            </Label>
            <Switch
              id={layer.id}
              checked={layer.enabled}
              onCheckedChange={() => onToggleLayer(layer.id)}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
