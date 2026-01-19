import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, subtitle }: MetricCardProps) {
  const getGradient = (title: string) => {
    if (title.includes('Patients')) return 'from-blue-500 to-cyan-500';
    if (title.includes('Beds')) return 'from-green-500 to-teal-500';
    if (title.includes('Staff')) return 'from-purple-500 to-pink-500';
    if (title.includes('Critical')) return 'from-red-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  const gradient = getGradient(title);

  return (
    <Card 
      className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden"
      data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div 
          className={`text-3xl font-bold tabular-nums bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {value}
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3 animate-bounce" />
              ) : (
                <ArrowDown className="h-3 w-3 animate-bounce" />
              )}
              <span className="font-semibold">
                {Math.abs(trend.value)}%
              </span>
            </div>
            <span className="text-muted-foreground">{subtitle || "vs last week"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
