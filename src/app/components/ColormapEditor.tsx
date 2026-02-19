import React, { useState } from 'react';
import { Palette, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Colormap } from '../types';

interface ColormapEditorProps {
  colormaps: Colormap[];
  selectedLayerId: string | null;
  onClose: () => void;
  onApplyColormap: (layerId: string, colormapId: string, bounds: [number, number]) => void;
  onCreateColormap: (name: string, colors: string[]) => void;
  onDeleteColormap: (colormapId: string) => void;
}

export function ColormapEditor({
  colormaps,
  selectedLayerId,
  onClose,
  onApplyColormap,
  onCreateColormap,
  onDeleteColormap,
}: ColormapEditorProps) {
  const [selectedColormap, setSelectedColormap] = useState<string>(colormaps[0]?.id || '');
  const [minValue, setMinValue] = useState(-10);
  const [maxValue, setMaxValue] = useState(10);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customColors, setCustomColors] = useState(['#3b82f6', '#ef4444']);

  const handleApply = () => {
    if (selectedLayerId && selectedColormap) {
      onApplyColormap(selectedLayerId, selectedColormap, [minValue, maxValue]);
      onClose();
    }
  };

  const handleCreateCustom = () => {
    if (customName && customColors.length >= 2) {
      onCreateColormap(customName, customColors);
      setIsCreatingCustom(false);
      setCustomName('');
      setCustomColors(['#3b82f6', '#ef4444']);
    }
  };

  const addColorStop = () => {
    setCustomColors([...customColors, '#808080']);
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...customColors];
    newColors[index] = color;
    setCustomColors(newColors);
  };

  const removeColor = (index: number) => {
    if (customColors.length > 2) {
      setCustomColors(customColors.filter((_, i) => i !== index));
    }
  };

  return (
    <Dialog open={!!selectedLayerId} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Configure Colormap</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Colormap Selection */}
            <div>
              <Label className="text-slate-200 text-sm mb-3 block">Select Colormap</Label>
              <div className="grid grid-cols-2 gap-3">
                {colormaps.map(colormap => (
                  <button
                    key={colormap.id}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      selectedColormap === colormap.id
                        ? 'border-blue-500'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedColormap(colormap.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{colormap.name}</span>
                      {!colormap.isBuiltIn && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteColormap(colormap.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="h-6 rounded flex overflow-hidden">
                      {colormap.colors.map((color, i) => (
                        <div
                          key={i}
                          style={{ backgroundColor: color, flex: 1 }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-3 bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100"
                onClick={() => setIsCreatingCustom(true)}
              >
                <Plus className="h-4 w-4 mr-2 text-white" />
                Create Custom Colormap
              </Button>
            </div>

            {/* Value Bounds */}
            <div className="space-y-4 pt-4 border-t border-slate-700">
              <Label className="text-slate-200 text-sm">Colormap Bounds</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-400 mb-2 block">Min Value</Label>
                  <Input
                    type="number"
                    value={minValue}
                    onChange={(e) => setMinValue(parseFloat(e.target.value))}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400 mb-2 block">Max Value</Label>
                  <Input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(parseFloat(e.target.value))}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{minValue}</span>
                  <span>{maxValue}</span>
                </div>
                <div className="h-8 rounded flex overflow-hidden">
                  {colormaps.find(c => c.id === selectedColormap)?.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: color, flex: 1 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t border-slate-700">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 border-slate-600">
            Cancel
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Colormap
          </Button>
        </div>
      </DialogContent>

      {/* Custom Colormap Creator */}
      <Dialog open={isCreatingCustom} onOpenChange={setIsCreatingCustom}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>Create Custom Colormap</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Colormap Name</Label>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., My Custom Colors"
                className="bg-slate-800 border-slate-600"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">Color Stops</Label>
              <div className="space-y-2">
                {customColors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="h-10 w-20 rounded border border-slate-600 cursor-pointer"
                    />
                    <Input
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="flex-1 bg-slate-800 border-slate-600 font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColor(index)}
                      disabled={customColors.length <= 2}
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addColorStop}
                className="w-full mt-2 bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100"
              >
                <Plus className="h-4 w-4 mr-2 text-white" />
                Add Color Stop
              </Button>
            </div>

            <div className="h-8 rounded flex overflow-hidden">
              {customColors.map((color, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: color, flex: 1 }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreatingCustom(false)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border-slate-600"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCustom} disabled={!customName} className="flex-1">
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}