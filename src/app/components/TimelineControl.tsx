import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';

interface TimelineControlProps {
  currentDate: Date;
  dateRange: { start: Date; end: Date };
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  onDateChange: (date: Date) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export function TimelineControl({
  currentDate,
  dateRange,
  isPlaying,
  onPlayPause,
  onStepBackward,
  onStepForward,
  onDateChange,
  playbackSpeed,
  onSpeedChange,
}: TimelineControlProps) {
  const totalDays = Math.floor((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.floor((currentDate.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
  const progress = (currentDay / totalDays) * 100;

  const handleSliderChange = (value: number[]) => {
    const dayOffset = Math.floor((value[0] / 100) * totalDays);
    const newDate = new Date(dateRange.start);
    newDate.setDate(newDate.getDate() + dayOffset);
    onDateChange(newDate);
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur border-t border-slate-700 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onStepBackward}
              className="h-8 w-8 bg-slate-800 hover:bg-slate-700 border-slate-600"
            >
              <SkipBack className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onPlayPause}
              className="h-9 w-9 bg-slate-800 hover:bg-slate-700 border-slate-600"
            >
              {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 ml-0.5 text-white" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onStepForward}
              className="h-8 w-8 bg-slate-800 hover:bg-slate-700 border-slate-600"
            >
              <SkipForward className="h-4 w-4 text-white" />
            </Button>
          </div>

          {/* Timeline slider */}
          <div className="flex-1 flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-slate-800 hover:bg-slate-700 border-slate-600 min-w-[140px] justify-start text-slate-100">
                  <Calendar className="h-4 w-4 mr-2 text-white" />
                  {format(currentDate, 'MMM yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-slate-800 border-slate-600 text-slate-100">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-slate-400">Start:</span> {format(dateRange.start, 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm">
                    <span className="text-slate-400">End:</span> {format(dateRange.end, 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm">
                    <span className="text-slate-400">Current:</span> {format(currentDate, 'MMM dd, yyyy')}
                  </p>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex-1 px-2">
              <Slider
                value={[progress]}
                onValueChange={handleSliderChange}
                max={100}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Speed control */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-slate-800 hover:bg-slate-700 border-slate-600 min-w-[80px]">
                {playbackSpeed}x
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 bg-slate-800 border-slate-600 text-slate-100">
              <div className="space-y-4">
                <p className="text-sm">Playback Speed</p>
                <Slider
                  value={[playbackSpeed]}
                  onValueChange={(val) => onSpeedChange(val[0])}
                  min={0.25}
                  max={4}
                  step={0.25}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>0.25x</span>
                  <span>4x</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}