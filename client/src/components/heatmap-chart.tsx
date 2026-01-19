import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapData {
  department: string;
  hour: number;
  occupancy: number;
}

interface HeatmapChartProps {
  title: string;
  data: HeatmapData[];
}

export function HeatmapChart({ title, data }: HeatmapChartProps) {
  const departments = [...new Set(data.map(d => d.department))];
  const hours = [...new Set(data.map(d => d.hour))].sort((a, b) => a - b);

  const getIntensityColor = (occupancy: number) => {
    if (occupancy >= 90) return "bg-red-500";
    if (occupancy >= 75) return "bg-orange-400";
    if (occupancy >= 50) return "bg-yellow-400";
    if (occupancy >= 25) return "bg-green-400";
    return "bg-blue-300";
  };

  const getIntensityOpacity = (occupancy: number) => {
    return Math.max(0.3, occupancy / 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time occupancy by department and time</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">Occupancy:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-300 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span>High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Critical</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              {/* Hour headers */}
              <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-1 mb-2">
                <div></div>
                {hours.map(hour => (
                  <div key={hour} className="text-xs text-center text-muted-foreground font-medium">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Department rows */}
              {departments.map(dept => (
                <div key={dept} className="grid grid-cols-[120px_repeat(4,1fr)] gap-1 mb-1">
                  <div className="text-sm font-medium text-muted-foreground py-2">
                    {dept}
                  </div>
                  {hours.map(hour => {
                    const dataPoint = data.find(d => d.department === dept && d.hour === hour);
                    const occupancy = dataPoint?.occupancy || 0;
                    return (
                      <div
                        key={`${dept}-${hour}`}
                        className={`h-8 rounded flex items-center justify-center text-xs font-medium text-white ${getIntensityColor(occupancy)}`}
                        style={{ opacity: getIntensityOpacity(occupancy) }}
                        title={`${dept} at ${hour}:00 - ${occupancy}% occupancy`}
                      >
                        {occupancy}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}