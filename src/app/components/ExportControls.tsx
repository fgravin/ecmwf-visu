import React, { useState } from 'react';
import { Download, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface ExportControlsProps {
  open: boolean;
  onClose: () => void;
}

export function ExportControls({ open, onClose }: ExportControlsProps) {
  const [exportType, setExportType] = useState<'image' | 'video'>('image');
  const [imageFormat, setImageFormat] = useState('png');
  const [resolution, setResolution] = useState('1920x1080');
  const [watermark, setWatermark] = useState(true);

  const handleExport = () => {
    // In a real implementation, this would capture the map view
    toast.success(`Exporting ${exportType} as ${imageFormat || 'video'} at ${resolution}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle>Export Map View</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-2 block">Export Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={exportType === 'image' ? 'default' : 'outline'}
                onClick={() => setExportType('image')}
                className={exportType === 'image' ? '' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100'}
              >
                <ImageIcon className="h-4 w-4 mr-2 text-white" />
                Image
              </Button>
              <Button
                variant={exportType === 'video' ? 'default' : 'outline'}
                onClick={() => setExportType('video')}
                className={exportType === 'video' ? '' : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100'}
              >
                <Video className="h-4 w-4 mr-2 text-white" />
                Video
              </Button>
            </div>
          </div>

          {exportType === 'image' && (
            <div>
              <Label className="text-sm mb-2 block">Format</Label>
              <Select value={imageFormat} onValueChange={setImageFormat}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-sm mb-2 block">Resolution</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger className="bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
            <Label className="text-sm">Include Watermark</Label>
            <input
              type="checkbox"
              checked={watermark}
              onChange={(e) => setWatermark(e.target.checked)}
              className="h-4 w-4"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 border-slate-600"
          >
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex-1">
            <Download className="h-4 w-4 mr-2 text-white" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}