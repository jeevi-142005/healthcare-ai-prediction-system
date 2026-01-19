import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown, Brain } from "lucide-react";

interface AIMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  aiInsight: string;
  confidence: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function AIMetricCard({ title, value, icon: Icon, aiInsight, confidence, trend }: AIMetricCardProps) {
  const confidenceColor = confidence >= 0.9 ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" : 
                         confidence >= 0.8 ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" : 
                         "bg-gradient-to-r from-red-500 to-pink-500 text-white";

  const gradientBg = title.includes('Risk') ? 'from-red-500 to-pink-500' :
                    title.includes('Predicted') ? 'from-green-500 to-teal-500' :
                    title.includes('Resource') ? 'from-purple-500 to-indigo-500' :
                    'from-blue-500 to-cyan-500';

  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
      <div className="absolute top-4 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${confidenceColor} shadow-lg animate-pulse`}>
            <Brain className="h-3 w-3 mr-1" />
            {Math.round(confidence * 100)}% AI
          </Badge>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradientBg} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className={`text-3xl font-bold tabular-nums bg-gradient-to-r ${gradientBg} bg-clip-text text-transparent`}>
          {value}
        </div>
        <div className="mt-3 flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Brain className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0 animate-pulse" />
          <p className="text-xs text-muted-foreground leading-tight font-medium">{aiInsight}</p>
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
            <span className="text-muted-foreground">vs predicted</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}