import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { POI } from '../types';

interface POIManagerProps {
  pois: POI[];
  onAdd: (name: string, coordinates: [number, number]) => void;
  onDelete: (poiId: string) => void;
  onRename: (poiId: string, newName: string) => void;
  onCreateTimeSeries: (poiId: string) => void;
}

export function POIManager({ pois, onAdd, onDelete, onRename, onCreateTimeSeries }: POIManagerProps) {
  const [isAddingPOI, setIsAddingPOI] = useState(false);
  const [newPOIName, setNewPOIName] = useState('');
  const [newPOILng, setNewPOILng] = useState('');
  const [newPOILat, setNewPOILat] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddPOI = () => {
    const lng = parseFloat(newPOILng);
    const lat = parseFloat(newPOILat);
    
    if (newPOIName && !isNaN(lng) && !isNaN(lat)) {
      onAdd(newPOIName, [lng, lat]);
      setIsAddingPOI(false);
      setNewPOIName('');
      setNewPOILng('');
      setNewPOILat('');
    }
  };

  const handleRename = (poiId: string) => {
    if (editName) {
      onRename(poiId, editName);
      setEditingId(null);
      setEditName('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <Button
          className="w-full"
          onClick={() => setIsAddingPOI(true)}
        >
          <Plus className="h-4 w-4 mr-2 text-white" />
          Add Point of Interest
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {pois.map(poi => (
            <div
              key={poi.id}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2 flex-1">
                  <MapPin className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-100 truncate">
                      {poi.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      {poi.coordinates[1].toFixed(4)}°, {poi.coordinates[0].toFixed(4)}°
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100"
                  onClick={() => onCreateTimeSeries(poi.id)}
                >
                  <TrendingUp className="h-3 w-3 mr-1 text-white" />
                  Plot
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100"
                  onClick={() => {
                    setEditingId(poi.id);
                    setEditName(poi.name);
                  }}
                >
                  <Edit2 className="h-3 w-3 text-white" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs bg-slate-700 hover:bg-red-900 border-slate-600 hover:border-red-800 text-slate-100"
                  onClick={() => onDelete(poi.id)}
                >
                  <Trash2 className="h-3 w-3 text-white" />
                </Button>
              </div>
            </div>
          ))}

          {pois.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No points of interest yet</p>
              <p className="text-xs mt-1">Click on the map or add manually</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add POI Dialog */}
      <Dialog open={isAddingPOI} onOpenChange={setIsAddingPOI}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>Add Point of Interest</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Name</Label>
              <Input
                value={newPOIName}
                onChange={(e) => setNewPOIName(e.target.value)}
                placeholder="e.g., Weather Station A"
                className="bg-slate-800 border-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Longitude</Label>
                <Input
                  type="number"
                  value={newPOILng}
                  onChange={(e) => setNewPOILng(e.target.value)}
                  placeholder="-74.006"
                  step="0.0001"
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block">Latitude</Label>
                <Input
                  type="number"
                  value={newPOILat}
                  onChange={(e) => setNewPOILat(e.target.value)}
                  placeholder="40.7128"
                  step="0.0001"
                  className="bg-slate-800 border-slate-600"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddingPOI(false)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPOI}
              disabled={!newPOIName || !newPOILng || !newPOILat}
              className="flex-1"
            >
              Add POI
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename POI Dialog */}
      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>Rename Point of Interest</DialogTitle>
          </DialogHeader>

          <div>
            <Label className="text-sm mb-2 block">Name</Label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-slate-800 border-slate-600"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingId(null)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => editingId && handleRename(editingId)}
              disabled={!editName}
              className="flex-1"
            >
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}