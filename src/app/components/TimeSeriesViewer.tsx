import React from 'react';
import { X, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeSeriesPlot } from '../types';
import { format } from 'date-fns';

interface TimeSeriesViewerProps {
  plots: TimeSeriesPlot[];
  onDelete: (plotId: string) => void;
  onExportImage: (plotId: string) => void;
  onClose: () => void;
}

export function TimeSeriesViewer({ plots, onDelete, onExportImage, onClose }: TimeSeriesViewerProps) {
  if (plots.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 w-96 bg-slate-900 rounded-lg border border-slate-700 p-8 text-center">
        <p className="text-slate-400 text-sm">No time series plots yet</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[600px] max-h-[80vh] overflow-auto space-y-4">
      {plots.map((plot) => (
        <Card key={plot.id} className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-100 text-sm">{plot.name}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onExportImage(plot.id)}
                >
                  <Download className="h-4 w-4 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onDelete(plot.id)}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="date"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM yyyy')}
                  stroke="#94a3b8"
                  fontSize={11}
                />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                  labelFormatter={(timestamp) => format(new Date(timestamp), 'MMM dd, yyyy')}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {plot.series.map((series) => (
                  <Line
                    key={`${series.poiId}-${series.datasetId}`}
                    data={series.data.map(d => ({ date: d.date.getTime(), value: d.value }))}
                    dataKey="value"
                    name={series.poiId}
                    stroke={series.color}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}