import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Bed, AlertTriangle, Calendar, Phone, FileText, Zap, Heart } from "lucide-react";

export function QuickActions() {
  const actions = [
    { icon: UserPlus, label: "Admit Patient", color: "bg-green-500 hover:bg-green-600", urgent: false },
    { icon: AlertTriangle, label: "Emergency Alert", color: "bg-red-500 hover:bg-red-600", urgent: true },
    { icon: Bed, label: "Assign Bed", color: "bg-blue-500 hover:bg-blue-600", urgent: false },
    { icon: Calendar, label: "Schedule Surgery", color: "bg-purple-500 hover:bg-purple-600", urgent: false },
    { icon: Phone, label: "Call Code Blue", color: "bg-red-600 hover:bg-red-700", urgent: true },
    { icon: FileText, label: "Generate Report", color: "bg-gray-500 hover:bg-gray-600", urgent: false },
    { icon: Zap, label: "Quick Discharge", color: "bg-orange-500 hover:bg-orange-600", urgent: false },
    { icon: Heart, label: "Vitals Check", color: "bg-pink-500 hover:bg-pink-600", urgent: false }
  ];

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`${action.color} text-white border-0 flex-col h-16 w-full relative transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                {action.urgent && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                )}
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}