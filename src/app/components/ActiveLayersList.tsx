import React from 'react';
import { Eye, EyeOff, Palette, Trash2, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { ScrollArea } from './ui/scroll-area';
import { VisualizationLayer } from '../types';

interface ActiveLayersListProps {
  layers: VisualizationLayer[];
  onToggleVisibility: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onDelete: (layerId: string) => void;
  onRename: (layerId: string) => void;
  onConfigureColormap: (layerId: string) => void;
}

export function ActiveLayersList({
  layers,
  onToggleVisibility,
  onOpacityChange,
  onDelete,
  onRename,
  onConfigureColormap,
}: ActiveLayersListProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'raw':
        return 'bg-blue-900/50 text-blue-300';
      case 'delta':
        return 'bg-orange-900/50 text-orange-300';
      case 'zscore':
        return 'bg-purple-900/50 text-purple-300';
      case 'bivariate':
        return 'bg-green-900/50 text-green-300';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {layers.map(layer => (
          <div
            key={layer.id}
            className={`bg-slate-800 rounded-lg p-4 border transition-all ${
              layer.visible ? 'border-slate-600' : 'border-slate-700 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-slate-100 truncate mb-1">
                  {layer.name}
                </h3>
                <Badge variant="secondary" className={`text-xs ${getTypeColor(layer.type)}`}>
                  {layer.type}
                </Badge>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onToggleVisibility(layer.id)}
                >
                  {layer.visible ? (
                    <Eye className="h-4 w-4 text-white" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onRename(layer.id)}
                >
                  <Edit2 className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>

            {layer.visible && (
              <>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Opacity</span>
                    <span>{Math.round(layer.opacity * 100)}%</span>
                  </div>
                  <Slider
                    value={[layer.opacity * 100]}
                    onValueChange={(val) => onOpacityChange(layer.id, val[0] / 100)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100"
                    onClick={() => onConfigureColormap(layer.id)}
                  >
                    <Palette className="h-3 w-3 mr-1 text-white" />
                    Colormap
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-slate-700 hover:bg-red-900 border-slate-600 hover:border-red-800 text-slate-100"
                    onClick={() => onDelete(layer.id)}
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}

        {layers.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            <Palette className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No visualization layers yet</p>
            <p className="text-xs mt-1">Use the Layer Builder to create one</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}