import { Cloud, Sun, CloudRain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function WeatherWidget() {
  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-2">
      <Sun className="h-4 w-4 mr-2 text-yellow-500" />
      <span className="font-medium">72°F</span>
      <span className="text-xs ml-1 opacity-75">Clear</span>
    </Badge>
  );
}